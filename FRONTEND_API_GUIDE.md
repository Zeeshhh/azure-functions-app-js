# Scalable Video Sharing API – Frontend Integration Guide

## Authentication
- **Signup:** `POST /api/auth/signup` with `{ username, password }` returns a JWT token.
- **Login:** `POST /api/auth/login` with `{ username, password }` returns a JWT token.
- Store the JWT in localStorage or memory. Send it as `Authorization: Bearer <token>` in all protected requests.

## Endpoints

### 1. List Videos
- **GET /api/videos**
- Returns: Array of videos
- Example response:
```json
[
  {
    "id": 1,
    "title": "Sample Video",
    "description": "A test video",
    "thumbnailUrl": "https://...",
    "createdAt": "2025-08-29T00:00:00Z"
  }
]
```

### 2. Register Video (Authenticated)
- **POST /api/videos**
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{
  "title": "Sample Video",
  "description": "A test video",
  "videoUrl": "https://...",
  "thumbnailUrl": "https://..."
}
```
- Returns: `201 Registered` or error

### 3. Generate Upload URL (Authenticated)
- **POST /api/videos/uploadUrl**
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{
  "filename": "video.mp4"
}
```
- Returns: `{ "uploadUrl": "..." }`

### 4. Get Video Details
- **GET /api/videos/{id}**
- Returns: Video object

### 5. List Comments
- **GET /api/videos/{id}/comments**
- Returns: Array of comments

### 6. Add Comment (Authenticated)
- **POST /api/videos/{id}/comments**
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{
  "text": "Nice video!"
}
```
- Returns: `201 Created` or error

## CORS
- All endpoints support CORS. Use standard AJAX/fetch/XHR from the frontend.

## Error Handling
- 401 Unauthorized: Login required or invalid token
- 400 Bad Request: Missing/invalid fields
- 500: Server/database error

## Notes
- Always check for JWT expiry and handle 401 errors by redirecting to login.
- Use the Postman collection (`video-sharing-api.postman_collection.json`) for testing.
- For file uploads, use the SAS URL from `/api/videos/uploadUrl` with a PUT request (see Azure Blob Storage docs).
