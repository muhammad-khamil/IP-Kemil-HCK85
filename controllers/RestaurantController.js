const axios = require('axios');
const { where } = require('sequelize');
const { Restaurant, Food, RestaurantReview, Favorite, User } = require('../models');

class PublicController {
    static async getAllRestaurants(req, res, next) {
        try {
            const restaurants = await Restaurant.findAll({ order: [['name', 'ASC']] })
            res.status(200).json(restaurants);
        } catch (error) {
            next(error);
        }
    }

    static async getDetailRestaurant(req, res, next) {
        try {
            const { id } = req.params;
            const restaurant = await Restaurant.findByPk(id, {
                include: [
                    { model: Food },
                    {
                        model: RestaurantReview,
                        include: [{ model: User, attributes: ['fullname', 'email'] }]
                    }
                ]
            });

            if (!restaurant) {
                throw { name: 'NotFound', message: 'Restaurant not found' };
            }

            res.status(200).json(restaurant);
        } catch (error) {
            next(error);
        }
    }

    static async getMenuNutrition(req, res, next) {
        try {
            const { name } = req.query;
            const food = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}&query=${name}`);
            // console.log(food.data);

            // Check if results exist and has at least one item
            if (!food.data.results || food.data.results.length === 0) {
                throw { name: 'NotFound', message: 'Food not found' };
            }

            const data = food.data.results[0].id
            // console.log(data, "<<< data");


            if (!data) {
                throw { name: 'NotFound', message: 'Food not found' };
            }

            const nutrition = await axios.get(`https://api.spoonacular.com/recipes/${data}/nutritionWidget.json?apiKey=${process.env.SPOONACULAR_API_KEY}`)
            // console.log(nutrition.data, "<<< nutrition");
            const nutritionData = {
                calories: nutrition.data.calories,
                carbs: nutrition.data.carbs,
                fat: nutrition.data.fat,
                protein: nutrition.data.protein
            }

            res.json(nutritionData);

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async addReview(req, res, next) {
        try {
            const userId = req.user.id;
            const restaurantId = req.params.id;
            const { rating, comment } = req.body;

            if (!rating) {
                throw { name: 'BadRequest', message: 'Rating is required' };
            }

            if (rating < 1 || rating > 5) {
                throw { name: 'BadRequest', message: 'Rating must be between 1 and 5' };
            }

            if (!comment) {
                throw { name: 'BadRequest', message: 'Comment is required' };
            }

            const review = await RestaurantReview.create({ userId, restaurantId, rating, comment });
            res.status(201).json(review);
        } catch (error) {
            next(error);
        }
    }

    static async getFavorites(req, res, next) {
        try {
            const userId = req.user.id;
            const data = await Favorite.findAll({
                where: { userId },
                include: Food
            })
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    static async addFavorite(req, res, next) {
        try {
            const userId = req.user.id;
            const foodId = req.body.FoodId || req.body.foodId; // ambil dari body

            const favorite = await Favorite.create({ userId, foodId });
            res.status(201).json(favorite);
        } catch (error) {
            next(error);
        }
    }


    static async removeFavorite(req, res, next) {
    try {
        const userId = req.user.id;
        const foodId = req.params.id;

        const favorite = await Favorite.findOne({ where: { userId, foodId } });
        if (!favorite) {
            throw { name: 'NotFound', message: 'Favorite not found' };
        }

        await favorite.destroy();
        res.status(200).json({ message: 'Favorite removed successfully' });
    } catch (error) {
        next(error);
    }
}


}

module.exports = PublicController;