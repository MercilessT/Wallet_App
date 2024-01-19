import jwt from 'jsonwebtoken'
import { createError } from '../error.js'

/**
 * Middleware to verify the authenticity of an access token stored in a cookie.
 */
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token

  if (!token) {
    return next(createError(401, 'You are not authenticated!'))
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      return next(createError(403, 'Token is not valid!'))
    }
    req.user = user
    next()
  })
}

