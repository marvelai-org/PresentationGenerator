"""
Core functionality for the outline generator module.
"""
import logging

from pydantic import BaseModel

from ai_services.utils.document_loaders import get_docs
from .tools import OutlineGenerator

logger = logging.getLogger(__name__)

class OutlineGeneratorInput(BaseModel):
    instructional_level: str
    n_slides: int
    topic: str
    file_url: str | None = None
    file_type: str | None = None
    lang: str = "en"

def executor(n_slides: int, topic: str, instructional_level: str = "intermediate",
            file_url: str | None = None, file_type: str | None = None, lang: str = "en",
            verbose: bool = False) -> dict[str, list[str]]:
    """
    Generate a presentation outline based on the given parameters.
    
    Args:
        n_slides (int): Number of slides to generate
        topic (str): The main topic of the presentation
        instructional_level (str): Level of detail (beginner, intermediate, advanced)
        file_url (str, optional): URL to file for context
        file_type (str, optional): Type of file for context
        lang (str): Language code (en, es, fr, etc.)
        verbose (bool): Whether to output detailed logs
        
    Returns:
        dict: A structured outline for the presentation with outlines key
    """
    if verbose:
        logger.info(f"Generating outline for topic: {topic}, slides: {n_slides}")
    
    try:
        if not (n_slides and topic and instructional_level):
            logger.info("Missing required inputs.")
            raise ValueError("Missing required inputs")
         
        if (file_url and not file_type) or (not file_url and file_type):
            missing = "file_type" if file_url else "file_url"
            provided = "file_url" if file_url else "file_type"
            message = f"{provided} provided but {missing} is missing"
            logger.info(message)
            raise ValueError(message)
            
        docs = None
        
        if file_url and file_type:
            logger.info(f"Fetching documents from {file_url} of type {file_type}")
            docs = get_docs(
                file_url=file_url,
                file_type=file_type,
                use_header=True
            )
        
        outline_generator_args = OutlineGeneratorInput(
            instructional_level=instructional_level,
            n_slides=n_slides,
            topic=topic,
            file_url=file_url,
            file_type=file_type,
            lang=lang
        )
        
        output = OutlineGenerator(args=outline_generator_args, verbose=verbose).generate_outline(docs)
        logger.info("Outline generated successfully")
    except Exception as e:
        error_message = f"Error in executor: {e}"
        logger.error(error_message)
        raise ValueError(error_message) from e
    
    return output
