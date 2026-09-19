from datetime import datetime, timezone
from bson import ObjectId

def serialize_doc(doc: dict) -> dict:
    if not doc:
        return doc
    result = dict(doc)
    if isinstance(result.get("_id"), ObjectId):
        result["id"] = str(result.pop("_id"))
    return result

def utc_now() -> datetime:
    return datetime.now(timezone.utc)
