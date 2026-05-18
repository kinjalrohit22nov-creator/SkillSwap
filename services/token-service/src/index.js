/**
 * Token Service — Token economy and transactions
 */

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const { logger } = require('@shared/utils')

const app = express()
const PORT = process.env.TOKEN_SERVICE_PORT || 3004

app.use(cors())
app.use(morgan('combined'))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'token-service' })
})

app.get('/wallet', (req, res) => {
  res.status(501).json({ message: 'Not implemented' })
})

app.listen(PORT, () => {
  logger.info('token-service', `Server running on port ${PORT}`)
})

module.exports = app
