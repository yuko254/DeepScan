# REST Routes Documentation

## Base URL

http://localhost:3000

## Authentication

Most endpoints require authentication via JWT token. Include the token in cookies (automatically set on login/register) or in the Authorization header:

Authorization: Bearer <access_token>

---

## Auth Endpoints

### Register

POST /auth/register

Request Body:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword",
  "stayLoggedIn": false
}

Response (201):
{
  "user": {
    "user_id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "role": {
      role_id: "3",
      role_name: "user"
    },
  },
  "tokens": {
    "access_token": "jwt_token",
    "refresh_token": "jwt_token"
  }
}

### Login

POST /auth/login

Request Body:
{
  "email": "john@example.com",
  "password": "securepassword",
  "stayLoggedIn": false
}

OR using username:
{
  "username": "john_doe",
  "password": "securepassword",
  "stayLoggedIn": false
}

Response (200): Same as Register

### Refresh Token

POST /auth/refresh

Request (Cookie): refresh_token cookie
OR
Request Body:
{
  "refresh_token": "jwt_token"
}

Response (200):
{
  "access_token": "new_jwt_token",
  "refresh_token": "new_jwt_token"
}

### Logout

POST /auth/logout

Response (200):
{
  "message": "Logged out successfully"
}

### Forgot Password

POST /auth/forgot-password

Request Body:
{
  "email": "john@example.com"
}

Response (200):
{
  "message": "If that email exists, a reset link has been sent"
}

### Reset Password

POST /auth/reset-password

Request Body:
{
  "email": "john@example.com",
  "token": "1234abcd",
  "new_password": "newsecurepassword"
}

Response (200):
{
  "message": "Password reset successfully"
}

---

## User Endpoints

### Get Current User Account

GET /users/me

Response (200):
{
  "user_id": "uuid",
  "username": "john_doe",
  "email": "john@example.com",
  "role": {
    role_id: "3",
    role_name: "user"
  },
}

### Update Current User Account

PATCH /users/me

Request Body:
{
  "username": "new_username",
  "email": "newemail@example.com"
}

Response (200): Same as Get Current User

### Delete Account

DELETE /users/me

Request Body:
{
  "email": "john@example.com",
  "password": "securepassword"
}

Response (204): No Content

### Change Password

PATCH /users/me/change-password

Request Body:
{
  "oldPass": "oldpassword",
  "newPass": "newpassword"
}

Response (200):
{
  "message": "Password changed successfully"
}

---

## Upload Endpoints

### Upload Single File

POST /uploads/single

Content-Type: multipart/form-data

Request Body:

- file: File (image or video, max 50MB)

Response (200):
{
  "success": true,
  "data": {
    "media_id": "uuid",
    "url": "http://localhost:9000/myapp-media/users/{userId}/{filename}",
    "key": "users/{userId}/{filename}",
    "size": 123456,
    "mimetype": "image/jpeg"
  }
}

### Upload Multiple Files

POST /uploads/multiple

Content-Type: multipart/form-data

Request Body:

- files: File[] (max 10 files, 50MB each)

Response (200):
{
  "success": true,
  "data": [
    {
      "media_id": "uuid",
      "url": "http://localhost:9000/myapp-media/users/{userId}/{filename}",
      "key": "users/{userId}/{filename}",
      "size": 123456,
      "mimetype": "image/jpeg"
    }
  ]
}

### Delete File

DELETE /uploads/{key}

Response (200):
{
  "success": true
}

---

## Admin Endpoints (Requires Admin or moderator Role)

### Get Users List

GET /admin/users?page=1&limit=20&search=abc&role=user&isActive=true&isBanned=true

Query Parameters:

- page: number (default: 1)
- limit: number (default: 20)
- search: string (search by username or email)
- role: string (filter by role)
- isActive: boolean (filter by active status)
- isBanned: boolean (filter by banned status)

Response (200):
{
  "users": [
    {
      "user_id": "uuid",
      "username": "john_doe",
      "email": "john@example.com",
      "role": {
        "role_id": 3,
        "role_name": "user",
      }
      "is_active": true,
      "is_banned": false,
      "created_at": "2026-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}

### Get Single User (Admin)

GET /admin/users/{user_id}

Response (200): 
{
  "user_id": "uuid",
  "username": "john_doe",
  "email": "john@example.com",
  "role": {
    "role_id": 3,
    "role_name": "user",
  }
  "is_active": true,
  "is_banned": false,
  "created_at": "2026-01-01T00:00:00Z"
  "profile": {
    "profile_id": UUID,
    "is_private": boolean,
    "bio": "hello world",
    "avatar": URL,
    "first_name": "Doe",
    "last_name": "Hello world"
    "phone_number": "1123"
    "birth_date": "2026-01-01T00:00:00Z"
    "created_at": "2026-01-01T00:00:00Z"
    "birth_location_details": {
      "location_id": "1123"
      "lat": "1123"
      "lng": "1123"
      "place_id": "1123"
      "city": {
        "city_id": "1123"
        "name": "1123"
        "country_id": "1123"
      }
      "country": {
        "country_id": "1123"
        "name": "1123"
      }
    }
    "current_location_details": {
      "location_id": "1123"
      "lat": "1123"
      "lng": "1123"
      "place_id": "1123"
      "city": {
        "city_id": "1123"
        "name": "1123"
        "country_id": "1123"
      }
      "country": {
        "country_id": "1123"
        "name": "1123"
      }
    }
  }
}

### Create User (Admin)

POST /admin/users

Request Body:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "123"
  "role_id": 3,
  "profile": {
    "is_private": boolean,
    "bio": "hello world",
    "avatar": URL,
    "first_name": "Doe",
    "last_name": "Hello world"
    "phone_number": "1123"
    "birth_date": "2026-01-01T00:00:00Z"
    "created_at": "2026-01-01T00:00:00Z"
    "birth_location": {
      "lat": "1123"
      "lng": "1123"
      "place_id": "1123"
      "city_id": "1123"
      "country_id": "1123"
    }
    "current_location": {
      "lat": "1123"
      "lng": "1123"
      "place_id": "1123"
      "city_id": "1123"
      "country_id": "1123"
    }
  }
}

Response (200): Created user object

### Update User (Admin)

PATCH /admin/users/{user_id}

Request Body:
{
  "username": "updated_name",
  "email": "updated@example.com",
  "role_id": 2,
  "is_active": false,
  "is_banned": true,
  "profile": {
    "is_private": boolean,
    "bio": "hello world",
    "avatar": URL,
    "first_name": "Doe",
    "last_name": "Hello world"
    "phone_number": "1123"
    "birth_date": "2026-01-01T00:00:00Z"
    "created_at": "2026-01-01T00:00:00Z"
    "birth_location": {
      "location_id": "1123"
      "lat": "1123"
      "lng": "1123"
      "place_id": "1123"
      "city_id": "1123"
      "country_id": "1123"
    }
    "current_location": {
      "location_id": "1123"
      "lat": "1123"
      "lng": "1123"
      "place_id": "1123"
      "city_id": "1123"
      "country_id": "1123"
    }
  }
}

Response (200): Updated user object

### Delete User (Admin)

DELETE /admin/users/{user_id}

Response (204): No Content

### Get Reports List

GET /admin/reports?page=1&limit=20&status=pending&reporter=uuid&resolver=uuid&reported=uuid

Response (200):
{
  "reports": [
    {
      "report_id": "uuid",
      "reason": "Spam",
      "status": "pending",
      "created_at": "2026-01-01T00:00:00Z",
      "reporter": {
        "user_id": "uuid",
        "username": "reporter"
      },
      "reported": {
        "type": "post",
        "id": "uuid"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}

### Resolve Report

PATCH /admin/reports/{report_id}

Request Body:
{
  "status": "resolved"
}

Status options: pending, reviewed, resolved, dismissed

Response (200): Updated report object

### Get Report Stats

GET /admin/reports/stats

Response (200):
{
  "pending": 10,
  "reviewed": 5,
  "resolved": 20,
  "dismissed": 3
}

### Get App Stats

GET /admin/stats/overview

Response (200):
{
  "users": 1000,
  "posts": 5000,
  "comments": 10000,
  "stories": 200,
  "reports": {
    "pending": 10,
    "reviewed": 5,
    "resolved": 20,
    "dismissed": 3
  }
}

### Delete Post (Admin)

DELETE /admin/posts/{post_id}

Response (204): No Content

### Delete Comment (Admin)

DELETE /admin/comments/{comment_id}

Response (204): No Content

### Delete Story (Admin)

DELETE /admin/stories/{story_id}

Response (204): No Content

---

## Error Responses

### Validation Error (400)

### Unauthorized (401)

### Forbidden (403)