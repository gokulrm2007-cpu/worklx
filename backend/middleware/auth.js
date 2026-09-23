const jwt = require('jsonwebtoken');
const { getDBStatus } = require('../config/db');
const User = require('../models/User');
const { mockStore } = require('../config/seed');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route (Missing token)',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'worklx_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret);

    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User no longer exists' });
      }
      if (user.isBlocked) {
        return res.status(403).json({ success: false, message: 'Your account has been blocked by administrator' });
      }
      req.user = user;
    } else {
      const user = mockStore.users.find((u) => u._id.toString() === decoded.id.toString());
      if (!user) {
        return res.status(401).json({ success: false, message: 'User no longer exists' });
      }
      if (user.isBlocked) {
        return res.status(403).json({ success: false, message: 'Your account has been blocked by administrator' });
      }
      const { password, ...userWithoutPass } = user;
      req.user = userWithoutPass;
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user?.role || 'Guest'}) is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
