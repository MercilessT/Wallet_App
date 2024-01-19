import { verifyToken } from '../../middlewares/verifyToken.js'
import { createError } from '../../error.js'


describe('verifyToken middleware', () => {
  it('verifyToken_not_authorized', async () => {
    const req = {
      cookies: {},
    }

    const res = {}
    const next = jest.fn()

    verifyToken(req, res, next)

    expect(next).toHaveBeenCalledWith(createError(401, 'You are not authenticated!'))
  })

  it('verifyToken_invalid_token', async () => {
    const invalidToken = 'invalid_token'
    const req = {
      cookies: {
        access_token: invalidToken,
      },
    }

    const res = {}
    const next = jest.fn()

    verifyToken(req, res, next)

    expect(next).toHaveBeenCalledWith(createError(403, 'Token is not valid!'))
  })
})
