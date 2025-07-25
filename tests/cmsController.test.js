const { expect, test, beforeAll, afterAll, describe } = require('@jest/globals');
const supertest = require('supertest');
const app = require('../app');
const { Restaurant, Food, User } = require('../models');

let adminToken;
let userToken;
let restaurantId;
let foodId;

beforeAll(async () => {
  // Create admin user
  const adminUser = await User.create({
    fullname: "Admin Test",
    email: "admin.test@example.com",
    password: "admin123",
    role: "admin"
  });

  // Create regular user
  const regularUser = await User.create({
    fullname: "User Test",
    email: "user.test@example.com",
    password: "user123",
    role: "user"
  });

  // Login as admin to get admin token
  const adminLoginResponse = await supertest(app)
    .post('/login')
    .send({ email: 'admin.test@example.com', password: 'admin123' });

  adminToken = adminLoginResponse.body.access_token;

  // Login as user to get user token
  const userLoginResponse = await supertest(app)
    .post('/login')
    .send({ email: 'user.test@example.com', password: 'user123' });

  userToken = userLoginResponse.body.access_token;

  // Create test restaurant
  const restaurant = await Restaurant.create({
    name: "Test Restaurant",
    address: "Test Address",
    imageUrl: "https://example.com/test.jpg",
    category: "Indonesian",
    rating: 4.5
  });
  restaurantId = restaurant.id;

  // Create test food
  const food = await Food.create({
    name: "Test Food",
    description: "Test Description",
    imageUrl: "https://example.com/food.jpg",
    category: "Main Course",
    restaurantId: restaurantId
  });
  foodId = food.id;
});

afterAll(async () => {
  // Reset tables after tests
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

// ==================== RESTAURANT TESTS ====================
describe('CMS Restaurant Endpoints', () => {
  
  describe('GET /cms/restaurants', () => {
    test('list restaurants success with admin token', async () => {
      const response = await supertest(app)
        .get('/cms/restaurants')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('address');
      expect(response.body[0]).toHaveProperty('Food');
    });

    test('list restaurants unauthorized without token', async () => {
      const response = await supertest(app)
        .get('/cms/restaurants');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    test('list restaurants forbidden with user token', async () => {
      const response = await supertest(app)
        .get('/cms/restaurants')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Only admin can access this resource');
    });
  });

  describe('POST /cms/restaurants', () => {
    test('create restaurant success with admin token', async () => {
      const restaurantData = {
        name: "New Restaurant",
        address: "New Address",
        imageUrl: "https://example.com/new.jpg",
        category: "Chinese",
        rating: 4.0
      };

      const response = await supertest(app)
        .post('/cms/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(restaurantData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'New Restaurant');
      expect(response.body).toHaveProperty('category', 'Chinese');
      expect(response.body).toHaveProperty('rating', 4.0);
    });

    test('create restaurant validation error - missing name', async () => {
      const restaurantData = {
        address: "Test Address",
        imageUrl: "https://example.com/test.jpg",
        category: "Indonesian",
        rating: 4.5
      };

      const response = await supertest(app)
        .post('/cms/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(restaurantData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Name is required');
    });

    test('create restaurant unauthorized without token', async () => {
      const restaurantData = {
        name: "Test Restaurant",
        address: "Test Address",
        imageUrl: "https://example.com/test.jpg",
        category: "Indonesian",
        rating: 4.5
      };

      const response = await supertest(app)
        .post('/cms/restaurants')
        .send(restaurantData);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /cms/restaurants/:id', () => {
    test('get restaurant detail success', async () => {
      const response = await supertest(app)
        .get(`/cms/restaurants/${restaurantId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', restaurantId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('Food');
    });

    test('get restaurant detail not found', async () => {
      const response = await supertest(app)
        .get('/cms/restaurants/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Restaurant not found');
    });
  });

  describe('PUT /cms/restaurants/:id', () => {
    test('update restaurant success', async () => {
      const updateData = {
        name: "Updated Restaurant",
        address: "Updated Address",
        imageUrl: "https://example.com/updated.jpg",
        category: "Updated Category"
      };

      const response = await supertest(app)
        .put(`/cms/restaurants/${restaurantId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('updated successfully');
    });

    test('update restaurant not found', async () => {
      const updateData = {
        name: "Updated Restaurant",
        address: "Updated Address",
        imageUrl: "https://example.com/updated.jpg",
        category: "Updated Category"
      };

      const response = await supertest(app)
        .put('/cms/restaurants/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('not found');
    });
  });

  describe('DELETE /cms/restaurants/:id', () => {
    test('delete restaurant not found', async () => {
      const response = await supertest(app)
        .delete('/cms/restaurants/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('not found');
    });
  });
});

// ==================== FOOD TESTS ====================
describe('CMS Food Endpoints', () => {
  
  describe('GET /cms/foods', () => {
    test('list foods success with admin token', async () => {
      const response = await supertest(app)
        .get('/cms/foods')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('description');
    });

    test('list foods unauthorized without token', async () => {
      const response = await supertest(app)
        .get('/cms/foods');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    test('list foods forbidden with user token', async () => {
      const response = await supertest(app)
        .get('/cms/foods')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Only admin can access this resource');
    });
  });

  describe('POST /cms/foods', () => {
    test('create food success with admin token', async () => {
      const foodData = {
        name: "New Food",
        description: "New Description",
        imageUrl: "https://example.com/newfood.jpg",
        category: "Appetizer",
        restaurantId: restaurantId
      };

      const response = await supertest(app)
        .post('/cms/foods')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(foodData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'New Food');
      expect(response.body).toHaveProperty('category', 'Appetizer');
      expect(response.body).toHaveProperty('restaurantId', restaurantId);
    });

    test('create food validation error - missing name', async () => {
      const foodData = {
        description: "Test Description",
        imageUrl: "https://example.com/test.jpg",
        category: "Main Course",
        restaurantId: restaurantId
      };

      const response = await supertest(app)
        .post('/cms/foods')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(foodData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Name is required');
    });

    test('create food unauthorized without token', async () => {
      const foodData = {
        name: "Test Food",
        description: "Test Description",
        imageUrl: "https://example.com/test.jpg",
        category: "Main Course",
        restaurantId: restaurantId
      };

      const response = await supertest(app)
        .post('/cms/foods')
        .send(foodData);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /cms/foods/:id', () => {
    test('get food detail success', async () => {
      const response = await supertest(app)
        .get(`/cms/foods/${foodId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', foodId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('Restaurant');
    });

    test('get food detail not found', async () => {
      const response = await supertest(app)
        .get('/cms/foods/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Food not found');
    });
  });

  describe('PUT /cms/foods/:id', () => {
    test('update food success', async () => {
      const updateData = {
        name: "Updated Food",
        description: "Updated Description",
        imageUrl: "https://example.com/updated.jpg",
        restaurantId: restaurantId
      };

      const response = await supertest(app)
        .put(`/cms/foods/${foodId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('updated');
      expect(response.body.message).toContain('successfully');
    });

    test('update food not found', async () => {
      const updateData = {
        name: "Updated Food",
        description: "Updated Description",
        imageUrl: "https://example.com/updated.jpg",
        restaurantId: restaurantId
      };

      const response = await supertest(app)
        .put('/cms/foods/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Food not found');
    });
  });

  describe('DELETE /cms/foods/:id', () => {
    test('delete food success', async () => {
      // Create a food to delete
      const foodToDelete = await Food.create({
        name: "Food to Delete",
        description: "Will be deleted",
        imageUrl: "https://example.com/delete.jpg",
        category: "Test",
        restaurantId: restaurantId
      });

      const response = await supertest(app)
        .delete(`/cms/foods/${foodToDelete.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Food deleted successfully');
    });

    test('delete food not found', async () => {
      const response = await supertest(app)
        .delete('/cms/foods/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Food not found');
    });
  });
});
