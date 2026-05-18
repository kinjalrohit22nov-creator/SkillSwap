/**
 * Match Service — Skill matching and recommendation algorithm
 */

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const { logger } = require('@shared/utils')

const app = express()
const PORT = process.env.MATCH_SERVICE_PORT || 3002

app.use(cors())
app.use(morgan('combined'))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'match-service' })
})

app.get('/matches', (req, res) => {
  res.status(501).json({ message: 'Not implemented' })
})

app.listen(PORT, () => {
  logger.info('match-service', `Server running on port ${PORT}`)
})

module.exports = app
