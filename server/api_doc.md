# Dokumentasi API Restaurant Management

## Endpoint Autentikasi

### POST /register
Mendaftarkan pengguna baru.

**Request Body:**
```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response (201):**
```json
{
  "id": 1,
  "fullname": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

**Error Response:**
- **400 Bad Request**: Jika input tidak valid.
  ```json
  {
    "message": ["Fullname is required", "Email is required", "Password is required"]
  }
  ```
  ```json
  {
    "message": ["Invalid email format"]
  }
  ```
  ```json
  {
    "message": ["Email already exists"]
  }
  ```

---

### POST /login
Login pengguna dan mendapatkan access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
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

**Error Response:**
- **401 Unauthorized**: Jika email/password salah.
  ```json
  {
    "message": "Invalid email or password"
  }
  ```
- **400 Bad Request**: Jika email/password tidak diisi.
  ```json
  {
    "message": "Email is required"
  }
  ```
  ```json
  {
    "message": "Password is required"
  }
  ```

---

### POST /google-login
Login menggunakan Google OAuth token.

**Request Body:**
```json
{
  "googleToken": "google_oauth_token_here"
}
```

**Response (200/201):**
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

**Error Response:**
- **400 Bad Request**: Jika Google token tidak valid.
  ```json
  {
    "message": "Google Token is required"
  }
  ```

---

## Endpoint Restaurant

### GET /public/restaurants
Mendapatkan semua restaurant.

**Response (200):**
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

### GET /public/restaurants/:id
Mendapatkan detail restaurant berdasarkan ID.

**Parameters:**
- `id` (path parameter) - Restaurant ID

**Response (200):**
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

**Error Response:**
- **404 Not Found**: Jika restaurant tidak ditemukan.
  ```json
  {
    "message": "Restaurant not found"
  }
  ```

---

### GET /public/menu/nutrition
Mendapatkan informasi nutrisi untuk makanan tertentu menggunakan API eksternal.

**Query Parameters:**
- `name` (required) - Nama makanan

**Response (200):**
```json
{
  "calories": "250 kcal",
  "protein": "20g",
  "carbs": "15g",
  "fat": "12g"
}
```

**Error Response:**
- **400 Bad Request**: Jika parameter name tidak ada.
  ```json
  {
    "message": "Food name parameter is required"
  }
  ```
- **404 Not Found**: Jika makanan tidak ditemukan.
  ```json
  {
    "message": "Food not found"
  }
  ```

---

### POST /public/restaurants/:id/reviews
Menambahkan review untuk restaurant. Memerlukan autentikasi dan moderasi konten menggunakan AI.

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

**Response (201):**
```json
{
  "id": 1,
  "rating": 5,
  "comment": "Excellent food and service!",
  "restaurantId": 1,
  "userId": 1
}
```

**Error Response:**
- **400 Bad Request**: Jika rating atau comment tidak ada.
  ```json
  {
    "message": "Rating is required"
  }
  ```
  ```json
  {
    "message": "Comment is required"
  }
  ```
  ```json
  {
    "message": "Rating must be between 1 and 5"
  }
  ```
- **401 Unauthorized**: Jika tidak ada autentikasi.
  ```json
  {
    "message": "Invalid token"
  }
  ```
- **403 Forbidden**: Jika review mengandung konten tidak pantas.
  ```json
  {
    "message": "Review contains inappropriate content"
  }
  ```

---

## Endpoint Favorites

### GET /public/favorites
Mendapatkan daftar makanan favorit pengguna yang sudah login.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "Food": {
      "id": 1,
      "name": "Food Name",
      "description": "Food Description",
      "imageUrl": "https://example.com/food.jpg",
      "category": "Main Course",
      "Restaurant": {
        "id": 1,
        "name": "Restaurant Name",
        "address": "Restaurant Address",
        "imageUrl": "https://example.com/image.jpg",
        "category": "Indonesian"
      }
    }
  }
]
```

**Error Response:**
- **401 Unauthorized**: Jika tidak ada autentikasi.
  ```json
  {
    "message": "Invalid token"
  }
  ```

---

### POST /public/favorites
Menambahkan makanan ke favorites.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "foodId": 1
}
```

**Response (201):**
```json
{
  "id": 1,
  "foodId": 1,
  "userId": 1
}
```

**Error Response:**
- **400 Bad Request**: Jika foodId tidak ada.
  ```json
  {
    "message": "Food ID is required"
  }
  ```
- **401 Unauthorized**: Jika tidak ada autentikasi.
  ```json
  {
    "message": "Invalid token"
  }
  ```
- **404 Not Found**: Jika makanan tidak ditemukan.
  ```json
  {
    "message": "Food not found"
  }
  ```

---

### DELETE /public/favorites/:id
Menghapus makanan dari favorites.

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id` (path parameter) - Favorite ID

**Response (200):**
```json
{
  "message": "Favorite removed successfully"
}
```

**Error Response:**
- **401 Unauthorized**: Jika tidak ada autentikasi.
  ```json
  {
    "message": "Invalid token"
  }
  ```
- **404 Not Found**: Jika favorite tidak ditemukan.
  ```json
  {
    "message": "Favorite not found"
  }
  ```

---

## Endpoint CMS (Admin Only)

### GET /cms/restaurants
Mendapatkan semua restaurant untuk admin management.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
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

**Error Response:**
- **401 Unauthorized**: Jika tidak ada autentikasi.
  ```json
  {
    "message": "Invalid token"
  }
  ```
- **403 Forbidden**: Jika bukan admin.
  ```json
  {
    "message": "Forbidden access"
  }
  ```

---

### POST /cms/restaurants
Membuat restaurant baru dengan upload gambar opsional.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `name` (required) - Nama restaurant
- `address` (required) - Alamat restaurant  
- `category` (required) - Kategori restaurant
- `rating` (optional) - Rating restaurant (0-5)
- `image` (optional) - File gambar (jpg, jpeg, png, gif) - Max 5MB

**Response (201):**
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

**Error Response:**
- **400 Bad Request**: Jika validation error.
  ```json
  {
    "message": "Name is required"
  }
  ```
- **401 Unauthorized**: Jika tidak ada autentikasi.
- **403 Forbidden**: Jika bukan admin.

---

### GET /cms/restaurants/:id
Mendapatkan detail restaurant untuk admin management.

### PUT /cms/restaurants/:id  
Mengupdate informasi restaurant dengan upload gambar opsional.

### DELETE /cms/restaurants/:id
Menghapus restaurant.

### GET /cms/foods
Mendapatkan semua food items untuk admin management.

### POST /cms/foods
Membuat food item baru dengan upload gambar opsional.

### GET /cms/foods/:id
Mendapatkan detail food untuk admin management.

### PUT /cms/foods/:id
Mengupdate informasi food dengan upload gambar opsional.

### DELETE /cms/foods/:id
Menghapus food item.

---

## Response Error

### 401 Unauthorized
**Token tidak valid:**
```json
{
  "message": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "message": "Forbidden access"
}
```

### 404 Not Found
```json
{
  "message": "Restaurant not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```

---
