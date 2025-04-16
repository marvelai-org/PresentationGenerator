# Troubleshooting Guide

This guide helps you diagnose and resolve common issues with the AI Backend service.

## Diagnostic Tools

Before troubleshooting specific issues, use these diagnostic tools:

1. **Health Check Endpoint**:
   ```bash
   curl http://localhost:8000/v1/health
   ```
   Should return `{"status": "healthy", "version": "1.0.0"}`

2. **Container Status**:
   ```bash
   docker ps -a | grep ai-backend
   ```

3. **View Logs**:
   ```bash
   # For Docker deployments
   docker logs -f ai-backend

   # For Kubernetes deployments
   kubectl logs -f deployment/ai-backend

   # For systemd deployments
   journalctl -u ai-backend -f
   ```

4. **Check Configuration**:
   ```bash
   # Print current environment variables (sanitized)
   curl http://localhost:8000/v1/debug/config
   ```

## Common Issues

### Service Won't Start

#### Symptoms
- Docker container exits immediately
- Service fails to bind to port
- Error in logs about missing configuration

#### Solutions

1. **Port Conflict**:
   ```bash
   # Check if port is already in use
   lsof -i :8000
   # If in use, change the port in .env file
   echo "PORT=8001" >> .env
   ```

2. **Missing Environment Variables**:
   ```bash
   # Copy example environment file
   cp .env.example .env
   # Edit required variables
   nano .env
   ```

3. **Permission Issues**:
   ```bash
   # Fix permissions for mounted volumes
   sudo chown -R 1000:1000 ./static
   ```

### Authentication Failures

#### Symptoms
- 401 Unauthorized responses
- Error message about invalid API key
- JWT validation errors

#### Solutions

1. **Invalid API Key**:
   ```bash
   # Generate a new API key
   curl -X POST http://localhost:8000/v1/api-keys \
     -H "Authorization: Bearer admin-token" \
     -H "Content-Type: application/json" \
     -d '{"name": "Test Key", "role": "developer"}'
   ```

2. **JWT Token Issues**:
   - Check token expiration
   - Verify signing keys are consistent
   - Ensure clock synchronization between services

3. **CORS Issues**:
   ```bash
   # Add your frontend origin to allowed origins
   echo "ALLOWED_ORIGINS=http://localhost:3000,https://your-app.com" >> .env
   ```

### Outline Generation Issues

#### Symptoms
- Empty outlines returned
- Error about model unavailability
- Timeout during generation

#### Solutions

1. **LLM Provider Connectivity**:
   ```bash
   # Test connectivity to OpenRouter
   curl -I https://openrouter.ai/api/v1
   ```

2. **API Key Issues**:
   - Verify your OpenRouter API key is valid
   - Check usage quotas and limits
   - Ensure the key has proper permissions

3. **Prompt Engineering**:
   - For detailed logs about the prompt:
   ```bash
   curl http://localhost:8000/v1/debug/last-prompt?endpoint=outline
   ```

### Image Generation Failures

#### Symptoms
- Missing images in response
- Error about image generation
- "Storage error" messages

#### Solutions

1. **Together.ai Connectivity**:
   ```bash
   # Test connectivity to Together.ai
   curl -I https://api.together.xyz/v1/health
   ```

2. **Supabase Storage Issues**:
   ```bash
   # Test Supabase connectivity
   curl -I https://your-project-id.supabase.co/storage/v1/health
   
   # Check if bucket exists and is accessible
   curl -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
     https://your-project-id.supabase.co/storage/v1/bucket/$SUPABASE_STORAGE_BUCKET
   ```

3. **File Permission Issues**:
   ```bash
   # Ensure temporary directory is writable
   sudo chmod 777 /tmp/ai-backend
   ```

### Performance Problems

#### Symptoms
- Slow response times
- Timeouts during generation
- High CPU/memory usage

#### Solutions

1. **Resource Constraints**:
   ```bash
   # Increase container resources
   docker run -p 8000:8000 --memory=2g --cpus=2 ai-backend
   ```

2. **Concurrent Requests**:
   - Limit concurrent requests to the service
   - Implement client-side queuing for large workloads

3. **Caching Issues**:
   ```bash
   # Clear cache for specific endpoint
   curl -X POST http://localhost:8000/v1/debug/clear-cache?endpoint=outline
   ```

## Advanced Debugging

### Enable Debug Mode

```bash
# Set DEBUG environment variable
echo "DEBUG=true" >> .env
# Restart the service
docker-compose restart ai-backend
```

### Trace Requests

For detailed request tracing:

```bash
# Set trace header
curl -H "X-Trace-Enabled: true" http://localhost:8000/v1/generate/outline \
  -H "Content-Type: application/json" \
  -d '{"topic": "AI Ethics", "n_slides": 5}'
```

### Generate Support Bundle

```bash
# Generate diagnostics bundle
curl -X POST http://localhost:8000/v1/debug/support-bundle > support-bundle.zip
```

## Getting Help

If you're still experiencing issues:

1. Check the [GitHub issues](https://github.com/your-org/ai-backend/issues) for similar problems
2. Join our [Discord community](https://discord.gg/example)
3. Contact support at support@example.com with your support bundle

When reporting issues, please include:

- Service version
- Environment details (OS, Docker version, etc.)
- Steps to reproduce
- Error messages and logs
- Support bundle if available 