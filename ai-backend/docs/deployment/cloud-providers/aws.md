### AWS Deployment

#### Using AWS ECS (Elastic Container Service)

1. **Push your Docker image to Amazon ECR**:
   ```bash
   # Authenticate Docker to your ECR registry
   aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account-id.dkr.ecr.your-region.amazonaws.com
   
   # Tag your image for ECR
   docker tag ai-presentation-generator:latest your-account-id.dkr.ecr.your-region.amazonaws.com/ai-presentation-generator:latest
   
   # Push to ECR
   docker push your-account-id.dkr.ecr.your-region.amazonaws.com/ai-presentation-generator:latest
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

