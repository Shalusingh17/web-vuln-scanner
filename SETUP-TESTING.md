# VulnScanner - FINAL SETUP & TESTING GUIDE

## ✅ What Was Fixed

### 1. ✅ Authentication System (COMPLETE)
- [x] User registration with password validation (8+ chars, uppercase, lowercase, number, special char)
- [x] Email validation (real format, no disposable domains)
- [x] Secure JWT tokens with HttpOnly cookies
- [x] Login/Logout functionality
- [x] Protected routes with auto-redirect
- [x] Session persistence across page reloads
- [x] Error handling and validation messages

### 2. ✅ Scanner System (COMPLETE)
- [x] URL validation
- [x] HTTPS/HTTP detection
- [x] Security headers analysis (CSP, X-Frame-Options, HSTS, etc.)
- [x] XSS vulnerability detection
- [x] SQL Injection pattern detection
- [x] Cookie security analysis
- [x] Risk scoring (0-100)
- [x] Severity classification (Low, Medium, High, Critical)
- [x] Finding details with recommendations

### 3. ✅ Dashboard (COMPLETE)
- [x] Modern cyberpunk-style UI
- [x] Scan input form
- [x] Real-time scan progress
- [x] Vulnerability findings list
- [x] Risk score visualization
- [x] Recent scans history
- [x] Error handling and loading states

### 4. ✅ Performance Optimization (COMPLETE)
- [x] Removed heavy dependencies (framer-motion, recharts, socket.io)
- [x] Optimized Node memory usage
- [x] Disabled Turbopack for stability
- [x] Minimal dependencies
- [x] Fast page loads

### 5. ✅ Security (COMPLETE)
- [x] Helmet middleware
- [x] Rate limiting (100 req/15min)
- [x] CORS configuration
- [x] Input validation
- [x] Password hashing (bcrypt)
- [x] JWT authentication
- [x] HttpOnly cookies

## 📋 Pre-Setup Checklist

- [ ] Node.js >= 18 installed (check: `node -v`)
- [ ] npm >= 9 installed (check: `npm -v`)
- [ ] MongoDB Atlas account created
- [ ] Text editor/IDE ready
- [ ] Terminal/Command Prompt ready
- [ ] Internet connection available

## 🚀 STEP 1: MongoDB Setup

### Create MongoDB Atlas Database

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account (if you don't have one)
3. Create new Project → Create Cluster (free tier)
4. Wait for cluster to be ready (5-10 minutes)
5. Click "Connect" → "Connect your application"
6. Copy connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/vulnscanner?retryWrites=true&w=majority
   ```

### Add Whitelist IP
- In MongoDB Atlas, go to Network Access
- Click "Add IP Address" → "Allow Access from Anywhere" (for development)
- Click Confirm

## 🔧 STEP 2: Backend Setup

```bash
# Navigate to backend folder
cd d:\vuln-scanner\web-vuln-scanner\backend

# Install dependencies
npm install

# Create .env file
notepad .env
```

### Paste into .env:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/vulnscanner?retryWrites=true&w=majority
JWT_SECRET=my-super-secret-key-12345678
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

Replace:
- `YOUR_USERNAME` and `YOUR_PASSWORD` with MongoDB credentials
- `JWT_SECRET` with a random string (e.g., use: https://generate-random.org/encryption-key-generator)

### Test Backend:
```bash
npm run dev
```

Expected output:
```
[Mongo] Connected
[Server] Running on http://localhost:5000
```

✅ If you see these messages, backend is working!

## 🎨 STEP 3: Frontend Setup

```bash
# Navigate to frontend folder (new terminal)
cd d:\vuln-scanner\web-vuln-scanner\frontend

# Install dependencies
npm install

# Create .env.local file
notepad .env.local
```

### Paste into .env.local:
```
BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Start Frontend:
```bash
npm run dev
```

Expected output:
```
▲ Next.js 16.2.6
- Local: http://localhost:3000
```

✅ If you see these messages, frontend is working!

## 🧪 STEP 4: Full Testing

### Terminal Checklist
- [ ] Backend terminal shows "Connected" to MongoDB
- [ ] Backend terminal shows "Running on http://localhost:5000"
- [ ] Frontend terminal shows "Local: http://localhost:3000"
- [ ] No red errors in either terminal

### Browser Test

1. **Open http://localhost:3000**
   - [ ] Page loads in < 2 seconds
   - [ ] See cyberpunk-style login page
   - [ ] No console errors (F12 → Console)

2. **Test Registration**
   ```
   Name: John Doe
   Email: john@example.com
   Password: SecurePass123!
   Confirm: SecurePass123!
   ```
   - [ ] Click "Create Account"
   - [ ] Should redirect to dashboard
   - [ ] No error messages
   - [ ] User name shows in top right

3. **Test Dashboard**
   - [ ] See "Welcome, John Doe!"
   - [ ] See scan input box
   - [ ] See "Recent Scans" section (empty)

4. **Test Scanning**
   ```
   URL: https://example.com
   ```
   - [ ] Click "Start Scan"
   - [ ] Progress bar fills from 0-100%
   - [ ] Findings appear in list
   - [ ] Risk score shows (0-100)
   - [ ] Severity badges display (Low/Medium/High/Critical)

5. **Test Recent Scans**
   - [ ] Scan appears in "Recent Scans"
   - [ ] Click recent scan
   - [ ] Details reload correctly
   - [ ] Can scan another URL

6. **Test Logout**
   - [ ] Click "Logout"
   - [ ] Redirects to login page
   - [ ] Closes session

7. **Test Login**
   ```
   Email: john@example.com
   Password: SecurePass123!
   ```
   - [ ] Click "Authenticate"
   - [ ] Redirects to dashboard
   - [ ] Session restores

### Performance Check
- [ ] Pages load in < 2 seconds
- [ ] No lag when typing
- [ ] Smooth button clicks
- [ ] No freezing
- [ ] Task manager: Node ~60-80MB, Chrome ~150-200MB

## 📊 Test Scan Results

When you scan https://example.com, you should see:

**Risk Score:** 30-50 (Low-Medium)

**Typical Findings:**
- ✅ HTTPS connection verified
- ⚠ Missing security headers (CSP, X-Frame-Options)
- ℹ Server information disclosed
- ℹ Standard HTTP status 200 OK

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:**
1. Check MongoDB Atlas connection string in .env
2. Verify IP is whitelisted in MongoDB Atlas
3. Check username/password are correct
4. Try adding `?retryWrites=true&w=majority` to connection string

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or use different port
set PORT=5001
```

### Issue: "Backend returns 401 Unauthorized"
**Solution:**
- Clear browser cookies: DevTools → Application → Cookies → Delete all
- Make sure you're logged in first
- Check JWT_SECRET is same in both .env

### Issue: "ENOENT: no such file or directory"
**Solution:**
- Create missing .env files
- Run `npm install` again
- Check folder paths are correct

### Issue: "Frontend stuck in loading loop"
**Solution:**
- Hard refresh: Ctrl+Shift+R
- Clear cache: DevTools → Application → Cache → Clear
- Check backend is running
- Check BACKEND_URL in .env.local

## ✨ Advanced Testing

### Test Different Websites

Try scanning these:
- https://google.com (should have good security)
- https://example.com (should have missing headers)
- https://httpbin.org/get (test connectivity)
- https://your-own-site.com (real-world test)

### Test Error Handling

Try these to trigger errors:
- Invalid URL: "not-a-url"
- Offline site: "https://definitely-not-a-real-domain-12345.com"
- Timeout: "https://httpstat.us/200?sleep=20000"

## 📝 What Each Finding Means

| Finding | Severity | Action |
|---------|----------|--------|
| Missing CSP Header | Medium | Add Content-Security-Policy header |
| Insecure Cookie | Medium | Add Secure flag to Set-Cookie |
| No HSTS | Medium | Add Strict-Transport-Security header |
| XSS Pattern | High | Sanitize user input, use CSP |
| SQL Injection Pattern | High | Use parameterized queries |
| Server Info Disclosed | Low | Remove Server header or mask it |
| HTTPS Not Used | High | Switch to HTTPS |

## 🚀 Next Steps (Optional)

### Deploy to Production

**Option 1: Vercel (Recommended - Free)**
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Auto-deploys on push

**Option 2: Railway (Free tier)**
1. Connect GitHub
2. Deploy backend
3. Deploy frontend
4. Set environment variables

**Option 3: Heroku (Paid)**
```bash
git push heroku main
```

### Custom Domain
1. Register domain (GoDaddy, Namecheap)
2. Update DNS to point to Vercel/Railway
3. Update BACKEND_URL and FRONTEND_URL

### Database Backup
```bash
# Backup MongoDB
mongodbdump --uri="your-connection-string" --out=backup/

# Restore
mongorestore --uri="your-connection-string" backup/
```

## 📊 File Summary

### All Changed Files:
1. ✅ `backend/server.js` - Complete rewrite with scanner
2. ✅ `backend/package.json` - Cleaned dependencies
3. ✅ `backend/.env.example` - New
4. ✅ `frontend/package.json` - Cleaned dependencies
5. ✅ `frontend/.env.example` - New
6. ✅ `frontend/src/lib/AuthContext.tsx` - Fixed auth
7. ✅ `frontend/src/components/ProtectedRoute.tsx` - Improved
8. ✅ `frontend/src/app/auth/register/page.tsx` - Complete rewrite
9. ✅ `frontend/src/app/auth/login/page.tsx` - Already good
10. ✅ `frontend/src/app/dashboard/page.tsx` - Complete rewrite with scanner
11. ✅ `frontend/next.config.ts` - Optimized
12. ✅ `COMPLETE-GUIDE.md` - New documentation
13. ✅ `START.bat` - New batch script
14. ✅ `START.sh` - New shell script

## 🎉 Success Indicators

✅ All tests pass if you see:
- Backend logs showing MongoDB connected
- Frontend loads in < 2 seconds
- Can register new account
- Can login successfully
- Dashboard displays without errors
- Scan completes with findings
- Recent scans list updates
- Logout works
- Can login again

## 📞 Support

If something doesn't work:
1. Check terminal for error messages
2. Review .env files for typos
3. Verify MongoDB connection
4. Clear browser cache
5. Restart both servers
6. Check firewall settings

---

**VulnScanner** - Professional Web Vulnerability Scanner

Ready to scan! 🛡️
