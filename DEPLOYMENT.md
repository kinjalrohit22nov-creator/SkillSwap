# SkillSwap — Deployment & Operations Guide

## Pre-Launch Checklist

### Security
- [ ] JWT_SECRET rotated (min 32 chars)
- [ ] All API keys in AWS Secrets Manager
- [ ] HTTPS enforced on all endpoints
- [ ] CORS whitelist configured (production domains only)
- [ ] Rate limiting tested (100 req/min per user)
- [ ] Helmet.js security headers enabled

### Database
- [ ] PostgreSQL in production (Supabase or RDS)
- [ ] Connection pooling configured (PgBouncer or pgpool)
- [ ] Backups automated (daily)
- [ ] MongoDB Atlas cluster (production)
- [ ] Redis in cluster mode (Upstash)

### Monitoring & Logging
- [ ] Error tracking (Sentry) configured
- [ ] Log aggregation (Datadog/Logtail) set up
- [ ] Health check endpoints deployed (`GET /health`)
- [ ] APM tools configured (DataDog APM)

### Payment Integration
- [ ] Stripe webhook signatures verified
- [ ] Production API keys in env
- [ ] Webhook retry logic tested
- [ ] Tax handling configured

### API & CDN
- [ ] API Gateway deployed
- [ ] Swagger docs published
- [ ] Frontend CDN (Vercel/Cloudflare) active
- [ ] Gzip compression enabled

---

## Deployment Architecture

### Services & Platforms

| Component | Platform | Config | Status |
|-----------|----------|--------|--------|
| Next.js Web | Vercel | Auto-deploy from `main` | Phase 1 |
| User Service | Railway/Render | Docker | Phase 1 |
| Match Service | Railway/Render | Docker | Phase 1 |
| Session Service | Railway/Render | Docker | Phase 1 |
| Token Service | Railway/Render | Docker | Phase 1 |
| AI Service | Railway/Render | Docker | Phase 1 |
| API Gateway | Railway/Render | Docker | Phase 1 |
| PostgreSQL | Supabase | Managed | Phase 1 |
| MongoDB | MongoDB Atlas | Managed | Phase 1 |
| Redis | Upstash | Managed | Phase 1 |
| S3 Storage | AWS | Managed | Phase 1 |
| TURN Server | Twilio | Managed | Phase 1 |
| Emails | SendGrid | Managed | Phase 1 |

---

## Environment Variables (Production)

Copy from `.env.example` and update:

```bash
# ── Database (production URLs) ──────────────────
DATABASE_URL=postgresql://user:pass@prod-db.supabase.co:5432/skillswap
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/skillswap
REDIS_URL=redis://user:pass@upstash-redis.com:6379

# ── Auth ────────────────────────────────────────
JWT_SECRET=<use strong random string>
JWT_EXPIRES_IN=7d

# ── OAuth (create apps at Google/GitHub)────────
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
GITHUB_CLIENT_ID=<from GitHub Settings>
GITHUB_CLIENT_SECRET=<from GitHub Settings>

OAUTH_CALLBACK_URL=https://skillswap.app/api/auth/callback

# ── AI ──────────────────────────────────────────
ANTHROPIC_API_KEY=<from Anthropic dashboard>
OPENAI_API_KEY=<from OpenAI dashboard>

# ── Payments ────────────────────────────────────
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# ── Storage ─────────────────────────────────────
AWS_ACCESS_KEY_ID=<from AWS IAM>
AWS_SECRET_ACCESS_KEY=<from AWS IAM>
AWS_S3_BUCKET=skillswap-prod

# ── Email ───────────────────────────────────────
SENDGRID_API_KEY=<from SendGrid dashboard>
EMAIL_FROM=noreply@skillswap.app

# ── App ─────────────────────────────────────────
NEXT_PUBLIC_API_URL=https://api.skillswap.app
NEXT_PUBLIC_SOCKET_URL=https://api.skillswap.app
NODE_ENV=production
```

---

## Deployment Steps

### 1. Frontend (Vercel)

```bash
# Connect GitHub repo to Vercel
# Auto-deploys on push to main

# Manual deploy (if needed)
vercel deploy --prod
```

**Post-deploy checks:**
- [ ] App loads at skillswap.app
- [ ] API calls reach gateway (check Network tab)
- [ ] WebSocket connects (check Console)

### 2. Backend Services (Railway/Render)

```bash
# Create app on Railway/Render with:
# - GitHub repo connected
# - Environment variables linked from Secrets Manager
# - Docker builds enabled

# Deploy
git push origin main  # Auto-triggers deploy
```

**Per-service setup:**
```
user-service → PORT 3001
match-service → PORT 3002
session-service → PORT 3003
token-service → PORT 3004
ai-service → PORT 3005
gateway → PORT 8080
```

### 3. Database Migrations

```bash
# SSH into production environment
ssh prod-server

# Run migrations
npm run db:migrate -- --prod

# Seed initial data (if fresh deploy)
npm run db:seed -- --prod
```

### 4. API Gateway

```bash
# Test gateway health
curl https://api.skillswap.app/health

# Check Swagger docs
https://api.skillswap.app/docs
```

### 5. Monitoring & Verification

```bash
# Monitor logs
# In Datadog/Logtail dashboard

# Check error rates
# In Sentry dashboard

# Performance metrics
# In DataDog APM
```

---

## Scaling Considerations

### Horizontal Scaling

**When to scale:**
- User count > 5,000
- Requests/sec > 100
- Response time > 500ms

**How to scale:**

1. **Database:**
   - Enable read replicas (Supabase)
   - Increase connection pool
   - Add caching layer (Redis more aggressive)

2. **Services:**
   - Auto-scaling groups (Railway/Render)
   - Load balancing (built-in)
   - Service replication

3. **Frontend:**
   - Vercel auto-scales
   - CDN at edge locations

### Optimization

```javascript
// Cache aggressive for match data
REDIS_TTL_MATCHES = 3600  // 1 hour

// Rate limiting per tier
RATE_LIMIT_FREE = 100/min
RATE_LIMIT_PREMIUM = 500/min

// Database query optimization
CREATE INDEX user_skills_user_id ON user_skills(user_id);
CREATE INDEX sessions_user_id ON sessions(teacher_id, learner_id);
```

---

## Disaster Recovery

### Backup Strategy

```bash
# PostgreSQL automated backups
# - Supabase: 7-day retention, geo-redundant
# - Restore: Point-in-time recovery available

# MongoDB Atlas backups
# - Continuous backups
# - 35-day retention
# - Restore to any point

# Redis persistence
# - Upstash: Daily snapshots
# - Restore available via dashboard
```

### Recovery Procedures

**If database is corrupted:**
```bash
# PostgreSQL
vercel env pull .env.production.local
npm run db:migrate -- --reset --prod
npm run db:seed -- --prod

# MongoDB
# Via MongoDB Atlas dashboard → Backup & Restore
```

**If service crashes:**
```bash
# Auto-restart via platform (Railway/Render)
# Manual restart:
railway redeploy -s user-service

# Check health
curl https://api.skillswap.app/health
```

---

## Monitoring Dashboard

### Key Metrics to Watch

1. **Error Rate**
   - Target: < 0.5%
   - Alert if: > 2%

2. **Response Time (p95)**
   - Target: < 200ms
   - Alert if: > 500ms

3. **Database Connections**
   - Target: < 80% of pool
   - Alert if: > 90%

4. **Cache Hit Rate**
   - Target: > 80%
   - Alert if: < 60%

5. **API Rate Limit Hits**
   - Monitor for suspicious patterns
   - Alert if: > 1% of requests

### Alert Rules (Datadog)

```javascript
// High error rate
error_rate > 0.02  // Alert at 2%

// Slow response time
avg_response_time > 500ms

// Database issues
db_connections_used / db_connections_limit > 0.9

// Memory pressure
memory_usage > 85%

// Stripe webhook failures
stripe_webhook_failures > 5
```

---

## Incident Response

### Process

1. **Detect** → Alert fires
2. **Assess** → Check dashboards, logs
3. **Communicate** → Notify team (Slack)
4. **Fix** → Apply hotfix or rollback
5. **Deploy** → Push fix to production
6. **Monitor** → Watch metrics for 1 hour
7. **Document** → Post-mortem

### Rollback Procedure

```bash
# If deploy is broken
git revert <commit-hash>
git push origin main

# Auto-redeploy on Vercel/Railway
# Or manual:
vercel deploy --prod
```

---

## Maintenance Windows

**Schedule:** Sundays 2-4 AM UTC

Activities:
- Database optimization
- Cache warmup
- Security patches
- Dependency updates

**Notification:** Email users 24h before

---

## Post-Launch Monitoring (First Month)

- [ ] Day 1: Monitor all error logs closely
- [ ] Week 1: Check database query performance
- [ ] Week 2: Review user feedback for bugs
- [ ] Week 3: Optimize slow endpoints
- [ ] Week 4: Capacity planning for growth

---

For emergency support: ops@skillswap.app
