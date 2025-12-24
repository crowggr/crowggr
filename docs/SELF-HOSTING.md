# Self-Hosting Guide

## Overview

better-blog can be self-hosted on any infrastructure. This guide covers Docker Compose deployment, which is the recommended approach.

## Requirements

- Docker & Docker Compose
- 1GB RAM minimum (2GB recommended)
- 10GB disk space

## Quick Start

### One-liner Install

```bash
curl -fsSL https://better.blog/install.sh | sh
```

This will:
1. Create a `better-blog` directory
2. Download `docker-compose.yml` and `.env.example`
3. Generate secure secrets
4. Start all services

### Manual Setup

```bash
# Clone the repository
git clone https://github.com/better-blog/better-blog
cd better-blog

# Copy environment file
cp .env.example .env

# Generate secrets (or set your own)
echo "BETTER_AUTH_SECRET=$(openssl rand -hex 32)" >> .env

# Start services
docker compose up -d
```

## Configuration

### Environment Variables

Create a `.env` file with the following:

```bash
# ===================
# Required
# ===================

# Database
DATABASE_URL=postgres://postgres:postgres@postgres:5432/better_blog

# Auth (generate with: openssl rand -hex 32)
BETTER_AUTH_SECRET=your-secret-here

# App URL
APP_URL=http://localhost:3000

# ===================
# Optional
# ===================

# OAuth Providers (optional)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# S3 Storage (uses MinIO by default)
S3_ENDPOINT=http://minio:9000
S3_BUCKET=better-blog
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_PUBLIC_URL=http://localhost:9000/better-blog

# Email (optional, uses console logging by default)
RESEND_API_KEY=
EMAIL_FROM=noreply@your-domain.com
```

### Docker Compose

```yaml
version: '3.8'

services:
  dashboard:
    image: ghcr.io/better-blog/dashboard:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://postgres:postgres@postgres:5432/better_blog
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - APP_URL=${APP_URL:-http://localhost:3000}
      - S3_ENDPOINT=http://minio:9000
      - S3_BUCKET=better-blog
      - S3_ACCESS_KEY=minioadmin
      - S3_SECRET_KEY=minioadmin
    depends_on:
      postgres:
        condition: service_healthy
      minio:
        condition: service_started
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: better_blog
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  minio_data:
```

## Deployment Options

### Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/better-blog)

1. Click the button above
2. Configure environment variables
3. Deploy

### Coolify

1. Add new service → Docker Compose
2. Paste the docker-compose.yml
3. Set environment variables
4. Deploy

### Hetzner / VPS

```bash
# SSH into your server
ssh user@your-server

# Install Docker
curl -fsSL https://get.docker.com | sh

# Clone and start
git clone https://github.com/better-blog/better-blog
cd better-blog
cp .env.example .env
# Edit .env with your values
nano .env

# Start
docker compose up -d
```

### Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name blog.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL with Caddy

```
blog.yourdomain.com {
    reverse_proxy localhost:3000
}
```

## Backups

### Database

```bash
# Backup
docker exec better-blog-postgres-1 pg_dump -U postgres better_blog > backup.sql

# Restore
cat backup.sql | docker exec -i better-blog-postgres-1 psql -U postgres better_blog
```

### Media Files

```bash
# Backup MinIO data
docker cp better-blog-minio-1:/data ./minio-backup

# Or use MinIO client
mc alias set local http://localhost:9000 minioadmin minioadmin
mc mirror local/better-blog ./media-backup
```

## Upgrading

```bash
# Pull latest images
docker compose pull

# Restart with new images
docker compose up -d

# Migrations run automatically on startup
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker compose logs dashboard

# Check database connection
docker compose exec dashboard bun db:studio
```

### Database connection issues

```bash
# Verify postgres is running
docker compose ps postgres

# Check postgres logs
docker compose logs postgres
```

### Storage issues

```bash
# Verify MinIO is accessible
curl http://localhost:9000/minio/health/live

# Check MinIO logs
docker compose logs minio
```

## Production Checklist

- [ ] Set strong `BETTER_AUTH_SECRET`
- [ ] Configure real S3 bucket (or keep MinIO with proper credentials)
- [ ] Set up SSL/TLS (use Caddy or nginx + Let's Encrypt)
- [ ] Configure backups (database + media)
- [ ] Set up monitoring (optional)
- [ ] Configure email provider (Resend) for password reset
