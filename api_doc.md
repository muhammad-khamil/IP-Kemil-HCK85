# Restaurant API Documentation

## Overview
This is a RESTful API for a restaurant management system that includes user authentication, public restaurant information, reviews, favorites, and admin content management.

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require authentication using JWT (JSON Web Token). Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Error Responses
All endpoints may return the following error responses:

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## Endpoints

### Authentication Endpoints

#### 1. Register User
**POST** `/register`

Register a new user account.

**Request Body:**
```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // optional, defaults to "user"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "fullname": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

**Error Responses:**
- `400` - Validation error (missing fields, invalid email, password too short)
- `400` - Email already exists

---

#### 2. Login User
**POST** `/login`

Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "fullname": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid email or password

---

#### 3. Google Login
**POST** `/google-login`

Authenticate using Google OAuth token.

**Request Body:**
```json
{
  "google_token": "google_oauth_token_here"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "fullname": "John Doe",
    "email": "john@gmail.com",
    "role": "user"
  }
}
```

**Error Responses:**
- `400` - Missing or invalid Google token

---

### Public Restaurant Endpoints

#### 4. Get All Restaurants
**GET** `/public/restaurants`

Get list of all restaurants.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Restaurant Name",
    "address": "Restaurant Address",
    "imageUrl": "https://example.com/image.jpg",
    "category": "Indonesian",
    "rating": 4.5,
    "Food": [
      {
        "id": 1,
        "name": "Food Name",
        "description": "Food Description",
        "imageUrl": "https://example.com/food.jpg",
        "category": "Main Course"
      }
    ]
  }
]
```

---

#### 5. Get Restaurant Detail
**GET** `/public/restaurants/:id`

Get detailed information about a specific restaurant.

**Parameters:**
- `id` (path parameter) - Restaurant ID

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Restaurant Name",
  "address": "Restaurant Address",
  "imageUrl": "https://example.com/image.jpg",
  "category": "Indonesian",
  "rating": 4.5,
  "Food": [
    {
      "id": 1,
      "name": "Food Name",
      "description": "Food Description",
      "imageUrl": "https://example.com/food.jpg",
      "category": "Main Course"
    }
  ],
  "RestaurantReviews": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Great food!",
      "User": {
        "fullname": "John Doe"
      }
    }
  ]
}
```

**Error Responses:**
- `404` - Restaurant not found

---

#### 6. Get Menu Nutrition Information
**GET** `/public/menu/nutrition?name=<food_name>`

Get nutrition information for a specific food item using external API.

**Query Parameters:**
- `name` (required) - Name of the food item

**Response (200 OK):**
```json
{
  "id": 123456,
  "title": "Chicken Curry",
  "nutrition": {
    "calories": "250 kcal",
    "protein": "20g",
    "carbs": "15g",
    "fat": "12g"
  }
}
```

**Error Responses:**
- `400` - Missing food name parameter
- `404` - Food not found in nutrition database

---

#### 7. Add Restaurant Review
**POST** `/public/restaurants/:id/reviews`

Add a review for a restaurant. Requires authentication and content moderation using AI.

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id` (path parameter) - Restaurant ID

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent food and service!"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "rating": 5,
  "comment": "Excellent food and service!",
  "restaurantId": 1,
  "userId": 1
}
```

**Error Responses:**
- `400` - Missing rating or comment
- `400` - Rating must be between 1 and 5
- `401` - Authentication required
- `403` - Review contains inappropriate content (SARA/offensive language)

---

### Favorites Endpoints

#### 8. Get User Favorites
**GET** `/public/favorites`

Get list of user's favorite restaurants.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "Restaurant": {
      "id": 1,
      "name": "Restaurant Name",
      "address": "Restaurant Address",
      "imageUrl": "https://example.com/image.jpg",
      "category": "Indonesian",
      "rating": 4.5
    }
  }
]
```

**Error Responses:**
- `401` - Authentication required

---

#### 9. Add Restaurant to Favorites
**POST** `/public/favorites`

Add a restaurant to user's favorites.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "restaurantId": 1
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "restaurantId": 1,
  "userId": 1
}
```

**Error Responses:**
- `400` - Missing restaurantId
- `401` - Authentication required
- `404` - Restaurant not found

---

#### 10. Remove Restaurant from Favorites
**DELETE** `/public/favorites/:id`

Remove a restaurant from user's favorites.

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id` (path parameter) - Favorite ID

**Response (200 OK):**
```json
{
  "message": "Favorite removed successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - Favorite not found

---

### CMS Restaurant Endpoints (Admin Only)

#### 11. List All Restaurants (CMS)
**GET** `/cms/restaurants`

Get list of all restaurants for admin management.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Restaurant Name",
    "address": "Restaurant Address",
    "imageUrl": "https://example.com/image.jpg",
    "category": "Indonesian",
    "rating": 4.5,
    "Food": [
      {
        "id": 1,
        "name": "Food Name",
        "description": "Food Description"
      }
    ]
  }
]
```

**Error Responses:**
- `401` - Authentication required
- `403` - Admin access required

---

#### 12. Create Restaurant (CMS)
**POST** `/cms/restaurants`

Create a new restaurant with optional image upload.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `name` (required) - Restaurant name
- `address` (required) - Restaurant address  
- `category` (required) - Restaurant category
- `rating` (optional) - Restaurant rating (0-5)
- `image` (optional) - Image file (jpg, jpeg, png, gif) - Max 5MB

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "New Restaurant",
  "address": "Restaurant Address",
  "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/restaurants/abc123.jpg",
  "category": "Indonesian",
  "rating": 4.5
}
```

**Error Responses:**
- `400` - Validation error (missing required fields, file too large, invalid file type)
- `401` - Authentication required
- `403` - Admin access required

---

#### 13. Get Restaurant Detail (CMS)
**GET** `/cms/restaurants/:id`

Get detailed restaurant information for admin management.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Parameters:**
- `id` (path parameter) - Restaurant ID

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Restaurant Name",
  "address": "Restaurant Address",
  "imageUrl": "https://example.com/image.jpg",
  "category": "Indonesian",
  "rating": 4.5,
  "Food": [
    {
      "id": 1,
      "name": "Food Name",
      "description": "Food Description",
      "imageUrl": "https://example.com/food.jpg",
      "category": "Main Course"
    }
  ]
}
```

**Error Responses:**
- `401` - Authentication required
- `403` - Admin access required
- `404` - Restaurant not found

---

#### 14. Update Restaurant (CMS)
**PUT** `/cms/restaurants/:id`

Update restaurant information with optional image upload.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Parameters:**
- `id` (path parameter) - Restaurant ID

**Request Body (Form Data):**
- `name` (optional) - Updated restaurant name
- `address` (optional) - Updated restaurant address
- `category` (optional) - Updated restaurant category
- `image` (optional) - New image file (jpg, jpeg, png, gif) - Max 5MB

**Response (200 OK):**
```json
{
  "message": "Restaurant updated successfully"
}
```

**Error Responses:**
- `400` - Validation error (file too large, invalid file type)
- `401` - Authentication required
- `403` - Admin access required
- `404` - Restaurant not found

---

#### 15. Delete Restaurant (CMS)
**DELETE** `/cms/restaurants/:id`

Delete a restaurant.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Parameters:**
- `id` (path parameter) - Restaurant ID

**Response (200 OK):**
```json
{
  "message": "Restaurant deleted successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `403` - Admin access required
- `404` - Restaurant not found

---

### CMS Food Endpoints (Admin Only)

#### 16. List All Foods (CMS)
**GET** `/cms/foods`

Get list of all food items for admin management.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Food Name",
    "description": "Food Description",
    "imageUrl": "https://example.com/food.jpg",
    "category": "Main Course",
    "restaurantId": 1,
    "Restaurant": {
      "name": "Restaurant Name"
    }
  }
]
```

**Error Responses:**
- `401` - Authentication required
- `403` - Admin access required

---

#### 17. Create Food (CMS)
**POST** `/cms/foods`

Create a new food item with optional image upload.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `name` (required) - Food name
- `description` (required) - Food description
- `category` (required) - Food category
- `restaurantId` (required) - Restaurant ID
- `image` (optional) - Image file (jpg, jpeg, png, gif) - Max 5MB

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "New Food",
  "description": "Food Description",
  "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/foods/def456.jpg",
  "category": "Main Course",
  "restaurantId": 1
}
```

**Error Responses:**
- `400` - Validation error (missing required fields, file too large, invalid file type)
- `401` - Authentication required
- `403` - Admin access required

---

#### 18. Get Food Detail (CMS)
**GET** `/cms/foods/:id`

Get detailed food information for admin management.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Parameters:**
- `id` (path parameter) - Food ID

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Food Name",
  "description": "Food Description",
  "imageUrl": "https://example.com/food.jpg",
  "category": "Main Course",
  "restaurantId": 1,
  "Restaurant": {
    "id": 1,
    "name": "Restaurant Name",
    "address": "Restaurant Address"
  }
}
```

**Error Responses:**
- `401` - Authentication required
- `403` - Admin access required
- `404` - Food not found

---

#### 19. Update Food (CMS)
**PUT** `/cms/foods/:id`

Update food information with optional image upload.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Parameters:**
- `id` (path parameter) - Food ID

**Request Body (Form Data):**
- `name` (optional) - Updated food name
- `description` (optional) - Updated food description
- `category` (optional) - Updated food category
- `restaurantId` (optional) - Updated restaurant ID
- `image` (optional) - New image file (jpg, jpeg, png, gif) - Max 5MB

**Response (200 OK):**
```json
{
  "message": "Food updated successfully"
}
```

**Error Responses:**
- `400` - Validation error (file too large, invalid file type)
- `401` - Authentication required
- `403` - Admin access required
- `404` - Food not found

---

#### 20. Delete Food (CMS)
**DELETE** `/cms/foods/:id`

Delete a food item.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Parameters:**
- `id` (path parameter) - Food ID

**Response (200 OK):**
```json
{
  "message": "Food deleted successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `403` - Admin access required
- `404` - Food not found

---

## Data Models

### User
```json
{
  "id": "integer",
  "fullname": "string",
  "email": "string (unique)",
  "password": "string (hashed)",
  "role": "string (user/admin)"
}
```

### Restaurant
```json
{
  "id": "integer",
  "name": "string",
  "address": "string",
  "imageUrl": "string",
  "category": "string",
  "rating": "decimal"
}
```

### Food
```json
{
  "id": "integer",
  "name": "string",
  "description": "string",
  "imageUrl": "string",
  "category": "string",
  "restaurantId": "integer (foreign key)"
}
```

### RestaurantReview
```json
{
  "id": "integer",
  "rating": "integer (1-5)",
  "comment": "string",
  "restaurantId": "integer (foreign key)",
  "userId": "integer (foreign key)"
}
```

### Favorite
```json
{
  "id": "integer",
  "restaurantId": "integer (foreign key)",
  "userId": "integer (foreign key)"
}
```

---

## Middleware Features

### Authentication
- JWT token validation
- User session management

### Authorization
- Role-based access control (Admin/User)
- Resource-level permissions

### AI Content Moderation
- Automatic review content checking using Google Generative AI
- SARA (discrimination) detection
- Inappropriate content filtering
- Hate speech detection

### Error Handling
- Centralized error handling
- Consistent error response format
- Validation error handling

---

## External Integrations

### Google OAuth
- Google Sign-In integration
- Automatic user account creation

### Spoonacular API
- Nutrition information lookup
- Food database integration

### Google Generative AI
- Content moderation for reviews
- AI-powered text analysis

### Cloudinary Integration
- Image upload and storage
- Automatic image transformation (resize, optimize)
- Support for jpg, jpeg, png, gif formats
- File size limits: 5MB for restaurants/foods, 2MB for profiles
- Automatic cleanup on upload errors

---

## Image Upload Features

### Supported File Types
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)

### File Size Limits
- Restaurant images: 5MB maximum
- Food images: 5MB maximum
- Profile images: 2MB maximum

### Image Transformations
All uploaded images are automatically:
- Resized to maximum 500x500 pixels (maintains aspect ratio)
- Optimized for web delivery
- Stored in organized folders on Cloudinary

### Upload Process
1. Images are uploaded via multipart/form-data
2. Files are validated for type and size
3. Images are uploaded to Cloudinary with transformations
4. Cloudinary URL is stored in database
5. If any error occurs, uploaded files are automatically cleaned up

### Error Handling
- `400` - File too large
- `400` - Invalid file type (only images allowed)
- `500` - Upload service unavailable

---

## Testing
This API includes comprehensive test coverage with:
- Unit tests for all controllers
- Integration tests for authentication flow
- Error handling tests
- Middleware tests
- 86%+ code coverage

Run tests with:
```bash
npm test
```

---

## Environment Variables
```
NODE_ENV=development
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
SPOONACULAR_API_KEY=your_spoonacular_api_key
PORT=3000
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name
DB_HOST=localhost
DB_DIALECT=postgres
```
