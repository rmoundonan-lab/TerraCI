const { User, Land, Review } = require('../models');

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['passwordHash'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, bio } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;
    if (req.file) user.avatarUrl = `/uploads/avatars/${req.file.filename}`;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Get user profile by ID
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['passwordHash', 'email'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile'
    });
  }
};

// Get user lands
const getUserLands = async (req, res) => {
  try {
    const lands = await Land.findAll({
      where: { userId: req.params.id },
      include: ['images']
    });

    res.json({
      success: true,
      data: lands
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user lands'
    });
  }
};

// Get user reviews
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { reviewedUserId: req.params.id },
      include: ['reviewer']
    });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { q, role } = req.query;
    const where = {};

    if (q) {
      where[sequelize.Op.or] = [
        { firstName: { [sequelize.Op.iLike]: `%${q}%` } },
        { lastName: { [sequelize.Op.iLike]: `%${q}%` } },
        { email: { [sequelize.Op.iLike]: `%${q}%` } }
      ];
    }

    if (role) where.role = role;

    const users = await User.findAll({
      where,
      attributes: { exclude: ['passwordHash', 'email'] },
      limit: 20
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search users'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUserProfile,
  getUserLands,
  getUserReviews,
  searchUsers
};
