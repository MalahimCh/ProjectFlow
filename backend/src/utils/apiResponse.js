// ─── Standard API Response Helpers ───────────────────────────────────────────
// Every response follows:  { success, message, data?, errors? }

export const sendSuccess = (res, statusCode = 200, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, statusCode = 500, message, errors = null) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};

// HTTP status shorthands
export const ok         = (res, message, data)    => sendSuccess(res, 200, message, data);
export const created    = (res, message, data)    => sendSuccess(res, 201, message, data);
export const badRequest = (res, message, errors)  => sendError(res, 400, message, errors);
export const unauthorized = (res, message = "Unauthorized") => sendError(res, 401, message);
export const forbidden  = (res, message = "Forbidden")      => sendError(res, 403, message);
export const notFound   = (res, message = "Not found")      => sendError(res, 404, message);
export const conflict   = (res, message)                    => sendError(res, 409, message);
export const serverError = (res, message = "Internal server error") => sendError(res, 500, message);