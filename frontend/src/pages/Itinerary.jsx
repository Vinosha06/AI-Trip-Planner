import { useState } from 'react'

import {
  ArrowLeft,
  Bot,
  CloudRain,
  MapPin,
  MessageCircle,
  RefreshCw,
  Sparkles,
  WalletCards,
} from 'lucide-react'

import MapPanel from '../components/MapPanel'

import {
  rerouteItinerary,
  chat,
} from '../lib/api'

export default function Itinerary({
  data,
  onHome,
}) {
  const [selectedDay, setSelectedDay] =
    useState(0)

  const [current, setCurrent] =
    useState(data)

  const [loading, setLoading] =
    useState(false)

  const [question, setQuestion] =
    useState('')

  const [answer, setAnswer] =
    useState('')

  const day =
    current?.days?.[selectedDay] ||
    current?.days?.[0]

  const simulate = async () => {
    if (!day?.items?.length) return

    setLoading(true)
    setAnswer('')

    try {
      const next =
        await rerouteItinerary({
          destination:
            current.destination,

          current_activity:
            day.items[0],

          profile: {
            ...current.profile,
            destination:
              current.destination,
          },

          weather_condition:
            'rain',

          traffic_level:
            'high',
        })

      setCurrent({
        ...next,
        profile:
          current.profile,
      })

      setSelectedDay(0)

    } catch (e) {
      setAnswer(e.message)

    } finally {
      setLoading(false)
    }
  }

  const ask = async () => {
    if (!question.trim()) return

    try {
      const result =
        await chat(
          question,
          current.destination
        )

      setAnswer(
        result.answer
      )

    } catch (e) {
      setAnswer(e.message)
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-5 py-7 sm:px-6 lg:py-9">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <button
              onClick={onHome}
              className="back-link"
            >
              <ArrowLeft size={15} />
              Plan another trip
            </button>

            <div className="mt-4 flex flex-wrap items-center gap-3">

              <span className="section-kicker">
                <Sparkles size={13} />
                Your adaptive itinerary
              </span>

              <span className="mode-pill">
                {current.mode || 'demo'} mode
              </span>

            </div>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {current.destination}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {current.summary}
            </p>
          </div>

          <button
            onClick={simulate}
            className="adaptive-button"
            disabled={loading}
          >
            <CloudRain size={17} />

            {loading
              ? 'Updating plan…'
              : 'Simulate rain + traffic'}
          </button>

        </div>

        {/* MAIN CONTENT */}
        <div className="mt-7 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">

          {/* ITINERARY */}
          <section className="itinerary-panel">

            <div className="flex gap-2 overflow-x-auto border-b border-slate-100 pb-4">

              {current.days.map(
                (d, index) => (
                  <button
                    key={d.day}
                    onClick={() =>
                      setSelectedDay(
                        index
                      )
                    }
                    className={`day-tab ${
                      index === selectedDay
                        ? 'day-tab-active'
                        : ''
                    }`}
                  >
                    <span>
                      Day {d.day}
                    </span>

                    <strong>
                      {d.date}
                    </strong>
                  </button>
                )
              )}

            </div>

            <div className="mt-5 flex items-center justify-between gap-3">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Day {day?.day}
                </p>

                <h2 className="mt-1 text-lg font-black text-slate-900">
                  Your stops
                </h2>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                {day?.items?.length || 0}{' '}
                places
              </span>

            </div>

            <div className="mt-4 space-y-3">

              {day?.items?.map(
                (item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="timeline-card"
                  >

                    <div className="timeline-time">
                      {item.time}
                    </div>

                    <div className="timeline-marker">
                      <span />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                        <div>

                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            {item.category} ·{' '}
                            {item.duration_min}{' '}
                            min
                          </p>

                          <h3 className="mt-1 text-sm font-black text-slate-900">
                            {item.title}
                          </h3>

                          <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-400">
                            <MapPin size={12} />
                            {item.location}
                          </p>

                        </div>

                        <span className="cost-badge">
                          LKR{' '}
                          {Number(
                            item.estimated_cost
                          ).toLocaleString()}
                        </span>

                      </div>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {item.reason}
                      </p>

                    </div>
                  </div>
                )
              )}

            </div>

            {/* SUMMARY */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">

              <div className="summary-card">

                <span className="summary-icon">
                  <WalletCards size={17} />
                </span>

                <div>
                  <p>Total estimate</p>

                  <strong>
                    LKR{' '}
                    {Number(
                      current.total_estimated_cost
                    ).toLocaleString()}
                  </strong>
                </div>

              </div>

              <div className="summary-card">

                <span className="summary-icon">
                  <CloudRain size={17} />
                </span>

                <div>
                  <p>Conditions</p>

                  <strong>
                    {current.weather_note ||
                      'Flexible plan'}
                  </strong>
                </div>

              </div>

            </div>

          </section>

          {/* MAP */}
          <MapPanel
            items={day?.items || []}
          />

        </div>

        {/* AI ASSISTANT */}
        <section className="assistant-panel mt-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <span className="assistant-icon">
                <Bot size={19} />
              </span>

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  TripMind Assistant
                </p>

                <h2 className="mt-1 text-base font-black text-slate-900">
                  Need to change something?
                </h2>

              </div>

            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-[11px] font-bold text-indigo-700">
              <MessageCircle size={13} />
              Ask about this trip
            </span>

          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">

            <input
              className="field-input"
              value={question}
              onChange={(e) =>
                setQuestion(
                  e.target.value
                )
              }
              placeholder="Ask about budget, food, timing or alternatives…"
            />

            <button
              className="cta-button sm:w-auto"
              onClick={ask}
            >
              <MessageCircle size={17} />
              Ask AI
            </button>

          </div>

          {answer && (
            <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm leading-6 text-slate-700">
              {answer}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">

            {[
              'Make it more relaxed',
              'Suggest an indoor option',
              'Keep the budget low',
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() =>
                  setQuestion(prompt)
                }
                className="quick-prompt"
              >
                <RefreshCw size={12} />
                {prompt}
              </button>
            ))}

          </div>

        </section>

      </div>
    </main>
  )
}