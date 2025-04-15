# AI Services Deployment Guide

This guide provides instructions for deploying the AI Services component in production environments.

## Docker Deployment

Docker is the recommended way to deploy the AI Services component, as it provides a consistent and isolated environment.

### Prerequisites

- Docker installed on your deployment machine or server
- Docker Compose (recommended for managing multi-container deployments)
- API keys for the necessary services (see [Getting Started](./getting-started.md))

### Building the Docker Image

1. **Navigate to the AI Services directory**:
   ```bash
   cd PresentationGenerator/ai-services
   ```

2. **Build the Docker image**:
   ```bash
   docker build -t presentation-ai-service .
   ```

   This uses the included Dockerfile which:
   - Uses Python 3.10 as the base
   - Installs all dependencies
   - Sets up the application
   - Configures the server

### Running with Docker

#### Using Docker Command

```bash
docker run -d \
  --name ai-services \
  -p 8000:8000 \
  --env-file .env \
  presentation-ai-service
```

#### Using Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3'

services:
  ai-services:
    build: ./ai-services
    container_name: presentation-ai-service
    ports:
      - "8000:8000"
    restart: unless-stopped
    env_file:
      - ./ai-services/.env
    volumes:
      - ./ai-services/static:/app/static
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s
```

Then run:

```bash
docker-compose up -d
```

### Configuring for Production

For production deployments, modify your `.env` file:

```dotenv
# Production settings
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=WARNING
WORKERS=4  # Number of Uvicorn workers
```

## Cloud Deployment Options

The AI Services component can be deployed to various cloud providers. Here are instructions for the most common options.

### AWS Deployment

#### Using AWS ECS (Elastic Container Service)

1. **Push your Docker image to Amazon ECR**:
   ```bash
   # Authenticate Docker to your ECR registry
   aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account-id.dkr.ecr.your-region.amazonaws.com
   
   # Tag your image for ECR
   docker tag presentation-ai-service:latest your-account-id.dkr.ecr.your-region.amazonaws.com/presentation-ai-service:latest
   
   # Push to ECR
   docker push your-account-id.dkr.ecr.your-region.amazonaws.com/presentation-ai-service:latest
   ```

2. **Create an ECS cluster** in the AWS console or using AWS CLI

3. **Define a Task Definition** that:
   - Uses your ECR image
   - Maps port 8000
   - Sets environment variables or references AWS Parameter Store for secrets

4. **Create an ECS Service** to run your container
   - Set up the number of tasks (containers) to run
   - Configure auto-scaling if needed
   - Add a load balancer if running multiple instances

5. **Set up an Application Load Balancer** to route traffic to your service

#### Using AWS App Runner

For a simpler deployment option:

1. Go to AWS App Runner in the AWS console
2. Create a new service using your ECR image
3. Configure environment variables in the console
4. Use automatic scaling based on request load

### Google Cloud Platform (GCP)

#### Using Google Cloud Run

1. **Push your Docker image to Google Container Registry**:
   ```bash
   # Configure Docker to use the gcloud command-line tool
   gcloud auth configure-docker
   
   # Tag your image for GCR
   docker tag presentation-ai-service:latest gcr.io/your-project-id/presentation-ai-service:latest
   
   # Push to GCR
   docker push gcr.io/your-project-id/presentation-ai-service:latest
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy presentation-ai-service \
     --image gcr.io/your-project-id/presentation-ai-service:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --memory 1Gi \
     --cpu 1 \
     --set-env-vars="ENVIRONMENT=production,LOG_LEVEL=WARNING"
   ```

3. Cloud Run will provide a URL to access your service

#### Using Google Kubernetes Engine (GKE)

For more complex deployments requiring more control:

1. Create a GKE cluster
2. Deploy your container using Kubernetes manifests or Helm charts
3. Configure environment variables using Kubernetes Secrets
4. Set up autoscaling with HorizontalPodAutoscaler

### Microsoft Azure

#### Using Azure Container Instances

1. **Push your Docker image to Azure Container Registry**
2. **Deploy using Azure CLI**:
   ```bash
   az container create \
     --resource-group your-resource-group \
     --name presentation-ai-service \
     --image your-acr.azurecr.io/presentation-ai-service:latest \
     --dns-name-label presentation-ai-service \
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

#### Google Secret Manager

1. Store secrets in Google Secret Manager
2. Mount them in Cloud Run:
   ```bash
   gcloud run deploy presentation-ai-service \
     --image gcr.io/your-project-id/presentation-ai-service:latest \
     --set-secrets="OPENAI_API_KEY=openai-key:latest"
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

The AI Services component can be scaled in several ways:

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
  name: presentation-ai-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: presentation-ai-service
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