// cloudinaryConfig.js
const cloudinary = require('cloudinary');
const crypto = require('crypto');

// Function to generate a secret key
const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'ds7jufrxl',
  api_key: '827497948387292',
  api_secret: 'qZygsilGaETbzQ5rnN8v-k8Ai4g',
});

const secretKey = generateSecretKey();

module.exports = { cloudinary, secretKey };