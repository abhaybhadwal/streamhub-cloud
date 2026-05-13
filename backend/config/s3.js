const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const fs = require('fs');

// AWS Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Cloud Storage Engine (AWS S3)
const cloudStorage = multerS3({
  s3: s3,
  bucket: process.env.S3_BUCKET_NAME || 'your-bucket-name',
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `videos/${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Local Fallback Storage Engine
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Determine storage mode based on credentials
const isCloudReady = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

const upload = multer({ 
  storage: isCloudReady ? cloudStorage : localStorage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

console.log(isCloudReady ? "☁️  CLOUD STORAGE ACTIVE (AWS S3)" : "💻  LOCAL STORAGE ACTIVE (Fallback)");

module.exports = upload;
