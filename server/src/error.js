/**
 * Creates an error object with the specified status code and message.
 */
export const createError = (status, message) => {
  const err = new Error()
  err.status = status
  err.message = message
  return err
}
