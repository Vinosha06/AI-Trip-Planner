# AI-Driven Hyper-Personalized Itinerary Planner

A full-stack travel planning web application with:
- React + Vite + Tailwind CSS frontend
- FastAPI backend
- MongoDB database
- AI itinerary generation with OpenAI-compatible integration
- Weather-aware dynamic rerouting
- Smart budget/time optimization
- Hidden-gem and local recommendations
- Docker Compose for local deployment

## Project structure

```text
ai-trip-planner/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── db.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── seed.py
│   │   └── services/
│   │       ├── ai.py
│   │       ├── itinerary.py
│   │       └── weather.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Run with Docker

1. Copy `.env.example` to `.env`.
2. Add API keys if you have them. The application still works in demo mode without them.
3. Run:

```bash
docker compose up --build
```

Open `http://localhost:5173`.

Backend API docs: `http://localhost:8000/docs`

## Run without Docker

### Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment variables

See `.env.example`. `OPENAI_API_KEY`, `OPENWEATHER_API_KEY`, and optional `GOOGLE_PLACES_API_KEY` can be added later. The initial MVP has safe fallback/demo behavior so the UI can be demonstrated without paid API access.

### Demo data
The backend contains a small Sri Lankan destination catalog (Ella, Kandy, Galle) used when third-party API keys are not configured. This lets you demonstrate the workflow first, then switch to live AI/weather integrations.
