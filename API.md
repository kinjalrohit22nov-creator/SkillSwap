# API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123",
  "university": "MIT"
}

Response (201):
{
  "id": "user-123",
  "email": "john@example.com",
  "name": "John Doe",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure123"
}

Response (200):
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 604800
}
```

### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response (200):
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

---

## Match Endpoints

### Get Matches
```http
GET /api/matches?limit=10&offset=0
Authorization: Bearer <token>

Response (200):
{
  "matches": [
    {
      "matchedUserId": "user-456",
      "matchScore": 0.87,
      "teachingSkills": ["React", "Node.js"],
      "learningSkills": ["Python", "ML"],
      "commonSkills": ["JavaScript"]
    }
  ],
  "total": 42,
  "limit": 10
}
```

### Accept Match
```http
POST /api/matches/user-456/accept
Authorization: Bearer <token>

Response (200):
{
  "status": "accepted"
}
```

---

## Session Endpoints

### Book Session
```http
POST /api/sessions/book
Authorization: Bearer <token>
Content-Type: application/json

{
  "matchedUserId": "user-456",
  "skillId": "skill-react",
  "duration": 60,
  "preferredTime": "2024-01-15T14:00:00Z"
}

Response (201):
{
  "id": "session-789",
  "status": "scheduled",
  "tokensCost": 5,
  "startTime": "2024-01-15T14:00:00Z"
}
```

### Get Sessions
```http
GET /api/sessions?status=scheduled
Authorization: Bearer <token>

Response (200):
{
  "sessions": [
    {
      "id": "session-789",
      "teacherId": "user-123",
      "learnerId": "user-456",
      "skill": "React",
      "startTime": "2024-01-15T14:00:00Z",
      "duration": 60,
      "status": "scheduled"
    }
  ]
}
```

---

## Wallet Endpoints

### Get Balance
```http
GET /api/wallet
Authorization: Bearer <token>

Response (200):
{
  "balance": 48,
  "currency": "tokens",
  "updatedAt": "2024-01-10T12:00:00Z"
}
```

### Get Transactions
```http
GET /api/wallet/transactions?limit=20
Authorization: Bearer <token>

Response (200):
{
  "transactions": [
    {
      "id": "tx-001",
      "type": "earned",
      "amount": 5,
      "description": "Session completed",
      "sessionId": "session-789",
      "createdAt": "2024-01-15T14:30:00Z"
    }
  ]
}
```

### Top Up Tokens
```http
POST /api/wallet/topup
Authorization: Bearer <token>
Content-Type: application/json

{
  "packageSize": 25,
  "paymentMethodId": "pm_xxxxx"
}

Response (201):
{
  "transactionId": "tx-stripe-001",
  "tokensAdded": 25,
  "newBalance": 73,
  "status": "completed"
}
```

---

## Error Responses

All errors return appropriate HTTP status codes with:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

**Common Status Codes:**
- `400` — Bad Request
- `401` — Unauthorized
- `403` — Forbidden
- `404` — Not Found
- `409` — Conflict
- `429` — Too Many Requests
- `500` — Internal Server Error

---

## Rate Limiting

- **Per user:** 100 requests per minute
- **Per IP:** 1000 requests per minute
- **Headers:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## WebSocket Events

Connect to `ws://localhost:8080` with auth token:

```javascript
const socket = io('http://localhost:8080', {
  auth: { token: 'eyJhbGc...' }
})

// Listen for match notifications
socket.on('match:found', (match) => {
  console.log('New match:', match)
})

// Listen for session events
socket.on('session:started', (session) => {
  console.log('Session started:', session)
})

// Send message in session
socket.emit('message:send', {
  sessionId: 'session-789',
  text: 'How can I help?'
})
```

---

For more details, see [README.md](../README.md).
