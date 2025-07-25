const { expect, test, beforeAll, afterAll, describe } = require('@jest/globals');
const supertest = require('supertest');
const app = require('../app');
const { User } = require('../models');
const userJson = require('../data/users.json');

let adminToken;

beforeAll(async () => {
  // Seed users before tests
  await User.bulkCreate(userJson, { individualHooks: true });

  await User.create({
    username: "Admin",
    email: "admin@mail.com",
    role: "admin",
    password: "admin123", // Updated password to meet length requirements
    fullname: "Admin User" // Added fullname to meet validation requirements
  });
});

afterAll(async () => {
  // Reset tables after tests
  await User.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
});

describe('POST /login', () => {
  test('login success', async () => {
    const formLogin = {
        email: 'admin@mail.com',
        password: 'admin123'
    };

    const response = await supertest(app).post('/login').send(formLogin);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('role', 'admin');
  });

  test('email not found', async () => {
    const formLogin = {
        email: '',
        password: 'admin123'
    };

    const response = await supertest(app).post('/login').send(formLogin);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Email is required');
  });

  test('password not found', async () => {
    const formLogin = {
        email: 'admin@mail.com',
        password: ''
    };

    const response = await supertest(app).post('/login').send(formLogin);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Password is required');
  });

  test('password invalid', async () => {
    const formLogin = {
        email: 'admin@mail.com',
        password: 'wewe'
    };

    const response = await supertest(app).post('/login').send(formLogin);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Invalid email or password');
  });

  test('email invalid', async () => {
    const formLogin = {
        email: 'admiil.com',
        password: 'admin123'
    };

    const response = await supertest(app).post('/login').send(formLogin);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Invalid email or password');
  });

  test('missing email and password', async () => {
    const formLogin = {};

    const response = await supertest(app).post('/login').send(formLogin);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Email is required');
  });

  test('email and password are null', async () => {
    const formLogin = {
        email: null,
        password: null
    };

    const response = await supertest(app).post('/login').send(formLogin);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Email is required');
  });

  test('email and password are undefined', async () => {
    const formLogin = {
        email: undefined,
        password: undefined
    };

    const response = await supertest(app).post('/login').send(formLogin);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Email is required');
  });
});

describe('POST /register', () => {
  test('register success', async () => {
    const userData = {
      fullname: "New User",
      email: "newuser@example.com",
      password: "password123",
      role: "user"
    };

    const response = await supertest(app)
      .post('/register')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('fullname', 'New User');
    expect(response.body).toHaveProperty('email', 'newuser@example.com');
    expect(response.body).toHaveProperty('role', 'user');
    expect(response.body).not.toHaveProperty('password');
  });

  test('register with default role', async () => {
    const userData = {
      fullname: "Default Role User",
      email: "defaultrole@example.com",
      password: "password123"
    };

    const response = await supertest(app)
      .post('/register')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('role', 'user');
  });

  test('register validation error - missing fullname', async () => {
    const userData = {
      email: "test@example.com",
      password: "password123"
    };

    const response = await supertest(app)
      .post('/register')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Fullname is required');
  });

  test('register validation error - missing email', async () => {
    const userData = {
      fullname: "Test User",
      password: "password123"
    };

    const response = await supertest(app)
      .post('/register')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Email is required');
  });

  test('register validation error - invalid email format', async () => {
    const userData = {
      fullname: "Test User",
      email: "invalid-email",
      password: "password123"
    };

    const response = await supertest(app)
      .post('/register')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Email format is invalid');
  });

  test('register validation error - password too short', async () => {
    const userData = {
      fullname: "Test User", 
      email: "test@example.com",
      password: "123"
    };

    const response = await supertest(app)
      .post('/register')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Password length must be between 6 and 100 characters');
  });

  test('register validation error - duplicate email', async () => {
    const userData = {
      fullname: "Duplicate User",
      email: "admin@mail.com", // Already exists
      password: "password123"
    };

    const response = await supertest(app)
      .post('/register')
      .send(userData);

    expect(response.status).toBe(400);
  });
});

describe('POST /google-login', () => {
  test('google login missing token', async () => {
    const response = await supertest(app)
      .post('/google-login')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Google Token is required');
  });

  test('google login invalid token', async () => {
    const response = await supertest(app)
      .post('/google-login')
      .send({ googleToken: 'invalid-token' });

    // Should return error due to invalid token
    expect([400, 401, 500]).toContain(response.status);
  });
});
