const { expect, test, describe } = require('@jest/globals');
const supertest = require('supertest');
const express = require('express');
const errorHandler = require('../middleware/errorHandler');

// Create test app to test error handler
const createTestApp = (errorToThrow) => {
  const app = express();
  app.use(express.json());
  
  app.get('/test-error', (req, res, next) => {
    next(errorToThrow);
  });
  
  app.use(errorHandler);
  return app;
};

describe('Error Handler Middleware', () => {
  
  test('handle SequelizeValidationError', async () => {
    const error = {
      name: 'SequelizeValidationError',
      errors: [{ message: 'Validation error message' }]
    };
    
    const app = createTestApp(error);
    
    const response = await supertest(app)
      .get('/test-error');
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Validation error message');
  });

  test('handle SequelizeUniqueConstraintError', async () => {
    const error = {
      name: 'SequelizeUniqueConstraintError',
      errors: [{ message: 'Unique constraint error' }]
    };
    
    const app = createTestApp(error);
    
    const response = await supertest(app)
      .get('/test-error');
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Unique constraint error');
  });

  test('handle Unauthorized error', async () => {
    const error = {
      name: 'Unauthorized',
      message: 'Access denied'
    };
    
    const app = createTestApp(error);
    
    const response = await supertest(app)
      .get('/test-error');
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Access denied');
  });

  test('handle AuthenticationError', async () => {
    const error = {
      name: 'AuthenticationError',
      message: 'Authentication failed'
    };
    
    const app = createTestApp(error);
    
    const response = await supertest(app)
      .get('/test-error');
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Authentication failed');
  });

  test('handle JsonWebTokenError', async () => {
    const error = {
      name: 'JsonWebTokenError',
      message: 'JWT error'
    };
    
    const app = createTestApp(error);
    
    const response = await supertest(app)
      .get('/test-error');
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid token');
  });

  test('handle NotFound error', async () => {
    const error = {
      name: 'NotFound',
      message: 'Resource not found'
    };
    
    const app = createTestApp(error);
    
    const response = await supertest(app)
      .get('/test-error');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Resource not found');
  });

  test('handle BadRequest error', async () => {
    const error = {
      name: 'BadRequest',
      message: 'Bad request'
    };
    
    const app = createTestApp(error);
    
    const response = await supertest(app)
      .get('/test-error');
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Bad request');
  });

  test('handle Forbidden error', async () => {
    const error = {
      name: 'Forbidden',
      message: 'Access forbidden'
    };
    
    const app = createTestApp(error);
    
    const response = await supertest(app)
      .get('/test-error');
    
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Access forbidden');
  });

  test('handle default/unknown error', async () => {
    const error = {
      name: 'UnknownError',
      message: 'Something went wrong'
    };
    
    const app = createTestApp(error);
    
    const response = await supertest(app)
      .get('/test-error');
    
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Something went wrong');
  });

  test('handle error without message', async () => {
    const error = {
      name: 'UnknownError'
    };
    
    const app = createTestApp(error);
    
    const response = await supertest(app)
      .get('/test-error');
    
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Internal Server Error');
  });
});
