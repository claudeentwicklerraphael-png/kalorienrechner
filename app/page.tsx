import Calculator from '@/components/Calculator';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="relative bg-gradient-to-br from-red-800 via-orange-700 to-amber-600 px-4 py-14 overflow-hidden">
        {/* Flammen-Hintergrund */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 left-1/4 w-32 h-40 bg-yellow-300 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-48 h-56 bg-orange-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-32 h-40 bg-red-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto relative">
          <p className="text-orange-200 text-xs font-semibold tracking-widest uppercase mb-3">
            🔥 Ernährungsrechner
          </p>
          <h1 className="text-4xl font-bold text-white tracking-tight">Kalorienrechner</h1>
          <p className="mt-2 text-orange-100 text-base max-w-xl">
            Grundumsatz, TDEE und Makroverteilung – berechnet direkt im Browser.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 -mt-6 pb-16">
        <Calculator />
      </main>

      <footer className="pb-8 text-center text-xs text-zinc-600">
        Alle Berechnungen laufen lokal. Es werden keine Daten übermittelt.
      </footer>
    </div>
  );
}
