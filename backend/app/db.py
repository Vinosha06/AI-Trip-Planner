from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

client = AsyncIOMotorClient(settings.mongo_uri)
db = client[settings.mongo_db]
users = db.users
trips = db.trips
places = db.places
