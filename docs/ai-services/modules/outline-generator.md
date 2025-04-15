# Outline Generator Module

The Outline Generator is responsible for creating structured presentation outlines from topics. This module analyzes a given topic and produces an organized sequence of slide titles that form a coherent presentation structure.

## How It Works

1. The module receives a topic and parameters (number of slides, instructional level, language)
2. It constructs a prompt for the LLM that includes the topic and specific instructions
3. The LLM generates a logical structure for the presentation
4. The response is parsed and formatted as a list of slide titles
5. The titles are returned to the caller in a consistent format

## Configuration

The Outline Generator can be configured through environment variables:

- `OPENAI_API_KEY`: API key for OpenAI (if using OpenAI)
- `GOOGLE_API_KEY`: API key for Google Gemini (if using Gemini)
- `OPENROUTER_API_KEY`: API key for OpenRouter (if using OpenRouter)
- `OPENROUTER_TEXT_MODEL`: Model to use with OpenRouter (default: "meta-llama/llama-4-maverick:free")

## Usage

### Via API

```bash
curl -X POST http://localhost:8000/generate/outline \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Introduction to Artificial Intelligence",
    "n_slides": 8,
    "instructional_level": "intermediate",
    "lang": "en"
  }'
```

### Via Python Code

```python
from ai_services.modules.outline_generator.core import executor

result = executor(
    n_slides=8,
    topic="Introduction to Artificial Intelligence",
    instructional_level="intermediate",
    lang="en",
    verbose=True
)

print(result["outlines"])
```

## Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| topic | string | The main subject of the presentation | (required) |
| n_slides | int | Number of slides to generate | (required) |
| instructional_level | string | Complexity level: "beginner", "intermediate", or "advanced" | "intermediate" |
| file_url | string | URL to a reference document | None |
| file_type | string | Type of reference document | None |
| lang | string | Language code (e.g., "en", "es", "fr") | "en" |
| verbose | bool | Whether to output detailed logs | False |

## Response Format

The module returns a dictionary with an "outlines" key containing a list of slide titles:

```python
{
    "outlines": [
        "What is Artificial Intelligence?",
        "History of AI: From Past to Present",
        "Key Components of AI Systems",
        "Machine Learning Fundamentals",
        "Neural Networks and Deep Learning",
        "AI Applications in Various Industries",
        "Ethical Considerations in AI Development",
        "Future Trends in AI Technology"
    ]
}
```

## Architecture

The Outline Generator module consists of:

- `core.py`: Main functionality and entry point (`executor()` function)
- `tools.py`: Contains the `OutlineGenerator` class with generation logic
- `prompts/`: Directory containing prompt templates (if applicable)

## Customization

To customize the Outline Generator's behavior:

1. Modify the prompt templates in the OutlineGenerator class
2. Adjust the processing parameters in the executor function
3. Add additional input validation or post-processing

Example: Enhancing the prompt for technical topics:

```python
# In tools.py
if "technical" in kwargs.get("tags", []):
    prompt = self._get_technical_prompt(args)
else:
    prompt = self._get_standard_prompt(args)
```

## Troubleshooting

Common issues and solutions:

1. **Repetitive or generic outlines**:
   - Try specifying a more detailed topic
   - Adjust the instructional level
   - Pass a reference document for more context

2. **Errors with reference documents**:
   - Verify both `file_url` and `file_type` are provided
   - Ensure the file is accessible and in the correct format
   - Check logs for detailed error messages

3. **Inconsistent number of slides**:
   - The LLM may sometimes generate slightly more or fewer slides than requested
   - Post-process the results if exact number is critical 