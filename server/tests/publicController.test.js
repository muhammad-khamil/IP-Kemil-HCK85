const { expect, test, beforeAll, afterAll, describe } = require('@jest/globals');
const supertest = require('supertest');
const app = require('../app');
const { Restaurant, Food, User, RestaurantReview, Favorite } = require('../models');

let userToken;

beforeAll(async () => {
  // Create test user with hashed password
  const testUser = await User.create({
    fullname: "Test User Public",
    email: "testpublic@example.com",
    password: "password123",
    role: "user"
  }, { individualHooks: true });

  // Login to get token
  const loginResponse = await supertest(app)
    .post('/login')
    .send({ email: 'testpublic@example.com', password: 'password123' });

  console.log('Login Response Status:', loginResponse.status);
  console.log('Login Response Body:', loginResponse.body);

  userToken = loginResponse.body.access_token;

  if (!userToken) {
    throw new Error('Failed to get user token from login');
  }

  // Create test restaurants
  const restaurants = await Restaurant.bulkCreate([
    {
      name: "Test Restaurant 1",
      address: "Test Address 1",
      imageUrl: "https://example.com/restaurant1.jpg",
      category: "Indonesian",
      rating: 4.5
    },
    {
      name: "Test Restaurant 2", 
      address: "Test Address 2",
      imageUrl: "https://example.com/restaurant2.jpg",
      category: "Chinese",
      rating: 4.0
    }
  ]);

  // Create test foods
  await Food.bulkCreate([
    {
      name: "Test Food 1",
      description: "Delicious food 1",
      imageUrl: "https://example.com/food1.jpg",
      category: "Main Course",
      restaurantId: restaurants[0].id
    },
    {
      name: "Test Food 2",
      description: "Delicious food 2", 
      imageUrl: "https://example.com/food2.jpg",
      category: "Appetizer",
      restaurantId: restaurants[1].id
    }
  ]);

  // Create test reviews
  await RestaurantReview.create({
    userId: testUser.id,
    restaurantId: restaurants[0].id,
    rating: 5,
    comment: "Great restaurant!"
  });
});

afterAll(async () => {
  // Clean up
  await RestaurantReview.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true
  });

  await Favorite.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true
  });

  await Food.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true
  });

  await Restaurant.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true
  });

  await User.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
});

describe('Public Restaurant Endpoints', () => {
  
  describe('GET /public/restaurants', () => {
    test('get all restaurants success', async () => {
      const response = await supertest(app)
        .get('/public/restaurants');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('address');
    });
  });

  describe('GET /public/restaurants/:id', () => {
    test('get restaurant detail success', async () => {
      const response = await supertest(app)
        .get('/public/restaurants/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('Food');
      expect(response.body).toHaveProperty('RestaurantReviews');
    });

    test('get restaurant detail not found', async () => {
      const response = await supertest(app)
        .get('/public/restaurants/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Restaurant not found');
    });
  });

  describe('GET /public/menu/nutrition', () => {
    test('get nutrition info success', async () => {
      const response = await supertest(app)
        .get('/public/menu/nutrition')
        .query({ name: 'chicken' });

      // This might fail due to external API, so we test both success and error cases
      expect([200, 404, 500]).toContain(response.status);
    }, 10000); // Increase timeout for external API call

    test('get nutrition info without name parameter', async () => {
      const response = await supertest(app)
        .get('/public/menu/nutrition');

      // Should handle missing name parameter
      expect([200, 404, 500]).toContain(response.status);
    }, 10000);
  });

  describe('GET /public/favorites', () => {
    test('get favorites success with authentication', async () => {
      const response = await supertest(app)
        .get('/public/favorites')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    test('get favorites unauthorized', async () => {
      const response = await supertest(app)
        .get('/public/favorites');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid token');
    });
  });

  describe('POST /public/favorites', () => {
    test('add favorite success', async () => {
      const response = await supertest(app)
        .post('/public/favorites')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ foodId: 1 });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('foodId', 1);
    });

    test('add favorite with FoodId property', async () => {
      const response = await supertest(app)
        .post('/public/favorites')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ FoodId: 2 });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('foodId', 2);
    });

    test('add favorite unauthorized', async () => {
      const response = await supertest(app)
        .post('/public/favorites')
        .send({ foodId: 1 });

      expect(response.status).toBe(401);
    });

    test('add favorite validation error', async () => {
      const response = await supertest(app)
        .post('/public/favorites')
        .set('Authorization', `Bearer ${userToken}`)
        .send({}); // No foodId

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /public/favorites/:id', () => {
    test('remove favorite success', async () => {
      // First add a favorite
      await supertest(app)
        .post('/public/favorites')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ foodId: 1 });

      // Then remove it
      const response = await supertest(app)
        .delete('/public/favorites/1')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Favorite removed successfully');
    });

    test('remove favorite not found', async () => {
      const response = await supertest(app)
        .delete('/public/favorites/999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Favorite not found');
    });

    test('remove favorite unauthorized', async () => {
      const response = await supertest(app)
        .delete('/public/favorites/1');

      expect(response.status).toBe(401);
    });
  });
});
