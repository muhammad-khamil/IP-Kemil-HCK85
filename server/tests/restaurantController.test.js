const { expect, test, beforeAll, afterAll } = require('@jest/globals');
const supertest = require('supertest');
const app = require('../app');
const { Restaurant, RestaurantReview, User } = require('../models');
const restaurantJson = require('../data/restaurants.json');
const userJson = require('../data/users.json');

let validToken;

beforeAll(async () => {
  // Seed restaurants and users before tests
  await Restaurant.bulkCreate(restaurantJson);
  await User.bulkCreate(userJson, { individualHooks: true });

  // Generate valid token for testing
  const loginResponse = await supertest(app)
    .post('/login')
    .send({ email: 'user1@example.com', password: '123456' });

  console.log('Login response:', loginResponse.body); // Debug log

  if (!loginResponse.body || !loginResponse.body.access_token) {
    throw new Error('Token not received from login response');
  }

  validToken = loginResponse.body.access_token;
});

afterAll(async () => {
  // Reset tables after tests
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

  await RestaurantReview.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
});

describe('POST /public/restaurants/:id/reviews', () => {
  test('add review success', async () => {
    const reviewData = {
      rating: 5,
      comment: 'Excellent food!'
    };

    const response = await supertest(app)
      .post('/public/restaurants/1/reviews')
      .set('Authorization', `Bearer ${validToken}`)
      .send(reviewData);

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('rating', 5);
    expect(response.body).toHaveProperty('comment', 'Excellent food!');
  }, 10000); // Increase timeout to 10 seconds

  test('rating not provided', async () => {
    const reviewData = {
      comment: 'Good food!'
    };

    const response = await supertest(app)
      .post('/public/restaurants/1/reviews')
      .set('Authorization', `Bearer ${validToken}`)
      .send(reviewData);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Rating is required');
  }, 10000); // Increase timeout to 10 seconds

  test('rating out of range', async () => {
    const reviewData = {
      rating: 6,
      comment: 'Good food!'
    };

    const response = await supertest(app)
      .post('/public/restaurants/1/reviews')
      .set('Authorization', `Bearer ${validToken}`)
      .send(reviewData);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Rating must be between 1 and 5');
  }, 10000); // Increase timeout to 10 seconds

  test('comment not provided', async () => {
    const reviewData = {
      rating: 4
    };

    const response = await supertest(app)
      .post('/public/restaurants/1/reviews')
      .set('Authorization', `Bearer ${validToken}`)
      .send(reviewData);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Comment is required');
  });

  test('unauthorized access', async () => {
    const reviewData = {
      rating: 4,
      comment: 'Good food!'
    };

    const response = await supertest(app)
      .post('/public/restaurants/1/reviews')
      .send(reviewData);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Invalid token');
  });
});
