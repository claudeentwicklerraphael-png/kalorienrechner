export type Proteinquelle = 'fleisch' | 'vegetarisch' | 'vegan';

export interface CalculatorInputs {
  alter: number;
  koerpergroesse: number; // in Metern
  gewicht: number;
  aktivitaetsfaktor: number;
  defizitfaktor: number;
  zielgewicht: number;
  proteinquelle: Proteinquelle;
}

export interface CalculatorResults {
  grundumsatz: number;
  tdee: number;
  kalorienziel: number;
  proteinFaktor: number;
  proteinGrammProTag: number;
  proteinKcalProTag: number;
  zielFettKcal: number;
  zielFettGramm: number;
  kohlenhydrateKcal: number;
  kohlenhydrateGramm: number;
  proteinProzent: number;
  fettProzent: number;
  kohlenhydrateProzent: number;
  kohlenhydrateNegativ: boolean;
}

export const PROTEIN_FAKTOREN: Record<Proteinquelle, number> = {
  fleisch: 2.2,
  vegetarisch: 2.3,
  vegan: 2.4,
};

export const DEFAULT_INPUTS: CalculatorInputs = {
  alter: 0,
  koerpergroesse: 0,
  gewicht: 0,
  aktivitaetsfaktor: 1.55,
  defizitfaktor: 0.85,
  zielgewicht: 0,
  proteinquelle: 'fleisch',
};

export function validateInputs(inputs: CalculatorInputs): string[] {
  const errors: string[] = [];
  if (!inputs.alter || inputs.alter <= 0 || inputs.alter > 120)
    errors.push('Alter muss zwischen 1 und 120 Jahren liegen.');
  if (!inputs.koerpergroesse || inputs.koerpergroesse < 1.0 || inputs.koerpergroesse > 2.5)
    errors.push('Körpergröße muss zwischen 100 und 250 cm liegen.');
  if (!inputs.gewicht || inputs.gewicht <= 0 || inputs.gewicht > 500)
    errors.push('Gewicht muss zwischen 1 und 500 kg liegen.');
  if (!inputs.defizitfaktor || inputs.defizitfaktor <= 0 || inputs.defizitfaktor > 2)
    errors.push('Defizitfaktor muss zwischen 0,01 und 2,0 liegen.');
  if (!inputs.zielgewicht || inputs.zielgewicht <= 0 || inputs.zielgewicht > 500)
    errors.push('Zielgewicht muss zwischen 1 und 500 kg liegen.');
  return errors;
}

export function calculate(inputs: CalculatorInputs): CalculatorResults {
  const {
    alter,
    koerpergroesse,
    gewicht,
    aktivitaetsfaktor,
    defizitfaktor,
    zielgewicht,
    proteinquelle,
  } = inputs;

  // 1. Grundumsatz
  const grundumsatz =
    11.936 * gewicht + 587.728 * koerpergroesse - 8.129 * alter + 220.827;

  // 2. TDEE
  const tdee = grundumsatz * aktivitaetsfaktor;

  // 3. Kalorienziel
  const kalorienziel = tdee * defizitfaktor;

  // 4. Protein
  const proteinFaktor = PROTEIN_FAKTOREN[proteinquelle];
  const proteinGrammProTag = zielgewicht * proteinFaktor;
  const proteinKcalProTag = proteinGrammProTag * 4.1;

  // 5. Angestrebte Fettzufuhr
  const zielFettKcal = kalorienziel * 0.25;
  const zielFettGramm = zielFettKcal / 9.3;

  // 7. Kohlenhydrate
  const kohlenhydrateKcal = kalorienziel - proteinKcalProTag - zielFettKcal;
  const kohlenhydrateGramm = kohlenhydrateKcal / 4.1;

  // 8. Prozentwerte
  const proteinProzent = (proteinKcalProTag / kalorienziel) * 100;
  const fettProzent = (zielFettKcal / kalorienziel) * 100;
  const kohlenhydrateProzent = (kohlenhydrateKcal / kalorienziel) * 100;

  return {
    grundumsatz,
    tdee,
    kalorienziel,
    proteinFaktor,
    proteinGrammProTag,
    proteinKcalProTag,
    zielFettKcal,
    zielFettGramm,
    kohlenhydrateKcal,
    kohlenhydrateGramm,
    proteinProzent,
    fettProzent,
    kohlenhydrateProzent,
    kohlenhydrateNegativ: kohlenhydrateKcal < 0,
  };
}
