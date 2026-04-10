# Deployment Guide

## 1. Local Project Setup

```powershell
cd C:\Users\omtiwari\Documents\fullstack-auth-app
Copy-Item .\backend\.env.example .\backend\.env
Copy-Item .\frontend\.env.example .\frontend\.env
```

Edit `backend/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://YOUR_ATLAS_USERNAME:YOUR_ATLAS_PASSWORD@YOUR_CLUSTER_URL/authdb?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=use_a_long_random_secret_here
```

## 2. Run Locally

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

Open `http://localhost:3000`

## 3. Docker Build and Run

```powershell
cd C:\Users\omtiwari\Documents\fullstack-auth-app
docker compose build
docker compose up -d
docker compose ps
```

## 4. Docker Hub Push (manual)

```powershell
$env:DOCKER_USERNAME="yourdockerhubusername"
docker login -u $env:DOCKER_USERNAME
docker build -t "$env:DOCKER_USERNAME/fullstack-auth-frontend:latest" .\frontend
docker build -t "$env:DOCKER_USERNAME/fullstack-auth-backend:latest" .\backend
docker push "$env:DOCKER_USERNAME/fullstack-auth-frontend:latest"
docker push "$env:DOCKER_USERNAME/fullstack-auth-backend:latest"
```

## 5. GitHub Secrets

Set repository secrets:

- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

## 6. EC2 Setup

SSH into Ubuntu EC2:

```bash
ssh -i /path/to/key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

Install Docker and Compose:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
newgrp docker
```

Create deployment files:

```bash
mkdir -p ~/fullstack-auth-app
cd ~/fullstack-auth-app
cat > backend.env <<'EOF'
PORT=5000
CLIENT_URL=http://YOUR_ALB_DNS_NAME
MONGODB_URI=mongodb+srv://YOUR_ATLAS_USERNAME:YOUR_ATLAS_PASSWORD@YOUR_CLUSTER_URL/authdb?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=use_a_long_random_secret_here
EOF
```

```bash
cat > docker-compose.ec2.yml <<'EOF'
services:
  backend:
    image: YOUR_DOCKER_USERNAME/fullstack-auth-backend:latest
    container_name: auth-backend
    env_file:
      - ./backend.env
    ports:
      - "5000:5000"
    restart: unless-stopped

  frontend:
    image: YOUR_DOCKER_USERNAME/fullstack-auth-frontend:latest
    container_name: auth-frontend
    depends_on:
      - backend
    ports:
      - "3000:3000"
    restart: unless-stopped
EOF
```

Run containers:

```bash
docker compose -f docker-compose.ec2.yml pull
docker compose -f docker-compose.ec2.yml up -d
docker compose -f docker-compose.ec2.yml ps
```

## 7. ALB Setup

1. Create Target Group
   - Target type: `Instances`
   - Protocol: `HTTP`
   - Port: `3000`
   - Health check path: `/`
2. Register your EC2 instance in the target group.
3. Create an Application Load Balancer
   - Scheme: `Internet-facing`
   - Listener: `HTTP:80`
   - Availability Zones: select your VPC subnets
4. Attach the target group to listener port `80`.

## 8. Security Group Rules

- Inbound `22` from your IP
- Inbound `80` from `0.0.0.0/0`
- Inbound `3000` from ALB security group if you want direct health/debug access
- Inbound `5000` from EC2 or ALB security group only if direct backend access is needed

## 9. Test

1. Open `http://YOUR_ALB_DNS_NAME`
2. Register a new user
3. Log out
4. Log back in with the same credentials
