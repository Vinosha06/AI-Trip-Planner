from datetime import date, timedelta
from typing import List
from ..schemas import PreferenceProfile, ItineraryDay, ItineraryItem

BASE_PLACES = {
    "Ella": [
        {"title":"Nine Arch Bridge", "category":"nature", "duration":90, "cost":0, "indoor":False, "lat":6.8768, "lng":81.0608},
        {"title":"Little Adam's Peak", "category":"adventure", "duration":120, "cost":0, "indoor":False, "lat":6.8667, "lng":81.0510},
        {"title":"Ella Spice Garden", "category":"food", "duration":90, "cost":2000, "indoor":True, "lat":6.8732, "lng":81.0468},
        {"title":"Ravana Cave Museum", "category":"history", "duration":75, "cost":1200, "indoor":True, "lat":6.8416, "lng":81.0562},
        {"title":"Tea Craft Studio", "category":"local", "duration":90, "cost":2500, "indoor":True, "lat":6.8721, "lng":81.0475},
        {"title":"Ella Art Café", "category":"cafe", "duration":70, "cost":1800, "indoor":True, "lat":6.8729, "lng":81.0460},
    ],
    "Kandy": [
        {"title":"Temple of the Tooth", "category":"history", "duration":120, "cost":2000, "indoor":True, "lat":7.2936, "lng":80.6413},
        {"title":"Kandy Lake Walk", "category":"nature", "duration":75, "cost":0, "indoor":False, "lat":7.2906, "lng":80.6400},
        {"title":"Ceylon Tea Tasting Room", "category":"food", "duration":75, "cost":2200, "indoor":True, "lat":7.2920, "lng":80.6350},
        {"title":"Udawatta Kele Forest", "category":"adventure", "duration":120, "cost":1000, "indoor":False, "lat":7.2973, "lng":80.6442},
        {"title":"Kandy Craft House", "category":"local", "duration":90, "cost":1800, "indoor":True, "lat":7.2943, "lng":80.6376},
    ],
    "Galle": [
        {"title":"Galle Fort", "category":"history", "duration":150, "cost":0, "indoor":False, "lat":6.0329, "lng":80.2168},
        {"title":"Japanese Peace Pagoda", "category":"nature", "duration":100, "cost":0, "indoor":False, "lat":6.0174, "lng":80.2471},
        {"title":"Maritime Museum", "category":"history", "duration":90, "cost":800, "indoor":True, "lat":6.0255, "lng":80.2193},
        {"title":"Fort Food Lab", "category":"food", "duration":90, "cost":2500, "indoor":True, "lat":6.0263, "lng":80.2165},
        {"title":"Handloom Workshop", "category":"local", "duration":90, "cost":1800, "indoor":True, "lat":6.0272, "lng":80.2175},
    ],
    "Nuwara Eliya": [
        {"title":"Gregory Lake", "category":"nature", "duration":90, "cost":0, "indoor":False, "lat":6.9497, "lng":80.7891},
        {"title":"Victoria Park", "category":"nature", "duration":90, "cost":500, "indoor":False, "lat":6.9712, "lng":80.7654},
        {"title":"Pedro Tea Factory", "category":"local", "duration":90, "cost":800, "indoor":True, "lat":6.9543, "lng":80.7590},
        {"title":"Seetha Amman Temple", "category":"history", "duration":75, "cost":0, "indoor":True, "lat":6.9309, "lng":80.8093},
        {"title":"Horton Plains Viewpoint", "category":"adventure", "duration":180, "cost":3000, "indoor":False, "lat":6.8019, "lng":80.7866},
        {"title":"Nuwara Eliya Tea Lounge", "category":"food", "duration":75, "cost":1800, "indoor":True, "lat":6.9700, "lng":80.7640},
    ],
    "Sigiriya": [
        {"title":"Sigiriya Rock Fortress", "category":"history", "duration":180, "cost":7500, "indoor":False, "lat":7.9570, "lng":80.7603},
        {"title":"Sigiriya Museum", "category":"history", "duration":75, "cost":1000, "indoor":True, "lat":7.9558, "lng":80.7515},
        {"title":"Pidurangala Rock", "category":"adventure", "duration":120, "cost":1000, "indoor":False, "lat":7.9667, "lng":80.7447},
        {"title":"Village Cooking Experience", "category":"food", "duration":120, "cost":3500, "indoor":True, "lat":7.9489, "lng":80.7630},
        {"title":"Minneriya Safari Area", "category":"nature", "duration":180, "cost":7000, "indoor":False, "lat":8.0380, "lng":80.8720},
    ],
    "Colombo": [
        {"title":"Gangaramaya Temple", "category":"history", "duration":90, "cost":1000, "indoor":True, "lat":6.9167, "lng":79.8567},
        {"title":"Galle Face Green", "category":"nature", "duration":75, "cost":0, "indoor":False, "lat":6.9271, "lng":79.8436},
        {"title":"Colombo National Museum", "category":"history", "duration":120, "cost":1500, "indoor":True, "lat":6.9107, "lng":79.8587},
        {"title":"Pettah Market Walk", "category":"local", "duration":120, "cost":0, "indoor":False, "lat":6.9366, "lng":79.8520},
        {"title":"Colombo Food Trail", "category":"food", "duration":120, "cost":3000, "indoor":True, "lat":6.9147, "lng":79.8610},
    ],
    "Anuradhapura": [
        {"title": "Sri Maha Bodhi", "category": "history", "duration": 120, "cost": 1000, "indoor": False, "lat": 8.3448, "lng": 80.3956},
        {"title": "Ruwanwelisaya", "category": "history", "duration": 90, "cost": 500, "indoor": False, "lat": 8.3510, "lng": 80.3941},
        {"title": "Jetavanaramaya", "category": "history", "duration": 90, "cost": 500, "indoor": False, "lat": 8.3533, "lng": 80.4025},
        {"title": "Abhayagiri Vihara", "category": "history", "duration": 100, "cost": 500, "indoor": False, "lat": 8.3621, "lng": 80.3980},
        {"title": "Anuradhapura Museum", "category": "history", "duration": 75, "cost": 800, "indoor": True, "lat": 8.3500, "lng": 80.3900},
    ],
}

def resolve_destination(destination: str) -> str | None:
    query = destination.strip().lower()
    aliases = {
        "nuwara": "Nuwara Eliya",
        "nuwara eliya": "Nuwara Eliya",
        "nuwara eliya, sri lanka": "Nuwara Eliya",
        "ella, sri lanka": "Ella",
        "kandy, sri lanka": "Kandy",
        "galle, sri lanka": "Galle",
        "sigiriya, sri lanka": "Sigiriya",
        "colombo, sri lanka": "Colombo",
        "anuradhapura": "Anuradhapura",
        "anuradhapura, sri lanka": "Anuradhapura",
    }
    if query in aliases:
        return aliases[query]
    for key in BASE_PLACES:
        if key.lower() == query or key.lower() in query or query in key.lower():
            return key
    return None

def pick_places(profile: PreferenceProfile, rainy: bool = False, available_places: List[dict] | None = None) -> List[dict]:
    key = resolve_destination(profile.destination)
    places = available_places if available_places else (BASE_PLACES.get(key, []) if key else [])
    preferred = set(profile.interests + profile.travel_styles)
    scored = []
    for p in places:
        score = 0
        if p["category"] in preferred: score += 3
        if p["indoor"] and rainy: score += 8
        if profile.pace == "relaxed" and p["duration"] <= 90: score += 2
        if profile.pace == "packed" and p["duration"] <= 120: score += 1
        if p["cost"] <= profile.budget: score += 1
        scored.append((score, p))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [p for _, p in scored[:6]]

def build_days(profile: PreferenceProfile, rainy: bool = False, available_places: List[dict] | None = None) -> List[ItineraryDay]:
    chosen = pick_places(profile, rainy, available_places)
    if not chosen:
        raise ValueError(f"No demo places are available for destination '{profile.destination}'. Add a place dataset or configure Google Places API.")
    days = []
    start = date.fromisoformat(profile.start_date)
    per_day = 3 if profile.pace == "relaxed" else 4
    for d in range(profile.days):
        day_places = [chosen[(d * per_day + i) % len(chosen)] for i in range(per_day)]
        items, clock = [], 9 * 60
        for p in day_places:
            if clock > 18 * 60: break
            h, m = divmod(clock, 60)
            reason = "Matches your preferences"
            if rainy and p["indoor"]: reason = "Indoor alternative selected because of rain"
            items.append(ItineraryItem(time=f"{h:02d}:{m:02d}", title=p["title"], category=p["category"], location=profile.destination, duration_min=p["duration"], estimated_cost=p["cost"], indoor=p["indoor"], reason=reason, lat=p["lat"], lng=p["lng"]))
            clock += p["duration"] + 30
        days.append(ItineraryDay(day=d+1, date=str(start + timedelta(days=d)), items=items, day_cost=sum(i.estimated_cost for i in items)))
    return days