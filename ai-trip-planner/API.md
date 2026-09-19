# API Reference

Base URL: `http://localhost:8000/api`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Backend health check |
| GET | `/places?destination=Ella` | Read local place catalog |
| GET | `/weather?destination=Ella` | Get live/demo weather |
| POST | `/itinerary/generate` | Generate and persist a personalized itinerary |
| GET | `/itinerary/{trip_id}` | Load a saved itinerary |
| POST | `/itinerary/reroute` | Recalculate the plan after weather/traffic changes |
| POST | `/chat` | Ask the travel assistant |

## Generate request example

```json
{
  "destination": "Ella, Sri Lanka",
  "start_date": "2026-10-10",
  "days": 3,
  "budget": 50000,
  "currency": "LKR",
  "food_preferences": ["traditional"],
  "travel_styles": ["nature", "local"],
  "pace": "balanced",
  "mood": "curious",
  "interests": ["nature", "history"]
}
```
