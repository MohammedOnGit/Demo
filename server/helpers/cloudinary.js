
// server/helpers/cloudinary.js
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

// allow common image mime types and some legacy ones
const ALLOWED_MIMETYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/pjpeg',     // some browsers
  'image/x-png',     // legacy
]);

const imageFileFilter = (req, file, cb) => {
  // log for debugging
  console.log('[upload] file.originalname=', file.originalname, 'mimetype=', file.mimetype);

  if (ALLOWED_MIMETYPES.has(file.mimetype)) {
    return cb(null, true);
  }

  // fallback: check file extension (handles weird mimetypes or missing mimetype)
  const ext = path.extname(file.originalname || '').toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
    return cb(null, true);
  }

  cb(new Error('Only image files are allowed!'));
};

const upload = multer({ storage, fileFilter: imageFileFilter });

async function imageUploadUtils(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );
    stream.end(fileBuffer);
  });
}

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary secure URL
 * @returns {string|null} - Public ID or null if not a Cloudinary URL
 */
function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  
  // Cloudinary URL pattern: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/public_id.jpg
  const regex = /\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/;
  const match = url.match(regex);
  
  return match ? match[1] : null;
}

/**
 * Delete image from Cloudinary by URL
 * @param {string} imageUrl - Cloudinary secure URL
 * @returns {Promise<boolean>} - True if deleted successfully
 */
async function deleteImageFromCloudinary(imageUrl) {
  try {
    const publicId = extractPublicIdFromUrl(imageUrl);
    
    if (!publicId) {
      console.warn('Could not extract public ID from URL:', imageUrl);
      return false;
    }
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      console.log(`Successfully deleted image from Cloudinary: ${publicId}`);
      return true;
    } else {
      console.warn(`Failed to delete image from Cloudinary: ${publicId}`, result);
      return false;
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
}

module.exports = { 
  imageUploadUtils, 
  upload, 
  imageFileFilter,
  deleteImageFromCloudinary,
  extractPublicIdFromUrl 
};
