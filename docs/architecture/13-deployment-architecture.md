# 13. Deployment Architecture

### Deployment Strategy

**Frontend Deployment:**
- **Platform:** Vercel
- **Build Command:** `npm run build --workspace=apps/web`
- **Output Directory:** `apps/web/.next`
- **CDN/Edge:** Vercel Edge Network (global, automatico)

**Backend Deployment:**
- **Platform:** AWS ECS Fargate
- **Build Command:** `docker build -f apps/api/Dockerfile .`
- **Deployment Method:** Docker container via ECR → ECS Fargate

### Environments

| Environment | Frontend URL | Backend URL | Purpose |
|-------------|-------------|-------------|---------|
| Development | http://localhost:3000 | http://localhost:3001 | Local development |
| Staging | https://staging.seg360.com.br | https://api-staging.seg360.com.br | Pre-production |
| Production | https://seg360.com.br | https://api.seg360.com.br | Live |

---
