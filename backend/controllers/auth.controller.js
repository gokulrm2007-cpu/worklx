const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDBStatus } = require('../config/db');
const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const { mockStore } = require('../config/seed');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'worklx_super_secret_jwt_key_2026';
  return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

// @desc    Register new user (SEEKER or WORKER)
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role, skill, price, location } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const assignedRole = role === 'WORKER' ? 'WORKER' : 'SEEKER';
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
        role: assignedRole,
        location: location || 'Salem, Tamil Nadu',
      });

      if (assignedRole === 'WORKER') {
        await WorkerProfile.create({
          userId: user._id,
          skills: [skill || 'Electrician'],
          price: Number(price) || 500,
          location: location || 'Salem, Tamil Nadu',
          description: `Skilled ${skill || 'service'} provider on WORKLX marketplace.`,
        });
      }

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          location: user.location,
          profileImage: user.profileImage,
        },
      });
    } else {
      // In-Memory Fallback
      const userExists = mockStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const hashedPassword = bcrypt.hashSync(password, 8);
      const newUserId = `user_${Date.now()}`;

      const newUser = {
        _id: newUserId,
        name,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
        role: assignedRole,
        profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        location: location || 'Salem, Tamil Nadu',
        isBlocked: false,
        createdAt: new Date(),
      };

      mockStore.users.push(newUser);

      if (assignedRole === 'WORKER') {
        mockStore.workerProfiles.push({
          _id: `wp_${Date.now()}`,
          userId: newUserId,
          skills: [skill || 'Electrician'],
          experience: 3,
          description: `Skilled ${skill || 'service'} provider on WORKLX.`,
          price: Number(price) || 500,
          location: location || 'Salem, Tamil Nadu',
          coordinates: { lat: 11.6643, lng: 78.1460 },
          availability: 'AVAILABLE',
          profileImage: newUser.profileImage,
          previousWorkImages: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'],
          isVerified: true,
          rating: 4.8,
          reviewCount: 1,
        });
      }

      const token = generateToken(newUserId);
      const { password: _, ...userSafe } = newUser;

      return res.status(201).json({
        success: true,
        token,
        user: userSafe,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      if (user.isBlocked) {
        return res.status(403).json({ success: false, message: 'Account is blocked. Contact administrator.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = generateToken(user._id);

      return res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          location: user.location,
          profileImage: user.profileImage,
        },
      });
    } else {
      // In-Memory Fallback
      const user = mockStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      if (user.isBlocked) {
        return res.status(403).json({ success: false, message: 'Account is blocked. Contact administrator.' });
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = generateToken(user._id);
      const { password: _, ...userSafe } = user;

      return res.json({
        success: true,
        token,
        user: userSafe,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    let workerProfile = null;

    if (req.user.role === 'WORKER') {
      if (dbStatus.connected) {
        workerProfile = await WorkerProfile.findOne({ userId: req.user._id });
      } else {
        workerProfile = mockStore.workerProfiles.find((wp) => wp.userId.toString() === req.user._id.toString());
      }
    }

    res.json({
      success: true,
      user: req.user,
      workerProfile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password (Generate Reset Token / Link)
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your registered email' });
    }

    res.json({
      success: true,
      message: `Password reset instructions sent to ${email}. For demonstration, you may reset password with the token "demo-reset-token-2026"`,
      demoResetToken: 'demo-reset-token-2026',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email and new password' });
    }

    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
    } else {
      const user = mockStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      user.password = bcrypt.hashSync(newPassword, 8);
    }

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Profile Settings
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, location, profileImage, skills, price, experience, description, availability } = req.body;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const user = await User.findById(req.user._id);
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (location) user.location = location;
      if (profileImage) user.profileImage = profileImage;
      await user.save();

      if (user.role === 'WORKER') {
        let wp = await WorkerProfile.findOne({ userId: user._id });
        if (!wp) wp = new WorkerProfile({ userId: user._id });
        if (skills) wp.skills = Array.isArray(skills) ? skills : [skills];
        if (price) wp.price = Number(price);
        if (experience) wp.experience = Number(experience);
        if (description) wp.description = description;
        if (availability) wp.availability = availability;
        if (profileImage) wp.profileImage = profileImage;
        if (location) wp.location = location;
        await wp.save();
      }

      return res.json({ success: true, message: 'Profile updated successfully', user });
    } else {
      const user = mockStore.users.find((u) => u._id.toString() === req.user._id.toString());
      if (user) {
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (location) user.location = location;
        if (profileImage) user.profileImage = profileImage;
      }

      if (user && user.role === 'WORKER') {
        let wp = mockStore.workerProfiles.find((w) => w.userId.toString() === user._id.toString());
        if (wp) {
          if (skills) wp.skills = Array.isArray(skills) ? skills : [skills];
          if (price) wp.price = Number(price);
          if (experience) wp.experience = Number(experience);
          if (description) wp.description = description;
          if (availability) wp.availability = availability;
          if (profileImage) wp.profileImage = profileImage;
          if (location) wp.location = location;
        }
      }

      return res.json({ success: true, message: 'Profile updated successfully', user });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
