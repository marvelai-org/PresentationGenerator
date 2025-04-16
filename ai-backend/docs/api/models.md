# Model Configuration

This document explains how to configure and customize the AI models used in the AI Backend component of the Presentation Generator.

## Switching Between LLM Providers

The AI Services are designed to work with multiple Large Language Model (LLM) providers. You can switch between them based on your needs, budget, or performance requirements.

### Available Providers

1. **OpenAI API**
   - Models: GPT-4, GPT-3.5-Turbo
   - Best for: High-quality content generation, complex reasoning
   - Configuration: Set `OPENAI_API_KEY` in your `.env` file

2. **OpenRouter**
   - Models: Access to multiple providers' models through a single API
   - Best for: Experimenting with different models or using specific models
   - Configuration: Set `OPENROUTER_API_KEY` and `OPENROUTER_TEXT_MODEL` in your `.env` file

3. **Together.ai**
   - Models: Various open models including Llama, Mixtral, and more
   - Best for: Cost-effective solution with good quality
   - Configuration: Set `TOGETHER_API_KEY` in your `.env` file

### How to Switch Providers

The service automatically selects the provider based on the available API keys in your `.env` file:

1. **Priority Order**: 
   - OpenAI (if `OPENAI_API_KEY` is set)
   - OpenRouter (if `OPENROUTER_API_KEY` is set)
   - Together.ai (if `TOGETHER_API_KEY` is set)

2. **Explicit Selection**:
   If you have multiple API keys configured but want to force the use of a specific provider, you can:

   - Set the `DEFAULT_LLM_PROVIDER` environment variable:
     ```
     DEFAULT_LLM_PROVIDER=together
     ```
     
   - Valid values are: `openai`, `together`, `openrouter`

### Provider-Specific Configuration

#### OpenAI

```dotenv
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o  # Optional, defaults to "gpt-4"
OPENAI_TEMPERATURE=0.7  # Optional, defaults to 0.7
```

#### OpenRouter

```dotenv
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_TEXT_MODEL=meta-llama/llama-4-maverick:free  # Optional
OPENROUTER_TEMPERATURE=0.7  # Optional, defaults to 0.7
```

#### Together.ai

```dotenv
TOGETHER_API_KEY=your_together_api_key_here
TOGETHER_MODEL=mistralai/mixtral-8x7b-instruct-v0.1  # Optional
TOGETHER_TEMPERATURE=0.7  # Optional, defaults to 0.7
```

## Fine-Tuning Parameters and Their Effects

You can adjust various parameters to control the behavior of the language models.

### Temperature

Controls randomness in the model's outputs:

```dotenv
OPENAI_TEMPERATURE=0.7  # Range: 0.0 - 1.0
```

- **Lower values** (e.g., 0.2): More deterministic, focused responses
  - Best for: Factual content, structured outlines, technical material
  - Effect: More consistent outputs, less creative but more reliable
  
- **Higher values** (e.g., 0.8): More creative, diverse responses
  - Best for: Creative content, brainstorming, varied suggestions
  - Effect: More variety between runs, potentially less focused

### Max Tokens

Controls the maximum length of the generated response:

```dotenv
OPENAI_MAX_TOKENS=2048
```

- **Lower values**: Shorter, more concise responses
  - Saves on API costs but may truncate content
  - Consider for outline generation or simple content
  
- **Higher values**: Allows for longer, more detailed responses
  - Necessary for detailed slide content generation
  - Increases API costs proportionally

### Top-P (Nucleus Sampling)

Controls diversity by limiting token selection to the top P probability mass:

```dotenv
OPENAI_TOP_P=0.95  # Range: 0.0 - 1.0
```

- Lower values (e.g., 0.5): More focused on likely tokens
- Higher values (e.g., 0.95): Considers a wider range of tokens

### Frequency Penalty

Reduces repetition by penalizing tokens based on their frequency:

```dotenv
OPENAI_FREQUENCY_PENALTY=0.5  # Range: -2.0 to 2.0
```

- Positive values: Reduces repetition of the same phrases
- Negative values: Encourages repetition (rarely useful)

### Presence Penalty

Reduces repetition by penalizing tokens that have appeared at all:

```dotenv
OPENAI_PRESENCE_PENALTY=0.5  # Range: -2.0 to 2.0
```

- Positive values: Encourages the model to talk about new topics
- Negative values: Encourages the model to repeat previously mentioned topics

## Best Practices for Prompt Engineering

Effective prompt engineering is crucial for getting optimal results from the LLMs.

### General Principles

1. **Be Specific and Clear**
   - Example (poor): "Make a presentation about AI"
   - Example (better): "Create a 7-slide presentation about artificial intelligence fundamentals for undergraduate computer science students"

2. **Provide Context and Examples**
   - Include relevant information about the audience, purpose, and desired style
   - Show example formats if you want a specific structure

3. **Use System Prompts for Setting Tone**
   - System prompts define the AI's role and behavior
   - Example: "You are an expert in educational content creation, specializing in clear, concise explanations suitable for beginner audiences."

### Module-Specific Prompt Techniques

#### Outline Generator

1. **Topic Framing**
   ```
   Create a comprehensive outline for a presentation on {topic} that would be suitable for a {instructional_level} audience. The presentation should have {n_slides} slides.
   ```

2. **Structure Guidance**
   ```
   Follow a logical progression: introduction → fundamentals → specific examples → applications → challenges → future directions → conclusion
   ```

3. **Custom Parameters in Prompts**
   ```python
   # In outline_generator/tools.py
   
   def _build_prompt(self, topic, n_slides, instructional_level, **kwargs):
       prompt = f"Create a presentation outline on '{topic}' with {n_slides} slides for a {instructional_level} audience."
       
       # Add custom focus areas if specified
       if "focus_areas" in kwargs:
           prompt += f" Focus especially on: {', '.join(kwargs['focus_areas'])}."
           
       # Add style guidance if specified
       if "style" in kwargs:
           prompt += f" The presentation style should be {kwargs['style']}."
           
       return prompt
   ```

#### Slide Generator

1. **Content Structuring**
   ```
   For each slide, generate content that includes:
   1. A brief introduction paragraph (2-3 sentences)
   2. 3-5 bullet points with key information
   3. A concluding thought or transition to the next slide
   4. Speaker notes with additional context
   ```

2. **Contextual Awareness**
   ```python
   # In slide_generator/tools.py
   
   # Provide previous and next slide titles for continuity
   slide_context = f"""
   This slide titled "{slide_title}" is part of a presentation on "{topic}".
   
   Previous slide: "{prev_slide_title if prev_slide_title else 'None (this is the first slide)'}"
   Next slide: "{next_slide_title if next_slide_title else 'None (this is the last slide)'}"
   
   Create comprehensive content for this slide that maintains flow with adjacent slides.
   """
   ```

#### Image Generator

1. **Visual Description Prompts**
   ```
   Create a professional, photorealistic image for a presentation slide titled "{title}". The image should:
   - Illustrate the concept of {main_concept}
   - Use a clean, minimalist style with neutral background
   - Be appropriate for a business/educational context
   - Avoid text overlays (text will be added separately)
   ```

2. **Style Consistency**
   ```python
   # In image_generator/tools.py
   
   # Define a consistent style for all images
   style_guidance = """
   Style guidelines:
   - Consistent color palette using blues and grays
   - Abstract or conceptual representation rather than literal
   - Professional, clean aesthetic suitable for business presentation
   - 16:9 aspect ratio optimized for presentation slides
   """
   ```

### Customizing Prompts in Configuration

You can customize default prompts by setting environment variables:

```dotenv
# Custom prompt templates
OUTLINE_GENERATOR_PROMPT_TEMPLATE="Generate an outline for a presentation on {topic} with {n_slides} slides for {instructional_level} audience. Structure it in a logical sequence."

SLIDE_GENERATOR_PROMPT_TEMPLATE="Create detailed content for a slide titled '{title}' in a presentation about {topic}. Include a brief introduction, 3-5 key bullet points, and suitable speaker notes."

IMAGE_GENERATOR_PROMPT_TEMPLATE="Generate a professional image that represents '{title}' for a business presentation. Use a minimalist style with a clean background."
```

## Model Selection Guidelines

Which model to use for which purpose:

| Task | Recommended Model | Alternative | Notes |
|------|------------------|-------------|-------|
| Outline Generation | GPT-4 | Mixtral 8x7B | Needs strong reasoning for structure |
| Slide Content | GPT-3.5-Turbo | Llama 3 70B | Balance of cost and quality |
| Image Generation | Together.ai FLUX | DALL-E 3 | Professional-looking images |

## Advanced Configuration

### Custom Model Hub

For teams with specific model preferences, you can define a model hub configuration:

```python
# In config/models.py

MODEL_HUB = {
    "outline_generation": {
        "default": "openai:gpt-4",
        "high_quality": "openai:gpt-4",
        "balanced": "together:mistralai/mixtral-8x7b-instruct-v0.1",
        "cost_effective": "together:mistralai/mixtral-8x7b-instruct-v0.1"
    },
    "slide_generation": {
        "default": "openai:gpt-3.5-turbo",
        "high_quality": "openai:gpt-4",
        "balanced": "together:meta-llama/llama-3-70b-instruct",
        "cost_effective": "together:meta-llama/llama-3-70b-instruct"
    }
}
```

Then use it in your environment:

```dotenv
OUTLINE_GENERATION_MODEL_PRESET=high_quality
SLIDE_GENERATION_MODEL_PRESET=balanced
``` 