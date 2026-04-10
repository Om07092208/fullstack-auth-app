# Full Stack Auth App

## Folder Structure

```text
fullstack-auth-app/
  frontend/
  backend/
  docker-compose.yml
  .github/workflows/deploy.yml
```

## Local Setup

```powershell
cd C:\Users\omtiwari\Documents\fullstack-auth-app
Copy-Item .\backend\.env.example .\backend\.env
Copy-Item .\frontend\.env.example .\frontend\.env
```

Update `backend/.env` with your MongoDB Atlas connection string and JWT secret.

## Run Without Docker

```powershell
cd C:\Users\omtiwari\Documents\fullstack-auth-app\backend
npm install
npm start
```

```powershell
cd C:\Users\omtiwari\Documents\fullstack-auth-app\frontend
npm install
npm run dev
```

## Build and Run with Docker Compose

```powershell
cd C:\Users\omtiwari\Documents\fullstack-auth-app
docker compose build
docker compose up -d
docker compose ps
```

## GitHub Secrets

Add these in `Settings -> Secrets and variables -> Actions`:

- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

