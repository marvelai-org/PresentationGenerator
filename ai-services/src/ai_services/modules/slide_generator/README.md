# Slide Generator Module

## Purpose
This module transforms outline titles into fully detailed slide content, generating the actual text and structure for each slide in a presentation.

## Features
- Produces comprehensive slide content from outline titles
- Generates appropriate bullet points, text sections, and examples
- Adjusts content depth based on instructional level
- Supports multi-language slide generation
- Ensures content coherence across slides

## Usage
The module is primarily used through the `/generate/slides` API endpoint in the main application.

## Dependencies
- OpenRouter/LLaMA or Google Gemini for text generation
- LangChain for prompt management and orchestration

## Directory Structure
- `core.py`: Main executor function and business logic
- `prompt_templates/`: Templates for slide content generation
- `utils.py`: Utility functions for content formatting and organization 