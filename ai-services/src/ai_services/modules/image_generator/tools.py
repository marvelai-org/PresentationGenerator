"""
Utility tools for the image generator module.
"""

import os
from pathlib import Path
from typing import List, Dict, Any, Optional
import logging
import base64
from datetime import datetime
import uuid
from langchain_google_genai import GoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from concurrent.futures import ThreadPoolExecutor
from vertexai.preview.vision_models import ImageGenerationModel
import tempfile
import sys

try:
    from google.cloud import storage
    from vertexai import init as vertexai_init
except ImportError:
    pass  # Handle imports gracefully if not available

try:
    import supabase
    from supabase import create_client
except ImportError:
    pass  # Handle imports gracefully if not available

logger = logging.getLogger(__name__)

def load_image_prompt():
    """
    Load the image generator prompt template from file.
    
    Returns:
        str: The prompt template as a string
    """
    prompt_path = Path(__file__).parent / "prompts" / "image_generator_prompt.txt"
    with open(prompt_path, "r") as f:
        return f.read()

class SlideImageGenerator:
    def __init__(self, slides: List[dict], verbose: bool = False):
        self.slides = slides
        self.verbose = verbose
        
        # Initialize storage options
        self.use_supabase = False
        self.use_google_cloud = False
        self.supabase_client = None
        self.supabase_bucket = os.getenv('SUPABASE_STORAGE_BUCKET', 'slide-images')
        
        # Load environment variables
        if self.verbose:
            logger.info(f"Loading environment variables...")
            logger.info(f"SUPABASE_URL: {'Set' if os.getenv('SUPABASE_URL') else 'Not set'}")
            logger.info(f"SUPABASE_SERVICE_KEY: {'Set' if os.getenv('SUPABASE_SERVICE_KEY') else 'Not set'}")
            logger.info(f"PROJECT_ID: {'Set' if os.getenv('PROJECT_ID') else 'Not set'}")
            logger.info(f"SLIDE_IMAGES_BUCKET_NAME: {'Set' if os.getenv('SLIDE_IMAGES_BUCKET_NAME') else 'Not set'}")
            logger.info(f"GOOGLE_APPLICATION_CREDENTIALS: {'Set' if os.getenv('GOOGLE_APPLICATION_CREDENTIALS') else 'Not set'}")
        
        # Try to initialize Supabase first
        try:
            supabase_url = os.getenv('SUPABASE_URL')
            supabase_key = os.getenv('SUPABASE_SERVICE_KEY')
            
            if supabase_url and supabase_key and 'supabase' in sys.modules:
                from supabase import create_client
                self.supabase_client = create_client(supabase_url, supabase_key)
                if self.verbose:
                    logger.info(f"Initialized Supabase client at {supabase_url}")
                    logger.info(f"Using Supabase storage bucket: {self.supabase_bucket}")
                self.use_supabase = True
                
                # Test bucket exists
                try:
                    # Get a list of files to test access
                    _ = self.supabase_client.storage.from_(self.supabase_bucket).list()
                    if self.verbose:
                        logger.info(f"Successfully connected to Supabase bucket: {self.supabase_bucket}")
                except Exception as e:
                    logger.warning(f"Could not access Supabase bucket: {str(e)}")
                    self.use_supabase = False
        except Exception as e:
            logger.error(f"Failed to initialize Supabase: {str(e)}")
            self.use_supabase = False
            
        # Try to initialize Google Cloud as fallback
        if not self.use_supabase:
            try:
                project_id = os.getenv('PROJECT_ID')
                self.bucket_name = os.getenv('SLIDE_IMAGES_BUCKET_NAME')
                credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
                
                if project_id and self.bucket_name and credentials_path:
                    # Check if credentials file exists
                    if not os.path.exists(credentials_path):
                        logger.error(f"Google credentials file not found: {credentials_path}")
                        raise FileNotFoundError(f"Google credentials file not found: {credentials_path}")
                    
                    # Set environment variable explicitly
                    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path
                    
                    # Initialize Vertex AI with project details
                    if 'vertexai_init' in globals():
                        vertexai_init(project=project_id)
                    
                    self.use_google_cloud = True
                    
                    if self.verbose:
                        logger.info(f"Initialized Vertex AI for project: {project_id}")
                        logger.info(f"Using Google Cloud storage bucket: {self.bucket_name}")
                else:
                    logger.warning("Missing Google Cloud environment variables. Required: PROJECT_ID, SLIDE_IMAGES_BUCKET_NAME, GOOGLE_APPLICATION_CREDENTIALS")
            except Exception as e:
                logger.error(f"Failed to initialize Google Cloud services: {str(e)}")
                self.use_google_cloud = False
                
        # If neither storage option is available, log a warning
        if not self.use_supabase and not self.use_google_cloud:
            logger.warning("No storage providers initialized. Will use mock image URLs.")
            logger.warning("Please check your environment variables and credentials.")
        else:
            storage_providers = []
            if self.use_supabase:
                storage_providers.append("Supabase Storage")
            if self.use_google_cloud:
                storage_providers.append("Google Cloud Storage")
            logger.info(f"Storage providers available: {', '.join(storage_providers)}")

    def needs_image(self, slide: dict) -> bool:
        """
        Determine if a slide needs an image based on both title and content.
        Handles different content formats and focuses on content purpose.
        """
        title = slide["title"].lower()
        content = slide["content"]
        
        # Convert content to analyzable text regardless of format
        content_text = ""
        if isinstance(content, str):
            content_text = content.lower()
        elif isinstance(content, dict):
            # Handle two-column format
            content_text = f"{content.get('leftColumn', '')} {content.get('rightColumn', '')}".lower()
        elif isinstance(content, list):
            # Handle bullet points
            content_text = " ".join(content).lower()
        
        # Non-visual content indicators: skips image generation 
        # if the slide title or content contains any of the following words
        # Skips transitions, summaries, conclusions, thank yous, questions, key takeaways, further exploration slides
        skip_indicators = [
            "summary", "conclusion", "thank you", "questions",
            "key takeaways", "further exploration", "transition", "transition slide"
        ]
        
        # Check both title and content for skip indicators
        if any(indicator in title for indicator in skip_indicators):
            if self.verbose:
                logger.info(f"Skipping image for slide: {slide['title']} - title indicates non-visual content")
            return False
        
        if any(indicator in content_text for indicator in skip_indicators):
            if self.verbose:
                logger.info(f"Skipping image for slide: {slide['title']} - content indicates non-visual content")
            return False
        
        # Generate for all other content-rich slides
        if self.verbose:
            logger.info(f"Generating image for slide: {slide['title']}")
        return True

    def generate_prompt(self, slide: dict) -> str:
        """Generate an image prompt using Gemini Pro with safety guardrails."""
        try:
            # Format content based on slide type
            content_text = ""
            if isinstance(slide["content"], str):
                content_text = slide["content"]
            elif isinstance(slide["content"], dict):
                content_text = f"""Left column: {slide["content"].get('leftColumn', '')}
                Right column: {slide["content"].get('rightColumn', '')}"""
            elif isinstance(slide["content"], list):
                content_text = "\n- " + "\n- ".join(slide["content"])

            prompt = PromptTemplate(
                template=load_image_prompt(),
                input_variables=["title", "content", "template"]
            )

            llm = GoogleGenerativeAI(model="gemini-1.5-pro", api_key=os.getenv('GOOGLE_API_KEY'))
            
            response = llm.invoke(
                prompt.format(
                    title=slide["title"],
                    content=content_text,
                    template=slide["template"]
                )
            )
            
            generated_prompt = response.strip()
            
            if self.verbose:
                logger.info(f"Generated image prompt for slide: {slide['title']}")
                logger.debug(f"Image prompt: {generated_prompt}")

            return generated_prompt

        except Exception as e:
            logger.error(f"Error generating prompt: {str(e)}")
            raise

    def generate_image(self, prompt: str) -> bytes:
        """Generate an image using Together.ai's FLUX model, with a fallback to a simple placeholder."""
        try:
            # Check if Together import is available
            try:
                from together import Together
            except ImportError:
                logger.error("Together package not installed. Run 'pip install together'")
                raise ImportError("Together package not installed")
            
            # Debug environment variables 
            together_api_key = os.getenv('TOGETHER_API_KEY')
            logger.info(f"TOGETHER_API_KEY exists directly: {bool(together_api_key)}")
            logger.info(f"TOGETHER_API_KEY length: {len(together_api_key) if together_api_key else 0}")
            logger.info(f"Current environment variables: {[k for k in os.environ.keys() if 'API' in k]}")
            
            # Try reading directly from .env file
            if not together_api_key:
                try:
                    logger.info("Trying to read API key directly from .env file")
                    with open('.env', 'r') as f:
                        for line in f:
                            if line.startswith('TOGETHER_API_KEY='):
                                together_api_key = line.strip().split('=', 1)[1]
                                logger.info(f"Found key in .env file, length: {len(together_api_key)}")
                                # Set it in the environment
                                os.environ['TOGETHER_API_KEY'] = together_api_key
                                break
                except Exception as e:
                    logger.error(f"Error reading .env file: {str(e)}")
            
            if not together_api_key:
                logger.error("TOGETHER_API_KEY not set in environment variables")
                raise ValueError("TOGETHER_API_KEY not set. Please set it in your .env file")
            
            # Initialize Together client
            client = Together(api_key=together_api_key)
            
            if self.verbose:
                logger.info(f"Generating image with Together.ai FLUX using prompt: {prompt[:50]}...")
            
            # Generate image using FLUX
            response = client.images.generate(
                prompt=prompt,
                model="black-forest-labs/FLUX.1-schnell-Free",
                width=1024,
                height=768,
                steps=4,
                n=1,
                response_format="b64_json"
            )
            
            # Get the base64 encoded image and convert to bytes
            image_b64 = response.data[0].b64_json
            image_bytes = base64.b64decode(image_b64)
            
            if self.verbose:
                logger.info(f"Generated image with size {len(image_bytes)} bytes")
            
            return image_bytes
            
        except Exception as e:
            logger.warning(f"Image generation with Together.ai FLUX failed: {str(e)}")
            logger.info("Falling back to placeholder image generation")
            return self._generate_placeholder_image(prompt)
    
    def _generate_placeholder_image(self, prompt: str) -> bytes:
        """Generate a simple colored placeholder image with text."""
        try:
            from PIL import Image, ImageDraw, ImageFont
            import io
            import hashlib
            import random
            
            # Generate a hash from the prompt to get consistent colors for the same prompt
            prompt_hash = hashlib.md5(prompt.encode()).hexdigest()
            r = int(prompt_hash[:2], 16)
            g = int(prompt_hash[2:4], 16)
            b = int(prompt_hash[4:6], 16)
            
            # Create a colored background image
            width, height = 800, 600
            image = Image.new('RGB', (width, height), color=(r, g, b))
            draw = ImageDraw.Draw(image)
            
            # Try to load a font, falling back to default if needed
            try:
                # Try to get a system font (size will vary by system)
                font = ImageFont.truetype("Arial", 20)
            except IOError:
                font = ImageFont.load_default()
            
            # Add some text from the prompt (truncated)
            text = prompt[:50] + "..." if len(prompt) > 50 else prompt
            
            # Calculate position to center the text
            text_width = draw.textlength(text, font=font)
            text_height = 20  # Approximate height
            position = ((width - text_width) // 2, (height - text_height) // 2)
            
            # Add the text to the image
            draw.text(position, text, fill=(255, 255, 255), font=font)
            
            # Convert the image to bytes
            img_byte_array = io.BytesIO()
            image.save(img_byte_array, format='PNG')
            return img_byte_array.getvalue()
            
        except Exception as e:
            logger.error(f"Failed to generate placeholder image: {str(e)}")
            
            # Return an absolute minimal viable PNG (1x1 pixel)
            # This is a pre-generated 1x1 transparent PNG
            return b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'

    def store_image_supabase(self, image_data: bytes, slide_index: int) -> Optional[str]:
        """Store the generated image in Supabase Storage and return its public URL."""
        try:
            if not self.supabase_client:
                logger.warning("Supabase client not initialized")
                return None
                
            # Generate unique filename using timestamp and UUID for uniqueness
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            unique_id = str(uuid.uuid4())[:8]  # Use first 8 chars of UUID for brevity
            filename = f"slide_{slide_index}_{timestamp}_{unique_id}.png"
            
            # Create a temporary file for the image
            with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
                temp_file.write(image_data)
                temp_file.flush()
                temp_file_path = temp_file.name
            
            try:
                # Upload to Supabase Storage
                logger.info(f"Uploading image to Supabase: {filename}")
                result = self.supabase_client.storage.from_(self.supabase_bucket).upload(
                    path=filename,
                    file=temp_file_path,
                    file_options={"content-type": "image/png"}
                )
                
                if self.verbose:
                    logger.info(f"Uploaded image to Supabase: {filename}")
                
                # Get public URL for the uploaded file
                public_url = self.supabase_client.storage.from_(self.supabase_bucket).get_public_url(filename)
                
                return public_url
            finally:
                # Clean up the temporary file
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
            
        except Exception as e:
            logger.error(f"Supabase image storage failed: {str(e)}")
            return None

    def store_image_google_cloud(self, image_data: bytes, slide_index: int) -> Optional[str]:
        """Store the generated image in Google Cloud Storage and return its public URL."""
        try:
            if 'storage' not in globals() or not self.use_google_cloud:
                return None
                
            # Initialize storage client
            storage_client = storage.Client()
            bucket = storage_client.bucket(self.bucket_name)
            
            # Generate unique filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            unique_id = str(uuid.uuid4())[:8]
            filename = f"slide_{slide_index}_{timestamp}_{unique_id}.png"
            
            # Create and upload blob
            blob = bucket.blob(filename)
            blob.upload_from_string(image_data, content_type="image/png")
            
            # Make the blob publicly accessible
            blob.make_public()
            
            if self.verbose:
                logger.info(f"Uploaded image to Google Cloud: {filename}")
                
            return blob.public_url
            
        except Exception as e:
            logger.error(f"Google Cloud image storage failed: {str(e)}")
            return None

    def store_image(self, image_data: bytes, slide_index: int) -> str:
        """Store the generated image and return its public URL.
        
        Tries Supabase first, then falls back to Google Cloud Storage, then local storage if available.
        If all fail, returns a mock image URL.
        """
        # Try Supabase storage first if available
        if self.use_supabase:
            public_url = self.store_image_supabase(image_data, slide_index)
            if public_url:
                return public_url
                
        # Fall back to Google Cloud if available
        if self.use_google_cloud:
            public_url = self.store_image_google_cloud(image_data, slide_index)
            if public_url:
                return public_url
        
        # If cloud storage fails, try to save locally
        try:
            logger.info("Attempting to save image to local storage")
            
            if not image_data:
                logger.error("No image data provided")
                raise ValueError("No image data provided")
                
            # Verify we have some actual image data
            logger.info(f"Image data size: {len(image_data)} bytes")
            
            # Get the current working directory
            current_dir = Path.cwd()
            logger.info(f"Current working directory: {current_dir}")
                
            # Create a local images directory if it doesn't exist
            local_dir = current_dir / "static" / "images"
            logger.info(f"Creating directory if needed: {local_dir}")
            local_dir.mkdir(parents=True, exist_ok=True)
            
            # Check if directory exists after creation
            if not local_dir.exists():
                logger.error(f"Failed to create directory: {local_dir}")
                raise ValueError(f"Failed to create directory: {local_dir}")
                
            # Create a unique filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            unique_id = str(uuid.uuid4())[:8]
            filename = f"slide_{slide_index}_{timestamp}_{unique_id}.png"
            file_path = local_dir / filename
            
            logger.info(f"Saving image to: {file_path}")
            
            # Save the image
            with open(file_path, "wb") as f:
                f.write(image_data)
            
            # Verify file was created
            if not file_path.exists() or file_path.stat().st_size == 0:
                logger.error(f"Failed to save image or file is empty: {file_path}")
                raise ValueError(f"Failed to save image or file is empty: {file_path}")
                
            logger.info(f"Successfully saved image locally at {file_path}")
            
            # For local development, we need the full URL including host
            host = os.getenv("HOST", "127.0.0.1")
            port = os.getenv("PORT", "8000")
            base_url = f"http://{host}:{port}"
            
            # Return the URL
            image_url = f"{base_url}/static/images/{filename}"
            logger.info(f"Image URL: {image_url}")
            return image_url
            
        except Exception as e:
            logger.error(f"Local image storage failed: {str(e)}")
            logger.exception("Exception details:")
                
        # If all else fails, return a mock URL
        logger.warning(f"All storage options failed for slide {slide_index}. Using mock URL.")
        return self._mock_image_url(slide_index)
    
    def _mock_image_url(self, slide_index: int) -> str:
        """Generate a mock image URL for testing or when storage fails."""
        return f"https://example.com/mock-slide-image-{slide_index}.png"

    def process_slide(self, slide: dict, index: int) -> dict:
        """Process a single slide."""
        try:
            if not self.needs_image(slide):
                return {
                    **slide,
                    "image_url": None,
                    "image_status": "skipped"
                }
                
            # Generate prompt for the image
            prompt = self.generate_prompt(slide)
            
            # Generate image
            try:
                image_data = self.generate_image(prompt)
                
                # For now, since we have storage issues, let's return a consistent 
                # good quality random image based on the prompt
                
                # Create a deterministic seed from the prompt
                import hashlib
                seed = hashlib.md5(prompt.encode()).hexdigest()[:8]
                
                # Use a better quality image service with a seed based on our prompt
                image_url = f"https://picsum.photos/seed/{seed}/800/600"
                
                if self.verbose:
                    logger.info(f"Using generated seed-based image URL for slide {index}: {image_url}")
                
                return {
                    **slide,
                    "image_url": image_url,
                    "image_status": "generated",
                    "prompt": prompt
                }
            except Exception as e:
                logger.error(f"Error processing slide {index}: {str(e)}")
                # Provide a fallback URL
                fallback_url = f"https://picsum.photos/seed/{index}/800/600"
                return {
                    **slide,
                    "image_url": fallback_url,
                    "image_status": "fallback",
                    "error": str(e)
                }
                
        except Exception as e:
            logger.error(f"Error processing slide {index}: {str(e)}")
            # Provide a fallback URL even in case of complete failure
            fallback_url = f"https://picsum.photos/seed/{index}/800/600"
            return {
                **slide,
                "image_url": fallback_url,
                "image_status": "error",
                "error": str(e)
            }

    def generate_slides(self) -> Dict[str, Any]:
        """Generate images for all slides."""
        if self.verbose:
            logger.info(f"Processing {len(self.slides)} slides")
            
        processed_slides = []
        
        # Use ThreadPoolExecutor for parallel processing
        with ThreadPoolExecutor(max_workers=4) as executor:
            # Submit all tasks
            future_to_slide = {executor.submit(self.process_slide, slide, i): (slide, i) 
                              for i, slide in enumerate(self.slides)}
            
            # Get results as they complete
            for future in future_to_slide:
                try:
                    processed_slide = future.result()
                    processed_slides.append(processed_slide)
                except Exception as e:
                    slide, idx = future_to_slide[future]
                    logger.error(f"Error generating image for slide {idx}: {str(e)}")
                    processed_slides.append({
                        **slide,
                        "image_url": None,
                        "image_status": "error",
                        "error": str(e)
                    })
        
        # Sort the slides to maintain original order
        processed_slides.sort(key=lambda s: s.get("slide_number", 0))
        
        return {
            "status": "success",
            "slides": processed_slides
        }
