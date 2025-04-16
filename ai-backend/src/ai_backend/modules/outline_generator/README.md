# Outline Generator Module

## Purpose
This module generates structured presentation outlines based on a given topic, creating a logical flow and organization for presentations.

## Features
- Creates coherent presentation outlines with appropriate slide titles
- Adapts outline complexity based on instructional level
- Supports content generation from reference materials
- Handles multi-language outline generation

## Usage
The module is primarily used through the `/generate/outline` API endpoint in the main application.

## Dependencies
- OpenRouter/LLaMA for text generation
- LangChain for prompt management and orchestration

## Directory Structure
- `core.py`: Main executor function and business logic
- `prompt_templates/`: Templates for outline generation prompts
- `utils.py`: Utility functions specific to outline processing 