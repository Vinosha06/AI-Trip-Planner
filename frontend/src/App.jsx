import { lazy, Suspense, useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { generateItinerary } from "./lib/api";

// Load the itinerary page only when it is needed.
// This prevents Leaflet / React-Leaflet from affecting
// the initial home-page rendering.
const Itinerary = lazy(
  () => import("./pages/Itinerary")
);

export default function App() {
  const [page, setPage] = useState("home");
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (profile) => {
    setBusy(true);
    setError("");

    try {
      const result = await generateItinerary(
        profile
      );

      setData({
        ...result,
        profile,
      });

      setPage("itinerary");
    } catch (error) {
      console.error(
        "Generate itinerary error:",
        error
      );

      setError(
        error?.message ||
          "Unable to generate itinerary."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Navbar
        onHome={() => {
          setPage("home");
          setError("");
        }}
      />

      {error && (
        <div className="mx-auto max-w-7xl px-6 pt-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        </div>
      )}

      {busy ? (
        <div className="mx-auto flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

            <p className="mt-4 font-semibold">
              Designing your trip...
            </p>
          </div>
        </div>
      ) : page === "home" ? (
        <Home
          onGenerate={handleGenerate}
        />
      ) : (
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

                <p className="mt-4 font-semibold">
                  Loading itinerary...
                </p>
              </div>
            </div>
          }
        >
          <Itinerary
            data={data}
            onHome={() => {
              setPage("home");
              setError("");
            }}
          />
        </Suspense>
      )}
    </>
  );
}