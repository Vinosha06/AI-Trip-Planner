import asyncio
from .db import places
from .services.itinerary import BASE_PLACES
async def seed():
    await places.delete_many({})
    rows=[{"destination":d,**p} for d,items in BASE_PLACES.items() for p in items]
    if rows: await places.insert_many(rows)
    print(f"Seeded {len(rows)} places")
if __name__=="__main__": asyncio.run(seed())
