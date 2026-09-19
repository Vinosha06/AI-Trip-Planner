from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from bson import ObjectId

from .config import settings
from .db import trips, places
from .models import serialize_doc, utc_now
from .schemas import (
    PreferenceProfile,
    ItineraryResponse,
    RerouteRequest,
    ChatRequest,
)
from .services.weather import get_weather
from .services.itinerary import build_days, resolve_destination, BASE_PLACES
from .services.ai import generate_ai_itinerary, answer_chat
# search_places import eka dan aawashya nathi nisa ain kala


app = FastAPI(
    title="AI Hyper-Personalized Itinerary Planner",
    version="1.1.0"
)


# Allow React frontend running on localhost / 127.0.0.1
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_origin,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Prevent unhandled backend errors from appearing as a CORS-only error
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    print("UNHANDLED BACKEND ERROR:", repr(exc))
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error. Check the backend terminal for the actual error."
        },
    )


@app.on_event("startup")
async def startup_seed_places():
    if await places.count_documents({}) == 0:
        rows = [
            {"destination": destination, **place}
            for destination, items in BASE_PLACES.items()
            for place in items
        ]

        if rows:
            await places.insert_many(rows)


@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "service": "trip-planner-api",
        "google_places_enabled": False, # Payment/card requirement bypassed
    }


async def get_dynamic_places(destination: str) -> list[dict]:
    """
    Skip live Google Places API to avoid card/payment requirements.
    Directly use curated places and local cache.
    """
    destination = destination.strip()

    # 1. Try MongoDB cached results for EXACT destination
    cached = await places.find(
        {"destination": destination}
    ).to_list(50)

    if cached:
        return [serialize_doc(x) for x in cached]

    # 2. Curated fallback for supported destinations
    key = resolve_destination(destination)

    if key:
        return BASE_PLACES.get(key, [])

    return []


@app.get("/api/places")
async def get_places(destination: str):
    return await get_dynamic_places(destination)


@app.post(
    "/api/itinerary/generate",
    response_model=ItineraryResponse
)
async def generate(profile: PreferenceProfile):

    available_places = await get_dynamic_places(
        profile.destination
    )

    # Weather service has its own fallback handling
    weather = await get_weather(
        profile.destination
    )

    # AI service also has its own fallback handling
    ai_data = await generate_ai_itinerary(
        profile,
        weather,
        available_places
    )

    mode = (
        "ai"
        if ai_data
        else "demo"
    )

    # -----------------------------
    # AI-generated itinerary
    # -----------------------------
    if ai_data and "days" in ai_data:

        allowed = {
            p["title"]: p
            for p in available_places
        }

        for day in ai_data.get("days", []):

            for item in day.get("items", []):

                match = allowed.get(
                    item.get("title")
                )

                if match:
                    item.update(
                        {
                            "category": match["category"],
                            "duration_min": match["duration"],
                            "estimated_cost": match["cost"],
                            "indoor": match["indoor"],
                            "lat": match["lat"],
                            "lng": match["lng"],
                            "location": (
                                match.get("address")
                                or profile.destination
                            ),
                        }
                    )
                else:
                    item["location"] = profile.destination

        try:
            response = ItineraryResponse(
                **ai_data,
                mode=mode
            )
        except Exception as exc:
            print(
                "AI response validation error:",
                repr(exc)
            )
            ai_data = None
            response = None

    else:
        response = None

    # -----------------------------
    # Demo / fallback itinerary
    # -----------------------------
    if response is None:

        if not available_places:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"No places were found for "
                    f"'{profile.destination}'. "
                    f"Please check the destination name."
                ),
            )

        rainy = any(
            word in weather.get(
                "condition",
                ""
            ).lower()
            for word in [
                "rain",
                "storm",
                "drizzle"
            ]
        )

        try:
            days = build_days(
                profile,
                rainy,
                available_places
            )

        except ValueError as exc:
            raise HTTPException(
                status_code=400,
                detail=str(exc)
            ) from exc

        response = ItineraryResponse(
            destination=profile.destination,
            summary=(
                f"Personalized {profile.days}-day plan "
                f"for {profile.destination} based on "
                f"your {profile.mood} mood and selected "
                f"preferences."
            ),
            total_estimated_cost=sum(
                day.day_cost
                for day in days
            ),
            days=days,
            weather_note=(
                f"Current weather: "
                f"{weather.get('description', 'Unknown')} "
                f"({weather.get('temperature', 28)}°C)."
            ),
            mode=mode,
        )

    # Save trip
    doc = response.model_dump()

    doc.update(
        {
            "created_at": utc_now(),
            "profile": profile.model_dump(),
        }
    )

    inserted = await trips.insert_one(doc)

    response.trip_id = str(
        inserted.inserted_id
    )

    return response


@app.get(
    "/api/itinerary/{trip_id}",
    response_model=ItineraryResponse
)
async def get_itinerary(trip_id: str):

    try:
        doc = await trips.find_one(
            {"_id": ObjectId(trip_id)}
        )

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail="Invalid trip id"
        ) from exc

    if not doc:
        raise HTTPException(
            status_code=404,
            detail="Trip not found"
        )

    result = serialize_doc(doc)

    return ItineraryResponse(
        **{
            key: value
            for key, value in result.items()
            if key in ItineraryResponse.model_fields
        }
    )


@app.post(
    "/api/itinerary/reroute",
    response_model=ItineraryResponse
)
async def reroute(payload: RerouteRequest):

    available_places = await get_dynamic_places(
        payload.destination
    )

    if not available_places:
        raise HTTPException(
            status_code=400,
            detail=(
                f"No places were found for "
                f"'{payload.destination}'."
            ),
        )

    rainy = any(
        word in payload.weather_condition.lower()
        for word in [
            "rain",
            "storm",
            "drizzle"
        ]
    )

    try:
        days = build_days(
            payload.profile,
            rainy,
            available_places
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        ) from exc

    return ItineraryResponse(
        destination=payload.destination,
        summary=(
            f"Dynamic plan updated because of "
            f"{payload.weather_condition} weather "
            f"and {payload.traffic_level} traffic."
        ),
        total_estimated_cost=sum(
            day.day_cost
            for day in days
        ),
        days=days,
        weather_note="Re-routed around current conditions.",
        mode="adaptive",
    )


@app.get("/api/weather")
async def weather(destination: str):
    return await get_weather(destination)


@app.post("/api/chat")
async def chat(payload: ChatRequest):
    return {
        "answer": await answer_chat(
            payload.question,
            payload.destination
        )
    }