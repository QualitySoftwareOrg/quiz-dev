const isAdmin = (user) => user && user.role === 'admin';

const requireAdmin = (req, res, next) => {
  if (isAdmin(req.user)) {
    return next();
  }
  return res.status(403).json({ code: 'FORBIDDEN', message: 'Acesso negado' });
};

const requireSelfOrAdmin = (req, res, next) => {
  const { id } = req.params;
  if (isAdmin(req.user) || String(req.user?.id) === String(id)) {
    return next();
  }
  return res.status(403).json({ code: 'FORBIDDEN', message: 'Acesso negado' });
};

module.exports = { requireAdmin, requireSelfOrAdmin };
