# AI Hyper-Personalized Itinerary Planner

Docker-free full-stack project using React + Vite, Tailwind CSS, FastAPI, MongoDB Atlas, Google Places API (New), OpenWeather API, and optional OpenAI.

## What makes this version dynamic?

Enter any destination in Sri Lanka, for example `Jaffna`, `Trincomalee`, `Ratnapura`, `Nuwara Eliya`, `Galle`, or `Colombo`. When `GOOGLE_PLACES_API_KEY` is configured, the backend searches Google Places for live attractions, restaurants and cafes around the requested destination, stores the returned places in MongoDB Atlas, and uses their real coordinates in the itinerary/map.

The backend never intentionally substitutes another Sri Lankan city when a destination is unknown. If Google Places is unavailable and there is no cached/curated dataset for the destination, the API returns a clear error instead of showing the wrong city's places.

## 1. Backend

```powershell
cd backend
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
```

Create `backend/.env` from `.env.example` and add your MongoDB Atlas connection string plus:

```env
GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

Enable **Places API (New)** in Google Cloud, then run:

```powershell
uvicorn app.main:app --reload --port 8000
```

Swagger: http://localhost:8000/docs

## 2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## 3. Google Places setup

Google Places API (New) Text Search uses a POST request to `https://places.googleapis.com/v1/places:searchText` and requires an API key plus a response field mask. This project requests only the fields needed for names, addresses, coordinates, types, price level and Maps URI.

For development, restrict the API key to the Places API where possible and monitor quota/billing in Google Cloud.

## 4. MongoDB Atlas

No local MongoDB installation is required. The backend stores generated trips and live Google Places results in MongoDB Atlas.
