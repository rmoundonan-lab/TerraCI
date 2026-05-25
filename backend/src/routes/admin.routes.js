const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

// Admin only routes
router.use(authMiddleware, roleMiddleware('admin'));

// Users management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserDetail);
router.put('/users/:id/role', adminController.updateUserRole);
router.put('/users/:id/status', adminController.updateUserStatus);

// Lands management
router.get('/lands', adminController.getAllLands);
router.put('/lands/:id/verify', adminController.verifyLand);
router.delete('/lands/:id', adminController.deleteLand);
router.put('/lands/:id/featured', adminController.toggleFeatured);

// Reports
router.get('/reports', adminController.getReports);
router.put('/reports/:id', adminController.resolveReport);

// Statistics
router.get('/stats', adminController.getStatistics);
router.get('/stats/users', adminController.getUsersStats);
router.get('/stats/lands', adminController.getLandsStats);
router.get('/stats/revenue', adminController.getRevenueStats);

module.exports = router;
