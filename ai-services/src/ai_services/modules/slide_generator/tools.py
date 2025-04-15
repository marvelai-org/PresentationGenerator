"""
Utility tools for the slide generator module.
"""

import os
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Union, Any
import logging
from langchain_chroma import Chroma
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from langchain_core.output_parsers import JsonOutputParser
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# Import our custom LLM utility function
from ai_services.utils import get_llm

logger = logging.getLogger(__name__)

def load_slide_prompt():
    """
    Load the slide generator prompt template from file.
    
    Returns:
        str: The prompt template as a string
    """
    prompt_path = Path(__file__).parent / "prompts" / "slide_generator_prompt.txt"
    with open(prompt_path, "r") as f:
        return f.read()
        
class Slide(BaseModel):
    title: str = Field(..., description="The title of the slide")
    template: str = Field(..., description="The slide template type: sectionHeader, titleAndBody, titleAndBullets, twoColumn")
    content: Union[str, list, dict, Any] = Field(None, description="Content of the slide, can be string, list, dict, or any type")

class SlidePresentation(BaseModel):
    slides: List[Slide] = Field(..., description="The complete set of slides in the presentation")

class SlideGenerator:
    def __init__(self, args=None, vectorstore_class=Chroma, prompt=None, embedding_model=None, model=None, parser=None, verbose=False):
        # Get model using our utility function that supports OpenRouter
        self.model = model or get_llm(verbose=verbose)
        
        # Get API key for embeddings
        google_api_key = os.environ.get("GOOGLE_API_KEY")
        if not google_api_key:
            logger.error("GOOGLE_API_KEY environment variable not found")
            raise ValueError("GOOGLE_API_KEY not set in environment variables")
            
        default_config = {
            "embedding_model": GoogleGenerativeAIEmbeddings(model='models/embedding-001', google_api_key=google_api_key),
            "parser": JsonOutputParser(pydantic_object=SlidePresentation),
            "prompt": load_slide_prompt(),
            "vectorstore_class": Chroma
        }

        self.prompt = prompt or default_config["prompt"]
        self.parser = parser or default_config["parser"]
        self.embedding_model = embedding_model or default_config["embedding_model"]

        self.vectorstore_class = vectorstore_class or default_config["vectorstore_class"]
        self.vectorstore, self.retriever, self.runner = None, None, None
        self.args = args
        self.verbose = verbose

        if vectorstore_class is None: 
            raise ValueError("Vectorstore must be provided")
    
    def validate_slides_content(self, response, topic):
        """Validates that slide content matches the requested topic and level."""
        topic_keywords = set(topic.lower().split())
        topic_coverage = 0
        garbage_coverage = 0
        template_requirements_met = False
        slides = response["slides"]
        try:
            if len(slides) == 0:
                raise ValueError("No slides found in the response")
            for slide in slides:
                slide_text = ""
                if slide["template"] == "twoColumn":
                    template_requirements_met = True
                    
                if isinstance(slide["content"], list):
                    slide_text = ' '.join(slide["content"])
                elif isinstance(slide["content"], dict):
                    slide_text = ' '.join(str(value) for value in slide["content"].values())
                else:
                    slide_text = str(slide["content"])
                # Check for topic keywords in the slide text
                if any(keyword in slide_text.lower() for keyword in topic_keywords):
                    topic_coverage += 1
            
                # Check for Markdown remnants or excessive newlines
                if any(char in slide_text for char in ['*', '\n', '`', '_']):
                    garbage_coverage += 1
        
            coverage_percentage = (topic_coverage / len(slides)) * 100
            garbage_coverage_percentage = (garbage_coverage / len(slides)) * 100
        
            return {
                "topic_coverage": coverage_percentage,
                "template_requirements_met": template_requirements_met,
                "garbage_coverage_percentage": garbage_coverage_percentage,
                "valid": coverage_percentage > 70 and template_requirements_met and garbage_coverage_percentage == 0
            }
            
        except ValueError as e:
            raise ValueError(e)

    def compile_context(self):
        # Return the chain
        prompt = PromptTemplate(
            template=self.prompt,
            input_variables=["instructional_level", "topic", "slides_titles"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()}
        )
        chain = prompt | self.model | self.parser

        logger.info("Chain compilation complete")

        return chain

    def generate_slides(self):
        logger.info("Creating the Outlines for the Presentation") 
        chain = self.compile_context() 

        input_parameters = {
            "instructional_level": self.args.instructional_level,
            "topic": self.args.topic,
            "slides_titles": self.args.slides_titles,
            "lang": self.args.lang
        }
        logger.info(f"Input parameters: {input_parameters}")

        try:
            response = chain.invoke(input_parameters)
            
            # Ensure response is properly formatted
            if not isinstance(response, dict):
                logger.error(f"Expected dict response, got {type(response)}")
                response = {"slides": []}
                
            if "slides" not in response:
                logger.error("Response missing 'slides' key")
                response = {"slides": []}
                
            # Sanitize response to ensure it's serializable
            sanitized_response = {"slides": []}
            for slide in response.get("slides", []):
                # Create a clean slide object
                clean_slide = {
                    "title": str(slide.get("title", "")),
                    "template": str(slide.get("template", "titleAndBody")),
                }
                
                # Handle content based on type
                content = slide.get("content")
                if isinstance(content, list):
                    # Ensure all list items are strings
                    clean_slide["content"] = [str(item) for item in content]
                elif isinstance(content, dict):
                    # Ensure all dict values are strings
                    clean_slide["content"] = {k: str(v) for k, v in content.items()}
                else:
                    # Convert to string if not list or dict
                    clean_slide["content"] = str(content) if content is not None else ""
                    
                sanitized_response["slides"].append(clean_slide)
            
            logger.info(f"Generated response: {sanitized_response}")
            
            # Add validation metrics
            validation_results = self.validate_slides_content(response=sanitized_response, topic=self.args.topic)
            logger.info(f"Response validation: {validation_results}")
            
            if not validation_results["valid"]:
                logger.warning("Generated content may not fully match the requested topic")
                
            return sanitized_response
            
        except Exception as e:
            logger.error(f"Error generating slides: {str(e)}")
            # Return a minimal valid response structure
            return {"slides": [
                {
                    "title": f"Error generating slides: {str(e)}",
                    "template": "titleAndBody",
                    "content": "Please try again with more specific inputs."
                }
            ]}
