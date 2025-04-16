### Microsoft Azure

#### Using Azure Container Instances

1. **Push your Docker image to Azure Container Registry**
2. **Deploy using Azure CLI**:
   ```bash
   az container create \
     --resource-group your-resource-group \
     --name ai-presentation-generator \
     --image your-acr.azurecr.io/ai-presentation-generator:latest \
     --dns-name-label ai-presentation-generator \
     --ports 8000 \
     --environment-variables ENVIRONMENT=production LOG_LEVEL=WARNING
   ```

#### Using Azure App Service

1. Push your Docker image to Azure Container Registry
2. Create an App Service with Docker configuration
3. Point it to your container image
4. Configure environment variables in the App Service settings

## Environment Variable Management

For production deployments, properly managing environment variables and secrets is crucial.

### Using Secret Management Services

Instead of storing API keys directly in `.env` files, use your cloud provider's secret management service:

#### AWS Parameter Store / Secrets Manager

1. Store secrets in AWS Parameter Store or Secrets Manager
2. Reference them in your ECS Task Definition:
   ```json
   "environment": [
     {
       "name": "OPENAI_API_KEY",
       "valueFrom": "arn:aws:ssm:your-region:your-account-id:parameter/presentation-ai/openai-key"
     }
   ]
   ```

#### Azure Key Vault

1. Store secrets in Azure Key Vault
2. Access them in your application using the Azure Key Vault SDK

### Environment-Specific Configuration

Create different environment configurations:

```
config/
  ├── .env.development
  ├── .env.staging
  ├── .env.production
```

Key differences for production:

```dotenv
# Production settings
DEBUG=false
LOG_LEVEL=WARNING
CACHE_ENABLED=true
RATE_LIMIT_ENABLED=true
API_HOST=0.0.0.0
API_PORT=8000
WORKERS=4
TIMEOUT=120
```

## Scaling Considerations

The AI Backend component can be scaled in several ways:

### Horizontal Scaling

Running multiple instances of the service behind a load balancer. This works well because the service is stateless (except for file storage which is handled by Supabase).

Configure your container orchestration platform to scale based on:
- CPU usage (typically 70-80%)
- Memory usage (typically 70-80%)
- Request throughput

Example with Kubernetes HPA:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ai-presentation-generator-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ai-presentation-generator
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 75
```

### Vertical Scaling

Increase resources for a single instance:

- CPU: Start with 1 vCPU, increase to 2-4 vCPU if needed
- Memory: Start with 2GB, increase to 4-8GB for handling more concurrent requests
- Workers: Set `WORKERS` to match the number of CPU cores

### Queue-Based Processing

For high-throughput environments, implement a queue-based architecture:

1. API service accepts requests and places them on a queue (RabbitMQ, SQS, etc.)
2. Worker processes consume from the queue and process requests
3. Results are stored in a database or storage service
4. Clients poll for results or receive callbacks when processing is complete

This pattern is especially useful for handling image generation, which is resource-intensive and time-consuming.

## Monitoring and Alerting

Set up monitoring for your deployed service:

### Metrics to Track

- API response times (p95, p99)
- Error rates
- CPU and memory usage
- Request queue length
- LLM token consumption (for cost management)
- Image generation counts

### Monitoring Solutions

- AWS: CloudWatch
- GCP: Cloud Monitoring
- Azure: Azure Monitor
- General: Prometheus + Grafana

### Health Checks

Configure health checks for your service:

```
http://your-service-url/health
```

This endpoint should return information about:
- Service status
- API provider connectivity
- Storage service connectivity

## Deployment Checklist

Before deploying to production, ensure you've completed these steps:

1. **Security**:
   - ✅ API keys and secrets are properly secured
   - ✅ Debug mode is disabled
   - ✅ Appropriate logging level is set
   - ✅ CORS settings are configured for your frontend domains

2. **Performance**:
   - ✅ Cache is enabled for appropriate endpoints
   - ✅ Rate limiting is configured
   - ✅ Worker count is optimized for your server
   - ✅ Request timeouts are set appropriately

3. **Reliability**:
   - ✅ Health check endpoint is configured
   - ✅ Monitoring is set up
   - ✅ Restart policy is configured for container failures
   - ✅ Backup API providers are configured (if possible)

4. **Scalability**:
   - ✅ Auto-scaling is configured
   - ✅ Load balancing is set up (if multiple instances)
   - ✅ Database connections are properly managed

5. **Maintenance**:
   - ✅ Logging is set up for debugging
   - ✅ Deployment scripts or CI/CD is configured
   - ✅ Version control tags are used for releases 