/**
 * Simple logger utility for consistent logging across services
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
}

const LEVEL = LOG_LEVELS[process.env.LOG_LEVEL || 'INFO']

function log(level, service, message, data = {}) {
  if (LOG_LEVELS[level] < LEVEL) return

  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    level,
    service,
    message,
    ...data,
  }

  const output = JSON.stringify(logEntry)

  if (level === 'ERROR') {
    console.error(output)
  } else if (level === 'WARN') {
    console.warn(output)
  } else {
    console.log(output)
  }
}

module.exports = {
  debug: (service, message, data) => log('DEBUG', service, message, data),
  info: (service, message, data) => log('INFO', service, message, data),
  warn: (service, message, data) => log('WARN', service, message, data),
  error: (service, message, data) => log('ERROR', service, message, data),
}
