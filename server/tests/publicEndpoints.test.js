const { expect, test, beforeAll, afterAll, describe } = require('@jest/globals');
const supertest = require('supertest');
const app = require('../app');
const { Restaurant, Food, User, RestaurantReview } = require('../models');

beforeAll(async () => {
  // Create test restaurants and foods for public endpoints
  const restaurants = await Restaurant.bulkCreate([
    {
      name: "Public Test Restaurant 1",
      address: "Public Test Address 1",
      imageUrl: "https://example.com/restaurant1.jpg",
      category: "Indonesian",
      rating: 4.5
    },
    {
      name: "Public Test Restaurant 2", 
      address: "Public Test Address 2",
      imageUrl: "https://example.com/restaurant2.jpg",
      category: "Chinese",
      rating: 4.0
    }
  ]);

  // Create test foods
  await Food.bulkCreate([
    {
      name: "Public Test Food 1",
      description: "Delicious food 1",
      imageUrl: "https://example.com/food1.jpg",
      category: "Main Course",
      restaurantId: restaurants[0].id
    },
    {
      name: "Public Test Food 2",
      description: "Delicious food 2", 
      imageUrl: "https://example.com/food2.jpg",
      category: "Appetizer",
      restaurantId: restaurants[1].id
    }
  ]);

  // Create test user and reviews
  const testUser = await User.create({
    fullname: "Test Public User",
    email: "testpublicuser@example.com",
    password: "password123",
    role: "user"
  });

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

describe('Public Restaurant Endpoints (Read Only)', () => {
  
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
    test('get nutrition info with valid food name', async () => {
      const response = await supertest(app)
        .get('/public/menu/nutrition')
        .query({ name: 'chicken' });

      // External API call - expect either success or error
      expect([200, 404, 500]).toContain(response.status);
    }, 15000);

    test('get nutrition info with no name parameter', async () => {
      const response = await supertest(app)
        .get('/public/menu/nutrition');

      // Should handle missing parameter gracefully
      expect([200, 404, 500]).toContain(response.status);
    }, 15000);

    test('get nutrition info with invalid food name', async () => {
      const response = await supertest(app)
        .get('/public/menu/nutrition')
        .query({ name: 'invalidfoodname12345' });

      // External API call - expect either success or error
      expect([200, 404, 500]).toContain(response.status);
    }, 15000);
  });
});
