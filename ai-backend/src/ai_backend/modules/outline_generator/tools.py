"""
Utility tools for the outline generator module.
"""

import os
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import logging
from langchain_chroma import Chroma
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from pydantic import BaseModel, Field
from ai_backend.utils import get_llm, get_embeddings

logger = logging.getLogger(__name__)

def load_outline_prompt():
    """
    Load the outline generator prompt template from file.
    
    Returns:
        str: The prompt template as a string
    """
    prompt_path = Path(__file__).parent / "prompts" / "outline_prompt.txt"
    with open(prompt_path, "r") as f:
        return f.read()

def load_outline_with_context_prompt():
    """
    Load the outline generator prompt template with context from file.
    
    Returns:
        str: The prompt template as a string
    """
    prompt_path = Path(__file__).parent / "prompts" / "outline_prompt_with_context.txt"
    with open(prompt_path, "r") as f:
        return f.read()

class OutlineResponse(BaseModel):
    outlines: List[str] = Field(..., description="List of slide titles")

class OutlineGenerator:
    def __init__(self, args=None, vectorstore_class=Chroma, prompt=None, embedding_model=None, model=None, parser=None, verbose=False):
        # Get model using our utility function that supports OpenRouter
        self.model = model or get_llm(verbose=verbose)
            
        default_config = {
            "embedding_model": embedding_model or get_embeddings(verbose=verbose),
            "parser": JsonOutputParser(pydantic_object=OutlineResponse),
            "prompt": load_outline_prompt(),
            "prompt_with_context": load_outline_with_context_prompt(),
            "vectorstore_class": Chroma
        }

        self.prompt = prompt or default_config["prompt"]
        self.prompt_with_context = default_config["prompt_with_context"]
        self.parser = parser or default_config["parser"]
        self.embedding_model = default_config["embedding_model"]

        self.vectorstore_class = vectorstore_class or default_config["vectorstore_class"]
        self.vectorstore, self.retriever, self.runner = None, None, None
        self.args = args
        self.verbose = verbose

    def create_retriever(self, docs=None):
        """
        Create a retriever if docs are provided.
        """
        if not docs:
            return None
            
        self.vectorstore = self.vectorstore_class.from_documents(docs, self.embedding_model)
        self.retriever = self.vectorstore.as_retriever()
        return self.retriever

    def compile_context(self, docs=None):
        """
        Compile the context with or without documents.
        """
        if docs:
            context = ""
            for i, doc in enumerate(docs):
                context += f"{doc.page_content}\n\n"
                
            prompt_with_context = PromptTemplate(
                template=self.prompt_with_context,
                input_variables=["instructional_level", "topic", "n_slides", "context", "audience", "duration", "style", "additional_context"],
                partial_variables={"format_instructions": self.parser.get_format_instructions()}
            )
            chain = prompt_with_context | self.model | self.parser
            
            if self.verbose:
                logger.info("Chain with context compilation complete")
                
            return chain, context
        else:
            prompt = PromptTemplate(
                template=self.prompt,
                input_variables=["instructional_level", "topic", "n_slides", "audience", "duration", "style", "additional_context"],
                partial_variables={"format_instructions": self.parser.get_format_instructions()}
            )
            chain = prompt | self.model | self.parser
            
            if self.verbose:
                logger.info("Chain compilation complete")
                
            return chain, None

    def generate_outline(self, docs=None):
        """
        Generate presentation outline.
        """
        if self.verbose:
            logger.info("Creating the Outlines for the Presentation")
            
        chain, context = self.compile_context(docs)
        
        # Add default values for the missing parameters
        input_parameters = {
            "instructional_level": self.args.instructional_level,
            "topic": self.args.topic,
            "n_slides": self.args.n_slides,
            "audience": "General audience",
            "duration": "30",
            "style": "Professional",
            "additional_context": "No additional context provided."
        }
        
        if context:
            input_parameters["context"] = context
            
        if self.verbose:
            logger.info(f"Input parameters: {input_parameters}")
            
        response = chain.invoke(input_parameters)
        
        if self.verbose:
            logger.info(f"Generated response: {response}")
            
        return response
