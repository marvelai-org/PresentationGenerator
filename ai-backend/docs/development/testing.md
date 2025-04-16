# Testing Guide

This document provides a comprehensive guide to testing in the AI Backend component of the Presentation Generator.

## Test Structure

The test suite is organized into the following directories:

```
tests/
├── api/              # API endpoint tests
├── integration/      # Integration tests
├── __init__.py       # Package marker
└── conftest.py       # Pytest fixtures and configuration
```

## Running Tests

### Prerequisites

- Ensure you have the development dependencies installed:
  ```bash
  poetry install --with dev
  ```

### Basic Test Commands

```bash
# Run all tests
poetry run pytest

# Run specific test module
poetry run pytest tests/api/test_outline_api.py

# Run tests with a specific marker
poetry run pytest -m "not slow"

# Run tests with coverage report
poetry run pytest --cov=src/ai_backend

# Generate HTML coverage report
poetry run pytest --cov=src/ai_backend --cov-report=html
```

## Writing Tests

### Unit Tests

Unit tests should focus on testing individual functions and classes in isolation. Use mocks for external dependencies.

Example unit test:

```python
import pytest
from ai_backend.modules.outline_generator.core import executor

def test_outline_generator_returns_correct_number_of_slides():
    # Arrange
    topic = "Test Topic"
    n_slides = 5
    
    # Act
    result = executor(topic=topic, n_slides=n_slides, verbose=False)
    
    # Assert
    assert len(result["outlines"]) == n_slides
```

### API Tests

API tests should verify that the HTTP endpoints function correctly. Use FastAPI's TestClient for this.

Example API test:

```python
from fastapi.testclient import TestClient
from ai_backend.main import app

client = TestClient(app)

def test_generate_outline_endpoint():
    # Arrange
    request_data = {
        "topic": "Test Topic",
        "n_slides": 5,
        "instructional_level": "beginner"
    }
    
    # Act
    response = client.post("/generate/outline", json=request_data)
    
    # Assert
    assert response.status_code == 200
    assert "outlines" in response.json()
    assert len(response.json()["outlines"]) == 5
```

### Integration Tests

Integration tests should test how different components work together. They may involve external dependencies.

Example integration test:

```python
import pytest
from ai_backend.modules.outline_generator.core import executor
from ai_backend.modules.slide_generator.core import executor as slide_executor

@pytest.mark.integration
def test_outline_to_slides_integration():
    # Generate outline
    outline_result = executor(topic="AI Basics", n_slides=3)
    
    # Use outline to generate slides
    slides_result = slide_executor(
        slides_titles=outline_result["outlines"],
        topic="AI Basics"
    )
    
    # Verify integration
    assert len(slides_result["slides"]) == 3
    for i, slide in enumerate(slides_result["slides"]):
        assert slide["title"] == outline_result["outlines"][i]
```

## Mocking External Services

When testing components that rely on external services (like OpenRouter or Together.ai), use mocks to avoid making actual API calls.

Example using pytest's monkeypatch:

```python
def test_image_generation_with_mocked_api(monkeypatch):
    # Define mock response
    def mock_generate_image(*args, **kwargs):
        return {"url": "https://example.com/fake-image.png"}
    
    # Apply mock to the API client
    monkeypatch.setattr(
        "ai_backend.modules.image_generator.tools.TogetherClient.generate_image",
        mock_generate_image
    )
    
    # Test with the mock
    from ai_backend.modules.image_generator.core import executor
    result = executor(slides=[{"title": "Test", "content": "Test content"}])
    
    # Verify the mock was used
    assert result["slides"][0]["image_url"] == "https://example.com/fake-image.png"
```

## Test Fixtures

Common test fixtures are defined in `conftest.py`:

```python
import pytest
from fastapi.testclient import TestClient
from ai_backend.main import app

@pytest.fixture
def client():
    """Return a TestClient instance for API testing"""
    return TestClient(app)

@pytest.fixture
def sample_outline():
    """Return a sample outline for testing"""
    return ["Title 1", "Title 2", "Title 3"]

@pytest.fixture
def sample_slides():
    """Return sample slides for testing"""
    return [
        {"title": "Title 1", "content": "Content 1"},
        {"title": "Title 2", "content": "Content 2"},
        {"title": "Title 3", "content": "Content 3"}
    ]
```

## Running Tests in CI/CD

The test suite is configured to run automatically in CI/CD pipelines. The workflow is defined in `.github/workflows/test.yml`.

Key features:
- Tests run on pushes to main and pull requests
- Coverage reports are generated and uploaded as artifacts
- Test results are published to the GitHub interface

## Performance Testing

For performance-sensitive components, use the `@pytest.mark.benchmark` decorator:

```python
import pytest

@pytest.mark.benchmark
def test_outline_generation_performance(benchmark):
    result = benchmark(
        lambda: executor(topic="Simple topic", n_slides=5)
    )
    assert len(result["outlines"]) == 5
```

## Best Practices

1. **Test Independence**: Each test should be independent and not rely on the state of other tests
2. **Appropriate Mocking**: Mock external dependencies but be careful not to mock the system under test
3. **Coverage**: Aim for high test coverage, especially for critical paths
4. **Test Documentation**: Include docstrings in test functions to explain what is being tested
5. **Assertions**: Make assertions specific and include meaningful error messages
6. **Test Edge Cases**: Include tests for error conditions and edge cases 