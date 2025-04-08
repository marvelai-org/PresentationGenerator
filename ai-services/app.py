from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import uvicorn

app = FastAPI(
    title="Presentation Generator AI Service",
    description="AI service for generating presentation content",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with actual frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    prompt: str
    options: Dict[str, Any] = {}

@app.get("/")
async def root():
    return {"status": "ok", "message": "Presentation Generator AI Service is running"}

@app.post("/predict")
async def predict(request: PredictionRequest):
    """
    Generate presentation content based on the provided prompt.
    This is a dummy implementation that will be replaced with actual AI processing.
    """
    try:
        # Dummy response - in production, this would call ML models
        return {
            "status": "success",
            "data": {
                "title": f"Presentation about {request.prompt}",
                "slides": [
                    {
                        "title": "Introduction",
                        "content": f"Overview of {request.prompt}"
                    },
                    {
                        "title": "Key Points",
                        "content": "Important information about the topic"
                    },
                    {
                        "title": "Conclusion",
                        "content": "Summary and next steps"
                    }
                ],
                "metadata": {
                    "prompt": request.prompt,
                    "options": request.options,
                    "generationTime": "0.5s"
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True) 