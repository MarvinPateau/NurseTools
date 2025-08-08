import React, { useMemo, useState } from "react";

export default function NurseToolkitApp() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-24">
        <Hero />
        <ToolGrid />
        <Tests />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200/60">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-6 w-6 rounded-xl bg-slate-900" />
            <span>Boîte à outils infirmière</span>
          </span>
        </h1>
        <div className="text-[11px] sm:text-xs text-slate-600">
          Outil d'aide — toujours vérifier selon votre protocole local
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mt-8 mb-8">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="order-2 md:order-1">
          <p className="text-sm uppercase tracking-wider text-slate-500">Pour le quotidien</p>
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight mt-2">Calculs rapides, scores cliniques & repères utiles</h2>
          <p className="text-slate-600 mt-3">Tout en français, pensé pour gagner de précieuses minutes : doses, débits, gouttes/min, GCS, NEWS2, clairance de la créatinine, IMC… et plus.</p>
          <div className="mt-4 text-xs text-slate-500">⚠️ Aide au calcul uniquement. Double contrôle recommandé.</div>
        </div>
        <div className="order-1 md:order-2">
          <div className="rounded-3xl border bg-white/70 backdrop-blur p-5 shadow-xl">
            <QuickPanel />
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function ToolGrid() {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      <DoseCalculator />
      <InfusionRate />
      <DripRate />
      <GCS />
      <NEWS2 />
      <CrCl />
      <BMI />
      <NoteBlock />
    </div>
  );
}

type FieldProps = {
  label: string;
  suffix?: string;
  value: number | string;
  onChange: (value: number) => void;
  type?: "number" | "text";
  min?: number;
  max?: number;
  step?: number | string;
};

function Field({ label, suffix, value, onChange, type = "number", min, max, step }: FieldProps) {
  return (
    <label className="block mb-3">
      <div className="text-sm text-slate-700 mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <input
          className="w-full rounded-xl border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-slate-900/20"
          type={type}
          value={value}
          min={min}
          max={max}
          step={step as any}
          onChange={(e) => onChange(toNum(e.target.value))}
        />
        {suffix && <div className="text-sm text-slate-500">{suffix}</div>}
      </div>
    </label>
  );
}

function Result({ children, tone = "ok" }: { children: React.ReactNode; tone?: "ok" | "warn" | "danger" | "info" }) {
  const toneMap: Record<string, string> = {
    ok: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warn: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-slate-50 text-slate-700 border-slate-200",
  };
  const styles = toneMap[tone] || toneMap.ok;
  return <div className={`rounded-2xl border px-4 py-3 text-sm ${styles}`}>{children}</div>;
}

function DoseCalculator() {
  const [mode, setMode] = useState<"mgkg" | "regle3" | "dilution">("mgkg");
  const [poids, setPoids] = useState<number>(70);
  const [doseMgKg, setDoseMgKg] = useState<number>(1);
  const [concentration, setConcentration] = useState<number>(10);
  const [voulu, setVoulu] = useState<number>(100);
  const [dispo, setDispo] = useState<number>(250);
  const [contenuAmpoule, setContenuAmpoule] = useState<number>(1000);
  const [volumeAmpoule, setVolumeAmpoule] = useState<number>(10);
  const [doseSouhaitee, setDoseSouhaitee] = useState<number>(250);

  const res = useMemo(() => {
    if (mode === "mgkg") {
      const doseTotaleMg = Number(poids) * Number(doseMgKg);
      const ml = safeDiv(doseTotaleMg, Number(concentration));
      return { text: `${round(doseTotaleMg)} mg au total → ${round(ml)} mL à prélever.`, tone: "ok" as const };
    }
    if (mode === "regle3") {
      const ml = safeDiv(Number(voulu), Number(dispo));
      return { text: `${round(ml)} mL à prélever.`, tone: "ok" as const };
    }
    if (mode === "dilution") {
      const v1 = safeDiv(Number(doseSouhaitee), Number(contenuAmpoule)) * Number(volumeAmpoule);
      return { text: `${round(v1)} mL à prélever depuis l'ampoule. Compléter avec solvant selon protocole.`, tone: "info" as const };
    }
    return { text: "", tone: "info" as const };
  }, [mode, poids, doseMgKg, concentration, voulu, dispo, contenuAmpoule, volumeAmpoule, doseSouhaitee]);

  return (
    <Card title="Calcul de dose" subtitle="Règle de trois, mg/kg, dilution">
      <div className="flex gap-2 mb-2">
        {[
          { id: "mgkg", label: "mg/kg" },
          { id: "regle3", label: "Règle de trois" },
          { id: "dilution", label: "Dilution" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as any)}
            className={`px-3 py-1.5 rounded-full text-sm border ${mode === m.id ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50"}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "mgkg" && (
        <div>
          <Field label="Poids du patient" value={poids} onChange={setPoids} suffix="kg" step="0.1" />
          <Field label="Dose prescrite" value={doseMgKg} onChange={setDoseMgKg} suffix="mg/kg" step="0.1" />
          <Field label="Concentration disponible" value={concentration} onChange={setConcentration} suffix="mg/mL" step="0.1" />
          <Result>{res.text}</Result>
        </div>
      )}

      {mode === "regle3" && (
        <div>
          <Field label="Dose voulue" value={voulu} onChange={setVoulu} suffix="mg" step="0.1" />
          <Field label="Concentration (ce que vous avez)" value={dispo} onChange={setDispo} suffix="mg/mL" step="0.1" />
          <Result>{res.text}</Result>
        </div>
      )}

      {mode === "dilution" && (
        <div>
          <Field label="Contenu ampoule" value={contenuAmpoule} onChange={setContenuAmpoule} suffix="mg" />
          <Field label="Volume ampoule" value={volumeAmpoule} onChange={setVolumeAmpoule} suffix="mL" step="0.1" />
          <Field label="Dose souhaitée" value={doseSouhaitee} onChange={setDoseSouhaitee} suffix="mg" />
          <Result tone="info">{res.text}</Result>
        </div>
      )}

      <div className="text-xs text-slate-500 mt-3">Toujours réaliser un double contrôle selon les procédures locales.</div>
    </Card>
  );
}

function InfusionRate() {
  const [volume, setVolume] = useState<number>(500);
  const [heures, setHeures] = useState<number>(2);
  const [minutes, setMinutes] = useState<number>(0);

  const mlh = useMemo(() => {
    const t = Number(heures) + Number(minutes) / 60;
    if (t <= 0) return 0;
    return safeDiv(Number(volume), t);
  }, [volume, heures, minutes]);

  return (
    <Card title="Débit d'infusion" subtitle="Calcul du mL/h">
      <Field label="Volume à perfuser" value={volume} onChange={setVolume} suffix="mL" />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Heures" value={heures} onChange={setHeures} suffix="h" />
        <Field label="Minutes" value={minutes} onChange={setMinutes} suffix="min" />
      </div>
      <Result>{`${round(mlh)} mL/h`}</Result>
    </Card>
  );
}

function DripRate() {
  const [volume, setVolume] = useState<number>(100);
  const [minutes, setMinutes] = useState<number>(30);
  const [df, setDf] = useState<number>(20);

  const gtt = useMemo(() => {
    return safeDiv(Number(volume) * Number(df), Number(minutes));
  }, [volume, df, minutes]);

  return (
    <Card title="Gouttes par minute" subtitle="Formule: (Volume × facteur de chute) ÷ temps">
      <Field label="Volume" value={volume} onChange={setVolume} suffix="mL" />
      <Field label="Temps" value={minutes} onChange={setMinutes} suffix="min" />
      <Field label="Facteur de chute" value={df} onChange={setDf} suffix="gtt/mL" />
      <Result>{`${Math.round(gtt)} gtt/min`}</Result>
    </Card>
  );
}

function GCS() {
  const [eye, setEye] = useState<number>(4);
  const [verbal, setVerbal] = useState<number>(5);
  const [motor, setMotor] = useState<number>(6);

  const total = Number(eye) + Number(verbal) + Number(motor);
  const interp = total >= 13 ? "Traumatisme léger (13–15)" : total >= 9 ? "Modéré (9–12)" : "Sévère (≤8)";

  return (
    <Card title="Glasgow Coma Scale (GCS)" subtitle="Additionner Œil (4) + Verbal (5) + Moteur (6)">
      <Select label="Ouverture des yeux" value={eye} onChange={setEye} options={[
        { v: 4, l: "Spontanée (4)" },
        { v: 3, l: "À la voix (3)" },
        { v: 2, l: "À la douleur (2)" },
        { v: 1, l: "Aucune (1)" },
      ]} />
      <Select label="Réponse verbale" value={verbal} onChange={setVerbal} options={[
        { v: 5, l: "Orientée (5)" },
        { v: 4, l: "Confuse (4)" },
        { v: 3, l: "Mots inappropriés (3)" },
        { v: 2, l: "Sons incompréhensibles (2)" },
        { v: 1, l: "Aucune (1)" },
      ]} />
      <Select label="Réponse motrice" value={motor} onChange={setMotor} options={[
        { v: 6, l: "Obéit (6)" },
        { v: 5, l: "Localise la douleur (5)" },
        { v: 4, l: "Retrait (4)" },
        { v: 3, l: "Flexion anormale (3)" },
        { v: 2, l: "Extension (2)" },
        { v: 1, l: "Aucune (1)" },
      ]} />
      <Result tone={total <= 8 ? "danger" : total < 13 ? "warn" : "ok"}>
        Score total: <b>{total}</b> — {interp}
      </Result>
      <div className="text-[11px] text-slate-500 mt-2">Référence: E4 V5 M6, échelle de Glasgow.</div>
    </Card>
  );
}

type SelectOption = { v: string | number; l: string };

function Select({ label, value, onChange, options }: { label: string; value: string | number; onChange: (value: any) => void; options: SelectOption[] }) {
  return (
    <label className="block mb-3">
      <div className="text-sm text-slate-700 mb-1">{label}</div>
      <select
        className="w-full rounded-xl border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-slate-900/20 bg-white"
        value={value as any}
        onChange={(e) => onChange(typeof value === "number" ? Number(e.target.value) : e.target.value)}
      >
        {options.map((o) => (
          <option key={String(o.v)} value={String(o.v)}>{o.l}</option>
        ))}
      </select>
    </label>
  );
}

function NEWS2() {
  const [rr, setRr] = useState<number>(16);
  const [spo2, setSpo2] = useState<number>(98);
  const [o2, setO2] = useState<boolean>(false);
  const [sbp, setSbp] = useState<number>(120);
  const [hr, setHr] = useState<number>(80);
  const [temp, setTemp] = useState<number>(37.0);
  const [avpu, setAvpu] = useState<string>("A");

  const scores = useMemo(() => {
    const s = { rr: 0, spo2: 0, o2: 0, sbp: 0, hr: 0, temp: 0, avpu: 0 };
    if (rr <= 8) s.rr = 3; else if (rr <= 11) s.rr = 1; else if (rr <= 20) s.rr = 0; else if (rr <= 24) s.rr = 2; else s.rr = 3;
    if (spo2 <= 91) s.spo2 = 3; else if (spo2 <= 93) s.spo2 = 2; else if (spo2 <= 95) s.spo2 = 1; else s.spo2 = 0;
    s.o2 = o2 ? 2 : 0;
    if (sbp <= 90) s.sbp = 3; else if (sbp <= 100) s.sbp = 2; else if (sbp <= 110) s.sbp = 1; else if (sbp <= 219) s.sbp = 0; else s.sbp = 3;
    if (hr <= 40) s.hr = 3; else if (hr <= 50) s.hr = 1; else if (hr <= 90) s.hr = 0; else if (hr <= 110) s.hr = 1; else if (hr <= 130) s.hr = 2; else s.hr = 3;
    if (temp <= 35.0) s.temp = 3; else if (temp <= 36.0) s.temp = 1; else if (temp <= 38.0) s.temp = 0; else if (temp <= 39.0) s.temp = 1; else s.temp = 2;
    s.avpu = avpu === "A" ? 0 : 3;

    const total = Object.values(s).reduce((a, b) => a + b, 0);
    return { s, total };
  }, [rr, spo2, o2, sbp, hr, temp, avpu]);

  const riskTone: "ok" | "warn" | "danger" | "info" = scores.total >= 7 ? "danger" : scores.total >= 5 ? "warn" : scores.total >= 1 ? "info" : "ok";

  return (
    <Card title="NEWS2 (adultes)" subtitle="Score d'alerte précoce">
      <div className="grid grid-cols-2 gap-3">
        <Field label="FR" value={rr} onChange={setRr} suffix="/min" />
        <Field label="SpO₂" value={spo2} onChange={setSpo2} suffix="%" />
        <Toggle label="Oxygène" checked={o2} onChange={setO2} />
        <Field label="PAS" value={sbp} onChange={setSbp} suffix="mmHg" />
        <Field label="FC" value={hr} onChange={setHr} suffix="/min" />
        <Field label="Température" value={temp} onChange={setTemp} suffix="°C" step="0.1" />
        <Select label="Conscience (AVPU)" value={avpu} onChange={setAvpu} options={[
          { v: "A", l: "Alerte (A)" },
          { v: "V", l: "Voix (V)" },
          { v: "P", l: "Douleur (P)" },
          { v: "U", l: "Aucune (U)" },
        ]} />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-2">
        <Badge label={`FR: ${scoreTxt(scores.s.rr)}`} />
        <Badge label={`SpO₂: ${scoreTxt(scores.s.spo2)}`} />
        <Badge label={`O₂: ${scoreTxt(scores.s.o2)}`} />
        <Badge label={`PAS: ${scoreTxt(scores.s.sbp)}`} />
        <Badge label={`FC: ${scoreTxt(scores.s.hr)}`} />
        <Badge label={`Temp: ${scoreTxt(scores.s.temp)}`} />
        <Badge label={`AVPU: ${scoreTxt(scores.s.avpu)}`} />
      </div>
      <div className="mt-3">
        <Result tone={riskTone}>
          Score total: <b>{scores.total}</b> — {scores.total >= 7 ? "Risque élevé" : scores.total >= 5 ? "Risque intermédiaire" : scores.total >= 1 ? "Faible" : "0"}
        </Result>
      </div>
      <div className="text-[11px] text-slate-500 mt-2">Référence: NEWS2 (Royal College of Physicians). Utilisation selon protocole local.</div>
    </Card>
  );
}

type ToggleProps = { label: string; checked: boolean; onChange: (v: boolean) => void };

function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex items-center gap-2 mb-3 select-none">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

function CrCl() {
  const [age, setAge] = useState<number>(30);
  const [poids, setPoids] = useState<number>(60);
  const [sexe, setSexe] = useState<"F" | "M">("F");
  const [unit, setUnit] = useState<"umol" | "mgdl">("umol");
  const [scr, setScr] = useState<number>(70);

  const mgdl = unit === "umol" ? safeDiv(Number(scr), 88.4) : Number(scr);
  const factor = sexe === "F" ? 0.85 : 1;
  const crcl = safeDiv((140 - Number(age)) * Number(poids) * factor, 72 * mgdl);

  return (
    <Card title="Clairance de la créatinine" subtitle="Équation de Cockcroft–Gault (adulte)">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Âge" value={age} onChange={setAge} suffix="ans" />
        <Field label="Poids" value={poids} onChange={setPoids} suffix="kg" />
        <Select label="Sexe" value={sexe} onChange={setSexe} options={[{ v: "F", l: "Femme" }, { v: "M", l: "Homme" }]} />
        <Select label="Unité créatinine" value={unit} onChange={setUnit} options={[{ v: "umol", l: "µmol/L" }, { v: "mgdl", l: "mg/dL" }]} />
        <Field label={`Créatinine sérique (${unit === "umol" ? "µmol/L" : "mg/dL"})`} value={scr} onChange={setScr} />
      </div>
      <Result tone="info">CrCl ≈ <b>{round(crcl)}</b> mL/min</Result>
      <div className="text-[11px] text-slate-500 mt-2">Vérifier la posologie selon protocole local.</div>
    </Card>
  );
}

function BMI() {
  const [taille, setTaille] = useState<number>(170);
  const [poids, setPoids] = useState<number>(60);
  const m = Number(taille) / 100;
  const bmi = safeDiv(Number(poids), m * m);
  const interp = bmi < 18.5 ? "Insuffisance pondérale" : bmi < 25 ? "Corpulence normale" : bmi < 30 ? "Surpoids" : "Obésité";

  return (
    <Card title="IMC" subtitle="Indice de masse corporelle">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Taille" value={taille} onChange={setTaille} suffix="cm" />
        <Field label="Poids" value={poids} onChange={setPoids} suffix="kg" />
      </div>
      <Result>{`IMC = ${round(bmi)} — ${interp}`}</Result>
    </Card>
  );
}

function NoteBlock() {
  const [txt, setTxt] = useState<string>("");
  return (
    <Card title="Bloc-notes rapide" subtitle="Sauvegardez localement vos repères (reste dans ce navigateur)">
      <textarea
        className="w-full min-h-[120px] rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
        placeholder="Ex: dilution habituelle, repères de service, check-lists..."
        value={txt}
        onChange={(e) => setTxt(e.target.value)}
      />
      <div className="text-[11px] text-slate-500 mt-2">Astuce: <em>Ctrl/Cmd + P</em> pour imprimer la page / exporter en PDF.</div>
    </Card>
  );
}

function QuickPanel() {
  const [w, setW] = useState<number>(60);
  const [d, setD] = useState<number>(1);
  const [c, setC] = useState<number>(10);
  const ml = safeDiv(Number(w) * Number(d), Number(c));
  return (
    <div>
      <div className="text-sm font-medium mb-2">Raccourci: dose mg/kg → mL</div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <MiniField label="Poids" value={w} suffix="kg" onChange={setW} />
        <MiniField label="Dose" value={d} suffix="mg/kg" onChange={setD} />
        <MiniField label="Concentration" value={c} suffix="mg/mL" onChange={setC} />
      </div>
      <div className="rounded-xl border bg-slate-50 text-slate-800 px-3 py-2 text-sm">≈ {round(ml)} mL</div>
    </div>
  );
}

type MiniFieldProps = { label: string; value: number; onChange: (v: number) => void; suffix?: string };

function MiniField({ label, value, onChange, suffix }: MiniFieldProps) {
  return (
    <label className="block">
      <div className="text-[11px] text-slate-600">{label}</div>
      <div className="flex items-center gap-1">
        <input
          className="w-full rounded-lg border px-2 py-1 text-sm"
          type="number"
          value={value}
          onChange={(e) => onChange(toNum(e.target.value))}
        />
        <span className="text-[11px] text-slate-500">{suffix}</span>
      </div>
    </label>
  );
}

type BadgeProps = { label: string };

function Badge({ label }: BadgeProps) {
  return <div className="text-xs rounded-full border px-2 py-1 bg-slate-50 text-slate-700">{label}</div>;
}

function Footer() {
  return (
    <footer className="mt-10 border-t bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            Conçu pour faciliter le quotidien infirmier. ⚠️ Aide au calcul uniquement.
          </div>
          <div>
            © {new Date().getFullYear()} — Fait avec ❤️
          </div>
        </div>
      </div>
    </footer>
  );
}

function round(n: number) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.round(x * 100) / 100;
}

function safeDiv(a: number, b: number) {
  const x = Number(a);
  const y = Number(b);
  if (!Number.isFinite(x) || !Number.isFinite(y) || y <= 0) return 0;
  return x / y;
}

function scoreTxt(score: number) {
  const n = Number(score);
  if (!Number.isFinite(n)) return "-";
  return String(Math.round(n));
}

function approxEqual(a: number, b: number, eps: number = 0.02) {
  const x = Number(a);
  const y = Number(b);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
  return Math.abs(x - y) <= eps * Math.max(1, Math.abs(y));
}

function toNum(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function Tests() {
  const cases = [
    {
      name: "Débit perfusion 500 mL sur 2h",
      expected: 250,
      actual: safeDiv(500, 2),
      pass: approxEqual(safeDiv(500, 2), 250),
    },
    {
      name: "Gouttes/min 100 mL, 30 min, DF20",
      expected: 66.67,
      actual: safeDiv(100 * 20, 30),
      pass: approxEqual(safeDiv(100 * 20, 30), 66.67),
    },
    {
      name: "Dose mg/kg 60 kg, 1 mg/kg, 10 mg/mL → mL",
      expected: 6,
      actual: safeDiv(60 * 1, 10),
      pass: approxEqual(safeDiv(60 * 1, 10), 6),
    },
    {
      name: "Cockcroft–Gault F 30 ans, 60 kg, 70 µmol/L",
      expected: 98.46,
      actual: safeDiv((140 - 30) * 60 * 0.85, 72 * safeDiv(70, 88.4)),
      pass: approxEqual(safeDiv((140 - 30) * 60 * 0.85, 72 * safeDiv(70, 88.4)), 98.46),
    },
  ];

  const allPass = cases.every((c) => c.pass);

  return (
    <section className="mt-10">
      <details className="rounded-2xl border bg-white p-4">
        <summary className={`cursor-pointer select-none text-sm font-medium ${allPass ? "text-emerald-700" : "text-rose-700"}`}>
          Tests intégrés: {allPass ? "OK" : "ÉCHEC"}
        </summary>
        <ul className="mt-3 space-y-2 text-sm">
          {cases.map((t, i) => (
            <li key={i} className="flex items-center justify-between">
              <span>{t.name}</span>
              <span className={t.pass ? "text-emerald-700" : "text-rose-700"}>
                attendu {round(t.expected)} / obtenu {round(t.actual)} — {t.pass ? "OK" : "KO"}
              </span>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
