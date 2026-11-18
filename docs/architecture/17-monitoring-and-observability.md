# 17. Monitoring and Observability

### Monitoring Stack

- **Frontend Monitoring:** Vercel Analytics (Core Web Vitals, performance)
- **Backend Monitoring:** AWS CloudWatch (ECS metrics, custom metrics)
- **Error Tracking:** Sentry (frontend + backend, source maps, release tracking)
- **Logging:** Pino (JSON estruturado) → CloudWatch Logs

### Key Metrics

**Frontend:** Core Web Vitals (LCP, FID, CLS), JS errors, API latency, page views por rota
**Backend:** Request rate, error rate (5xx), P95 latency, DB query time, cache hit rate, active policies, daily quotes
