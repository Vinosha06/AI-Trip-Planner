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
}

def pick_places(profile: PreferenceProfile, rainy: bool = False) -> List[dict]:
    key = next((k for k in BASE_PLACES if k.lower() in profile.destination.lower()), "Ella")
    places = BASE_PLACES[key]
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

def build_days(profile: PreferenceProfile, rainy: bool = False) -> List[ItineraryDay]:
    chosen = pick_places(profile, rainy)
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
