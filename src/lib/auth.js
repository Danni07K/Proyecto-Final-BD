import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secreto-ultra'

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    throw new Error('Token inválido')
  }
}
