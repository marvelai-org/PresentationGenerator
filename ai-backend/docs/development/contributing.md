# Contributing to AI Backend

This guide explains how to contribute to the AI Backend component of the Presentation Generator project.

## Code Organization

The AI Backend component follows a modular architecture to maintain separation of concerns and make the codebase easier to maintain and extend.

### Directory Structure

```
ai-backend/
├── src/                 # Source package
│   └── ai_backend/     # Main package
│       ├── modules/     # Internal module references
│       │   ├── outline_generator/
│       │   │   ├── core.py
│       │   │   ├── tools.py
│       │   │   └── __init__.py
│       │   ├── slide_generator/
│       │   │   ├── core.py
│       │   │   ├── tools.py
│       │   │   └── __init__.py
│       │   └── image_generator/
│       │       ├── core.py
│       │       ├── tools.py
│       │       └── __init__.py
│       ├── utils/       # Utility functions
│       │   ├── logging.py
│       │   ├── storage.py
│       │   └── __init__.py
│       ├── __init__.py
│       ├── __main__.py  # Command-line entry point
│       └── main.py      # FastAPI application definition
├── tests/               # Test suite
│   ├── unit/
│   │   ├── test_outline_generator.py
│   │   ├── test_slide_generator.py
│   │   └── test_image_generator.py
│   ├── integration/
│   │   └── test_api.py
│   └── conftest.py
├── static/              # Static files and media storage
├── app.py               # Wrapper script for backward compatibility
├── pyproject.toml       # Project definition and dependencies
├── .env.example         # Example environment configuration
└── README.md            # Project documentation
```

### Module Design Pattern

Each functional module follows the same design pattern:

1. **core.py**: Contains the main entry point function (usually called `executor`) that handles the public API of the module
2. **tools.py**: Contains the implementation details, typically in class format
3. **__init__.py**: Exports the public API of the module

Example for the Outline Generator module:

```python
# core.py - Public API
def executor(topic, n_slides, instructional_level="intermediate", **kwargs):
    """Generates a presentation outline based on the given topic."""
    generator = OutlineGenerator()
    return generator.generate(topic, n_slides, instructional_level, **kwargs)

# tools.py - Implementation details
class OutlineGenerator:
    def generate(self, topic, n_slides, instructional_level, **kwargs):
        # Implementation details
        pass
```

### API Design

The REST API is defined in `main.py` using FastAPI:

```python
@app.post("/generate/outline")
async def generate_outline(request: OutlineRequest):
    """Generate a presentation outline."""
    result = outline_generator.executor(
        topic=request.topic,
        n_slides=request.n_slides,
        instructional_level=request.instructional_level,
    )
    return result
```

## Development Workflow

### Setting Up Development Environment

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/PresentationGenerator.git
   cd PresentationGenerator
   ```

2. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set up environment**:
   ```bash
   cd ai-backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -e .
   ```

4. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file to add any necessary API keys.

### Development Process

1. **Local Development Server**:
   ```bash
   python app.py
   ```
   This will start a development server at http://localhost:8000.

2. **Code Changes**:
   - Make your changes to the codebase
   - Follow the existing coding style and patterns
   - Add appropriate docstrings and type hints

3. **Testing Your Changes**:
   - Add unit tests for new functionality
   - Run tests to ensure existing functionality isn't broken

4. **Documentation**:
   - Update or add documentation for your changes
   - Include examples if adding new features

### Coding Standards

Please follow these coding standards when contributing:

1. **PEP 8** for Python code style
2. **Type Hints** for function signatures
3. **Docstrings** for all public functions and classes
4. **Absolute Imports** for consistency (`from ai_backend.utils import` rather than relative imports)

Example of proper function definition:

```python
def generate_outline(
    topic: str, 
    n_slides: int, 
    instructional_level: str = "intermediate"
) -> dict:
    """
    Generate a presentation outline based on the given topic.
    
    Args:
        topic: The main topic of the presentation
        n_slides: Number of slides to generate
        instructional_level: Complexity level (beginner, intermediate, advanced)
        
    Returns:
        A dictionary containing the outline with the "outlines" key
        mapping to a list of slide titles.
        
    Raises:
        ValueError: If the topic is empty or n_slides is less than 1
    """
    # Implementation
    return {"outlines": [...]}
```

## Testing Procedures

The AI Services component uses pytest for testing. Tests are organized into unit tests and integration tests.

### Running Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/unit/test_outline_generator.py

# Run tests with coverage report
pytest --cov=ai_backend
```

### Writing Tests

1. **Unit Tests**:
   - Focus on testing individual functions and classes
   - Use mocks for external dependencies (e.g., LLM APIs)
   - Place in `tests/unit/` directory

   Example unit test:
   ```python
   # tests/unit/test_outline_generator.py
   from ai_backend.modules.outline_generator.core import executor
   import pytest
   
   def test_executor_returns_correct_structure():
       # Arrange
       topic = "Artificial Intelligence"
       n_slides = 5
       
       # Act
       result = executor(topic, n_slides, mock_llm=True)
       
       # Assert
       assert "outlines" in result
       assert isinstance(result["outlines"], list)
       assert len(result["outlines"]) == n_slides
   ```

2. **Integration Tests**:
   - Test API endpoints and module interactions
   - Use FastAPI TestClient for API testing
   - Place in `tests/integration/` directory

   Example integration test:
   ```python
   # tests/integration/test_api.py
   from fastapi.testclient import TestClient
   from ai_backend.main import app
   
   client = TestClient(app)
   
   def test_generate_outline_api():
       response = client.post(
           "/generate/outline",
           json={"topic": "AI Basics", "n_slides": 5, "instructional_level": "beginner"}
       )
       assert response.status_code == 200
       data = response.json()
       assert "outlines" in data
       assert len(data["outlines"]) == 5
   ```

### Test Fixtures

Common test fixtures are defined in `tests/conftest.py`:

```python
# tests/conftest.py
import pytest
from unittest.mock import MagicMock

@pytest.fixture
def mock_llm_response():
    """Fixture that returns a mock LLM response."""
    return {
        "choices": [
            {
                "message": {
                    "content": "1. Introduction to AI\n2. Machine Learning Basics\n3. Neural Networks\n4. AI Applications\n5. Future of AI"
                }
            }
        ]
    }

@pytest.fixture
def mock_llm_client(mock_llm_response):
    """Fixture that returns a mock LLM client."""
    client = MagicMock()
    client.chat.completions.create.return_value = mock_llm_response
    return client
```

## Pull Request Guidelines

When submitting a Pull Request (PR), please follow these guidelines to ensure a smooth review process:

### PR Process

1. **Create a branch** with a descriptive name:
   - For features: `feature/short-feature-description`
   - For bugfixes: `fix/short-bug-description`
   - For documentation: `docs/short-description`

2. **Make your changes** in this branch:
   - Keep changes focused on a single goal
   - Break large changes into smaller, logical PRs
   - Ensure all tests pass

3. **Submit your PR** against the `main` branch:
   - Fill out the PR template completely
   - Reference any related issues
   - Provide a clear description of changes

### PR Checklist

Before submitting your PR, ensure:

- [ ] Code follows the project's coding standards
- [ ] All tests pass (`pytest`)
- [ ] New code has appropriate tests
- [ ] Documentation is updated
- [ ] Type hints are included where appropriate
- [ ] Commits are clean and have descriptive messages

### PR Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, a maintainer will merge your PR

### PR Description Template

```
## Description
[Description of the changes]

## Related Issue
Fixes #[issue number]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing Performed
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Screenshots (if applicable)

## Checklist
- [ ] Code follows coding standards
- [ ] Tests added/updated for changes
- [ ] Documentation updated
- [ ] Type hints added
```

## Getting Help

If you need help while contributing:

1. Check the existing documentation
2. Look through the codebase to understand patterns
3. Reach out to maintainers through the issue tracker
4. Join the community discussions

Thank you for contributing to the AI Services component! 