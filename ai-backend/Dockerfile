FROM python:3.10-slim

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_NO_INTERACTION=1

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install --no-cache-dir poetry

# Copy pyproject.toml and poetry.lock (if exists)
COPY pyproject.toml poetry.lock* ./

# Install dependencies
RUN poetry install --no-root --without dev

# Copy application code
# Exclude any sensitive files (credentials, .env) from copy
COPY . .

# Create directory for credentials if needed
RUN mkdir -p /app/credentials

# Expose the port the app runs on
EXPOSE 8000

# IMPORTANT: When running the container, mount volumes or set environment variables:
# docker run -p 8000:8000 \
#   -e SUPABASE_SERVICE_KEY=your-supabase-key \
#   -e TOGETHER_API_KEY=your-together-key \
#   -e OPENROUTER_API_KEY=your-openrouter-key \
#   your-image-name

# Command to run the application
CMD ["poetry", "run", "start"]