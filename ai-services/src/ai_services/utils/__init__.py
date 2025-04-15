"""Utility functions for the AI Services package."""

import os
import logging
import sys
from typing import Optional
from .document_loaders import get_docs, download_file

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logger = logging.getLogger(__name__)

def get_llm(model_name: Optional[str] = None, verbose: bool = False):
    """
    Get LLM client based on environment configuration.
    Prefers OpenRouter over Google Gemini when available.
    
    Args:
        model_name: Optional specific model to use.
        verbose: Whether to enable verbose logging.
        
    Returns:
        An LLM client configured to use the appropriate model.
    """
    # Debug environment variables
    if verbose:
        logger.info("DEBUG: Environment variables:")
        logger.info(f"DEBUG: OPENROUTER_API_KEY exists: {bool(os.getenv('OPENROUTER_API_KEY'))}")
        logger.info(f"DEBUG: GOOGLE_API_KEY exists: {bool(os.getenv('GOOGLE_API_KEY'))}")
        logger.info(f"DEBUG: Current working directory: {os.getcwd()}")
        logger.info(f"DEBUG: Python path: {sys.executable}")
    
    # Check for OpenRouter first
    openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
    if openrouter_api_key:
        try:
            from langchain_openai import ChatOpenAI
            
            # Use specified model or the default from env
            or_model = model_name or os.getenv("OPENROUTER_TEXT_MODEL", "meta-llama/llama-4-maverick:free")
            
            if verbose:
                logger.info(f"Using OpenRouter with model: {or_model}")
                
            return ChatOpenAI(
                model=or_model,
                openai_api_key=openrouter_api_key,
                openai_api_base="https://openrouter.ai/api/v1",
                max_tokens=4000,
                temperature=0.7
            )
        except ImportError:
            logger.warning("langchain_openai package not installed. Falling back to Google Gemini.")
        except Exception as e:
            logger.error(f"Failed to initialize OpenRouter client: {str(e)}")
            logger.warning("Falling back to Google Gemini.")
    
    # Fall back to Google Gemini
    google_api_key = os.getenv("GOOGLE_API_KEY")
    if google_api_key:
        try:
            from langchain_google_genai import GoogleGenerativeAI
            
            gemini_model = "gemini-1.5-flash"
            
            if verbose:
                logger.info(f"Using Google Gemini model: {gemini_model}")
                
            return GoogleGenerativeAI(
                model=gemini_model,
                google_api_key=google_api_key
            )
        except ImportError:
            logger.error("langchain_google_genai package not installed.")
            raise ValueError("No LLM provider available. Please install required packages.")
        except Exception as e:
            logger.error(f"Failed to initialize Google Gemini client: {str(e)}")
            raise ValueError(f"Failed to initialize any LLM client: {str(e)}")
    
    raise ValueError("No API keys found for any supported LLM provider. Please set OPENROUTER_API_KEY or GOOGLE_API_KEY environment variables.")

# Export functions
__all__ = ['get_llm', 'get_docs', 'download_file'] 