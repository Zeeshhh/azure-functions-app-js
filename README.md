# Scalable Video Sharing – Azure Functions (JavaScript)

This is a JavaScript port of the Azure Functions app you provided (originally in Java).

## Functions & Routes
* `GET /api/videos` — List videos
* `GET /api/videos/{id}` — Get video details
* `POST /api/auth/signup` — Create user and returns JWT
* `POST /api/auth/login` — Login and returns JWT
* `POST /api/videos/uploadUrl` — Generate a SAS upload URL for blob storage
* `POST /api/videos` — Register a video (JWT required)
* `GET/POST /api/videos/{id}/comments` — List/add comments (POST needs JWT)

## Quick start
1. Install Azure Functions Core Tools v4 and Node 18+.
2. Run `npm install`.
3. Copy `local.settings.sample.json` to `local.settings.json` and fill in your secrets.
4. Start Azurite for local storage (or set a real storage connection string).
5. `npm start` to run the functions.

## Notes
- Passwords are hashed with SHA-256 to match the original Java implementation.
- SQL is written for Microsoft SQL Server using the `mssql` client.
- CORS is permissive by default (`ALLOWED_ORIGINS=*`). Set a stricter value in production.

