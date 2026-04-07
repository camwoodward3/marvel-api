function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized. Please log in.'});
}

function ensureGuest(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return next();
  } 
  return res.status(400).json({ message: 'Already logged in' });
}

module.exports = {
  ensureAuth,
  ensureGuest
};