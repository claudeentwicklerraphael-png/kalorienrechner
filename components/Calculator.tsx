'use client';

import { useState } from 'react';
import {
  calculate,
  validateInputs,
  DEFAULT_INPUTS,
  PROTEIN_FAKTOREN,
} from '@/lib/calculator';
import type { CalculatorInputs, CalculatorResults, Proteinquelle } from '@/lib/calculator';

// ── Daten ─────────────────────────────────────────────────────────────────────

const AKTIVITAET_OPTIONEN = [
  { value: 1.2, label: '1,2 – Kaum Bewegung' },
  { value: 1.375, label: '1,375 – Leicht aktiv (1–3× Sport/Woche)' },
  { value: 1.55, label: '1,55 – Moderat aktiv (3–5× Sport/Woche)' },
  { value: 1.725, label: '1,725 – Sehr aktiv (6–7× Sport/Woche)' },
  { value: 1.9, label: '1,9 – Extrem aktiv' },
];

// ── Helfer ────────────────────────────────────────────────────────────────────

function fmt(value: number, decimals = 0): string {
  return value.toFixed(decimals);
}

function fmtPct(value: number): string {
  return value.toFixed(1) + ' %';
}

// ── Sub-Komponenten ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-widest uppercase text-orange-500 mb-3 mt-8 first:mt-0">
      {children}
    </p>
  );
}

function InputField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-zinc-100 text-sm font-medium ' +
  'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-zinc-750 transition-all';

/** Dreifarbiger gestapelter Balken für die Makroverteilung */
function MacroBar({
  proteinPct,
  fettPct,
  khPct,
}: {
  proteinPct: number;
  fettPct: number;
  khPct: number;
}) {
  const p = Math.max(0, proteinPct);
  const f = Math.max(0, fettPct);
  const k = Math.max(0, khPct);
  return (
    <div className="flex h-3 w-full rounded-full overflow-hidden bg-zinc-800">
      <div
        className="bg-red-500 transition-all duration-500"
        style={{ width: `${p}%` }}
        title={`Protein ${p.toFixed(1)} %`}
      />
      <div
        className="bg-amber-400 transition-all duration-500"
        style={{ width: `${f}%` }}
        title={`Fett ${f.toFixed(1)} %`}
      />
      <div
        className="bg-yellow-400 transition-all duration-500"
        style={{ width: `${k}%` }}
        title={`Kohlenhydrate ${k.toFixed(1)} %`}
      />
    </div>
  );
}

/** Einzelne Makro-Karte mit farbigem Akzentstreifen */
function MacroCard({
  label,
  kcal,
  gramm,
  pct,
  color,
  warn = false,
}: {
  label: string;
  kcal: number;
  gramm: number;
  pct: number;
  color: string;
  warn?: boolean;
}) {
  return (
    <div
      className={`bg-zinc-900 rounded-2xl border shadow-sm overflow-hidden ${
        warn ? 'border-red-500' : 'border-zinc-700'
      }`}
    >
      <div className={`h-1 w-full ${color}`} />
      <div className="p-5">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">{label}</p>
        <p className={`text-3xl font-bold ${warn ? 'text-red-400' : 'text-zinc-100'}`}>
          {fmt(gramm, 1)} <span className="text-lg font-medium text-zinc-500">g</span>
        </p>
        <div className="mt-3 flex items-center justify-between text-sm text-zinc-500">
          <span>{fmt(kcal)} kcal</span>
          <span className="font-medium">{fmtPct(pct)}</span>
        </div>
      </div>
    </div>
  );
}

/** Kennzahl-Karte: Grundumsatz / TDEE / Kalorienziel */
function MetricCard({
  label,
  value,
  unit,
  accent = false,
}: {
  label: string;
  value: string;
  unit: string;
  accent?: boolean;
}) {
  if (accent) {
    return (
      <div className="bg-gradient-to-br from-red-700 via-orange-600 to-amber-500 rounded-2xl p-6 shadow-md shadow-red-950">
        <p className="text-xs font-semibold tracking-widest uppercase text-orange-100 mb-2">
          {label}
        </p>
        <p className="text-5xl font-bold text-white">{value}</p>
        <p className="text-sm text-orange-200 mt-1">{unit}</p>
      </div>
    );
  }
  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-700 shadow-sm p-6">
      <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-2">{label}</p>
      <p className="text-4xl font-bold text-zinc-100">{value}</p>
      <p className="text-sm text-zinc-500 mt-1">{unit}</p>
    </div>
  );
}

// ── Haupt-Komponente ──────────────────────────────────────────────────────────

export default function Calculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);

  const setNumber =
    (field: keyof Omit<CalculatorInputs, 'proteinquelle'>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      setInputs((prev) => ({ ...prev, [field]: isNaN(v) ? 0 : v }));
    };

  const setProteinquelle = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setInputs((prev) => ({ ...prev, proteinquelle: e.target.value as Proteinquelle }));

  const setAktivitaet = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setInputs((prev) => ({ ...prev, aktivitaetsfaktor: parseFloat(e.target.value) }));

  const resetDefaults = () => setInputs(DEFAULT_INPUTS);

  const errors = validateInputs(inputs);
  const results: CalculatorResults | null = errors.length === 0 ? calculate(inputs) : null;

  const proteinfaktor = PROTEIN_FAKTOREN[inputs.proteinquelle].toFixed(1);

  return (
    <div>
      {/* ── Eingabe-Card ── */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-700 shadow-sm p-6 mt-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-zinc-100">Deine Daten</h2>
          <button
            onClick={resetDefaults}
            className="text-xs font-medium text-zinc-500 hover:text-orange-400 transition-colors"
          >
            Zurücksetzen
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          <InputField label="Alter (Jahre)">
            <input
              type="number" min={1} max={120} step={1}
              value={inputs.alter || ''} onChange={setNumber('alter')}
              className={inputCls}
            />
          </InputField>

          <InputField label="Körpergröße (m)">
            <input
              type="number" min={1.0} max={2.5} step={0.01}
              value={inputs.koerpergroesse || ''} onChange={setNumber('koerpergroesse')}
              className={inputCls}
            />
          </InputField>

          <InputField label="Gewicht (kg)">
            <input
              type="number" min={1} max={500} step={0.5}
              value={inputs.gewicht || ''} onChange={setNumber('gewicht')}
              className={inputCls}
            />
          </InputField>

          <InputField label="Zielgewicht (kg)">
            <input
              type="number" min={1} max={500} step={0.5}
              value={inputs.zielgewicht || ''} onChange={setNumber('zielgewicht')}
              className={inputCls}
            />
          </InputField>

          <InputField label="Aktivitätsfaktor">
            <select value={inputs.aktivitaetsfaktor} onChange={setAktivitaet} className={inputCls}>
              {AKTIVITAET_OPTIONEN.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </InputField>

          <InputField label="Defizitfaktor" hint="0,7 = 70 % des Erhaltungsbedarfs">
            <input
              type="number" min={0.1} max={2.0} step={0.05}
              value={inputs.defizitfaktor || ''} onChange={setNumber('defizitfaktor')}
              className={inputCls}
            />
          </InputField>

          <InputField
            label="Proteinquelle"
            hint={`Proteinfaktor: ${proteinfaktor} g pro kg Zielgewicht`}
          >
            <select value={inputs.proteinquelle} onChange={setProteinquelle} className={inputCls}>
              <option value="fleisch">Fleisch</option>
              <option value="vegetarisch">Vegetarisch</option>
              <option value="vegan">Vegan</option>
            </select>
          </InputField>
        </div>
      </div>

      {/* ── Validierungsfehler ── */}
      {errors.length > 0 && (
        <div className="mt-4 bg-red-950 border border-red-700 rounded-xl px-5 py-4">
          <p className="text-sm font-semibold text-red-400 mb-1.5">Ungültige Eingaben</p>
          <ul className="space-y-1">
            {errors.map((err, i) => (
              <li key={i} className="text-sm text-red-500">– {err}</li>
            ))}
          </ul>
        </div>
      )}

      {results && (
        <>
          {/* ── Zentrale Kennzahlen ── */}
          <SectionLabel>Kennzahlen</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard label="Grundumsatz" value={fmt(results.grundumsatz)} unit="kcal / Tag" />
            <MetricCard label="Erhaltungskalorien (TDEE)" value={fmt(results.tdee)} unit="kcal / Tag" />
            <MetricCard label="Kalorienziel" value={fmt(results.kalorienziel)} unit="kcal / Tag" accent />
          </div>

          {/* ── KH-Warnung ── */}
          {results.kohlenhydrateNegativ && (
            <div className="mt-4 bg-amber-950 border border-amber-600 rounded-xl px-5 py-4">
              <p className="text-sm font-semibold text-amber-400">Achtung: Negative Kohlenhydrate</p>
              <p className="text-sm text-amber-500 mt-1">
                Das Kalorienziel reicht nicht aus, um Protein- und Fettbedarf zu decken.
                Erhöhe den Defizitfaktor oder reduziere das Zielgewicht.
              </p>
            </div>
          )}

          {/* ── Makroverteilung ── */}
          <SectionLabel>Makroverteilung pro Tag</SectionLabel>

          {/* Legende + Balken */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-700 shadow-sm p-5 mb-4">
            <div className="flex items-center gap-5 mb-4 text-xs font-medium text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                Protein
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                Fett
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
                Kohlenhydrate
              </span>
            </div>
            <MacroBar
              proteinPct={results.proteinProzent}
              fettPct={results.fettProzent}
              khPct={results.kohlenhydrateProzent}
            />
            <div className="mt-3 flex justify-between text-xs text-zinc-500">
              <span>{fmtPct(results.proteinProzent)}</span>
              <span>{fmtPct(results.fettProzent)}</span>
              <span>{fmtPct(results.kohlenhydrateProzent)}</span>
            </div>
          </div>

          {/* Makro-Karten */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MacroCard
              label="Protein"
              kcal={results.proteinKcalProTag}
              gramm={results.proteinGrammProTag}
              pct={results.proteinProzent}
              color="bg-red-500"
            />
            <MacroCard
              label="Fett"
              kcal={results.zielFettKcal}
              gramm={results.zielFettGramm}
              pct={results.fettProzent}
              color="bg-amber-400"
            />
            <MacroCard
              label="Kohlenhydrate"
              kcal={results.kohlenhydrateKcal}
              gramm={results.kohlenhydrateGramm}
              pct={results.kohlenhydrateProzent}
              color={results.kohlenhydrateNegativ ? 'bg-red-600' : 'bg-yellow-400'}
              warn={results.kohlenhydrateNegativ}
            />
          </div>

        </>
      )}
    </div>
  );
}
