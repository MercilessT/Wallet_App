import { errorHandler } from '../../middlewares/errorHandler.js'


describe('errorHandler middleware', () => {
  it('should return the correct response with default message and status 500', () => {
    const mockRequest = {}
    const mockResponse = {
      status: jest.fn(() => mockResponse),
      json: jest.fn(),
    }
    const mockNext = jest.fn()

    errorHandler({}, mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      status: 500,
      message: 'Something went wrong...',
    })
  })

  it('should return the correct response with provided status and message', () => {
    const mockRequest = {}
    const mockResponse = {
      status: jest.fn(() => mockResponse),
      json: jest.fn(),
    }
    const mockNext = jest.fn()

    const err = {
      status: 404,
      message: 'Not Found',
    }

    errorHandler(err, mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(404)
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      status: 404,
      message: 'Not Found',
    })
  })
})