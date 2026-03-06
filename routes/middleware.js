function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  if (req.session.user.role !== "admin") {
    req.session.flash = "Access denied. Admin privileges required.";
    req.session.flashType = "error";
    return res.redirect("/home");
  }
  next();
}

module.exports = { requireLogin, requireAdmin };
