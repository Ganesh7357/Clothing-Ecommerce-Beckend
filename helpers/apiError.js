class ApiError extends Error {
  constructor(statusCode, message, source) {
    super()
    this.statusCode = statusCode
    this.message = message
    this.source = source
  }
}

class NotFoundError extends ApiError {
  constructor(message = 'Not Found', source) {
    super(404, message, source)
  }
}

class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden', source) {
    super(403, message, source)
  }
}

class InternalServerError extends ApiError {
  constructor(message = 'Internal Server Error', source) {
    super(500, message, source)
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized Request', source) {
    super(401, message, source)
  }
}

class BadRequestError extends ApiError {
  constructor(message = 'Bad Request', source) {
    super(400, message, source)
  }
}

module.exports = {
  ApiError,
  NotFoundError,
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
  BadRequestError,
}
