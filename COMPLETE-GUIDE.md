# VulnScanner - Web Vulnerability Scanner

A professional full-stack web vulnerability scanner built with Next.js, Express, and MongoDB.

## 🎯 Features

### Authentication System
- ✅ User Registration with strong password validation
- ✅ Secure JWT-based login
- ✅ Email validation with disposable domain blocking
- ✅ Password requirements (8+ chars, uppercase, lowercase, number, special char)
- ✅ HttpOnly cookie-based session management
- ✅ Protected routes with automatic redirects

### Website Scanning Engine
- ✅ URL validation and connectivity check
- ✅ HTTP/HTTPS detection
- ✅ Security headers analysis (CSP, X-Frame-Options, HSTS, etc.)
- ✅ SSL/TLS certificate detection
- ✅ XSS vulnerability pattern detection
- ✅ SQL Injection pattern detection
- ✅ Cookie security analysis (Secure, HttpOnly flags)
- ✅ Server information disclosure detection
- ✅ Risk scoring (0-100)
- ✅ Severity classification (Low, Medium, High, Critical)

### Dashboard
- ✅ Modern cyberpunk-style UI
- ✅ Real-time scan results
- ✅ Vulnerability findings with details
- ✅ Risk score visualization
- ✅ Recent scans history
- ✅ Loading states and error handling

### Security
- ✅ Helmet middleware for secure headers
- ✅ Express rate limiting (100 req/15min)
- ✅ CORS with configurable origin
- ✅ Input validation and sanitization
- ✅ Password hashing with bcrypt
- ✅ Secure JWT tokens

### Performance
- ✅ Optimized Node.js memory usage (512MB dev, 1536MB Next)
- ✅ Turbopack disabled for stability
- ✅ Minimal dependencies
- ✅ Next.js optimizations enabled
- ✅ Efficient database queries

## 📋 Stack

- **Frontend**: Next.js 16+ with TypeScript, Tailwind CSS, Lucide icons
- **Backend**: Express.js with Node.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT + HttpOnly Cookies
- **Security**: Helmet, Rate limiting, Express validator
- **Dev Tools**: Nodemon for backend auto-reload, ESLint for code quality

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- MongoDB Atlas account (free)
- Windows, macOS, or Linux

### 1. Clone & Setup

```bash
cd d:\vuln-scanner\web-vuln-scanner
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
copy .env.example .env

# Edit .env with your MongoDB URI and JWT secret
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vulnscanner
# JWT_SECRET=your-random-string-here
```

### 3. Frontend Setup

```bash
cd ..\frontend
npm install

# Create .env.local file
copy .env.example .env.local

# Optional: Set BACKEND_URL if not localhost:5000
# BACKEND_URL=http://localhost:5000
```

### 4. Run the Project

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

**Open browser:** http://localhost:3000

## 📝 Testing Checklist

### Authentication
- [ ] Register new account with valid email/password
- [ ] Verify email validation rejects invalid formats
- [ ] Verify password validation requires all criteria
- [ ] Login with registered account
- [ ] Check dashboard loads after login
- [ ] Verify logout clears session
- [ ] Test protected routes (redirect to login if not authenticated)

### Scanning
- [ ] Enter valid URL (https://example.com)
- [ ] Click "Start Scan" button
- [ ] Watch progress and findings appear
- [ ] Verify risk score calculation
- [ ] Check severity badges display correctly
- [ ] Scan should complete in 5-10 seconds
- [ ] Recent scans list updates
- [ ] Click recent scan to view details

### UI/UX
- [ ] Cyberpunk theme displays correctly
- [ ] No console errors
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] All buttons functional
- [ ] Proper error messages shown
- [ ] Loading states working

### Performance
- [ ] Page loads in < 2 seconds
- [ ] No memory leaks (check browser dev tools)
- [ ] Smooth animations
- [ ] No lag during typing

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vulnscanner
JWT_SECRET=your-strong-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 📁 Project Structure

```
web-vuln-scanner/
├── backend/
│   ├── server.js              # Express app with auth & scan endpoints
│   ├── package.json           # Backend dependencies
│   ├── .env.example           # Environment template
│   └── node_modules/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx              # Root layout with AuthProvider
│   │   │   ├── page.tsx                # Landing page
│   │   │   ├── api/auth/               # Next.js API routes (proxy)
│   │   │   └── dashboard/
│   │   │       ├── page.tsx            # Main dashboard
│   │   │       └── scan/page.tsx       # Scan interface
│   │   ├── auth/
│   │   │   ├── login/page.tsx          # Login form
│   │   │   └── register/page.tsx       # Registration form
│   │   ├── components/
│   │   │   ├── ProtectedRoute.tsx      # Auth guard
│   │   │   └── ui/                     # UI components
│   │   └── lib/
│   │       └── AuthContext.tsx         # Auth context provider
│   ├── package.json
│   ├── .env.example
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── tsconfig.json
│
└── README.md
```

## 🔐 Security Notes

### Passwords
- Minimum 8 characters
- Must contain uppercase letter (A-Z)
- Must contain lowercase letter (a-z)
- Must contain number (0-9)
- Must contain special character (!@#$%^&*)

### Email Validation
- Real email format required
- Disposable domains blocked (tempmail.com, etc.)
- Unique per user

### Tokens
- JWT signed with SECRET key
- Expires in 7 days
- Stored in HttpOnly cookies (not accessible from JS)
- Transmitted in Authorization header or cookies

### API Security
- Rate limited: 100 requests per 15 minutes
- CORS restricted to frontend URL
- Input validation on all endpoints
- Helmet middleware for secure headers

## 🐛 Troubleshooting

### "Cannot find module 'express'"
```bash
cd backend
npm install
```

### "MONGODB_URI is missing"
- Create .env file in backend directory
- Copy values from .env.example
- Set real MongoDB connection string

### "Frontend keeps redirecting to login"
- Make sure backend is running (http://localhost:5000)
- Check browser cookies are enabled
- Clear browser cache/cookies and retry

### "Scan fails with connection error"
- Verify backend is running
- Check firewall allows localhost:5000
- Check BACKEND_URL in frontend .env

### "Port already in use"
- Change PORT in .env (backend)
- Kill process using the port

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Scanning
- `POST /api/scan` - Start new scan (requires auth)
- `GET /api/scans` - List user's scans (requires auth)
- `GET /api/scan/:id` - Get scan details (requires auth)

### Health
- `GET /health` - Backend health check
- `GET /` - API status

## 🚀 Production Deployment

### Before Deploying
1. Set strong JWT_SECRET in environment
2. Use real MongoDB Atlas connection
3. Set NODE_ENV=production
4. Run `npm run build` in frontend
5. Update FRONTEND_URL and BACKEND_URL for production domains

### Deploy Backend
- **Vercel**: Push to GitHub, connect to Vercel
- **Heroku**: `git push heroku main`
- **Railway**: Push repo, set env vars
- **Self-hosted**: Use PM2 process manager

### Deploy Frontend
- **Vercel**: Recommended (built for Next.js)
- **Netlify**: Requires build command setup
- **GitHub Pages**: Static export mode

### Environment Setup
```bash
# Production backend .env
PORT=5000
NODE_ENV=production
MONGODB_URI=<production-mongo-uri>
JWT_SECRET=<very-strong-secret>
FRONTEND_URL=<your-frontend-domain>

# Production frontend .env.local
BACKEND_URL=<your-backend-domain>
NEXT_PUBLIC_APP_URL=<your-frontend-domain>
NODE_ENV=production
```

## 📖 API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "token": "jwt-token-here",
  "user": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Error Response
```json
{
  "message": "Error description",
  "details": {
    "errors": [
      {
        "field": "email",
        "message": "Enter a valid email address"
      }
    ]
  }
}
```

### Scan Response
```json
{
  "message": "Scan completed",
  "scan": {
    "_id": "scan-id",
    "url": "https://example.com",
    "status": "completed",
    "riskScore": 45,
    "findings": [
      {
        "type": "missing_header",
        "severity": "medium",
        "message": "Missing security header: CSP"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

## 🤝 Support

For issues or questions:
1. Check troubleshooting section
2. Review .env configuration
3. Check browser console for errors
4. Verify backend is running
5. Verify MongoDB connection

## 📄 License

MIT License - Feel free to use for personal or commercial projects

---

**VulnScanner** - Professional Web Vulnerability Scanner v1.0
