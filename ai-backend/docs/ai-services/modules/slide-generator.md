# Slide Generator Module

The Slide Generator module transforms outline titles into comprehensive slide content. It takes the titles from an outline and generates detailed, informative content appropriate for presentation slides.

## How It Works

1. The module receives a list of slide titles, the main topic, and parameters
2. For each title, it creates a prompt that includes the overall context and specific title
3. The LLM generates appropriate content, including bullet points and speaker notes
4. The response is parsed and structured into a consistent format
5. All slide content is returned to the caller

## Configuration

The Slide Generator can be configured through environment variables:

- `OPENAI_API_KEY`: API key for OpenAI (if using OpenAI)
- `GOOGLE_API_KEY`: API key for Google Gemini (if using Gemini)
- `OPENROUTER_API_KEY`: API key for OpenRouter (if using OpenRouter)
- `OPENROUTER_TEXT_MODEL`: Model to use with OpenRouter (default: "meta-llama/llama-4-maverick:free")

## Usage

### Via API

```bash
curl -X POST http://localhost:8000/generate/slides \
  -H "Content-Type: application/json" \
  -d '{
    "slides_titles": [
      "What is Artificial Intelligence?", 
      "History of AI: From Past to Present",
      "Key Components of AI Systems"
    ],
    "topic": "Introduction to Artificial Intelligence",
    "instructional_level": "intermediate",
    "lang": "en"
  }'
```

### Via Python Code

```python
from ai_services.modules.slide_generator.core import executor

result = executor(
    slides_titles=[
        "What is Artificial Intelligence?", 
        "History of AI: From Past to Present",
        "Key Components of AI Systems"
    ],
    topic="Introduction to Artificial Intelligence",
    instructional_level="intermediate",
    lang="en",
    verbose=True
)

print(result["slides"])
```

## Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| slides_titles | list[string] | List of slide titles | (required) |
| topic | string | The main subject of the presentation | (required) |
| instructional_level | string | Complexity level: "beginner", "intermediate", or "advanced" | "intermediate" |
| lang | string | Language code (e.g., "en", "es", "fr") | "en" |
| verbose | bool | Whether to output detailed logs | False |

## Response Format

The module returns a dictionary with a "slides" key containing a list of slide objects:

```python
{
    "slides": [
        {
            "title": "What is Artificial Intelligence?",
            "content": "Artificial Intelligence (AI) refers to systems or machines that mimic human intelligence to perform tasks and can iteratively improve themselves based on the information they collect.\n\n- AI systems analyze their environment and take actions to achieve specific goals\n- They process vast amounts of data to identify patterns and make predictions\n- AI combines computer science with robust datasets to enable problem-solving\n- Modern AI includes subfields like machine learning and deep learning",
            "notes": "When discussing this slide, emphasize that AI systems are not truly 'intelligent' in the human sense but simulate aspects of human cognition."
        },
        {
            "title": "History of AI: From Past to Present",
            "content": "The field of AI has evolved significantly since its inception in the mid-20th century.\n\n- 1950s: Alan Turing proposes the Turing Test; term 'Artificial Intelligence' coined at Dartmouth Conference (1956)\n- 1960s-70s: Early development of expert systems and rule-based programming\n- 1980s: Rise of machine learning algorithms\n- 1990s-2000s: Development of statistical methods and increased computing power\n- 2010s: Breakthrough in deep learning with neural networks\n- Present: Integration of AI in everyday technology and business applications",
            "notes": "This timeline shows how AI has evolved from theoretical concepts to practical applications across multiple industries."
        },
        {
            "title": "Key Components of AI Systems",
            "content": "Modern AI systems consist of several interconnected components:\n\n- Data Collection and Processing: The foundation of AI systems\n- Algorithms: Mathematical procedures that process input data\n- Training Methods: Supervised, unsupervised, and reinforcement learning\n- Feature Engineering: Selecting relevant data attributes\n- Model Evaluation: Testing accuracy and performance\n- Deployment Infrastructure: Hardware and software for implementation\n- Feedback Mechanisms: Systems to improve performance over time",
            "notes": "Highlight that the quality of data is often more important than the complexity of the algorithm for most AI applications."
        }
    ]
}
```

## Architecture

The Slide Generator module consists of:

- `core.py`: Main functionality and entry point (`executor()` function)
- `tools.py`: Contains the `SlideGenerator` class with content generation logic
- `prompts/`: Directory containing prompt templates (if applicable)

## Customization

To customize the Slide Generator's behavior:

1. Modify the prompt templates in the SlideGenerator class
2. Adjust the processing parameters in the executor function
3. Add specific formatting instructions for different types of content

Example: Adding custom formatting for code slides:

```python
# In tools.py
if "code" in slide_title.lower():
    prompt += "Format any code examples with proper syntax highlighting and comments."
```

## Batch Processing

For large presentations, the Slide Generator processes slides in parallel batches to improve performance and stay within API rate limits. This behavior can be customized by modifying the batch size in the executor function.

Default behavior:
- Batch size: 3 slides
- Concurrent processing: True
- Timeout: 60 seconds per batch

## Troubleshooting

Common issues and solutions:

1. **Content too long or too short**:
   - Adjust the prompt to specify desired length more clearly
   - Add post-processing to enforce length constraints
   - Consider splitting complex slides into multiple simpler ones

2. **Inconsistent formatting**:
   - Add more specific formatting instructions to the prompt
   - Implement post-processing to standardize output format
   - Create templates for different types of slides

3. **Rate limiting or timeout errors**:
   - Reduce batch size to process fewer slides concurrently
   - Increase timeout duration for complex topics
   - Implement exponential backoff for retries 