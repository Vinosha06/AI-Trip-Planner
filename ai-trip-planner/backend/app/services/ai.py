import json
from typing import Any
from openai import AsyncOpenAI
from ..config import settings
from ..schemas import PreferenceProfile

SYSTEM = "You are a travel itinerary assistant. Create practical, safe, personalized travel plans. Respect budget, mood, interests, food preferences, travel style, and time. Prefer local experiences and efficient grouping. Return JSON only."

async def generate_ai_itinerary(profile: PreferenceProfile, weather: dict) -> dict[str, Any] | None:
    if not settings.openai_api_key: return None
    client=AsyncOpenAI(api_key=settings.openai_api_key)
    prompt={**profile.model_dump(),"weather":weather}
    r=await client.chat.completions.create(model=settings.openai_model,response_format={"type":"json_object"},messages=[{"role":"system","content":SYSTEM},{"role":"user","content":json.dumps(prompt)}],temperature=0.4)
    return json.loads(r.choices[0].message.content)

async def answer_chat(question: str, destination: str) -> str:
    if not settings.openai_api_key:
        return "Demo assistant: I can help adjust your itinerary, compare places, manage budget/time, or suggest indoor alternatives. Add OPENAI_API_KEY to enable AI chat."
    client=AsyncOpenAI(api_key=settings.openai_api_key)
    r=await client.chat.completions.create(model=settings.openai_model,messages=[{"role":"system","content":"You are a concise travel assistant."},{"role":"user","content":f"Destination: {destination}\nQuestion: {question}"}],temperature=0.4)
    return r.choices[0].message.content
