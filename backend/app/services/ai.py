import json
from typing import Any
import os

from ..config import settings
from ..schemas import PreferenceProfile
from .itinerary import resolve_destination, BASE_PLACES

from google import genai
from google.genai import types


SYSTEM = """
You are a travel itinerary assistant.

Create practical, safe and personalized travel plans.

Respect:
- budget
- mood
- interests
- food preferences
- travel style
- pace
- weather
- time

VERY IMPORTANT:
Use ONLY places supplied in the allowed_places list.

Never substitute a place from another city.

Return JSON only with:
- destination
- summary
- total_estimated_cost
- days
- weather_note

Each itinerary item must contain:
- time
- title
- category
- location
- duration_min
- estimated_cost
- indoor
- reason
- lat
- lng
"""


async def generate_ai_itinerary(
    profile: PreferenceProfile,
    weather: dict,
    available_places: list[dict] | None = None,
) -> dict[str, Any] | None:

    # Check for Gemini API key (from settings or environment)
    api_key = getattr(settings, "gemini_api_key", None) or os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None

    destination_key = resolve_destination(
        profile.destination
    )

    allowed_places = (
        available_places
        if available_places
        else (
            BASE_PLACES.get(
                destination_key,
                []
            )
            if destination_key
            else []
        )
    )

    if not allowed_places:
        return None

    # Initialize Gemini Client
    client = genai.Client(api_key=api_key)

    prompt = {
        **profile.model_dump(),
        "weather": weather,
        "allowed_places": allowed_places,
    }

    try:
        model_name = getattr(settings, "gemini_model", "gemini-2.5-flash")

        response = client.models.generate_content(
            model=model_name,
            contents=f"System Instruction:\n{SYSTEM}\n\nUser Data (JSON):\n{json.dumps(prompt)}",
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.4,
            ),
        )

        content = response.text

        if not content:
            return None

        return json.loads(content)

    except Exception as exc:
        print(
            "Gemini itinerary error:",
            repr(exc)
        )
        return None


async def answer_chat(
    question: str,
    destination: str
) -> str:

    api_key = getattr(settings, "gemini_api_key", None) or os.getenv("GEMINI_API_KEY")
    
    # Smart offline context-matching fallback when Gemini API key is missing
    if not api_key:
        q = question.lower()
        dest = destination.title() if destination else "your destination"

        # Check for specific intents in the user's question to give accurate replies
        if any(w in q for w in ["cost", "price", "budget", "money", "rs", "rupees", "how much", "expensive", "cheap"]):
            return f"Regarding your question about costs in {dest}: It depends on your activities, but carrying local currency (Sri Lankan Rupees) is essential for small entry tickets, local buses, and street food since many smaller vendors don't accept cards."
        
        elif any(w in q for w in ["weather", "rain", "sunny", "climate", "temperature", "month", "best time"]):
            return f"About the weather and timing for {dest}: Conditions can shift between sunny periods and sudden showers depending on the season. It's always best to check the live forecast right before your trip and pack a light raincoat or umbrella just in case."
        
        elif any(w in q for w in ["food", "eat", "restaurant", "lunch", "dinner", "breakfast", "cafe", "rice"]):
            return f"When it comes to food in {dest}: You are in for a treat! Make sure to try authentic Sri Lankan rice and curry, kottu roti, hoppers, and fresh king coconut water from local spots."
        
        elif any(w in q for w in ["transport", "travel", "bus", "train", "taxi", "drive", "get around", "reach"]):
            return f"To get around in {dest}: Public transport like local buses and scenic trains are great budget options, while tuk-tuks are very convenient for short local trips within the town."
        
        elif any(w in q for w in ["time", "duration", "hour", "day", "schedule", "long", "fast"]):
            return f"Regarding timing for your query in {dest}: Planning your visits early in the morning helps you avoid the midday heat and the biggest crowds at popular attractions."
        
        elif any(w in q for w in ["clothes", "wear", "dress", "packing", "shoe"]):
            return f"For what to wear in {dest}: Lightweight, breathable cotton clothing is ideal. If you are visiting temples or cultural heritage sites, make sure to wear clothes that cover your shoulders and knees out of respect."
        
        else:
            return f"That's a very interesting question about {dest}! While operating in demo mode without a Gemini API key, I recommend focusing on the local culture, heritage, and trying out traditional experiences there."

    client = genai.Client(api_key=api_key)

    try:
        model_name = getattr(settings, "gemini_model", "gemini-2.5-flash")

        response = client.models.generate_content(
            model=model_name,
            contents=f"Destination: {destination}\nQuestion: {question}",
            config=types.GenerateContentConfig(
                system_instruction="You are a concise travel assistant.",
                temperature=0.4,
            ),
        )

        content = response.text

        return content or (
            "I could not generate an answer right now."
        )

    except Exception as exc:
        print(
            "Gemini chat error:",
            repr(exc)
        )

        return (
            "AI chat is temporarily unavailable. "
            "Please check your GEMINI_API_KEY and "
            "GEMINI_MODEL settings."
        )