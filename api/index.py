import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types

# ----------------------------------------------------------------------
# Configuration
# ----------------------------------------------------------------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

SPECIFIC_TOPIC = "Python programming"
SYSTEM_INSTRUCTION = (
    f"You are a highly specialized assistant focused ONLY on {SPECIFIC_TOPIC}. "
    f"If a user asks anything outside of this exact topic, you must politely "
    f"decline to answer and guide them back to {SPECIFIC_TOPIC}. "
    f"Keep your answers engaging but concise."
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ----------------------------------------------------------------------
# App Initialization
# ----------------------------------------------------------------------
app = FastAPI()

# Allow CORS so the frontend can easily call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize GenAI Client
try:
    client = genai.Client(api_key=GEMINI_API_KEY)
except Exception as e:
    logger.error(f"Failed to initialize GenAI client: {e}")
    client = None

# ----------------------------------------------------------------------
# Models
# ----------------------------------------------------------------------
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

# ----------------------------------------------------------------------
# API Endpoints
# ----------------------------------------------------------------------
@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Endpoint to receive user messages and return Gemini responses."""
    if not client:
        raise HTTPException(status_code=503, detail="AI Service is currently offline.")
        
    user_text = request.message.strip()
    if not user_text:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    try:
        # Async call to Gemini API
        response = await client.aio.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_text,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=0.3
            )
        )
        
        reply_text = response.text
        if not reply_text:
            reply_text = "I'm sorry, I couldn't generate a response."
            
        return ChatResponse(reply=reply_text)
        
    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate response.")

# Optional: Add a simple health check root for the API
@app.get("/api/health")
def health_check():
    return {"status": "Backend is running!"}
