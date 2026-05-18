# Architecture & Technical Decisions

## System Design Overview

SkillSwap is built as a **microservices monorepo** with:
- Unified frontend (Next.js)
- 5 specialized backend services
- Central API Gateway
- Shared libraries

### Request Flow

```
Browser
  ↓
Next.js Frontend (3000)
  ↓
API Gateway (8080)
  ├→ User Service (3001)
  ├→ Match Service (3002)
  ├→ Session Service (3003)
  ├→ Token Service (3004)
  └→ AI Service (3005)
  ↓
PostgreSQL / MongoDB / Redis
```

---

## Service Responsibilities

### 1. User Service (Port 3001)
**Responsibility:** User authentication, profiles, OAuth

**Key Features:**
- JWT token generation/refresh
- OAuth integration (Google, GitHub)
- User profile CRUD
- Email verification
- Password reset flows

**Database:** PostgreSQL
- Users table
- OAuth tokens table
- Email verification table

**Key Routes:**
```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
GET    /profile
PUT    /profile
POST   /oauth/callback/:provider
```

---

### 2. Match Service (Port 3002)
**Responsibility:** Skill matching & recommendations

**Key Features:**
- Skill embedding via OpenAI API
- Cosine similarity scoring
- Collaborative filtering
- Real-time match caching

**Algorithm:**
1. Convert skill name → 1536-dim embedding (OpenAI)
2. Store in vector DB (pgvector or Pinecone)
3. For each user pair, calculate cosine similarity
4. Rank matches by score + common skills + recency
5. Cache top 100 matches per user (Redis)

**Database:** PostgreSQL + pgvector extension
- Skill embeddings
- Match history
- Skill-to-user mappings

**Key Routes:**
```
GET    /matches
GET    /matches/:userId
GET    /matches/:userId/score
POST   /matches/:userId/accept
POST   /matches/:userId/reject
POST   /skills/embed (admin)
```

---

### 3. Session Service (Port 3003)
**Responsibility:** Session booking, calendar, WebRTC signaling

**Key Features:**
- Session booking with time slots
- Calendar availability
- WebRTC offer/answer/ICE relay
- Chat & session notes
- Real-time event emission (Socket.IO)

**Database:** PostgreSQL + MongoDB
- Sessions (SQL)
- Session notes (MongoDB, free-form JSON)
- Real-time chat (Redis Pub/Sub)

**WebRTC Signaling:**
```json
// Client A → Server
{
  "type": "offer",
  "sdp": "...",
  "sessionId": "session-789"
}

// Server → Client B
// Client B → Server (answer)
// Server → Client A (answer)
// ICE candidates exchanged
```

**Key Routes:**
```
POST   /sessions/book
GET    /sessions
GET    /sessions/:id
POST   /sessions/:id/start
POST   /sessions/:id/end
WS     /sessions/:id/chat
WS     /sessions/:id/webrtc
```

---

### 4. Token Service (Port 3004)
**Responsibility:** Token economy, wallet, transactions

**Key Features:**
- Atomic token transfers (prevents double-spend)
- Stripe payment processing
- Transaction ledger
- Token earning rules
- Purchase history

**Database:** PostgreSQL (ACID required)
- Wallets (user_id, balance)
- Transactions (ledger)
- Stripe events (webhook log)

**Token Rules:**
- **Earn:** 5 tokens per 1-hour session (teaching)
- **Spend:** 1-5 tokens per session (learning) — based on teacher rating
- **Purchase:** 10/25/50 token packages via Stripe

**Key Routes:**
```
GET    /wallet
GET    /wallet/transactions
POST   /wallet/topup
POST   /wallet/topup/webhook (Stripe)
POST   /transactions/transfer (internal)
```

---

### 5. AI Service (Port 3005)
**Responsibility:** AI-powered roadmap generation & sentiment analysis

**Key Features:**
- Claude API for roadmap generation
- Personalized learning paths
- Session review sentiment
- Recommendation summaries

**LLM Calls:**
```javascript
// Roadmap generation
const prompt = `
Create a learning roadmap for ${skill} starting from ${level}.
Include 5 milestones, estimated timeline, and resources.
Format as JSON.
`

const response = await anthropic.messages.create({
  model: "claude-sonnet",
  max_tokens: 1000,
  messages: [{ role: "user", content: prompt }],
})
```

**Database:** PostgreSQL + caching (Redis)
- Generated roadmaps (cached 7 days)
- Sentiment scores on reviews

**Key Routes:**
```
GET    /roadmaps/:skillId
GET    /roadmaps/:skillId/milestone/:mId/complete
POST   /review/sentiment
```

---

## Data Flow & Consistency

### Account Creation
```
1. User registers (User Service)
   ↓
2. Create user record (PostgreSQL)
   ↓
3. Emit USER_REGISTERED event (Redis Pub/Sub)
   ↓
4. AI Service subscribes → Create welcome roadmap
5. Match Service subscribes → Calculate initial embeddings
6. Welcome email sent
```

### Session Booking
```
1. Frontend requests session booking (Session Service)
   ↓
2. Check availability (calendar)
   ↓
3. Deduct tokens (Token Service) — ATOMIC
   ↓
4. Create session record (PostgreSQL)
   ↓
5. Emit SESSION_BOOKED event
   ↓
6. Notify both users (WebSocket)
```

---

## Database Schema Overview

### PostgreSQL (Main)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR,
  name VARCHAR,
  university VARCHAR,
  bio TEXT,
  avatar_url VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Skills (with pgvector)
CREATE TABLE skills (
  id UUID PRIMARY KEY,
  name VARCHAR UNIQUE,
  category VARCHAR,
  embedding vector(1536),
  created_at TIMESTAMP
);

-- User Skills
CREATE TABLE user_skills (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  skill_id UUID REFERENCES skills(id),
  proficiency_level VARCHAR,
  is_teaching BOOLEAN
);

-- Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  teacher_id UUID REFERENCES users(id),
  learner_id UUID REFERENCES users(id),
  skill_id UUID REFERENCES skills(id),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  status VARCHAR,
  tokens_cost INTEGER,
  rating INTEGER,
  review TEXT,
  created_at TIMESTAMP
);

-- Wallet
CREATE TABLE wallets (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES users(id),
  balance INTEGER DEFAULT 0,
  updated_at TIMESTAMP
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR,
  amount INTEGER,
  description VARCHAR,
  session_id UUID REFERENCES sessions(id),
  stripe_event_id VARCHAR,
  created_at TIMESTAMP
);
```

### MongoDB (Sessions Data)

```javascript
// sessions_notes collection
{
  _id: ObjectId(),
  session_id: "uuid",
  user_id: "uuid",
  content: "Discussed React hooks...",
  created_at: ISODate(),
  updated_at: ISODate()
}

// session_messages collection
{
  _id: ObjectId(),
  session_id: "uuid",
  sender_id: "uuid",
  message: "Great explanation!",
  created_at: ISODate()
}
```

### Redis (Caching & Pub/Sub)

```
Keys:
  user:{id}:matches → top 100 matches (expires 1h)
  user:{id}:wallet → balance (expires 5m)
  user:{id}:sessions:upcoming → scheduled sessions
  skill:embeddings:{skillName} → cached embedding

Pub/Sub Channels:
  events:user:registered
  events:session:booked
  events:tokens:transferred
  notifications:user:{id}
```

---

## API Gateway Pattern

The gateway sits at Port 8080 and:

1. **Routes requests** to appropriate services
2. **Authenticates** via JWT middleware
3. **Rate limits** per user (100 req/min)
4. **Logs requests** for debugging
5. **Aggregates errors** with consistent format

### Gateway Middleware Stack

```javascript
// Order matters!
app.use(helmet())                  // Security headers
app.use(cors())                    // CORS
app.use(morgan())                  // Request logging
app.use(express.json())            // Parse JSON
app.use(rateLimit)                 // Rate limiting
app.use(authMiddleware)            // JWT verify
app.use(proxy({ pathRewrite }))    // Service proxy
```

---

## Real-time Communication (Socket.IO)

WebSocket namespace hierarchy:

```
/
  ├── /sessions/{sessionId}
  │   ├── :join
  │   ├── :leave
  │   ├── :message
  │   ├── :chat
  │   └── :webrtc
  │
  ├── /matches
  │   ├── :notify
  │   └── :update
  │
  ├── /notifications
  │   └── :alert
  │
  └── /online
      ├── :presence
      └── :typing
```

---

## Error Handling & Logging

### Structured Logging

```javascript
logger.info('user-service', 'User created', {
  userId: 'user-123',
  email: 'john@example.com',
  method: 'POST /auth/register',
  duration: '45ms'
})
```

### Error Responses

```json
{
  "error": "Insufficient tokens",
  "code": "INSUFFICIENT_BALANCE",
  "status": 400,
  "requestId": "req-12345"
}
```

---

## Deployment Architecture

### Local (Docker Compose)

```
docker-compose up -d
```

All services in containers, PostgreSQL/MongoDB/Redis locally.

### Production

```
┌─────────────────┐
│   Vercel CDN    │ ← Next.js (web)
└────────┬────────┘
         │
    ┌────▼─────────┐
    │  API Gateway │ (Railway/Render)
    └────┬─────────┘
         │
    ┌────┴──────────────────┬──────────┬───────────┬────────────┐
    │                       │          │           │            │
┌───▼────┐          ┌──────▼──┐ ┌────▼──┐  ┌─────▼──┐  ┌─────▼──┐
│ User   │          │  Match  │ │Session│  │ Token  │  │   AI   │
│Service │          │ Service │ │Service│  │Service │  │Service │
└────────┘          └─────────┘ └───────┘  └────────┘  └────────┘
         │
    ┌────┴──────────────────┬──────────┬───────────┐
    │                       │          │           │
┌───▼────────────┐ ┌────────▼──┐ ┌────▼──┐  ┌─────▼─┐
│    Supabase    │ │   Atlas   │ │Upstash│  │  AWS  │
│  PostgreSQL    │ │ MongoDB   │ │ Redis │  │  S3   │
└────────────────┘ └───────────┘ └───────┘  └───────┘
```

---

## Performance Optimization

### Frontend
- Code splitting (Next.js App Router)
- Image optimization (next/image)
- Font loading strategies
- CSS-in-JS (Tailwind)

### Backend
- Database connection pooling (PgBouncer)
- Caching strategy (Redis, 1h–7d TTL)
- Rate limiting per endpoint
- Async task processing (future: Bull queue)

### Infrastructure
- CDN for static assets (Vercel, CloudFlare)
- Gzip compression
- HTTP/2
- HTTPS everywhere

---

## Security Measures

✅ **Authentication**
- JWT tokens (HS256)
- Refresh token rotation
- OAuth2 (stateless)

✅ **Authorization**
- Role-based access (user, teacher, admin)
- Resource-level checks (user owns session)

✅ **Data Protection**
- Bcryptjs password hashing
- SQL injection prevention (parameterized queries)
- CORS whitelist

✅ **Compliance**
- GDPR data deletion
- PII encryption at rest (future)
- Audit logging (future)

---

For implementation guides, see:
- [User Service Docs](./docs/user-service.md)
- [Match Service Docs](./docs/match-service.md)
- [Session Service Docs](./docs/session-service.md)
