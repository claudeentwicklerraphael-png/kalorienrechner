import Calculator from '@/components/Calculator';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 px-4 py-14">
        <div className="max-w-4xl mx-auto">
          <p className="text-emerald-200 text-xs font-semibold tracking-widest uppercase mb-3">
            Ernährungsrechner
          </p>
          <h1 className="text-4xl font-bold text-white tracking-tight">Kalorienrechner</h1>
          <p className="mt-2 text-emerald-100 text-base max-w-xl">
            Grundumsatz, TDEE und Makroverteilung – berechnet direkt im Browser.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 -mt-6 pb-16">
        <Calculator />
      </main>

      <footer className="pb-8 text-center text-xs text-slate-400">
        Alle Berechnungen laufen lokal. Es werden keine Daten übermittelt.
      </footer>
    </div>
  );
}
