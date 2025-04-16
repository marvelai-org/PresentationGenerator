### Google Cloud Platform (GCP)

#### Using Google Cloud Run

1. **Push your Docker image to Google Container Registry**:
   ```bash
   # Configure Docker to use the gcloud command-line tool
   gcloud auth configure-docker
   
   # Tag your image for GCR
   docker tag ai-presentation-generator:latest gcr.io/your-project-id/ai-presentation-generator:latest
   
   # Push to GCR
   docker push gcr.io/your-project-id/ai-presentation-generator:latest
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy ai-presentation-generator \
     --image gcr.io/your-project-id/ai-presentation-generator:latest \
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

