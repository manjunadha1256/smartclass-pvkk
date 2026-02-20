function roleMiddleware(requiredRole) {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Access Denied ❌" });
    }
    next();
  };
}

module.exports = roleMiddleware;