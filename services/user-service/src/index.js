/**
 * User Service Main Entry Point
 * Handles user authentication, profiles, and OAuth
 */

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const { logger } = require('@shared/utils')

const app = express()
const PORT = process.env.USER_SERVICE_PORT || 3001

// Middleware
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'user-service' })
})

// Routes (to be implemented)
app.post('/auth/register', (req, res) => {
  res.status(501).json({ message: 'Not implemented' })
})

app.post('/auth/login', (req, res) => {
  res.status(501).json({ message: 'Not implemented' })
})

app.get('/profile', (req, res) => {
  res.status(501).json({ message: 'Not implemented' })
})

// Error handling
app.use((err, req, res, next) => {
  logger.error('user-service', 'Unhandled error', { error: err.message })
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  })
})

// Start server
app.listen(PORT, () => {
  logger.info('user-service', `Server running on port ${PORT}`)
})

module.exports = app
