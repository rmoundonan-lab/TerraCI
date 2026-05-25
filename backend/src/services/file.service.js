const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const processImage = async (filePath, outputPath, width = 800) => {
  try {
    await sharp(filePath)
      .resize(width, width, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toFile(outputPath);
    return { success: true };
  } catch (error) {
    console.error('Image processing failed:', error);
    return { success: false, error: error.message };
  }
};

const createThumbnail = async (filePath, outputPath, width = 300) => {
  return processImage(filePath, outputPath, width);
};

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    return { success: true };
  } catch (error) {
    console.error('File deletion failed:', error);
    return { success: false, error: error.message };
  }
};

const validateImageFile = (file) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedMimes.includes(file.mimetype)) {
    return { valid: false, message: 'Invalid image format' };
  }

  if (file.size > maxSize) {
    return { valid: false, message: 'Image size too large' };
  }

  return { valid: true };
};

const validateDocumentFile = (file) => {
  const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedMimes.includes(file.mimetype)) {
    return { valid: false, message: 'Invalid document format' };
  }

  if (file.size > maxSize) {
    return { valid: false, message: 'Document size too large' };
  }

  return { valid: true };
};

module.exports = {
  processImage,
  createThumbnail,
  deleteFile,
  validateImageFile,
  validateDocumentFile
};
