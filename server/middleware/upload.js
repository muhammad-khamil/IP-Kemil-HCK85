const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure Cloudinary storage for different types
const createCloudinaryStorage = (folder) => {
    return new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: folder,
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
            transformation: [
                { width: 500, height: 500, crop: 'limit' },
                { quality: 'auto' }
            ]
        }
    });
};

// Create different upload middlewares for different purposes
const uploadRestaurant = multer({
    storage: createCloudinaryStorage('restaurants'),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

const uploadFood = multer({
    storage: createCloudinaryStorage('foods'),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

const uploadProfile = multer({
    storage: createCloudinaryStorage('profiles'),
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit for profile pictures
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

module.exports = {
    uploadRestaurant: uploadRestaurant.single('image'),
    uploadFood: uploadFood.single('image'),
    uploadProfile: uploadProfile.single('profileImage'),
    uploadMultiple: uploadRestaurant.array('images', 5) // For multiple images
};
