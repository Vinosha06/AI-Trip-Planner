import { Compass, Sparkles } from 'lucide-react'

export default function Navbar({ onHome }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
        <button
          onClick={onHome}
          className="group flex items-center gap-3 text-left"
        >
          <span className="brand-mark">
            <Compass size={20} strokeWidth={2.4} />
          </span>

          <span>
            <span className="block text-[15px] font-black tracking-tight text-slate-950">
              TripMind AI
            </span>

            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 sm:block">
              Smart travel, your way
            </span>
          </span>
        </button>

        <div className="hidden items-center gap-7 text-sm font-semibold text-slate-500 md:flex">
          <a href="#features" className="nav-link">
            Features
          </a>

          <a href="#planner" className="nav-link">
            Planner
          </a>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
          <span className="status-dot" />
          <Sparkles size={13} />
          Adaptive AI
        </div>
      </div>
    </nav>
  )
}