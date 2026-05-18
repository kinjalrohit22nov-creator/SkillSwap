/**
 * Session Service — Session booking and WebRTC coordination
 */

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const socketIo = require('socket.io')
require('dotenv').config()

const { logger } = require('@shared/utils')

const app = express()
const PORT = process.env.SESSION_SERVICE_PORT || 3003

app.use(cors())
app.use(morgan('combined'))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'session-service' })
})

app.post('/sessions/book', (req, res) => {
  res.status(501).json({ message: 'Not implemented' })
})

const server = app.listen(PORT, () => {
  logger.info('session-service', `Server running on port ${PORT}`)
})

module.exports = app
