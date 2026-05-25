const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const landController = require('../controllers/land.controller');
const { validateRequest, schemas } = require('../middleware/validation');
const multer = require('multer');

const router = express.Router();

// Configure multer
const upload = multer({ dest: 'uploads/lands/' });

// Public routes
router.get('/', landController.getAllLands);
router.get('/search', landController.searchLands);
router.get('/featured', landController.getFeaturedLands);
router.get('/:id', landController.getLandDetail);
router.get('/:id/similar', landController.getSimilarLands);

// Protected routes
router.post('/', 
  authMiddleware, 
  upload.array('images', 10), 
  validateRequest(schemas.createLand), 
  landController.createLand
);

router.put('/:id', 
  authMiddleware, 
  upload.array('images', 10), 
  landController.updateLand
);

router.delete('/:id', authMiddleware, landController.deleteLand);
router.post('/:id/images', authMiddleware, upload.array('images', 5), landController.addImages);
router.delete('/:id/images/:imageId', authMiddleware, landController.deleteImage);
router.post('/:id/documents', authMiddleware, upload.array('documents', 5), landController.addDocuments);
router.delete('/:id/documents/:docId', authMiddleware, landController.deleteDocument);

module.exports = router;
