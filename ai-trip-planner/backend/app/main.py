from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from .config import settings
from .db import trips, places
from .models import serialize_doc, utc_now
from .schemas import PreferenceProfile, ItineraryResponse, RerouteRequest, ChatRequest
from .services.weather import get_weather
from .services.itinerary import build_days
from .services.ai import generate_ai_itinerary, answer_chat

app=FastAPI(title="AI Hyper-Personalized Itinerary Planner",version="1.0.0")
app.add_middleware(CORSMiddleware,allow_origins=[settings.frontend_origin,"http://localhost:5173"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"])

@app.get("/api/health")
async def health(): return {"status":"ok","service":"trip-planner-api"}

@app.get("/api/places")
async def get_places(destination: str="Ella"):
    docs=await places.find({"destination":{"$regex":destination,"$options":"i"}}).to_list(50)
    return [serialize_doc(x) for x in docs]

@app.post("/api/itinerary/generate",response_model=ItineraryResponse)
async def generate(profile: PreferenceProfile):
    weather=await get_weather(profile.destination); ai_data=await generate_ai_itinerary(profile,weather); mode="ai" if ai_data else "demo"
    if ai_data and "days" in ai_data:
        response=ItineraryResponse(**ai_data,mode=mode)
    else:
        rainy=any(w in weather["condition"] for w in ["rain","storm","drizzle"]); days=build_days(profile,rainy)
        response=ItineraryResponse(destination=profile.destination,summary=f"Personalized {profile.days}-day plan for {profile.destination} based on your {profile.mood} mood and selected preferences.",total_estimated_cost=sum(d.day_cost for d in days),days=days,weather_note=f"Current weather: {weather['description']} ({weather['temperature']}°C).",mode=mode)
    doc=response.model_dump(); doc.update({"created_at":utc_now(),"profile":profile.model_dump()}); inserted=await trips.insert_one(doc); response.trip_id=str(inserted.inserted_id); return response

@app.get("/api/itinerary/{trip_id}",response_model=ItineraryResponse)
async def get_itinerary(trip_id:str):
    try: doc=await trips.find_one({"_id":ObjectId(trip_id)})
    except Exception as exc: raise HTTPException(400,"Invalid trip id") from exc
    if not doc: raise HTTPException(404,"Trip not found")
    result=serialize_doc(doc); return ItineraryResponse(**{k:v for k,v in result.items() if k in ItineraryResponse.model_fields})

@app.post("/api/itinerary/reroute",response_model=ItineraryResponse)
async def reroute(payload:RerouteRequest):
    rainy=any(w in payload.weather_condition.lower() for w in ["rain","storm","drizzle"]); days=build_days(payload.profile,rainy)
    return ItineraryResponse(destination=payload.destination,summary=f"Dynamic plan updated because of {payload.weather_condition} weather and {payload.traffic_level} traffic.",total_estimated_cost=sum(d.day_cost for d in days),days=days,weather_note="Re-routed around current conditions.",mode="adaptive")

@app.get("/api/weather")
async def weather(destination:str): return await get_weather(destination)

@app.post("/api/chat")
async def chat(payload:ChatRequest): return {"answer":await answer_chat(payload.question,payload.destination)}
