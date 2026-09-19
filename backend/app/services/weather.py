import httpx

from ..config import settings


async def get_weather(destination: str):

    # No API key → demo weather
    if not settings.openweather_api_key:
        return {
            "condition": "clear",
            "description": "Demo weather data",
            "temperature": 28,
            "source": "demo",
        }

    try:
        async with httpx.AsyncClient(
            timeout=8
        ) as client:

            response = await client.get(
                "https://api.openweathermap.org/data/2.5/weather",
                params={
                    "q": destination,
                    "appid": settings.openweather_api_key,
                    "units": "metric",
                },
            )

            response.raise_for_status()

            data = response.json()

        weather_data = data.get(
            "weather",
            [{}]
        )[0]

        return {
            "condition": weather_data.get(
                "main",
                "clear"
            ).lower(),

            "description": weather_data.get(
                "description",
                ""
            ),

            "temperature": data.get(
                "main",
                {}
            ).get(
                "temp"
            ),

            "source": "openweather",
        }

    except Exception as exc:

        # Weather API failure should not crash
        # itinerary generation
        print(
            "OpenWeather error:",
            repr(exc)
        )

        return {
            "condition": "clear",
            "description": (
                "Weather unavailable; "
                "using demo conditions"
            ),
            "temperature": 28,
            "source": "demo-fallback",
        }