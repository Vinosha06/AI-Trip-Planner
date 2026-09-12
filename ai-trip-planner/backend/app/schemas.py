from pydantic import BaseModel, Field
from typing import List, Optional

class PreferenceProfile(BaseModel):
    destination: str
    start_date: str
    days: int = Field(ge=1, le=30)
    budget: float = Field(gt=0)
    currency: str = "LKR"
    food_preferences: List[str] = []
    travel_styles: List[str] = []
    pace: str = "balanced"
    mood: str = "curious"
    interests: List[str] = []

class ItineraryItem(BaseModel):
    time: str
    title: str
    category: str
    location: str
    duration_min: int
    estimated_cost: float
    indoor: bool = False
    reason: str = ""
    lat: float = 0
    lng: float = 0

class ItineraryDay(BaseModel):
    day: int
    date: str
    items: List[ItineraryItem]
    day_cost: float = 0

class ItineraryResponse(BaseModel):
    trip_id: Optional[str] = None
    destination: str
    summary: str
    total_estimated_cost: float
    days: List[ItineraryDay]
    weather_note: str = ""
    mode: str = "demo"

class RerouteRequest(BaseModel):
    destination: str
    current_activity: ItineraryItem
    profile: PreferenceProfile
    weather_condition: str
    traffic_level: str = "normal"

class ChatRequest(BaseModel):
    question: str
    destination: str = "Sri Lanka"
