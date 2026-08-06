/**
 * Constants: Features, pricing, navbar items, etc.
 */

import {
  Shield,
  Code,
  Lock,
  Globe,
  Database,
  Search,
  FileText,
  Zap,
  LucideIcon,
} from "lucide-react";

export interface Feature {
  id: string;
  icon: LucideIcon;
  label: string;
  title: string;
  shortDesc: string;
  description: string;
  fullDescription: string;
  benefits: string[];
  color: string;
  bgColor: string;
  severity?: "critical" | "high" | "medium" | "low";
}

export const FEATURES: Feature[] = [
  {
    id: "sql-injection",
    icon: Database,
    label: "SQL Injection",
    title: "SQL Injection Scanner",
    shortDesc: "Detect all SQLi variants including blind and time-based",
    description: "Advanced SQL injection detection",
    fullDescription:
      "Comprehensive SQL injection vulnerability detection including time-based blind SQLi, error-based injections, union-based attacks, and boolean-based blind attacks. Our scanner tests multiple injection vectors and uses intelligent payload optimization.",
    benefits: [
      "Detects blind SQL injections",
      "Time-based attack detection",
      "Error-based vulnerability identification",
      "Union-based query detection",
      "Automated payloads and vectors",
    ],
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    severity: "critical",
  },
  {
    id: "xss-scanner",
    icon: Code,
    label: "XSS Detection",
    title: "XSS Scanner",
    shortDesc: "Reflected, stored, and DOM-based XSS detection",
    description: "Multi-vector XSS vulnerability detection",
    fullDescription:
      "Detect all types of XSS vulnerabilities: reflected XSS in URL parameters, stored XSS in databases, and DOM-based XSS in JavaScript. Our advanced parser identifies bypass techniques and encoding evasion.",
    benefits: [
      "Reflected XSS detection",
      "Stored XSS identification",
      "DOM-based XSS scanning",
      "Filter bypass detection",
      "Multiple encoding techniques",
    ],
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    severity: "high",
  },
  {
    id: "ssl-checker",
    icon: Lock,
    label: "SSL/TLS Checker",
    title: "SSL/TLS Security Checker",
    shortDesc: "Certificate validity, cipher suite and protocol checks",
    description: "Complete SSL/TLS security analysis",
    fullDescription:
      "Comprehensive SSL/TLS certificate analysis including validity checks, cipher suite strength evaluation, protocol vulnerability detection (POODLE, Heartbleed), and certificate chain validation.",
    benefits: [
      "Certificate validity verification",
      "Cipher suite strength analysis",
      "Protocol vulnerability detection",
      "Certificate chain validation",
      "Expiration date warnings",
    ],
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    severity: "high",
  },
  {
    id: "security-headers",
    icon: Shield,
    label: "Security Headers",
    title: "Security Headers Checker",
    shortDesc: "CSP, HSTS, X-Frame-Options and 12 more headers",
    description: "Complete security header analysis",
    fullDescription:
      "Analyze all critical security headers including Content-Security-Policy, HTTP Strict Transport Security, X-Frame-Options, X-Content-Type-Options, and more. Get recommendations for optimal header configurations.",
    benefits: [
      "15+ header checks",
      "Configuration recommendations",
      "Best practices comparison",
      "Security score calculation",
      "CSP policy analysis",
    ],
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    severity: "medium",
  },
  {
    id: "cors-scanner",
    icon: Globe,
    label: "CORS Scanner",
    title: "CORS Configuration Scanner",
    shortDesc: "Detect dangerous cross-origin policy misconfigurations",
    description: "CORS vulnerability detection",
    fullDescription:
      "Identify dangerous CORS configurations that could lead to sensitive data exposure. Detects overly permissive origins, credential leaks, and missing origin validation.",
    benefits: [
      "Overly permissive origin detection",
      "Credential leak identification",
      "Origin validation testing",
      "Misconfiguration recommendations",
      "Real-world attack simulation",
    ],
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    severity: "high",
  },
  {
    id: "subdomain-finder",
    icon: Search,
    label: "Subdomain Finder",
    title: "Subdomain Enumeration",
    shortDesc: "Enumerate all subdomains and check their security",
    description: "Comprehensive subdomain discovery",
    fullDescription:
      "Discover hidden subdomains using multiple enumeration techniques including passive DNS queries, API scanning, and brute-force methods. Automatically security scan each discovered subdomain.",
    benefits: [
      "Passive DNS enumeration",
      "Brute-force subdomain discovery",
      "Automatic security scanning",
      "Shadow IT detection",
      "Subdomain categorization",
    ],
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    severity: "medium",
  },
  {
    id: "pdf-reports",
    icon: FileText,
    label: "PDF Reports",
    title: "PDF Report Generation",
    shortDesc: "Download full vulnerability reports in PDF format",
    description: "Professional report generation",
    fullDescription:
      "Generate comprehensive, professional PDF reports of all vulnerabilities found. Includes executive summary, detailed findings, remediation guidance, and compliance references.",
    benefits: [
      "Executive summary format",
      "Detailed vulnerability info",
      "Remediation recommendations",
      "Compliance references (OWASP, CWE)",
      "Custom branding options",
    ],
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    severity: "low",
  },
  {
    id: "ai-fix-suggestions",
    icon: Zap,
    label: "AI Fix Suggestions",
    title: "AI-Powered Remediation",
    shortDesc: "GPT-powered remediation for every vulnerability found",
    description: "Intelligent fix recommendations",
    fullDescription:
      "Get AI-powered fix suggestions for every vulnerability. Our system analyzes the vulnerability context and provides specific, actionable remediation code and guidance.",
    benefits: [
      "Context-aware fix suggestions",
      "Code examples provided",
      "Implementation guidance",
      "Security best practices",
      "Framework-specific recommendations",
    ],
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    severity: "low",
  },
];

export interface PricingPlan {
  id: string;
  name: string;
  descriptionInr: string;
  descriptionUsd: string;
  priceInr: number;
  priceUsd: number;
  billingPeriod: "monthly" | "yearly";
  highlighted: boolean;
  features: string[];
  cta: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    descriptionInr: "शुरुआत करने के लिए बिल्कुल सही",
    descriptionUsd: "Perfect for getting started",
    priceInr: 0,
    priceUsd: 0,
    billingPeriod: "monthly",
    highlighted: false,
    features: [
      "5 scans per day",
      "Basic vulnerability detection",
      "Email reports",
      "Community support",
      "OWASP Top 10 coverage",
    ],
    cta: "Start Free",
  },
  {
    id: "pro",
    name: "Professional",
    descriptionInr: "विकास टीमों के लिए आदर्श",
    descriptionUsd: "Great for development teams",
    priceInr: 4999,
    priceUsd: 60,
    billingPeriod: "monthly",
    highlighted: true,
    features: [
      "Unlimited scans",
      "All detection modules",
      "AI fix suggestions",
      "Scheduled scanning",
      "API access",
      "Priority support",
      "Custom reports",
      "Slack/Discord integration",
      "Advanced analytics",
    ],
    cta: "Get Started",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    descriptionInr: "बड़े संगठनों के लिए",
    descriptionUsd: "For large organizations",
    priceInr: 19999,
    priceUsd: 249,
    billingPeriod: "monthly",
    highlighted: false,
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Dedicated security officer",
      "Advanced threat intelligence",
      "Custom scanning rules",
      "Compliance reporting (SOC 2, ISO 27001)",
      "White-label option",
      "On-premise deployment",
      "24/7 support",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
  },
];

export const NAVBAR_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
];

/** In-app routes and anchors only (no placeholder pages). */
export const TOOLS_DROPDOWN = [
  { label: "OSINT Tool", href: "/docs#features" },
  { label: "Port Scanner", href: "/docs#api" },
  { label: "Vulnerability Scanner", href: "/dashboard/scan" },
  { label: "Container Security", href: "/dashboard/container" },
  { label: "Subdomain Finder", href: "/#feature-subdomain-finder" },
  { label: "SSL Checker", href: "/#feature-ssl-checker" },
];

export const FEATURES_DROPDOWN = [
  { label: "AI Detection", href: "/#feature-ai-fix-suggestions" },
  { label: "Scan Reports", href: "/#feature-pdf-reports" },
  { label: "Real-time Monitoring", href: "/#how-it-works" },
  { label: "Threat Intelligence", href: "/#feature-subdomain-finder" },
  { label: "API Integration", href: "/docs#api" },
];



export const FAQ_ITEMS = [
  {
    question: "What makes your scanner different?",
    answer:
      "Our scanner combines multiple detection engines with AI-powered analysis to identify vulnerabilities other tools might miss. We provide actionable remediation advice and maintain compliance with latest OWASP standards.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We use enterprise-grade encryption, HTTPS-only communication, and never store scan payloads. All data is deleted after 30 days unless manually retained.",
  },
  {
    question: "Can I scan internal applications?",
    answer:
      "Yes. Both cloud-based and on-premise scanning are available. For internal apps, install our lightweight agent or use our self-hosted solution.",
  },
  {
    question: "What's the cost for large enterprises?",
    answer:
      "Enterprise pricing is custom based on team size, scanning volume, and features needed. Contact our sales team for a personalized quote.",
  },
  {
    question: "Do you offer compliance reporting?",
    answer:
      "Yes. Pro and Enterprise plans include compliance reports for SOC 2, ISO 27001, GDPR, and other standards with audit trails.",
  },
  {
    question: "Can I integrate with my CI/CD pipeline?",
    answer:
      "Absolutely. We provide plugins for GitHub, GitLab, Jenkins, and other CI/CD platforms. API access is also available.",
  },
];

export const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Free scan", href: "/auth/register" },
  ],
  company: [
    { label: "Documentation", href: "/docs" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Sign in", href: "/auth/login" },
    { label: "Create account", href: "/auth/register" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API reference", href: "/docs#api" },
    { label: "Deployment", href: "/docs#deploy" },
    { label: "FAQ", href: "/docs#faq" },
  ],
  legal: [
    { label: "Privacy", href: "/docs#overview" },
    { label: "Terms", href: "/docs#faq" },
    { label: "Security", href: "/docs#auth" },
    { label: "Compliance", href: "/docs#deploy" },
  ],
};

export const SOCIAL_LINKS = [
  { icon: "Github", href: "https://github.com" },
  { icon: "Linkedin", href: "https://linkedin.com" },
  { icon: "Twitter", href: "https://twitter.com" },
  { icon: "Discord", href: "https://discord.com" },
  { icon: "Telegram", href: "https://telegram.com" },
  { icon: "Youtube", href: "https://youtube.com" },
];
