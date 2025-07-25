if (process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

const cors = require('cors');

const express = require('express');
const UserController = require('./controllers/userController');
const authentication = require('./middleware/authentication');
const adminOnly = require('./middleware/adminOnly');
const errorHandler = require('./middleware/errorHandler');
const PublicController = require('./controllers/RestaurantController');
const CMSController = require('./controllers/CMSController');
const {reviewChecker} = require('./middleware/reviewChecker');
const { uploadRestaurant, uploadFood } = require('./middleware/upload');
const app = express()
const port = 3000

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.post('/register', UserController.register)
app.post('/login', UserController.login)
app.post('/google-login', UserController.googleLogin);
 
// Public routes
app.get('/public/restaurants', PublicController.getAllRestaurants);
app.get('/public/restaurants/:id', PublicController.getDetailRestaurant);
app.get('/public/menu/nutrition', PublicController.getMenuNutrition);
app.post('/public/restaurants/:id/reviews', authentication, reviewChecker, PublicController.addReview);

app.get('/public/favorites', authentication, PublicController.getFavorites);
app.post('/public/favorites', authentication, PublicController.addFavorite);
app.delete('/public/favorites/:id', authentication, PublicController.removeFavorite);


//cms restaurant routes
app.get('/cms/restaurants', authentication, adminOnly, CMSController.listRestaurants);
app.post('/cms/restaurants', authentication, adminOnly, uploadRestaurant, CMSController.createRestaurant);
app.get('/cms/restaurants/:id', authentication, adminOnly, CMSController.getDetailRestaurant);
app.put('/cms/restaurants/:id', authentication, adminOnly, uploadRestaurant, CMSController.updateRestaurant);
app.delete('/cms/restaurants/:id', authentication, adminOnly, CMSController.deleteRestaurant);

//cms food routes
app.get('/cms/foods', authentication, adminOnly, CMSController.listFoods);
app.post('/cms/foods', authentication, adminOnly, uploadFood, CMSController.createFood);
app.get('/cms/foods/:id', authentication, adminOnly, CMSController.getDetailFood);
app.put('/cms/foods/:id', authentication, adminOnly, uploadFood, CMSController.updateFood);
app.delete('/cms/foods/:id', authentication, adminOnly, CMSController.deleteFood);

app.use(errorHandler)

module.exports = app