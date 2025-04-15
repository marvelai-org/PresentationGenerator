# Troubleshooting Guide

This guide provides solutions for common issues with the AI Services component, debugging techniques, performance optimization tips, and logging configuration.

## Common Errors and Solutions

### API Authentication Errors

#### Error: "Authentication failed: Invalid API key"

**Causes**:
- Missing or incorrect API key in `.env` file
- Expired API key
- API key doesn't have required permissions

**Solutions**:
1. Verify that the API key is correctly set in your `.env` file
2. Check the API key format (no extra spaces or characters)
3. Generate a new API key from the provider's dashboard
4. Ensure the key has proper permissions (e.g., text generation, image generation)

```dotenv
# Example of correctly formatted API keys
OPENAI_API_KEY=sk-abcdefghijklmnopqrstuvwxyz123456
GOOGLE_API_KEY=AIza1234567890abcdefghijklmnopqrstuvwxyz
```

#### Error: "Quota exceeded for API key"

**Causes**:
- Usage limit reached for the current billing period
- Rate limit exceeded (too many requests in a short period)

**Solutions**:
1. Check your usage on the provider's dashboard
2. Upgrade your API plan if necessary
3. Implement rate limiting in your code (see Performance Optimization below)
4. Switch to an alternative provider temporarily

### FastAPI Server Issues

#### Error: "Address already in use"

**Causes**:
- Another process is using the specified port
- Previous instance of the server wasn't properly shut down

**Solutions**:
1. Change the port in your `.env` file:
   ```dotenv
   API_PORT=8001  # Change from default 8000
   ```

2. Find and terminate the process using the port:
   ```bash
   # Find process using port 8000
   lsof -i :8000
   
   # Kill the process
   kill -9 <PID>
   ```

### Module-Specific Errors

#### Outline Generator

**Error**: "Empty or invalid response from LLM"

**Causes**:
- Poorly formatted prompt
- Topic too vague or complex
- LLM provider issue

**Solutions**:
1. Check that your topic is specific and clear
2. Verify LLM provider status
3. Try with a different LLM provider
4. Adjust the temperature setting to a lower value (e.g., 0.2) for more consistent output

#### Slide Generator

**Error**: "Error generating content for slide: timeout"

**Causes**:
- Complex slide requiring too much processing time
- Network issues
- LLM provider performance problems

**Solutions**:
1. Reduce batch size to process fewer slides simultaneously
2. Increase timeout duration in configuration
3. Simplify slide titles or break into smaller topics
4. Check network connectivity

#### Image Generator

**Error**: "Failed to upload image to storage: bucket not found"

**Causes**:
- Supabase storage not configured correctly
- Storage bucket doesn't exist
- Permissions issue with Supabase service key

**Solutions**:
1. Follow the [Supabase Storage Setup](../supabase/storage-setup.md) guide
2. Verify the bucket exists and is public
3. Check RLS policies on the bucket
4. Validate your Supabase credentials

**Error**: "Invalid prompt for image generation"

**Causes**:
- Prompt contains content that violates provider's content policy
- Prompt is too vague or complex

**Solutions**:
1. Review slide content for potentially inappropriate terms
2. Make prompts more specific and descriptive
3. Add additional context about the desired image style

## Debugging Techniques

### Enabling Debug Mode

Set the `DEBUG` environment variable to `true` to enable detailed logging:

```dotenv
DEBUG=true
```

This will:
- Print detailed error messages
- Log request/response data
- Show prompt templates being used
- Display model parameter settings

### Using the Debug Endpoint

The service provides a debug endpoint to check configuration and status:

```bash
curl http://localhost:8000/debug
```

This returns information about:
- Loaded environment variables (with sensitive values redacted)
- Available API providers
- Current configuration settings
- Service status

### Step-by-Step Request Tracing

For complex issues, enable step-by-step tracing:

```dotenv
TRACE_REQUESTS=true
```

This will output a numbered sequence of steps for each request, making it easier to identify where a failure occurs.

### Testing Individual Components

You can test individual modules directly from the Python shell:

```python
# Test the outline generator module in isolation
from ai_services.modules.outline_generator.core import executor as outline_executor

result = outline_executor(
    topic="Artificial Intelligence in Healthcare",
    n_slides=5,
    instructional_level="intermediate",
    verbose=True
)
print(result)
```

### Examining LLM Prompts

To see the exact prompts being sent to the LLM:

```dotenv
LOG_PROMPTS=true
```

This is valuable for:
- Debugging unexpected output
- Refining prompt templates
- Understanding how context influences generation

## Performance Optimization Tips

### Batch Processing

The Slide Generator processes slides in batches to improve efficiency. You can optimize this:

```dotenv
# Configure batch processing
SLIDE_GENERATOR_BATCH_SIZE=3  # Number of slides to process simultaneously
SLIDE_GENERATOR_CONCURRENT=true  # Run batches in parallel
```

For large presentations, consider reducing batch size if you encounter timeouts.

### Caching Frequently Used Content

Enable the caching system to avoid redundant API calls:

```dotenv
ENABLE_CACHE=true
CACHE_EXPIRATION=3600  # in seconds (1 hour)
```

This is particularly effective for:
- Common outline topics
- Similar slide content requests
- Frequently generated images

### Rate Limiting Configuration

To avoid hitting API rate limits:

```dotenv
# Rate limiting configuration
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=60  # Number of requests
RATE_LIMIT_PERIOD=60  # Period in seconds (1 minute)
```

These settings apply to client API requests. For model provider rate limiting:

```dotenv
# Provider-specific rate limiting
PROVIDER_RATE_LIMIT_ENABLED=true
OPENAI_RATE_LIMIT_RPM=60  # Requests per minute for OpenAI
GOOGLE_RATE_LIMIT_RPM=60  # Requests per minute for Google
```

### Request Prioritization

For high-volume deployments, enable request prioritization:

```dotenv
REQUEST_PRIORITY_ENABLED=true
```

This ensures that:
- Outline generation (fast) is processed before image generation (slow)
- Smaller batches are processed before larger ones
- Critical requests can be flagged for priority processing

### Optimizing Image Generation

Image generation is typically the most resource-intensive operation:

1. **Reduce Image Quality for Drafts**:
   ```dotenv
   IMAGE_QUALITY=standard  # Options: low, standard, high
   ```

2. **Optimize Image Size**:
   ```dotenv
   IMAGE_SIZE=512x512  # Smaller than default 1024x1024
   ```

3. **Enable Progressive Loading**:
   ```dotenv
   PROGRESSIVE_LOADING=true  # Generate low-res previews first
   ```

## Logging Configuration

### Log Levels

Control the verbosity of logs with the `LOG_LEVEL` environment variable:

```dotenv
LOG_LEVEL=INFO  # Options: DEBUG, INFO, WARNING, ERROR, CRITICAL
```

Recommended levels for different environments:
- Development: `DEBUG`
- Testing: `INFO`
- Production: `WARNING`

### Log Formatting

Customize log format with these environment variables:

```dotenv
LOG_FORMAT=detailed  # Options: simple, detailed, json
LOG_TIMESTAMP=true
```

Example formats:
- `simple`: `INFO: Message here`
- `detailed`: `2023-07-15 14:30:45 INFO [outline_generator.core]: Message here`
- `json`: `{"timestamp": "2023-07-15T14:30:45", "level": "INFO", "module": "outline_generator.core", "message": "Message here"}`

### Log Output Destinations

Configure where logs are sent:

```dotenv
# Log to file
LOG_TO_FILE=true
LOG_FILE=./logs/ai-services.log
LOG_ROTATION=true
LOG_MAX_SIZE=10485760  # 10MB

# Log to stdout/stderr
LOG_TO_STDOUT=true

# Log to external service (optional)
LOG_TO_SERVICE=false
LOG_SERVICE_URL=https://your-logging-service.com/ingest
```

### Module-Specific Logging

Enable detailed logging for specific modules:

```dotenv
# Enable debug logs only for specific modules
OUTLINE_GENERATOR_LOG_LEVEL=DEBUG
SLIDE_GENERATOR_LOG_LEVEL=INFO
IMAGE_GENERATOR_LOG_LEVEL=DEBUG
```

### Request/Response Logging

For API request/response logging:

```dotenv
LOG_REQUESTS=true
LOG_RESPONSES=true
# Don't log sensitive data
LOG_SANITIZE=true
```

With `LOG_SANITIZE=true`, sensitive information like API keys will be redacted from logs.

## Monitoring Tools

The service includes built-in monitoring:

### Health Check Endpoint

```bash
curl http://localhost:8000/health
```

Returns service health metrics:
- API status
- Provider availability
- Response times
- Error rates

### Prometheus Metrics

Enable Prometheus metrics for detailed monitoring:

```dotenv
ENABLE_METRICS=true
```

Access metrics at:
```
http://localhost:8000/metrics
```

Key metrics include:
- Request count by endpoint
- Request duration
- Error count
- LLM token usage
- Cache hit/miss ratio

## Getting Additional Help

If you're still facing issues:

1. Check the [GitHub Issues](https://github.com/your-org/PresentationGenerator/issues) for similar problems
2. Review the [API Documentation](./api-reference.md) for endpoint details
3. Consult the specific module documentation:
   - [Outline Generator](./modules/outline-generator.md)
   - [Slide Generator](./modules/slide-generator.md)
   - [Image Generator](./modules/image-generator.md)
4. Enable detailed logging and provide the logs when seeking help 