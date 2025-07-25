const {Restaurant, Food, RestaurantReview, Favorite, User} = require('../models');
const cloudinary = require('../config/cloudinary');

class CMSController{
    static async listRestaurants(req, res, next) {
        try {
            const data = await Restaurant.findAll({include: Food, order: [['name', 'ASC']]});
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    static async createRestaurant(req, res, next) {
        try {
            const {name, address, category, rating} = req.body;
            
            // Get image URL from uploaded file
            const imageUrl = req.file ? req.file.path : req.body.imageUrl;

            const restaurant = await Restaurant.create({
                name,
                address,
                imageUrl,
                category,
                rating
            });
            res.status(201).json(restaurant);
        } catch (error) {
            // If there was an error and file was uploaded, delete it from Cloudinary
            if (req.file && req.file.public_id) {
                await cloudinary.uploader.destroy(req.file.public_id);
            }
            next(error);
        }
    }

    static async getDetailRestaurant(req, res, next) {
        try {
            const {id} = req.params
            const restaurant = await Restaurant.findByPk(id,{include: Food});
            if (!restaurant) {
                throw {name: 'NotFound', message: 'Restaurant not found'};
            }
            res.status(200).json(restaurant);
        } catch (error) {
            next(error);
        }
    }

    static async updateRestaurant(req, res, next) {
        try {
            const {id} = req.params;
            const {name, address, category} = req.body;
            const data = await Restaurant.findByPk(id);

            if (!data) {
                throw {name: 'NotFound', message: `Restaurant with id ${id} not found`};
            }

            const updateData = {name, address, category};
            
            // If new image is uploaded, add it to update data
            if (req.file) {
                updateData.imageUrl = req.file.path;
            } else if (req.body.imageUrl) {
                updateData.imageUrl = req.body.imageUrl;
            }

            const result = await Restaurant.update(
                updateData,
                {where: {id}, returning: true}
            )
            if (result[0] === 0) {
                throw {name: 'NotFound', message: `Restaurant with id ${id} not found`};
            }
            res.status(200).json({message: `Restaurant ${data.name} updated successfully`});
        } catch (error) {
            // If there was an error and file was uploaded, delete it from Cloudinary
            if (req.file && req.file.public_id) {
                await cloudinary.uploader.destroy(req.file.public_id);
            }
            next(error);
        }
    }

    static async deleteRestaurant(req, res, next) {
        try {
            const {id} = req.params;

            const data = await Restaurant.findByPk(id);
            const result = await Restaurant.destroy({where: {id}});
            if (result === 0) {
                throw {name: 'NotFound', message: `Restaurant with id ${id} not found`};
            }
            res.status(200).json({message: `Restaurant deleted ${data.name} successfully`});
        } catch (error) {
            next(error);
        }
    }

    static async listFoods(req, res, next) {
        try {
            const data = await Food.findAll({order: [['name', 'ASC']]});
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    static async createFood(req, res, next) {
        try {
            const {name, description, category, restaurantId} = req.body;
            
            // Get image URL from uploaded file
            const imageUrl = req.file ? req.file.path : req.body.imageUrl;

            const food = await Food.create({name, description, imageUrl, category, restaurantId});
            res.status(201).json(food);
        } catch (error) {
            // If there was an error and file was uploaded, delete it from Cloudinary
            if (req.file && req.file.public_id) {
                await cloudinary.uploader.destroy(req.file.public_id);
            }
            next(error);
        }
    }

    static async getDetailFood(req, res, next) {
        try {
            const {id} = req.params;
            const food = await Food.findByPk(id, {
                include: [{model: Restaurant, attributes: ['name', 'address']}]
            });
            if (!food) {
                throw {name: 'NotFound', message: 'Food not found'};
            }
            res.status(200).json(food);
        } catch (error) {
            next(error);
        }
    }

    static async updateFood(req, res, next) {
        try {
            const {id} = req.params;
            const {name, description, restaurantId} = req.body;
            const data = await Food.findByPk(id);

            if (!data) {
                throw {name: 'NotFound', message: 'Food not found'};
            }

            const updateData = {name, description, restaurantId};
            
            // If new image is uploaded, add it to update data
            if (req.file) {
                updateData.imageUrl = req.file.path;
            } else if (req.body.imageUrl) {
                updateData.imageUrl = req.body.imageUrl;
            }

            const result = await Food.update(
                updateData,
                {where: {id}}
            );
            if (result[0] === 0) {
                throw {name: 'NotFound', message: 'Food not found'};
            }
            res.status(200).json({message: `Food updated ${data.name} successfully`});
        } catch (error) {
            // If there was an error and file was uploaded, delete it from Cloudinary
            if (req.file && req.file.public_id) {
                await cloudinary.uploader.destroy(req.file.public_id);
            }
            next(error);
        }
    }

    static async deleteFood(req, res, next) {
        try {
            const {id} = req.params;
            const result = await Food.destroy({where: {id}});
            if (result === 0) {
                throw {name: 'NotFound', message: 'Food not found'};
            }
            res.status(200).json({message: 'Food deleted successfully'});
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CMSController;