from __future__ import annotations

from typing import Any
import httpx
from ..config import settings

GOOGLE_PLACES_URL = "https://places.googleapis.com/v1/places:searchText"


def _category(types: list[str]) -> str:
    s = set(types or [])
    if s & {"restaurant", "meal_takeaway", "meal_delivery", "bar", "cafe"}:
        return "food" if "restaurant" in s or "meal_takeaway" in s or "meal_delivery" in s else "cafe"
    if s & {"museum", "hindu_temple", "church", "mosque", "place_of_worship", "historical_landmark"}:
        return "history"
    if s & {"park", "national_park", "beach", "tourist_attraction", "hiking_area", "campground", "natural_feature"}:
        return "nature"
    if s & {"art_gallery", "cultural_center", "market", "shopping_mall", "gift_shop"}:
        return "local"
    return "nature"


def _estimate_cost(price_level: str | None, category: str) -> int:
    if category in {"nature", "history", "local"} and not price_level:
        return 0
    return {
        "PRICE_LEVEL_FREE": 0,
        "PRICE_LEVEL_INEXPENSIVE": 750,
        "PRICE_LEVEL_MODERATE": 2000,
        "PRICE_LEVEL_EXPENSIVE": 4500,
        "PRICE_LEVEL_VERY_EXPENSIVE": 7000,
    }.get(price_level or "", 1500 if category in {"food", "cafe"} else 1000)


def _estimate_duration(category: str) -> int:
    return {"history": 90, "nature": 105, "local": 90, "food": 75, "cafe": 60}.get(category, 90)


def _normalize(place: dict[str, Any]) -> dict[str, Any] | None:
    name = (place.get("displayName") or {}).get("text")
    loc = place.get("location") or {}
    lat, lng = loc.get("latitude"), loc.get("longitude")
    if not name or lat is None or lng is None:
        return None
    category = _category(place.get("types", []))
    return {
        "title": name,
        "category": category,
        "duration": _estimate_duration(category),
        "cost": _estimate_cost(place.get("priceLevel"), category),
        "indoor": category in {"history", "food", "cafe"},
        "lat": float(lat),
        "lng": float(lng),
        "address": place.get("shortFormattedAddress") or place.get("formattedAddress", ""),
        "google_maps_uri": (place.get("googleMapsLinks") or {}).get("placeUri") or place.get("googleMapsUri", ""),
        "google_place_id": place.get("id", ""),
        "source": "google_places",
    }


async def search_places(destination: str, limit: int = 20) -> list[dict[str, Any]]:
    if not settings.google_places_api_key:
        return []

    queries = [
        f"tourist attractions, landmarks, parks, museums, viewpoints, beaches and things to do in {destination}, Sri Lanka",
        f"popular restaurants and cafes in {destination}, Sri Lanka",
    ]
    field_mask = (
        "places.id,places.displayName,places.formattedAddress,places.shortFormattedAddress,"
        "places.location,places.types,places.priceLevel,places.googleMapsUri"
    )
    found: list[dict[str, Any]] = []
    seen: set[str] = set()

    async with httpx.AsyncClient(timeout=12) as client:
        for query in queries:
            response = await client.post(
                GOOGLE_PLACES_URL,
                headers={
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": settings.google_places_api_key,
                    "X-Goog-FieldMask": field_mask,
                },
                json={"textQuery": query, "pageSize": min(limit, 20), "regionCode": "LK", "languageCode": "en"},
            )
            response.raise_for_status()
            for raw in response.json().get("places", []):
                item = _normalize(raw)
                if not item:
                    continue
                key = item["google_place_id"] or item["title"].lower()
                if key in seen:
                    continue
                seen.add(key)
                found.append(item)

    return found