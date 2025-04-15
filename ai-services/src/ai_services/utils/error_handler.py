"""Error handling utilities for API functions."""

import functools
import logging
from collections.abc import Callable

from fastapi import HTTPException
from pydantic import ValidationError

logger = logging.getLogger(__name__)

def api_error_handler(func: Callable) -> Callable:
    """
    Decorator to handle errors in API endpoint functions.
    
    Catches exceptions and returns appropriate HTTP responses.
    """
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except ValidationError as e:
            logger.error(f"Validation error: {str(e)}")
            raise HTTPException(status_code=422, detail=str(e)) from e
        except HTTPException:
            # Re-raise existing HTTP exceptions
            raise
        except Exception as e:
            logger.exception(f"Error in API function {func.__name__}: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"An unexpected error occurred: {str(e)}"
            ) from e
    return wrapper 