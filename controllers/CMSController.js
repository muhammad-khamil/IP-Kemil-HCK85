const {Restaurant, Food, RestaurantReview, Favorite, User} = require('../models');

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
            const {name, address, imageUrl, category, rating} = req.body;
            const restaurant = await Restaurant.create({
                name,
                address,
                imageUrl,
                category,
                rating
            });
            res.status(201).json(restaurant);
        } catch (error) {
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
            const {name, address, imageUrl, category} = req.body
            const data = await Restaurant.findByPk(id);

            const result = await Restaurant.update(
                {name, address, imageUrl, category},
                {where: {id}, returning: true}
            )
            if (result[0] === 0) {
                throw {name: 'NotFound', message: `Restaurant with id ${id} not found`};
            }
            res.status(200).json({message: `Restaurant ${data.name} updated successfully`});
        } catch (error) {
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
            const {name, description, imageUrl, category, restaurantId} = req.body;
            const food = await Food.create({name, description, imageUrl, category, restaurantId});
            res.status(201).json(food);
        } catch (error) {
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
            const {name, description, imageUrl, restaurantId} = req.body;
            const data = await Food.findByPk(id);

            const result = await Food.update(
                {name, description, imageUrl, restaurantId},
                {where: {id}}
            );
            if (result[0] === 0) {
                throw {name: 'NotFound', message: 'Food not found'};
            }
            res.status(200).json({message: `Food updated ${data.name} successfully`});
        } catch (error) {
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