const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_min_32_chars'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

/**
 * Sign a JWT token
 */
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'HS256',
  })
}

/**
 * Verify a JWT token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] })
  } catch (error) {
    throw new Error(`Invalid token: ${error.message}`)
  }
}

/**
 * Decode token without verification (for debugging)
 */
function decodeToken(token) {
  return jwt.decode(token)
}

module.exports = {
  signToken,
  verifyToken,
  decodeToken,
}
