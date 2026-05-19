# VulnScanner - Deployment & Production Guide

## 🎯 DEPLOYMENT OPTIONS

### Option 1: Vercel + Railway (RECOMMENDED)
**Cost:** Free (up to limits)  
**Best for:** First deployment, easy scaling

### Option 2: Heroku
**Cost:** $7-14/month  
**Best for:** Simple deployments

### Option 3: AWS
**Cost:** Free tier available  
**Best for:** Large scale

### Option 4: Self-Hosted
**Cost:** Server cost only  
**Best for:** Full control

---

## 🚀 DEPLOYMENT 1: VERCEL + RAILWAY

### Part A: Vercel (Frontend)

#### 1. Push to GitHub
```bash
cd web-vuln-scanner
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/vulnscanner.git
git push -u origin main
```

#### 2. Connect to Vercel
```
1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repo
4. Click "Import"
```

#### 3. Add Environment Variables
```
In Vercel Dashboard → Settings → Environment Variables
Add: BACKEND_URL = https://railway-backend-url.railway.app
```

#### 4. Deploy
```
Vercel auto-deploys on push!
Frontend URL: https://vulnscanner.vercel.app (example)
```

### Part B: Railway (Backend)

#### 1. Setup Railway
```
1. Go to https://railway.app
2. Login with GitHub
3. Click "New Project"
4. Select "GitHub repo"
5. Choose your repo
```

#### 2. Add Environment Variables
```
In Railway Dashboard → Variables
PORT = 5000
NODE_ENV = production
MONGODB_URI = your-mongodb-connection-string
JWT_SECRET = generate-random-secret
FRONTEND_URL = https://vulnscanner.vercel.app
```

#### 3. Deploy
```
Railway auto-deploys on push!
Backend URL: https://railway-backend-url.railway.app (auto-generated)
```

#### 4. Update Frontend
```
Go to Vercel Settings → Environment Variables
Update: BACKEND_URL = https://railway-backend-url.railway.app
```

---

## 🐳 DEPLOYMENT 2: DOCKER (Self-Hosted)

### Create Docker Files

#### backend/Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY server.js .

EXPOSE 5000

CMD ["node", "server.js"]
```

#### frontend/Dockerfile
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["npm", "start"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - FRONTEND_URL=http://localhost:3000
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - BACKEND_URL=http://backend:5000
    depends_on:
      - backend

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

### Run with Docker
```bash
docker-compose up
# Access: http://localhost:3000
```

---

## 🌐 DEPLOYMENT 3: HEROKU

### Backend Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create vulnscanner-api

# Add MongoDB Atlas
heroku config:set MONGODB_URI=mongodb+srv://...

# Add JWT Secret
heroku config:set JWT_SECRET=your-secret

# Deploy
cd backend
git subtree push --prefix backend heroku main

# View logs
heroku logs --tail
```

### Frontend Deployment

```bash
# Update BACKEND_URL
# frontend/.env.production
BACKEND_URL=https://vulnscanner-api.herokuapp.com

# Create Heroku app
heroku create vulnscanner-web

# Deploy
cd frontend
git subtree push --prefix frontend heroku main

# URL: https://vulnscanner-web.herokuapp.com
```

---

## 📊 PRODUCTION CHECKLIST

### Code Preparation
- [ ] All .env secrets are NOT in git
- [ ] No console.log statements with sensitive data
- [ ] No TODO/FIXME comments in code
- [ ] TypeScript strict mode enabled
- [ ] All imports use absolute paths
- [ ] Build completes without warnings
- [ ] Tests pass (if applicable)

### Configuration
- [ ] .env files created with production values
- [ ] Database backups enabled
- [ ] CORS origin is specific URL, not "*"
- [ ] Rate limiting is appropriate
- [ ] JWT expiration is reasonable
- [ ] Session timeout is configured

### Security
- [ ] HTTPS everywhere (enforce in app)
- [ ] Helmet security headers enabled
- [ ] CORS properly configured
- [ ] Rate limiting per IP
- [ ] Input validation on all endpoints
- [ ] No SQL injection vulnerabilities
- [ ] XSS protection enabled
- [ ] CSRF tokens if needed
- [ ] Secrets not in code

### Performance
- [ ] Database indexes created
- [ ] Images optimized
- [ ] Caching headers set
- [ ] Gzip compression enabled
- [ ] CDN configured (if needed)
- [ ] Load times < 2 seconds

### Monitoring
- [ ] Error logging setup (Sentry, LogRocket)
- [ ] Performance monitoring (New Relic, Datadog)
- [ ] Uptime monitoring (Pingdom, UptimeRobot)
- [ ] Log aggregation (Loggly, Stackdriver)
- [ ] Alerts configured for critical issues

### Backup & Disaster Recovery
- [ ] Database backups automated
- [ ] Backup restore tested
- [ ] Disaster recovery plan documented
- [ ] Version control backup
- [ ] Environment variables backed up

---

## 🔐 PRODUCTION SECURITY HARDENING

### Backend Security

```javascript
// Enable all security headers
app.use(helmet({
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
  hsts: { maxAge: 31536000 },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    }
  }
}));

// Strict rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Input sanitization
const { body } = require('express-validator');
app.post('/api/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 })
], loginHandler);
```

### Frontend Security

```javascript
// Content Security Policy
// next.config.ts
async headers() {
  return [{
    source: '/:path*',
    headers: [
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY'
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
      }
    ]
  }];
}
```

---

## 📈 SCALING STRATEGIES

### If Traffic Increases

**Phase 1: Basic Optimization**
- Enable database indexes
- Setup Redis caching
- Use CDN for static files
- Enable gzip compression

**Phase 2: Infrastructure Scaling**
- Use load balancer (Nginx)
- Run multiple backend instances
- Separate database server
- Use message queues (RabbitMQ)

**Phase 3: Enterprise Scaling**
- Kubernetes orchestration
- Database sharding
- Microservices architecture
- Global CDN

---

## 💾 BACKUP & RESTORE

### MongoDB Backup

```bash
# Manual backup
mongodump --uri "mongodb+srv://..." --out ./backup

# Restore
mongorestore --uri "mongodb+srv://..." ./backup

# Automated (in MongoDB Atlas)
# Dashboard → Backups → Enable automatic backups
```

### Application Backup

```bash
# Backup entire project
tar -czf vulnscanner-backup-$(date +%Y%m%d).tar.gz .

# Store in S3, Azure, or Google Cloud Storage
aws s3 cp vulnscanner-backup-*.tar.gz s3://backups/
```

---

## 🆘 TROUBLESHOOTING PRODUCTION ISSUES

### Issue: High Memory Usage
```javascript
// Add memory monitoring
const os = require('os');
setInterval(() => {
  console.log('Memory usage:', Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB');
}, 60000);
```

### Issue: Database Connection Drops
```javascript
// Retry logic
async function connectDB() {
  let retries = 5;
  while (retries > 0) {
    try {
      await mongoose.connect(uri);
      return;
    } catch (err) {
      retries--;
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  throw new Error('Failed to connect after 5 retries');
}
```

### Issue: Slow Queries
```javascript
// Add query monitoring
db.setProfilingLevel(1);
// Review slow queries
db.system.profile.find({ millis: { $gt: 1000 } }).pretty();
```

---

## 📊 MONITORING SETUP

### Sentry (Error Tracking)

```javascript
// backend/server.js
const Sentry = require("@sentry/node");

Sentry.init({ dsn: "your-sentry-dsn" });

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

### New Relic (Performance)

```javascript
require('newrelic');
// Place at top of server.js
```

### UptimeRobot (Uptime Monitoring)

```
1. Go to UptimeRobot.com
2. Add Monitor
3. URL: https://your-api.com/health
4. Alert if down
```

---

## 🚀 ZERO-DOWNTIME DEPLOYMENT

### Blue-Green Deployment

```bash
# Deploy to "green" environment
# Run all tests
# Switch traffic from "blue" to "green"
# If issues, switch back to "blue"

# Railway/Vercel do this automatically!
```

### Canary Deployment

```bash
# Deploy to 10% of users
# Monitor errors and performance
# If good, deploy to 100%
# If bad, rollback
```

---

## 📝 PRODUCTION ENVIRONMENT VARIABLES

### backend/.env (Production)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vulnscanner
JWT_SECRET=generate-long-random-string-32-chars-min
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://yourdomain.com

# Optional
SENTRY_DSN=your-sentry-dsn
NEW_RELIC_LICENSE_KEY=your-nr-key
```

### frontend/.env.production
```
BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_TELEMETRY_DISABLED=1
```

---

## 🎯 FINAL CHECKLIST

- [ ] Database migrations run
- [ ] Environment variables set
- [ ] SSL certificate configured
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Team access granted
- [ ] Documentation updated
- [ ] Stakeholders notified
- [ ] Load testing passed
- [ ] Security audit complete
- [ ] Performance benchmarks met
- [ ] Incident response plan ready

---

## 🎓 POST-DEPLOYMENT

### Week 1
- Monitor error rates
- Check performance metrics
- Review user feedback
- Fix any critical issues

### Week 2-4
- Optimize based on data
- Plan improvements
- Train support team
- Document processes

### Ongoing
- Regular backups
- Security updates
- Performance optimization
- Feature improvements

---

## 📞 SUPPORT CONTACTS

- Email: support@yourdomain.com
- Slack: #vulnscanner
- Status Page: https://status.yourdomain.com
- Incident Response: Page on call engineer

---

**Congratulations! Your VulnScanner is now production-ready! 🎉**

Questions? Review SETUP-TESTING.md or COMPLETE-GUIDE.md

Happy scanning! 🛡️
