# SkillSwap — Peer-to-Peer Skill Exchange Platform

![SkillSwap](https://img.shields.io/badge/SkillSwap-v1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/Node-%3E%3D18-brightgreen)

**Teach what you know. Learn what you need.**

SkillSwap is a modern peer-to-peer skill exchange platform designed for university students, bootcamp graduates, and self-learners. Built with a token-based economy (no money involved), users exchange skills with each other through 1-on-1 sessions powered by WebRTC video calls.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- ✅ **User Authentication** — OAuth + JWT-based auth with email/password fallback
- ✅ **Skill Matching** — AI-powered recommendation engine using embeddings + collaborative filtering
- ✅ **Session Booking** — Calendar-based scheduling with duration options (30/60/90 min)
- ✅ **Video Calls** — P2P WebRTC sessions with live chat and session notes
- ✅ **Token Economy** — Earned through teaching, spent to book sessions (or purchased via Stripe)
- ✅ **Learning Roadmaps** — AI-generated personalized learning paths using Claude API
- ✅ **Reviews & Ratings** — Community trust system with star ratings and feedback
- ✅ **Real-time Notifications** — WebSocket events for matches, session reminders, token updates

---

## Tech Stack

### Frontend
- **Next.js 14** (App Router, SSR)
- **React 18** with TypeScript
- **TailwindCSS** + Dark theme
- **Zustand** (state management)
- **Socket.IO** (real-time updates)
- **Axios** (HTTP client)

### Backend Services (Node.js + Express)
- **User Service** — Auth, profiles, OAuth
- **Match Service** — Skill embeddings, recommendation algorithm
- **Session Service** — Booking, calendar, WebRTC signaling
- **Token Service** — Wallet, transactions, Stripe integration
- **AI Service** — Roadmap generation, sentiment analysis

### Infrastructure
- **PostgreSQL 16** — Main database (users, sessions, transactions)
- **MongoDB 7** — Document store (sessions, notes)
- **Redis 7** — Pub/Sub, caching, real-time events
- **Docker & Compose** — Local dev stack + containerization
- **API Gateway** — Express reverse proxy with rate limiting + auth

### Deployment
- **Vercel** (frontend)
- **Railway / Render** (backend services)
- **Supabase / AWS RDS** (PostgreSQL)
- **MongoDB Atlas** (MongoDB)
- **Upstash** (Redis)
- **AWS S3** (file uploads)

---

## Project Structure

```
skillswap/
├── apps/
│   └── web/                          # Next.js 14 frontend
│       ├── app/                      # App Router pages
│       ├── components/               # React components
│       ├── lib/                      # API, socket, WebRTC helpers
│       ├── store/                    # Zustand state stores
│       ├── hooks/                    # Custom React hooks
│       └── package.json
│
├── services/
│   ├── user-service/                 # Port 3001
│   ├── match-service/                # Port 3002
│   ├── session-service/              # Port 3003
│   ├── token-service/                # Port 3004
│   └── ai-service/                   # Port 3005
│
├── gateway/                          # Port 8080 — API Gateway
│   ├── src/
│   │   ├── middleware/auth.js
│   │   ├── middleware/rateLimit.js
│   │   └── proxy/index.js
│   └── package.json
│
├── shared/
│   ├── types/index.ts                # Shared TypeScript interfaces
│   ├── events/index.js               # Event constants
│   └── utils/                        # JWT, logger utilities
│
├── infra/
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   ├── nginx/nginx.conf
│   └── k8s/                          # Kubernetes (optional)
│
├── .env.example
├── package.json
├── turbo.json
└── README.md
```

---

## Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** or **pnpm**
- **Docker** & **Docker Compose**
- **Git**

### 1. Clone Repository
```bash
git clone https://github.com/your-org/skillswap.git
cd skillswap
```

### 2. Install Dependencies
```bash
npm install
# or: pnpm install
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your secrets (PostgreSQL, JWT, API keys, etc.)
```

### 4. Start Infrastructure
```bash
docker-compose up -d
```

This starts:
- PostgreSQL (5432)
- MongoDB (27017)
- Redis (6379)
- Gateway (8080)
- All microservices (3001-3005)

### 5. Run Migrations
```bash
npm run db:migrate
```

### 6. (Optional) Seed Sample Data
```bash
npm run db:seed
```

### 7. Start Development Servers
```bash
npm run dev
```

Using **Turborepo**, this starts all services in parallel:
- **Web frontend** → http://localhost:3000
- **API Gateway** → http://localhost:8080
- **Services** → 3001–3005
- **Docs** → http://localhost:8080/docs (Swagger)

---

## Development

### Project Commands

```bash
# Start all services
npm run dev

# Build all packages
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Database operations
npm run db:migrate
npm run db:seed

# Clean dependencies
npm run clean
```

### Git Workflow

```
main (production) ← dev (integration) ← feature/* (develop)
```

**Commit Convention (Conventional Commits):**
```
feat(match): add cosine similarity scoring
fix(auth): resolve JWT refresh token bug
chore(infra): update docker-compose redis version
```

### Adding New Features

1. Create feature branch: `git checkout -b feature/my-feature`
2. Implement changes
3. Test locally: `npm run test && npm run lint`
4. Push and create PR to `dev`
5. After review, merge to `dev`, then promote to `main` for release

---

## API Documentation

### Gateway Endpoints

All endpoints proxy to respective microservices. Full Swagger UI at `/docs`.

#### Authentication
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login
- `POST /api/auth/refresh` — Refresh JWT token
- `POST /api/auth/logout` — Logout

#### Matches
- `GET /api/matches` — Get recommended matches
- `GET /api/matches/:id` — Get single match
- `POST /api/matches/:id/accept` — Accept match
- `POST /api/matches/:id/reject` — Reject match

#### Sessions
- `POST /api/sessions/book` — Create session booking
- `GET /api/sessions` — Get user's sessions
- `GET /api/sessions/:id` — Get session details
- `POST /api/sessions/:id/start` — Begin session
- `POST /api/sessions/:id/end` — End session

#### Wallet
- `GET /api/wallet` — Get token balance
- `GET /api/wallet/transactions` — Transaction history
- `POST /api/wallet/topup` — Purchase tokens (Stripe)

#### Roadmaps
- `GET /api/roadmaps/:skillId` — Get AI-generated roadmap
- `POST /api/roadmaps/:skillId/milestone/:mId/complete` — Mark milestone done

---

## Deployment

### Pre-Launch Checklist
- [ ] All `.env` secrets in AWS Secrets Manager
- [ ] PostgreSQL with connection pooling
- [ ] Redis in cluster mode (Upstash)
- [ ] HTTPS + TLS enforced
- [ ] Rate limiting configured
- [ ] CORS whitelist set
- [ ] Stripe webhooks verified
- [ ] Error monitoring (Sentry) enabled
- [ ] Logs aggregation setup (Datadog)
- [ ] Health check endpoints tested

### Deployment Targets

| Service | Platform | Config |
|---------|----------|--------|
| Web | Vercel | Auto from `main` |
| Services | Railway / Render | Docker containers |
| PostgreSQL | Supabase / RDS | Managed |
| MongoDB | Atlas | Managed |
| Redis | Upstash | Managed |
| S3 | AWS | File storage |
| TURN | Twilio / Coturn | WebRTC relay |

### Deployment Steps

1. **Frontend**
   ```bash
   # Vercel auto-deploys on push to main
   git push origin main
   ```

2. **Backend Services**
   ```bash
   # Push to Railway/Render
   git push railway main
   # Or deploy Docker images to ECR
   docker push your-registry/skillswap-user-service:latest
   ```

3. **Database Migrations**
   ```bash
   npm run db:migrate -- --prod
   ```

---

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -am 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) file for details.

---

## Contact & Support

- **Issues** — [GitHub Issues](https://github.com/your-org/skillswap/issues)
- **Discussions** — [GitHub Discussions](https://github.com/your-org/skillswap/discussions)
- **Email** — support@skillswap.app

---

**SkillSwap** — *Teach what you know. Learn what you need.* 🚀
