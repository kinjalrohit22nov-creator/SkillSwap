/**
 * Gateway Main Entry Point
 * Central API proxy with auth and rate limiting
 */

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const httpProxy = require('http-proxy-middleware')
require('dotenv').config()

const { logger } = require('@shared/utils')

const app = express()
const PORT = process.env.GATEWAY_PORT || 8080

// Security & Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute per user
  message: { error: 'Too many requests', code: 'RATE_LIMITED' },
})

app.use(limiter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gateway' })
})

// Service proxies (to be configured)
app.use('/api/auth', (req, res) => {
  res.status(502).json({ error: 'Service unavailable' })
})

app.use('/api/matches', (req, res) => {
  res.status(502).json({ error: 'Service unavailable' })
})

app.use('/api/sessions', (req, res) => {
  res.status(502).json({ error: 'Service unavailable' })
})

app.use('/api/wallet', (req, res) => {
  res.status(502).json({ error: 'Service unavailable' })
})

app.use('/api/roadmaps', (req, res) => {
  res.status(502).json({ error: 'Service unavailable' })
})

// Swagger docs (placeholder)
app.get('/docs', (req, res) => {
  res.json({ message: 'Swagger UI will be available at /docs' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  })
})

// Error handling
app.use((err, req, res, next) => {
  logger.error('gateway', 'Unhandled error', { error: err.message })
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  })
})

// Start server
app.listen(PORT, () => {
  logger.info('gateway', `Gateway running on port ${PORT}`)
})

module.exports = app
