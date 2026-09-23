const { getDBStatus } = require('../config/db');
const WorkerProfile = require('../models/WorkerProfile');
const User = require('../models/User');
const Category = require('../models/Category');
const { mockStore } = require('../config/seed');

// @desc    Get all workers with search and filtering
// @route   GET /api/workers
exports.getWorkers = async (req, res) => {
  try {
    const { category, skill, location, minRating, maxPrice, availability, verified } = req.query;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const query = {};

      if (category && category !== 'All') {
        query.skills = { $in: [new RegExp(category, 'i')] };
      }
      if (skill) {
        query.skills = { $in: [new RegExp(skill, 'i')] };
      }
      if (location) {
        query.location = { $regex: location, $options: 'i' };
      }
      if (minRating) {
        query.rating = { $gte: Number(minRating) };
      }
      if (maxPrice) {
        query.price = { $lte: Number(maxPrice) };
      }
      if (availability) {
        query.availability = availability;
      }
      if (verified === 'true') {
        query.isVerified = true;
      }

      const profiles = await WorkerProfile.find(query).populate('userId', 'name email phone profileImage location isBlocked');
      const activeWorkers = profiles.filter((p) => p.userId && !p.userId.isBlocked);

      return res.json({
        success: true,
        count: activeWorkers.length,
        workers: activeWorkers,
      });
    } else {
      // In-memory filter
      let results = mockStore.workerProfiles.map((wp) => {
        const user = mockStore.users.find((u) => u._id.toString() === wp.userId.toString());
        return {
          ...wp,
          userId: user || { name: 'Unknown Worker', email: '', phone: '', isBlocked: false },
        };
      }).filter((w) => w.userId && !w.userId.isBlocked);

      if (category && category !== 'All') {
        results = results.filter((w) => w.skills.some((s) => s.toLowerCase().includes(category.toLowerCase())));
      }
      if (skill) {
        results = results.filter((w) => w.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase())));
      }
      if (location) {
        results = results.filter((w) => w.location.toLowerCase().includes(location.toLowerCase()));
      }
      if (minRating) {
        results = results.filter((w) => w.rating >= Number(minRating));
      }
      if (maxPrice) {
        results = results.filter((w) => w.price <= Number(maxPrice));
      }
      if (availability) {
        results = results.filter((w) => w.availability === availability);
      }
      if (verified === 'true') {
        results = results.filter((w) => w.isVerified);
      }

      return res.json({
        success: true,
        count: results.length,
        workers: results,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single worker by ID (userId or profileId)
// @route   GET /api/workers/:id
exports.getWorkerById = async (req, res) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      let profile = await WorkerProfile.findById(id).populate('userId', 'name email phone profileImage location');
      if (!profile) {
        profile = await WorkerProfile.findOne({ userId: id }).populate('userId', 'name email phone profileImage location');
      }

      if (!profile) {
        return res.status(404).json({ success: false, message: 'Worker profile not found' });
      }

      return res.json({ success: true, worker: profile });
    } else {
      let profile = mockStore.workerProfiles.find((wp) => wp._id === id || wp.userId === id);
      if (!profile) {
        return res.status(404).json({ success: false, message: 'Worker profile not found' });
      }

      const user = mockStore.users.find((u) => u._id === profile.userId);
      const fullProfile = {
        ...profile,
        userId: user || { name: 'Worker', email: '', phone: '', profileImage: profile.profileImage },
      };

      return res.json({ success: true, worker: fullProfile });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get service categories
// @route   GET /api/workers/categories/all
exports.getCategories = async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      const categories = await Category.find({ isActive: true });
      if (categories.length > 0) return res.json({ success: true, categories });
    }
    return res.json({ success: true, categories: mockStore.categories.filter((c) => c.isActive) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
