module.exports = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Acesso negado - Admin apenas' });
  }
  next();
};
