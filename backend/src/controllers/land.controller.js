const { Land, LandImage, LandDocument, Favorite, User, Sequelize } = require('../models');
const fs = require('fs').promises;
const path = require('path');

// Get all lands with filters
const getAllLands = async (req, res) => {
  try {
    const { page = 1, limit = 12, status = 'available', type, city, minPrice, maxPrice } = req.query;
    const offset = (page - 1) * limit;
    const where = { status, deletedAt: null };

    if (type) where.type = type;
    if (city) where.city = { [Sequelize.Op.iLike]: `%${city}%` };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Sequelize.Op.gte] = minPrice;
      if (maxPrice) where.price[Sequelize.Op.lte] = maxPrice;
    }

    const { count, rows } = await Land.findAndCountAll({
      where,
      include: [{ model: LandImage, as: 'images', limit: 1 }, { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }],
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
    res.status(500).json({ success: false, message: 'Failed to fetch lands', error: error.message });
  }
};

// Get featured lands
const getFeaturedLands = async (req, res) => {
  try {
    const lands = await Land.findAll({
      where: { isFeatured: true, status: 'available', deletedAt: null },
      include: [{ model: LandImage, as: 'images', limit: 1 }, { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }],
      limit: 6,
      order: [['featuredUntil', 'DESC']]
    });

    res.json({ success: true, data: lands });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch featured lands' });
  }
};

// Search lands
const searchLands = async (req, res) => {
  try {
    const { q, type, city, minPrice, maxPrice, minSurface, maxSurface } = req.query;
    const where = { status: 'available', deletedAt: null };

    if (q) {
      where[Sequelize.Op.or] = [
        { title: { [Sequelize.Op.iLike]: `%${q}%` } },
        { description: { [Sequelize.Op.iLike]: `%${q}%` } },
        { address: { [Sequelize.Op.iLike]: `%${q}%` } }
      ];
    }

    if (type) where.type = type;
    if (city) where.city = { [Sequelize.Op.iLike]: `%${city}%` };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Sequelize.Op.gte] = minPrice;
      if (maxPrice) where.price[Sequelize.Op.lte] = maxPrice;
    }
    if (minSurface || maxSurface) {
      where.surface = {};
      if (minSurface) where.surface[Sequelize.Op.gte] = minSurface;
      if (maxSurface) where.surface[Sequelize.Op.lte] = maxSurface;
    }

    const lands = await Land.findAll({
      where,
      include: [{ model: LandImage, as: 'images', limit: 1 }, { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName'] }],
      limit: 20
    });

    res.json({ success: true, data: lands });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to search lands' });
  }
};

// Get land detail
const getLandDetail = async (req, res) => {
  try {
    const land = await Land.findByPk(req.params.id, {
      include: [
        { model: LandImage, as: 'images' },
        { model: LandDocument, as: 'documents' },
        { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName', 'avatarUrl', 'bio', 'phone'] },
        { model: Favorite, as: 'favoritedBy' }
      ]
    });

    if (!land) {
      return res.status(404).json({ success: false, message: 'Land not found' });
    }

    // Increment views
    await land.increment('viewsCount');

    res.json({ success: true, data: land });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch land details' });
  }
};

// Get similar lands
const getSimilarLands = async (req, res) => {
  try {
    const land = await Land.findByPk(req.params.id);
    if (!land) return res.status(404).json({ success: false, message: 'Land not found' });

    const similar = await Land.findAll({
      where: {
        id: { [Sequelize.Op.ne]: land.id },
        type: land.type,
        city: land.city,
        status: 'available',
        deletedAt: null
      },
      include: [{ model: LandImage, as: 'images', limit: 1 }],
      limit: 6
    });

    res.json({ success: true, data: similar });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch similar lands' });
  }
};

// Create land
const createLand = async (req, res) => {
  try {
    const { title, description, price, surface, type, city, district, address, latitude, longitude } = req.validatedData;

    const land = await Land.create({
      userId: req.user.id,
      title,
      description,
      price,
      surface,
      type,
      city,
      district,
      address,
      latitude,
      longitude,
      verified: 'pending'
    });

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const imageUrl = `/uploads/lands/${file.filename}`;
        await LandImage.create({
          landId: land.id,
          imageUrl,
          displayOrder: i
        });
      }
      await land.update({ imagesCount: req.files.length });
    }

    res.status(201).json({
      success: true,
      message: 'Land created successfully',
      data: land
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create land', error: error.message });
  }
};

// Update land
const updateLand = async (req, res) => {
  try {
    const land = await Land.findByPk(req.params.id);
    if (!land) return res.status(404).json({ success: false, message: 'Land not found' });

    if (land.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { title, description, price, surface, type, city, district, address, latitude, longitude, status } = req.body;

    if (title) land.title = title;
    if (description) land.description = description;
    if (price) land.price = price;
    if (surface) land.surface = surface;
    if (type) land.type = type;
    if (city) land.city = city;
    if (district) land.district = district;
    if (address) land.address = address;
    if (latitude) land.latitude = latitude;
    if (longitude) land.longitude = longitude;
    if (status) land.status = status;

    await land.save();

    res.json({ success: true, message: 'Land updated successfully', data: land });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update land' });
  }
};

// Delete land
const deleteLand = async (req, res) => {
  try {
    const land = await Land.findByPk(req.params.id);
    if (!land) return res.status(404).json({ success: false, message: 'Land not found' });

    if (land.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await land.destroy();
    res.json({ success: true, message: 'Land deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete land' });
  }
};

// Add images
const addImages = async (req, res) => {
  try {
    const land = await Land.findByPk(req.params.id);
    if (!land) return res.status(404).json({ success: false, message: 'Land not found' });

    if (land.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const images = [];
    for (let i = 0; i < req.files.length; i++) {
      const image = await LandImage.create({
        landId: land.id,
        imageUrl: `/uploads/lands/${req.files[i].filename}`,
        displayOrder: land.imagesCount + i
      });
      images.push(image);
    }

    await land.increment('imagesCount', { by: req.files.length });

    res.status(201).json({ success: true, message: 'Images added successfully', data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add images' });
  }
};

// Delete image
const deleteImage = async (req, res) => {
  try {
    const land = await Land.findByPk(req.params.id);
    if (!land) return res.status(404).json({ success: false, message: 'Land not found' });

    if (land.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const image = await LandImage.findByPk(req.params.imageId);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });

    await image.destroy();
    await land.decrement('imagesCount');

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete image' });
  }
};

// Add documents
const addDocuments = async (req, res) => {
  try {
    const land = await Land.findByPk(req.params.id);
    if (!land) return res.status(404).json({ success: false, message: 'Land not found' });

    if (land.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const documents = [];
    for (const file of req.files) {
      const doc = await LandDocument.create({
        landId: land.id,
        documentUrl: `/uploads/lands/${file.filename}`,
        documentType: req.body.documentType || 'other',
        fileName: file.originalname,
        fileSize: file.size
      });
      documents.push(doc);
    }

    res.status(201).json({ success: true, message: 'Documents added successfully', data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add documents' });
  }
};

// Delete document
const deleteDocument = async (req, res) => {
  try {
    const land = await Land.findByPk(req.params.id);
    if (!land) return res.status(404).json({ success: false, message: 'Land not found' });

    if (land.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const doc = await LandDocument.findByPk(req.params.docId);
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

    await doc.destroy();
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete document' });
  }
};

module.exports = {
  getAllLands,
  getFeaturedLands,
  searchLands,
  getLandDetail,
  getSimilarLands,
  createLand,
  updateLand,
  deleteLand,
  addImages,
  deleteImage,
  addDocuments,
  deleteDocument
};
