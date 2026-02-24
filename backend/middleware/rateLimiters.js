const rateLimit = require('express-rate-limit');

const parseLimit = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildLimiter = ({ windowMs, max, message, code }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      const resetTime = req.rateLimit?.resetTime;
      const retryAfter = resetTime
        ? Math.max(0, Math.ceil((resetTime - new Date()) / 1000))
        : Math.ceil(options.windowMs / 1000);
      res.set('Retry-After', retryAfter);
      return res.status(options.statusCode || 429).json({
        code: code || 'RATE_LIMITED',
        message: message || 'Muitas requisicoes. Tente novamente mais tarde.',
        retry_after: retryAfter,
      });
    },
  });

const loginLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: parseLimit(process.env.LOGIN_RATE_LIMIT_MAX, 20),
  message: 'Muitas tentativas de login. Tente novamente mais tarde.',
  code: 'LOGIN_RATE_LIMIT',
});

const otpLimiter = buildLimiter({
  windowMs: 10 * 60 * 1000,
  max: parseLimit(process.env.OTP_RATE_LIMIT_MAX, 5),
  message: 'Muitas solicitacoes de OTP. Tente novamente mais tarde.',
  code: 'OTP_RATE_LIMIT',
});

module.exports = { loginLimiter, otpLimiter };
