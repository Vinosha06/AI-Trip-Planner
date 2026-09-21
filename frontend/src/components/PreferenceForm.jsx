import { useState } from 'react'
import {
  CalendarDays,
  DollarSign,
  MapPin,
  Sparkles,
} from 'lucide-react'

const styles = [
  {
    id: 'adventure',
    label: 'Adventure',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'history',
    label: 'History',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'nature',
    label: 'Nature',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'food',
    label: 'Food',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'local',
    label: 'Local',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'cafe',
    label: 'Cafés',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=300&q=80',
  },
]

export default function PreferenceForm({
  onGenerate,
}) {
  const [f, setF] = useState({
    destination: 'Nuwara Eliya, Sri Lanka',
    start_date: new Date()
      .toISOString()
      .slice(0, 10),
    days: 3,
    budget: 50000,
    currency: 'LKR',
    food_preferences: ['traditional'],
    travel_styles: ['nature'],
    pace: 'balanced',
    mood: 'curious',
    interests: ['nature', 'local'],
  })

  const update = (key, value) => {
    setF((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const toggle = (key, value) => {
    setF((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(
            (item) => item !== value
          )
        : [...prev[key], value],
    }))
  }

  const submit = (e) => {
    e.preventDefault()

    onGenerate({
      ...f,
      destination: f.destination.trim(),
      days: Number(f.days),
      budget: Number(f.budget),
    })
  }

  return (
    <form
      onSubmit={submit}
      className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/30 p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl"
    >
      {/* Decorative Background Glows */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full shadow-sm">
            <Sparkles size={13} />
            Personalize your trip
          </div>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            Tell us how you like to travel.
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 font-medium">
            Your choices guide the places, pace and activities
            in your itinerary.
          </p>
        </div>

        <div className="hidden rounded-2xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-100 px-4 py-3 text-right sm:block shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">
            Planner mode
          </p>

          <p className="mt-1 text-sm font-extrabold text-slate-800">
            Hyper-personalized
          </p>
        </div>

      </div>

      <div className="relative z-10 mt-8 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">

        {/* LEFT */}
        <div className="space-y-6">

          <div className="grid gap-5 sm:grid-cols-2">

            <label className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <MapPin size={15} className="text-indigo-600" />
                Destination
              </span>

              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                value={f.destination}
                onChange={(e) =>
                  update(
                    'destination',
                    e.target.value
                  )
                }
                placeholder="e.g. Ella, Sri Lanka"
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <CalendarDays size={15} className="text-indigo-600" />
                Start date
              </span>

              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                type="date"
                value={f.start_date}
                onChange={(e) =>
                  update(
                    'start_date',
                    e.target.value
                  )
                }
                required
              />
            </label>

          </div>

          <div className="grid gap-5 sm:grid-cols-2">

            <label className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Trip length
              </span>

              <div className="relative">
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-16 text-sm font-semibold text-slate-800 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                  type="number"
                  min="1"
                  max="14"
                  value={f.days}
                  onChange={(e) =>
                    update(
                      'days',
                      e.target.value
                    )
                  }
                  required
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                  days
                </span>
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <DollarSign size={15} className="text-emerald-600" />
                Budget
              </span>

              <div className="relative">
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-16 text-sm font-semibold text-slate-800 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                  type="number"
                  min="1"
                  value={f.budget}
                  onChange={(e) =>
                    update(
                      'budget',
                      e.target.value
                    )
                  }
                  required
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                  LKR
                </span>
              </div>
            </label>

          </div>

          <div>

            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Travel style
              </span>

              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                Select all that fit
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

              {styles.map((option) => {
                const active =
                  f.travel_styles.includes(
                    option.id
                  )

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      toggle(
                        'travel_styles',
                        option.id
                      )
                    }
                    className={`group relative overflow-hidden flex flex-col items-start justify-end p-3 h-24 rounded-2xl border text-left font-bold transition-all duration-300 shadow-sm ${
                      active
                        ? 'ring-2 ring-indigo-600 ring-offset-2 border-transparent scale-[1.02]'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Background Thumbnail Image */}
                    <img
                      src={option.image}
                      alt={option.label}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Dark Gradient Overlay for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

                    {/* Label & Check Icon */}
                    <div className="relative z-10 flex w-full items-center justify-between text-white">
                      <span className="text-xs font-extrabold tracking-wide drop-shadow">
                        {option.label}
                      </span>

                      {active ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-black shadow-md">
                          ✓
                        </span>
                      ) : (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-transparent text-[10px]">
                          ○
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}

            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <aside className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 text-white shadow-2xl border border-slate-800 flex flex-col justify-between">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-300 backdrop-blur-md border border-white/10">
              <Sparkles size={11} />
              Fine-tune the vibe
            </div>

            <div className="mt-5 space-y-4">

              <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-300">
                <span>Travel pace</span>
                <select
                  className="w-full rounded-2xl bg-slate-800/90 border border-slate-700/80 px-4 py-3 text-xs font-bold text-white shadow-inner focus:border-indigo-400 focus:outline-none"
                  value={f.pace}
                  onChange={(e) =>
                    update(
                      'pace',
                      e.target.value
                    )
                  }
                >
                  <option value="relaxed">Relaxed</option>
                  <option value="balanced">Balanced</option>
                  <option value="packed">Packed</option>
                </select>
              </label>

              <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-300">
                <span>Mood</span>
                <select
                  className="w-full rounded-2xl bg-slate-800/90 border border-slate-700/80 px-4 py-3 text-xs font-bold text-white shadow-inner focus:border-indigo-400 focus:outline-none"
                  value={f.mood}
                  onChange={(e) =>
                    update(
                      'mood',
                      e.target.value
                    )
                  }
                >
                  <option value="curious">Curious & explorer</option>
                  <option value="relaxed">Calm & relaxed</option>
                  <option value="energetic">Energetic</option>
                  <option value="romantic">Romantic</option>
                </select>
              </label>

              <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-300">
                <span>Food preference</span>
                <select
                  className="w-full rounded-2xl bg-slate-800/90 border border-slate-700/80 px-4 py-3 text-xs font-bold text-white shadow-inner focus:border-indigo-400 focus:outline-none"
                  value={
                    f.food_preferences[0]
                  }
                  onChange={(e) =>
                    update(
                      'food_preferences',
                      [e.target.value]
                    )
                  }
                >
                  <option value="traditional">Traditional Sri Lankan</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="street-food">Street food</option>
                </select>
              </label>

            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400" />
              What happens next?
            </p>
            <p className="mt-1.5 text-[11px] leading-5 text-slate-300">
              We match your profile with destination places, weather and budget for a smart day plan.
            </p>
          </div>
        </aside>
      </div>

      <button
        className="relative z-10 mt-8 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white shadow-xl shadow-emerald-500/25 px-8 py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.01]"
        type="submit"
      >
        <Sparkles size={20} className="text-emerald-200" />
        Generate my itinerary
        <span className="ml-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-black backdrop-blur-md">
          AI
        </span>
      </button>

    </form>
  )
}