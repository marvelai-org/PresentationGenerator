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
    Uses OpenRouter for LLM capabilities.
    
    Args:
        model_name: Optional specific model to use.
        verbose: Whether to enable verbose logging.
        
    Returns:
        An LLM client configured to use the appropriate model.
    """
    # Always print environment variables status for debugging
    logger.info("Checking environment variables:")
    logger.info(f"OPENROUTER_API_KEY exists: {bool(os.getenv('OPENROUTER_API_KEY'))}")
    logger.info(f"TOGETHER_API_KEY exists: {bool(os.getenv('TOGETHER_API_KEY'))}")
    logger.info(f"Current working directory: {os.getcwd()}")
    logger.info(f"Python path: {sys.executable}")
    
    # Check for OpenRouter
    openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
    if openrouter_api_key:
        logger.info("Found OpenRouter API key, attempting to use it")
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
        except ImportError as e:
            logger.error(f"langchain_openai package not installed: {e}")
            raise ValueError("Required package langchain_openai not available")
        except Exception as e:
            logger.error(f"Failed to initialize OpenRouter client: {str(e)}")
            raise ValueError(f"Failed to initialize OpenRouter client: {str(e)}")
    else:
        logger.error("OpenRouter API key not found in environment variables")
    
    error_msg = "OpenRouter API key not found. Please set OPENROUTER_API_KEY environment variable."
    logger.error(error_msg)
    raise ValueError(error_msg)

def get_embeddings(verbose: bool = False):
    """
    Get embeddings model from Together.ai.
    
    Args:
        verbose: Whether to enable verbose logging.
        
    Returns:
        An embeddings client from Together.ai.
    """
    together_api_key = os.getenv("TOGETHER_API_KEY")
    if not together_api_key:
        logger.error("TOGETHER_API_KEY not found in environment variables")
        raise ValueError("TOGETHER_API_KEY not set in environment variables")
        
    try:
        from langchain_together import TogetherEmbeddings
        
        embedding_model = os.getenv("TOGETHER_EMBEDDING_MODEL", "togethercomputer/m2-bert-80M-8k-retrieval")
        
        if verbose:
            logger.info(f"Using Together.ai embeddings model: {embedding_model}")
            
        return TogetherEmbeddings(
            model=embedding_model,
            together_api_key=together_api_key
        )
    except ImportError as e:
        logger.error(f"langchain_together package not installed: {e}")
        raise ValueError("Required package langchain_together not available")
    except Exception as e:
        logger.error(f"Failed to initialize Together.ai embeddings: {str(e)}")
        raise ValueError(f"Failed to initialize Together.ai embeddings: {str(e)}")

# Export functions
__all__ = ['get_llm', 'get_embeddings', 'get_docs', 'download_file'] 