require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const axios = require("axios");

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// CORS with proper config
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Config
const PORT = process.env.PORT || 5000;
let JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const MONGODB_URI = process.env.MONGODB_URI;

if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error("[Auth] Missing JWT_SECRET in production");
    process.exit(1);
  }
  console.warn("[Auth] JWT_SECRET not set — using dev secret");
  JWT_SECRET = 'dev-secret-' + Math.random().toString(36).slice(2);
}

// ─────────────────────────────────────────────────────
// Mongo models
// ─────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2 },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const scanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  url: { type: String, required: true, trim: true },
  status: { type: String, enum: ["pending", "running", "completed", "failed"], default: "pending" },
  riskScore: { type: Number, min: 0, max: 100, default: 0 },
  findings: [{
    type: { type: String },
    severity: { type: String, enum: ["low", "medium", "high", "critical"] },
    message: String,
    details: mongoose.Schema.Types.Mixed,
  }],
  headers: mongoose.Schema.Types.Mixed,
  sslInfo: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Scan = mongoose.model("Scan", scanSchema);

// ─────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────

// Comprehensive email validation
function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const disposableDomains = [
    "tempmail.com", "throwaway.email", "10minutemail.com",
    "guerrillamail.com", "mailinator.com", "temp-mail.org"
  ];
  const domain = email.split("@")[1];
  return regex.test(email) && !disposableDomains.includes(domain);
}

// Password validation: min 8 chars, uppercase, lowercase, number, special
function isValidPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/.test(password);
}

function signToken(user) {
  const payload = {
    sub: String(user._id),
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function authMiddleware(req, res, next) {
  try {
    let token = null;

    // Try Authorization header
    const header = req.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
      token = header.slice(7);
    }

    // Try cookie
    if (!token && req.headers && req.headers.cookie) {
      const cookies = req.headers.cookie.split(";").map((c) => c.trim());
      for (const c of cookies) {
        if (c.startsWith("auth-token=")) {
          token = decodeURIComponent(c.substring("auth-token=".length));
          break;
        }
      }
    }

    if (!token) {
      return res.status(401).json({ message: "Missing authentication token" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.auth = decoded;
    next();
  } catch (err) {
    console.warn('[Auth] Token verification failed:', err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function jsonError(res, message, status = 400, details) {
  return res.status(status).json({
    message,
    ...(details !== undefined ? { details } : {}),
  });
}

// ─────────────────────────────────────────────────────
// Auth Routes
// ─────────────────────────────────────────────────────

app.post(
  "/api/auth/register",
  [
    body("name").isString().trim().isLength({ min: 2, max: 100 }).escape(),
    body("email").isEmail().normalizeEmail().custom(isValidEmail),
    body("password").custom(isValidPassword),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return jsonError(res, "Validation failed", 400, {
          errors: errors.array().map(e => ({
            field: e.path,
            message: e.msg
          }))
        });
      }

      const { name, email, password } = req.body;

      const existing = await User.findOne({ email }).lean();
      if (existing) {
        return jsonError(res, "Email already registered", 409);
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await User.create({
        name,
        email,
        passwordHash,
        role: "user"
      });

      const token = signToken(user);

      return res.status(201).json({
        message: "Account created successfully",
        token,
        user: {
          _id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("[Register Error]", err.message);
      return jsonError(res, "Registration failed", 500);
    }
  }
);

app.post(
  "/api/auth/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isString().isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return jsonError(res, "Validation failed", 400);
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });
      
      if (!user) {
        return jsonError(res, "Invalid email or password", 401);
      }

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) {
        return jsonError(res, "Invalid email or password", 401);
      }

      const token = signToken(user);

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          _id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("[Login Error]", err.message);
      return jsonError(res, "Login failed", 500);
    }
  }
);

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.auth.sub;
    const user = await User.findById(userId).lean();
    
    if (!user) {
      return jsonError(res, "User not found", 404);
    }

    return res.status(200).json({
      message: "User profile",
      user: {
        _id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("[Me Error]", err.message);
    return jsonError(res, "Failed to fetch profile", 500);
  }
});

// ─────────────────────────────────────────────────────
// Scanner Routes
// ─────────────────────────────────────────────────────

// Scan engine helper
async function performVulnScan(url) {
  const findings = [];
  let riskScore = 0;
  const headers = {};
  let sslInfo = {};

  try {
    // 1. URL validation
    try {
      new URL(url);
    } catch {
      return { findings: [{ type: "url", severity: "critical", message: "Invalid URL format" }], riskScore: 100, headers, sslInfo };
    }

    // 2. HTTP request with timeouts
    let response;
    try {
      response = await axios.get(url, {
        timeout: 10000,
        validateStatus: () => true, // Accept all status codes
        maxRedirects: 5,
      });
    } catch (err) {
      findings.push({
        type: "connectivity",
        severity: "high",
        message: `Failed to connect: ${err.message.split('\n')[0]}`,
        details: { code: err.code }
      });
      riskScore = 85;
      return { findings, riskScore, headers, sslInfo };
    }

    // 3. Analyze response headers
    const respHeaders = response.headers || {};
    Object.assign(headers, respHeaders);

    // Check for security headers
    const requiredHeaders = {
      "content-security-policy": "CSP",
      "x-frame-options": "X-Frame-Options",
      "x-content-type-options": "X-Content-Type-Options",
      "strict-transport-security": "HSTS",
      "x-xss-protection": "X-XSS-Protection",
    };

    for (const [header, name] of Object.entries(requiredHeaders)) {
      if (!respHeaders[header]) {
        findings.push({
          type: "missing_header",
          severity: "medium",
          message: `Missing security header: ${name}`,
          details: { header }
        });
        riskScore += 8;
      }
    }

    // 4. Check for SSL/TLS (URL starts with https)
    const isSSL = url.startsWith("https://");
    if (!isSSL) {
      findings.push({
        type: "ssl",
        severity: "high",
        message: "No SSL/TLS encryption detected (HTTP used instead of HTTPS)",
      });
      riskScore += 15;
    } else {
      sslInfo.protocol = "TLS";
      sslInfo.encrypted = true;
      findings.push({
        type: "ssl",
        severity: "low",
        message: "Valid HTTPS connection detected",
      });
    }

    // 5. Check response status
    if (response.status >= 500) {
      findings.push({
        type: "server",
        severity: "high",
        message: `Server error (${response.status}): Check server health`,
      });
      riskScore += 10;
    } else if (response.status >= 400) {
      findings.push({
        type: "auth",
        severity: "medium",
        message: `Client error (${response.status}): Check authentication or permissions`,
      });
      riskScore += 5;
    }

    // 6. Check for server header exposure (fingerprinting)
    if (respHeaders["server"]) {
      findings.push({
        type: "fingerprinting",
        severity: "low",
        message: `Server information disclosed: ${respHeaders["server"]}`,
        details: { server: respHeaders["server"] }
      });
      riskScore += 2;
    }

    // 7. Check for common vulnerability patterns in response body
    const bodyStr = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    
    // XSS patterns
    if (bodyStr.includes("<script") || bodyStr.includes("javascript:")) {
      findings.push({
        type: "xss",
        severity: "high",
        message: "Potential XSS vulnerability: Inline scripts detected",
      });
      riskScore += 12;
    }

    // SQL Injection patterns in URL/params (basic heuristic)
    if (url.includes("'") || url.includes("--") || url.includes(";") || url.includes("/*")) {
      findings.push({
        type: "sqli",
        severity: "high",
        message: "Potential SQL Injection patterns detected in URL",
      });
      riskScore += 12;
    }

    // 8. Check cookie security
    const setCookie = respHeaders["set-cookie"];
    if (setCookie) {
      if (!setCookie.toString().includes("Secure")) {
        findings.push({
          type: "cookie",
          severity: "medium",
          message: "Insecure cookies detected (missing Secure flag)",
        });
        riskScore += 8;
      }
      if (!setCookie.toString().includes("HttpOnly")) {
        findings.push({
          type: "cookie",
          severity: "medium",
          message: "Cookies not protected with HttpOnly flag (XSS vulnerable)",
        });
        riskScore += 8;
      }
    }

    // 9. Success check
    if (findings.length === 0 || findings.every(f => f.severity === "low")) {
      findings.unshift({
        type: "scan_status",
        severity: "low",
        message: "Scan completed with no critical issues detected",
      });
    }

  } catch (err) {
    console.error("[Scan Error]", err.message);
    findings.push({
      type: "scan",
      severity: "critical",
      message: "Scan engine error",
    });
    riskScore = 100;
  }

  // Cap risk score at 100
  riskScore = Math.min(100, riskScore);

  return { findings, riskScore, headers, sslInfo };
}

app.post("/api/scan", authMiddleware, [
  body("url").isURL().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return jsonError(res, "Invalid URL", 400);
    }

    const { url } = req.body;
    const userId = req.auth.sub;

    // Create scan record
    const scan = await Scan.create({
      userId,
      url,
      status: "running",
    });

    // Run scan (non-blocking for demo; ideally queue this)
    const { findings, riskScore, headers, sslInfo } = await performVulnScan(url);

    // Update scan with results
    scan.findings = findings;
    scan.riskScore = riskScore;
    scan.headers = headers;
    scan.sslInfo = sslInfo;
    scan.status = "completed";
    await scan.save();

    return res.status(200).json({
      message: "Scan completed",
      scan: {
        _id: String(scan._id),
        url: scan.url,
        status: scan.status,
        riskScore: scan.riskScore,
        findings: scan.findings,
        createdAt: scan.createdAt,
      },
    });
  } catch (err) {
    console.error("[Scan Error]", err.message);
    return jsonError(res, "Scan failed", 500);
  }
});

app.get("/api/scan/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.auth.sub;

    const scan = await Scan.findOne({ _id: id, userId });
    if (!scan) {
      return jsonError(res, "Scan not found", 404);
    }

    return res.status(200).json({
      message: "Scan details",
      scan: {
        _id: String(scan._id),
        url: scan.url,
        status: scan.status,
        riskScore: scan.riskScore,
        findings: scan.findings,
        createdAt: scan.createdAt,
      },
    });
  } catch (err) {
    console.error("[Get Scan Error]", err.message);
    return jsonError(res, "Failed to fetch scan", 500);
  }
});

app.get("/api/scans", authMiddleware, async (req, res) => {
  try {
    const userId = req.auth.sub;
    const scans = await Scan.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.status(200).json({
      message: "User scans",
      scans: scans.map(s => ({
        _id: String(s._id),
        url: s.url,
        status: s.status,
        riskScore: s.riskScore,
        createdAt: s.createdAt,
      })),
    });
  } catch (err) {
    console.error("[Get Scans Error]", err.message);
    return jsonError(res, "Failed to fetch scans", 500);
  }
});

// ─────────────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Backend is healthy",
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.get("/", (req, res) => {
  res.json({ message: "VulnScanner API running" });
});

// ─────────────────────────────────────────────────────
// Container Security Routes
// ─────────────────────────────────────────────────────
app.post("/api/scan/dockerfile", authMiddleware, [
  body("dockerfile").isString().notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return jsonError(res, "Invalid input", 400, errors.array());
    }

    const { dockerfile } = req.body;
    const lines = dockerfile.split('\n').map(l => l.trim()).filter(Boolean);
    const findings = [];
    let grade = 'A';

    let hasUser = false;
    let fromLine = null;
    let hasAdd = false;
    let hasSecrets = false;
    let hasExpose22 = false;

    for (const line of lines) {
      if (line.toUpperCase().startsWith("USER ")) hasUser = true;
      if (line.toUpperCase().startsWith("FROM ")) fromLine = line;
      if (line.toUpperCase().startsWith("ADD ")) hasAdd = true;
      if (line.toUpperCase().startsWith("EXPOSE 22")) hasExpose22 = true;

      if (line.toUpperCase().startsWith("ENV ") || line.toUpperCase().startsWith("ARG ")) {
        const upperLine = line.toUpperCase();
        if (upperLine.includes("PASSWORD") || upperLine.includes("SECRET") || upperLine.includes("TOKEN") || upperLine.includes("KEY")) {
          hasSecrets = true;
        }
      }
    }

    if (!hasUser) {
      findings.push({
        type: "root_privilege",
        severity: "critical",
        message: "No USER directive specified. Container runs as root by default.",
        recommendation: "Add 'USER <non-root-user>' (e.g., 'USER node') before executing your application."
      });
    }

    if (fromLine) {
      if (fromLine.endsWith(":latest") || !fromLine.includes(":")) {
        findings.push({
          type: "unpinned_tag",
          severity: "high",
          message: "Base image uses 'latest' or has no tag pinned.",
          recommendation: "Pin a specific version (e.g., node:18.17.0) to prevent unpredictable breaking changes."
        });
      }
      if (!fromLine.includes("alpine") && !fromLine.includes("slim") && !fromLine.includes("distroless")) {
        findings.push({
          type: "bloated_image",
          severity: "medium",
          message: "Base image appears to be a full OS distribution.",
          recommendation: "Consider switching to an alpine, slim, or distroless variant to reduce attack surface."
        });
      }
    } else {
      findings.push({
        type: "missing_from",
        severity: "critical",
        message: "No FROM directive found.",
        recommendation: "A valid Dockerfile must begin with a FROM instruction."
      });
    }

    if (hasAdd) {
      findings.push({
        type: "insecure_directive",
        severity: "low",
        message: "Use of ADD directive detected.",
        recommendation: "Prefer COPY over ADD unless you specifically need to extract a tarball or fetch a remote URL."
      });
    }

    if (hasExpose22) {
      findings.push({
        type: "exposed_ssh",
        severity: "high",
        message: "Port 22 (SSH) is exposed.",
        recommendation: "Never run an SSH daemon inside a container. Use 'docker exec' for debugging."
      });
    }

    if (hasSecrets) {
      findings.push({
        type: "hardcoded_secrets",
        severity: "critical",
        message: "Potential secrets found in ENV or ARG directives.",
        recommendation: "Never hardcode secrets in Dockerfiles. Pass them at runtime or use Docker Secrets / BuildKit."
      });
    }

    const criticalCount = findings.filter(f => f.severity === 'critical').length;
    const highCount = findings.filter(f => f.severity === 'high').length;

    if (criticalCount > 0) grade = 'F';
    else if (highCount > 0) grade = 'D';
    else if (findings.length > 0) grade = 'B';

    return res.status(200).json({
      message: "Container scan completed",
      grade,
      findings
    });

  } catch (err) {
    console.error("[Container Scan Error]", err.message);
    return jsonError(res, "Scan failed", 500);
  }
});

// ─────────────────────────────────────────────────────
// Database connection
// ─────────────────────────────────────────────────────
async function start() {
  if (!MONGODB_URI) {
    console.error("[Mongo] Missing MONGODB_URI in env");
    process.exit(1);
  }

  mongoose.set("strictQuery", true);

  const connectOptions = {
    serverSelectionTimeoutMS: 20000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 20000,
    retryWrites: true,
  };

  mongoose.connection.on("connected", () => {
    console.log("[Mongo] Connected");
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("[Mongo] Disconnected");
  });
  mongoose.connection.on("error", (err) => {
    console.error("[Mongo] Error:", err.message);
  });

  async function connectWithRetry(maxAttempts) {
    let lastErr;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`[Mongo] Connecting... (attempt ${attempt}/${maxAttempts})`);
        await mongoose.connect(MONGODB_URI, connectOptions);

        if (mongoose.connection.readyState === 1) {
          return;
        }
      } catch (err) {
        lastErr = err;
        console.error(`[Mongo] Connection attempt ${attempt} failed:`, err.message);
        const delayMs = Math.min(8000, 2000 + attempt * 500);
        if (attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, delayMs));
        }
      }
    }
    throw lastErr;
  }

  try {
    await connectWithRetry(10);
    console.log("[Mongo] Connected successfully");
  } catch (err) {
    console.error("[Mongo] Failed to connect after retries");
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Startup failed:", err);
  process.exit(1);
});