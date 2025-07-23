async function adminOnly(req, res, next) {
  try {
    // Pastikan req.user sudah diisi oleh authentication middleware
    if (!req.user || req.user.role !== 'admin') {
      throw { name: 'Forbidden', message: 'Only admin can access this resource' };
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = adminOnly;
