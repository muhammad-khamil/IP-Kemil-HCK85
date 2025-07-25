const cloudinary = require('cloudinary').v2;

// Extract credentials from CLOUDINARY_URL
const cloudinaryUrl = process.env.CLOUDINARY_URL;
if (!cloudinaryUrl) {
    throw new Error('CLOUDINARY_URL environment variable is required');
}

// Parse the URL to extract credentials
const url = new URL(cloudinaryUrl);
const cloudName = url.hostname;
const apiKey = url.username;
const apiSecret = url.password;

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
});

module.exports = cloudinary;
