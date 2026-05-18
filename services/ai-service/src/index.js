/**
 * AI Service — Roadmap generation and sentiment analysis
 */

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const { logger } = require('@shared/utils')

const app = express()
const PORT = process.env.AI_SERVICE_PORT || 3005

app.use(cors())
app.use(morgan('combined'))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ai-service' })
})

app.get('/roadmaps/:skillId', (req, res) => {
  res.status(501).json({ message: 'Not implemented' })
})

app.listen(PORT, () => {
  logger.info('ai-service', `Server running on port ${PORT}`)
})

module.exports = app
