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
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
}

module.exports = { imageUploadUtils, upload, imageFileFilter };
