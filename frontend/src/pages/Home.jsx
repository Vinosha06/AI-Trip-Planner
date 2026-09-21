import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CloudSun,
  MapPinned,
  Sparkles,
  WalletCards,
  Zap,
} from 'lucide-react'

import PreferenceForm from '../components/PreferenceForm'

const features = [
  {
    icon: Sparkles,
    title: 'Made for you',
    description:
      'Mood, interests, food choices and pace shape every recommendation.',
    tone: 'indigo',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop',
  },
  {
    icon: CloudSun,
    title: 'Adapts in real time',
    description:
      'Weather and travel conditions can trigger a smarter alternative plan.',
    tone: 'amber',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop',
  },
  {
    icon: CalendarDays,
    title: 'Time-aware',
    description:
      'Build a realistic day instead of a long list of places you cannot finish.',
    tone: 'emerald',
    image: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=600&auto=format&fit=crop',
  },
  {
    icon: WalletCards,
    title: 'Budget-aware',
    description:
      'Estimated costs stay visible while the itinerary is being planned.',
    tone: 'violet',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop',
  },
]

export default function Home({ onGenerate }) {
  return (
    <div className="overflow-hidden bg-[#f8fafc]">

      {/* HERO */}
      <section className="hero-shell relative overflow-hidden bg-slate-950 text-white">
        {/* Background Image Banner Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transform hover:scale-100 transition-all duration-1000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1600&auto=format&fit=crop')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-indigo-950/40" />

        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:py-24">

          <div>
            <div className="hero-pill inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-emerald-300 backdrop-blur-md border border-white/10 shadow-lg">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-sm">
                <Sparkles size={12} />
              </span>
              AI-powered hyper-personalized planning
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.03] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Plan less.{' '}
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
                Experience more.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg font-medium">
              TripMind turns your destination, budget and mood into a
              practical itinerary — then adapts it when weather or
              traffic changes.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#planner" className="hero-cta bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-xl shadow-emerald-500/20 px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all">
                Start planning
                <ArrowRight size={18} />
              </a>

              <a href="#features" className="hero-secondary bg-white/10 hover:bg-white/20 text-white border border-white/15 px-6 py-3.5 rounded-2xl font-bold backdrop-blur-md transition-all">
                See how it works
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-xs font-semibold text-slate-300">
              {[
                'Sri Lanka destinations',
                'Smart budget planning',
                'Weather-aware changes',
              ].map((text) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-2"
                >
                  <CheckCircle2
                    size={15}
                    className="text-emerald-400"
                  />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* PREVIEW */}
          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">

            <div className="floating-card floating-card-top bg-white/95 text-slate-900 backdrop-blur-xl shadow-2xl rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <span className="icon-tile bg-indigo-100 text-indigo-600 p-2.5 rounded-xl">
                  <MapPinned size={18} />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Planning now
                  </p>
                  <p className="text-sm font-extrabold text-slate-900">
                    Nuwara Eliya, Sri Lanka
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                Live
              </span>
            </div>

            <div className="preview-card bg-slate-900/90 border border-slate-700/60 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">

              <div className="preview-topbar flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-300">
                    Adaptive day plan
                  </p>
                  <p className="mt-1 text-2xl font-black text-white">
                    Friday in the hills
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3">
                  <CloudSun
                    size={30}
                    className="text-amber-400"
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                <div className="mini-stat bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50 text-center">
                  <p className="text-[11px] text-slate-400">Weather</p>
                  <strong className="text-sm text-white">22°C</strong>
                </div>

                <div className="mini-stat bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50 text-center">
                  <p className="text-[11px] text-slate-400">Budget</p>
                  <strong className="text-sm text-emerald-400">Rs 12.4k</strong>
                </div>

                <div className="mini-stat bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50 text-center">
                  <p className="text-[11px] text-slate-400">Stops</p>
                  <strong className="text-sm text-indigo-300">4 places</strong>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                {[
                  ['09:00', 'Tea Estate Walk', 'Nature'],
                  ['12:30', 'Local Lunch', 'Food'],
                  ['15:00', 'Gregory Lake', 'Relax'],
                  ['17:30', 'Cafe & Sunset', 'Local'],
                ].map(([time, title, type]) => (
                  <div
                    key={time}
                    className="preview-item flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:bg-slate-800/80 transition-all"
                  >
                    <span className="w-12 text-xs font-bold text-teal-300">
                      {time}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">
                        {title}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {type}
                      </p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Zap
                    size={14}
                    className="text-amber-400"
                  />
                  Changes automatically when conditions shift
                </span>
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  AI
                </span>
              </div>

            </div>

            <div className="floating-card floating-card-bottom bg-white/95 text-slate-900 backdrop-blur-xl shadow-2xl rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <span className="status-ring bg-emerald-100 text-emerald-600 p-2 rounded-xl">
                  <CheckCircle2 size={16} />
                </span>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">
                    Smart route ready
                  </p>
                  <p className="text-[11px] text-slate-500">
                    4 places · balanced pace
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES with Image Banners */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:py-20"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              <Sparkles size={13} />
              Why TripMind
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              A planner that thinks beyond a checklist.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-slate-500 font-medium">
            Designed to balance discovery, time, cost and changing
            conditions — without taking away your control.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map(
            ({ icon: Icon, title, description, tone, image }) => (
              <div
                key={title}
                className={`feature-card feature-${tone} group relative overflow-hidden rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-1.5 transition-all duration-300`}
              >
                {/* Image Header Background inside Card */}
                <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white z-10" />
                  <img 
                    src={image} 
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                  />
                </div>

                <div className="relative z-20 pt-14">
                  <div className="feature-icon inline-flex p-3 rounded-2xl bg-white shadow-md text-indigo-600 border border-slate-100">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                    {title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-500 font-medium">
                    {description}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* PLANNER */}
      <section
        id="planner"
        className="mx-auto max-w-7xl px-5 pb-24 sm:px-6"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="step-number flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white font-black shadow-lg shadow-indigo-500/25">
            01
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              Trip builder
            </p>
            <p className="text-sm font-extrabold text-slate-800">
              Start with your preferences
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100">
          <PreferenceForm
            onGenerate={onGenerate}
          />
        </div>
      </section>

    </div>
  )
}