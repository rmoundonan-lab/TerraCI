const { User, Land, Report, Offer, Sequelize } = require('../models');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (role) where.role = role;
    if (search) {
      where[Sequelize.Op.or] = [
        { email: { [Sequelize.Op.iLike]: `%${search}%` } },
        { firstName: { [Sequelize.Op.iLike]: `%${search}%` } },
        { lastName: { [Sequelize.Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['passwordHash'] },
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: count, pages: Math.ceil(count / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

// Get user detail
const getUserDetail = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['passwordHash'] },
      include: ['lands', 'purchaseOffers', 'receivedReviews']
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await user.update({ role });
    res.json({ success: true, message: 'User role updated', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user role' });
  }
};

// Update user status
const updateUserStatus = async (req, res) => {
  try {
    const { isActive, isVerified } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (isActive !== undefined) user.isActive = isActive;
    if (isVerified !== undefined) user.isVerified = isVerified;
    await user.save();

    res.json({ success: true, message: 'User status updated', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user status' });
  }
};

// Get all lands (admin)
const getAllLands = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, verified } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (verified) where.verified = verified;

    const { count, rows } = await Land.findAndCountAll({
      where,
      include: ['seller', 'images'],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: count }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch lands' });
  }
};

// Verify land
const verifyLand = async (req, res) => {
  try {
    const { verified } = req.body;
    const land = await Land.findByPk(req.params.id);

    if (!land) return res.status(404).json({ success: false, message: 'Land not found' });

    await land.update({ verified });
    res.json({ success: true, message: 'Land verification status updated', data: land });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to verify land' });
  }
};

// Delete land (admin)
const deleteLand = async (req, res) => {
  try {
    const land = await Land.findByPk(req.params.id);
    if (!land) return res.status(404).json({ success: false, message: 'Land not found' });

    await land.destroy();
    res.json({ success: true, message: 'Land deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete land' });
  }
};

// Toggle featured
const toggleFeatured = async (req, res) => {
  try {
    const { isFeatured, featuredUntil } = req.body;
    const land = await Land.findByPk(req.params.id);

    if (!land) return res.status(404).json({ success: false, message: 'Land not found' });

    await land.update({ isFeatured, featuredUntil });
    res.json({ success: true, message: 'Featured status updated', data: land });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle featured' });
  }
};

// Get reports
const getReports = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;

    const { count, rows } = await Report.findAndCountAll({
      where,
      include: ['reporter', 'reportedUser', 'reportedLand'],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: count }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reports' });
  }
};

// Resolve report
const resolveReport = async (req, res) => {
  try {
    const { status, adminNotes, action } = req.body;
    const report = await Report.findByPk(req.params.id);

    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    await report.update({ status, adminNotes, resolvedAt: new Date() });

    // Execute action if needed (ban user, delete land, etc)
    if (action === 'ban_user' && report.reportedUserId) {
      await User.update({ isActive: false }, { where: { id: report.reportedUserId } });
    }
    if (action === 'delete_land' && report.reportedLandId) {
      await Land.destroy({ where: { id: report.reportedLandId } });
    }

    res.json({ success: true, message: 'Report resolved', data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to resolve report' });
  }
};

// Get statistics
const getStatistics = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalLands = await Land.count();
    const totalOffers = await Offer.count();
    const activeLands = await Land.count({ where: { status: 'available' } });
    const verifiedLands = await Land.count({ where: { verified: 'verified' } });
    const totalReports = await Report.count();
    const pendingReports = await Report.count({ where: { status: 'pending' } });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalLands,
        totalOffers,
        activeLands,
        verifiedLands,
        totalReports,
        pendingReports
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
};

// Get users stats
const getUsersStats = async (req, res) => {
  try {
    const buyers = await User.count({ where: { role: 'buyer' } });
    const sellers = await User.count({ where: { role: 'seller' } });
    const admins = await User.count({ where: { role: 'admin' } });
    const verifiedUsers = await User.count({ where: { isVerified: true } });
    const activeUsers = await User.count({ where: { isActive: true } });

    res.json({
      success: true,
      data: { buyers, sellers, admins, verifiedUsers, activeUsers }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user stats' });
  }
};

// Get lands stats
const getLandsStats = async (req, res) => {
  try {
    const residential = await Land.count({ where: { type: 'residential' } });
    const commercial = await Land.count({ where: { type: 'commercial' } });
    const agricultural = await Land.count({ where: { type: 'agricultural' } });
    const mixed = await Land.count({ where: { type: 'mixed' } });

    res.json({
      success: true,
      data: { residential, commercial, agricultural, mixed }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch land stats' });
  }
};

// Get revenue stats
const getRevenueStats = async (req, res) => {
  try {
    const acceptedOffers = await Offer.findAll({
      where: { status: 'accepted' },
      attributes: ['offeredPrice']
    });

    const totalRevenue = acceptedOffers.reduce((sum, offer) => sum + parseFloat(offer.offeredPrice), 0);
    const averagePrice = acceptedOffers.length > 0 ? (totalRevenue / acceptedOffers.length).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        totalRevenue: totalRevenue.toFixed(2),
        averagePrice,
        totalAcceptedOffers: acceptedOffers.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch revenue stats' });
  }
};

module.exports = {
  getAllUsers,
  getUserDetail,
  updateUserRole,
  updateUserStatus,
  getAllLands,
  verifyLand,
  deleteLand,
  toggleFeatured,
  getReports,
  resolveReport,
  getStatistics,
  getUsersStats,
  getLandsStats,
  getRevenueStats
};
