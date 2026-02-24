const sendError = (res, status, code, message, details) => {
  const payload = { code, message };
  if (details !== undefined) {
    payload.details = details;
  }
  return res.status(status).json(payload);
};

const createError = (status, code, message, details) => ({
  status,
  code,
  message,
  details,
});

const normalizeError = (error, fallback) => {
  const hasExplicit = !!(error && (error.code || error.status));
  const message = hasExplicit
    ? (error?.message || fallback.message)
    : fallback.message;
  return {
    status: error?.status || fallback.status,
    code: error?.code || fallback.code,
    message,
    details: error?.details,
  };
};

module.exports = { sendError, createError, normalizeError };
