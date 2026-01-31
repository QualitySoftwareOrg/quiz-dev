const rateLimit = require('express-rate-limit');

const parseLimit = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message,
  });

const loginLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: parseLimit(process.env.LOGIN_RATE_LIMIT_MAX, 20),
  message: { message: 'Muitas tentativas de login. Tente novamente mais tarde.' },
});

const otpLimiter = buildLimiter({
  windowMs: 10 * 60 * 1000,
  max: parseLimit(process.env.OTP_RATE_LIMIT_MAX, 5),
  message: { message: 'Muitas solicitacoes de OTP. Tente novamente mais tarde.' },
});

module.exports = { loginLimiter, otpLimiter };
