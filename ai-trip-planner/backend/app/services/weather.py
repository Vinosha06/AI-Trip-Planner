import httpx
from ..config import settings

async def get_weather(destination: str):
    if not settings.openweather_api_key:
        return {"condition": "clear", "description": "Demo weather data", "temperature": 28, "source": "demo"}
    async with httpx.AsyncClient(timeout=8) as client:
        r = await client.get("https://api.openweathermap.org/data/2.5/weather", params={"q":destination,"appid":settings.openweather_api_key,"units":"metric"})
        r.raise_for_status(); data=r.json()
    w=data.get("weather", [{}])[0]
    return {"condition":w.get("main","clear").lower(),"description":w.get("description",""),"temperature":data.get("main",{}).get("temp"),"source":"openweather"}
