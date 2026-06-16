import os
import logging
from fastapi import FastAPI, Request
from telegram import Update, Bot
from google import genai
from google.genai import types

# ----------------------------------------------------------------------
# Configuration
# ----------------------------------------------------------------------
# Note: On Vercel, it's best to move these to Environment Variables later!
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

SPECIFIC_TOPIC = "Python programming"
SYSTEM_INSTRUCTION = (
    f"You are a highly specialized assistant focused ONLY on {SPECIFIC_TOPIC}. "
    f"If a user asks anything outside of this exact topic, you must politely "
    f"decline to answer and guide them back to {SPECIFIC_TOPIC}. "
    f"Keep your answers short since we are on a 10-second serverless timeout."
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI()

# Initialize Telegram Bot (Stateless)
bot = Bot(token=TELEGRAM_BOT_TOKEN)

# Initialize GenAI Client
try:
    client = genai.Client(api_key=GEMINI_API_KEY)
except Exception as e:
    logger.error(f"Failed to initialize GenAI client: {e}")
    client = None

# ----------------------------------------------------------------------
# Helper Functions
# ----------------------------------------------------------------------
async def process_update(update: Update):
    """Processes a single incoming Telegram Update."""
    if not update.message or not update.message.text:
        return

    chat_id = update.effective_chat.id
    user_text = update.message.text

    # Handle /start
    if user_text.startswith('/start'):
        await bot.send_message(
            chat_id=chat_id, 
            text=f"Hello! 👋 I am an expert assistant for {SPECIFIC_TOPIC}. Ask me anything!"
        )
        return

    # Handle /help
    if user_text.startswith('/help'):
        await bot.send_message(
            chat_id=chat_id, 
            text=f"Just send me your questions about: {SPECIFIC_TOPIC}."
        )
        return

    # Process standard message with Gemini
    if not client:
        await bot.send_message(chat_id=chat_id, text="AI capabilities are offline.")
        return

    try:
        # Show 'typing' action
        await bot.send_chat_action(chat_id=chat_id, action='typing')

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
            
        await bot.send_message(chat_id=chat_id, text=reply_text)
        
    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}")
        await bot.send_message(
            chat_id=chat_id, 
            text="Sorry, I encountered an error. The request might have timed out."
        )

# ----------------------------------------------------------------------
# API Endpoints
# ----------------------------------------------------------------------
@app.post("/api/webhook")
async def telegram_webhook(request: Request):
    """Endpoint to receive Webhook updates from Telegram."""
    try:
        # Parse the incoming JSON into a Telegram Update object
        data = await request.json()
        update = Update.de_json(data, bot)
        
        # Process the update
        await process_update(update)
        
        # Respond to Telegram with 200 OK so it doesn't retry
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Error processing webhook: {e}")
        # Always return 200 OK to Telegram, even on error, to prevent retry loops
        return {"status": "error"}

@app.get("/")
def home():
    """Simple health check endpoint."""
    return {"status": "Bot is running and ready for webhooks!"}
