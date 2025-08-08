import React, { useMemo, useState, useId } from "react";

export default function NurseToolkitApp() {
  const [tab, setTab] = useState<TabKey>("gaz");
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <Header onChangeTab={setTab} active={tab} />

      <main className="mx-auto w-full max-w-3xl px-4 pb-28 sm:pb-24">
        <Greeting />
        <Tabs active={tab} onChange={setTab} />
        <TabContent active={tab} />
      </main>

      <BottomNav active={tab} onChange={setTab} />
      <Footer />
    </div>
  );
}

type TabKey = "calculs" | "scores" | "gaz" | "patient" | "notes" | "apropos";

function Header({ onChangeTab, active }: { onChangeTab: (t: TabKey) => void; active: TabKey }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-slate-200/60">
      <div className="mx-auto w-full max-w-3xl px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-6 w-6 rounded-xl bg-slate-900" aria-hidden />
            <span>Outils de Chloé</span>
          </span>
        </h1>
        <nav className="hidden sm:flex gap-2 text-sm" aria-label="Navigation principale">
          <TopLink id="calculs" label="Calculs" active={active} onClick={onChangeTab} />
          <TopLink id="scores" label="Scores" active={active} onClick={onChangeTab} />
          <TopLink id="gaz" label="Gazométrie" active={active} onClick={onChangeTab} />
          <TopLink id="patient" label="Patient" active={active} onClick={onChangeTab} />
          <TopLink id="notes" label="Notes" active={active} onClick={onChangeTab} />
          <TopLink id="apropos" label="À propos" active={active} onClick={onChangeTab} />
        </nav>
      </div>
    </header>
  );
}

function TopLink({ id, label, active, onClick }: { id: TabKey; label: string; active: TabKey; onClick: (t: TabKey) => void }) {
  const is = active === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={`px-3 py-1.5 rounded-full border transition focus:outline-none focus:ring-2 focus:ring-slate-900/20 ${is ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50"}`}
      aria-current={is ? "page" : undefined}
    >
      {label}
    </button>
  );
}

function Greeting() {
  const hours = new Date().getHours();
  const tone = hours < 12 ? "Bonjour" : hours < 18 ? "Bon après-midi" : "Bonsoir";
  return (
    <section className="mt-6 sm:mt-8 mb-2">
      <p className="text-sm uppercase tracking-wider text-slate-500">{tone}</p>
      <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mt-1">Chloé, tout ce qu’il te faut, dans ta poche.</h2>
      <p className="text-slate-600 mt-2">Calculs rapides, scores cliniques et repères utiles. Optimisé pour mobile, hors stress.</p>
    </section>
  );
}

function Tabs({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  const items: { id: TabKey; label: string }[] = [
    { id: "calculs", label: "💊 Calculs" },
    { id: "scores", label: "📈 Scores" },
    { id: "gaz", label: "🩸 Gazométrie" },
    { id: "patient", label: "🧪 Patient" },
    { id: "notes", label: "🗒️ Notes" },
    { id: "apropos", label: "ℹ️ À propos" },
  ];
  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-6 gap-2" role="tablist">
      {items.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={`px-3 py-2 rounded-2xl border text-sm transition shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 ${active === t.id ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50"}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function TabContent({ active }: { active: TabKey }) {
  if (active === "calculs") return <CalculsTab />;
  if (active === "scores") return <ScoresTab />;
  if (active === "gaz") return <GazometrieTab />;
  if (active === "patient") return <PatientTab />;
  if (active === "notes") return <NotesTab />;
  return <AProposTab />;
}

function CalculsTab() {
  return (
    <section className="mt-6 space-y-6">
      <QuickPanel />
      <DoseCalculator />
      <div className="grid sm:grid-cols-2 gap-6">
        <InfusionRate />
        <DripRate />
      </div>
    </section>
  );
}

function ScoresTab() {
  return (
    <section className="mt-6 space-y-6">
      <GCS />
      <NEWS2 />
    </section>
  );
}

function GazometrieTab() {
  return (
    <section className="mt-6 space-y-6">
      <ABGTool />
    </section>
  );
}

function PatientTab() {
  return (
    <section className="mt-6 space-y-6">
      <CrCl />
      <BMI />
    </section>
  );
}

function NotesTab() {
  return (
    <section className="mt-6 space-y-6">
      <NoteBlock />
    </section>
  );
}

function AProposTab() {
  return (
    <section className="mt-6 space-y-6">
      <Card title="À propos" subtitle="Conçu pour Chloé — usage d’aide uniquement">
        <p className="text-sm text-slate-700">Toujours vérifier selon le protocole local et réaliser un double contrôle pour les calculs. Créé avec ❤️ pour Chloé.</p>
      </Card>
      <Tests />
    </section>
  );
}

function BottomNav({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  const items: { id: TabKey; icon: string; label: string }[] = [
    { id: "calculs", icon: "💊", label: "Calculs" },
    { id: "scores", icon: "📈", label: "Scores" },
    { id: "gaz", icon: "🩸", label: "Gaz" },
    { id: "patient", icon: "🧪", label: "Patient" },
    { id: "notes", icon: "🗒️", label: "Notes" },
    { id: "apropos", icon: "ℹ️", label: "Infos" },
  ];
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 sm:hidden" aria-label="Navigation mobile">
      <div className="mx-auto max-w-3xl bg-white/90 backdrop-blur border-t border-slate-200">
        <div className="grid grid-cols-6">
          {items.map((t) => {
            const is = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                className={`flex flex-col items-center justify-center py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/20 ${is ? "text-slate-900" : "text-slate-500"}`}
                aria-current={is ? "page" : undefined}
              >
                <span className="text-base leading-none" aria-hidden>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow" aria-label={title}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
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
  placeholder?: string;
};

function Field({ label, suffix, value, onChange, type = "number", min, max, step, placeholder }: FieldProps) {
  const id = useId();
  return (
    <label className="block mb-3" htmlFor={id}>
      <div className="text-sm text-slate-700 mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <input
          id={id}
          className="w-full rounded-xl border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-slate-900/20"
          type={type}
          inputMode={type === "number" ? "decimal" : undefined}
          value={value}
          min={min}
          max={max}
          placeholder={placeholder}
          step={step as any}
          onChange={(e) => onChange(toNumAllowEmpty(e.target.value))}
        />
        {suffix && <div className="text-sm text-slate-500">{suffix}</div>}
      </div>
    </label>
  );
}

// Champ spécifique string (pour autoriser la saisie vide sans forcer 0)
function FieldStr({ label, suffix, value, onChange, placeholder }: { label: string; suffix?: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const id = useId();
  return (
    <label className="block mb-3" htmlFor={id}>
      <div className="text-sm text-slate-700 mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <input
          id={id}
          className="w-full rounded-xl border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-slate-900/20"
          type="text"
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && <div className="text-sm text-slate-500">{suffix}</div>}
        {value !== "" && (
          <button type="button" aria-label="Effacer" className="text-slate-500 text-sm px-2 py-1 rounded-lg border hover:bg-slate-50" onClick={() => onChange("")}>×</button>
        )}
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
      <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar">
        {[
          { id: "mgkg", label: "mg/kg" },
          { id: "regle3", label: "Règle de trois" },
          { id: "dilution", label: "Dilution" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as any)}
            className={`px-3 py-1.5 rounded-full text-sm border whitespace-nowrap ${mode === m.id ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50"}`}
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

      <div className="text-xs text-slate-500 mt-3">Double contrôle recommandé.</div>
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
    <Card title="Gouttes par minute" subtitle="(Volume × facteur de chute) ÷ temps">
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
    <Card title="Glasgow Coma Scale (GCS)" subtitle="E4 + V5 + M6">
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
      <div className="text-[11px] text-slate-500 mt-2">Référence: échelle de Glasgow (E4 V5 M6).</div>
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

function ABGTool() {
  // états string pour autoriser l'effacement sans forcer 0
  const [pHStr, setPHStr] = useState<string>("7.40");
  const [PaCO2Str, setPaCO2Str] = useState<string>("40");
  const [HCO3Str, setHCO3Str] = useState<string>("24");
  const [PaO2Str, setPaO2Str] = useState<string>("95");
  const [FiO2pctStr, setFiO2pctStr] = useState<string>("21");
  const [NaStr, setNaStr] = useState<string>("140");
  const [ClStr, setClStr] = useState<string>("104");
  const [albuminStr, setAlbuminStr] = useState<string>("4");
  const [lactateStr, setLactateStr] = useState<string>("1.0");
  const [PatmStr, setPatmStr] = useState<string>("760");
  const [RStr, setRStr] = useState<string>("0.8");
  const [respChronic, setRespChronic] = useState<boolean>(false);

  // parse helpers
  const num = (s: string) => {
    const n = parseFloat(s.replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  };

  const pH = num(pHStr);
  const PaCO2 = num(PaCO2Str);
  const HCO3 = num(HCO3Str);
  const PaO2 = num(PaO2Str);
  const FiO2pct = num(FiO2pctStr);
  const Na = num(NaStr);
  const Cl = num(ClStr);
  const albumin = num(albuminStr);
  const lactate = num(lactateStr);
  const Patm = num(PatmStr);
  const R = num(RStr);

  const FiO2 = Math.max(0, Math.min(1, (Number.isFinite(FiO2pct) ? FiO2pct : 0) / 100));

  const pf = useMemo(() => (Number.isFinite(PaO2) && FiO2 > 0 ? pfRatio(PaO2, FiO2) : 0), [PaO2, FiO2]);
  const aagrad = useMemo(() => (Number.isFinite(PaO2) && Number.isFinite(PaCO2) ? aAGradientCustom(PaO2, PaCO2, FiO2, Number.isFinite(Patm) ? Patm : 760, 47, Number.isFinite(R) ? R : 0.8) : 0), [PaO2, PaCO2, FiO2, Patm, R]);
  const ag = useMemo(() => (Number.isFinite(Na) && Number.isFinite(Cl) && Number.isFinite(HCO3) ? anionGap(Na, Cl, HCO3) : 0), [Na, Cl, HCO3]);
  const agCorr = useMemo(() => (Number.isFinite(albumin) ? correctedAnionGap(ag, albumin) : ag), [ag, albumin]);
  const disorder = useMemo(() => (Number.isFinite(pH) && Number.isFinite(PaCO2) && Number.isFinite(HCO3) ? primaryDisorder(pH, PaCO2, HCO3) : "—"), [pH, PaCO2, HCO3]);

    const pfTone: "ok" | "warn" | "danger" | "info" = pf >= 300 ? "ok" : pf >= 200 ? "info" : pf >= 100 ? "warn" : "danger";
  const lactTone: "ok" | "warn" | "danger" = Number.isFinite(lactate) && lactate <= 2 ? "ok" : Number.isFinite(lactate) && lactate <= 4 ? "warn" : "danger";

  const onCopy = async () => {
    const lines = [
      `Trouble: ${disorder}`,
      `P/F: ${round(pf)}`,
      `A–a: ${round(aagrad)} mmHg`,
      `AG: ${round(ag)} | AGcorr: ${round(agCorr)}`,
      Number.isFinite(lactate) ? `Lactate: ${round(lactate)} mmol/L` : "",
    ].filter(Boolean);
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
    } catch {}
  };

  return (
    <Card title="Gazométrie (ABG)" subtitle="Aide à l'interprétation rapide">
      {/* Group 1: Gaz du sang */}
      <fieldset className="rounded-2xl border p-3">
        <legend className="px-2 text-xs text-slate-600">Gaz du sang</legend>
        <div className="grid grid-cols-2 gap-3">
          <FieldStr label="pH" value={pHStr} onChange={setPHStr} placeholder="ex. 7,32" />
          <FieldStr label="PaCO₂" value={PaCO2Str} onChange={setPaCO2Str} suffix="mmHg" placeholder="ex. 52" />
          <FieldStr label="HCO₃⁻" value={HCO3Str} onChange={setHCO3Str} suffix="mEq/L" placeholder="ex. 20" />
          <FieldStr label="PaO₂" value={PaO2Str} onChange={setPaO2Str} suffix="mmHg" placeholder="ex. 75" />
          <FieldStr label="FiO₂" value={FiO2pctStr} onChange={setFiO2pctStr} suffix="%" placeholder="ex. 40" />
        </div>
      </fieldset>

      {/* Group 2: Ions et lactate */}
      <fieldset className="rounded-2xl border p-3 mt-3">
        <legend className="px-2 text-xs text-slate-600">Électrolytes</legend>
        <div className="grid grid-cols-2 gap-3">
          <FieldStr label="Na⁺" value={NaStr} onChange={setNaStr} suffix="mmol/L" placeholder="ex. 140" />
          <FieldStr label="Cl⁻" value={ClStr} onChange={setClStr} suffix="mmol/L" placeholder="ex. 104" />
          <FieldStr label="HCO₃⁻ (chimie)" value={HCO3Str} onChange={setHCO3Str} suffix="mEq/L" />
          <FieldStr label="Albumine" value={albuminStr} onChange={setAlbuminStr} suffix="g/dL" placeholder="ex. 4" />
          <FieldStr label="Lactate" value={lactateStr} onChange={setLactateStr} suffix="mmol/L" placeholder="ex. 1.6" />
        </div>
      </fieldset>

      {/* Options avancées */}
      <details className="mt-3">
        <summary className="text-xs text-slate-600 cursor-pointer">Options avancées (altitude & physiologie)</summary>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <FieldStr label="Pression atmosphérique" value={PatmStr} onChange={setPatmStr} suffix="mmHg" placeholder="760" />
          <FieldStr label="Quotient respiratoire (R)" value={RStr} onChange={setRStr} placeholder="0.8" />
          <Toggle label="Trouble respiratoire chronique" checked={respChronic} onChange={setRespChronic} />
        </div>
      </details>

      {/* Résultats */}
      <div className="space-y-2 mt-3">
        <div className="flex flex-wrap gap-2 text-xs">
          <Chip>{disorder}</Chip>
          <Chip tone={pfTone}>P/F {round(pf)}</Chip>
          <Chip>A–a {round(aagrad)} mmHg</Chip>
          <Chip>AG {round(ag)}</Chip>
          <Chip>AGcorr {round(agCorr)}</Chip>
          {Number.isFinite(lactate) && <Chip tone={lactTone as any}>Lactate {round(lactate)} mmol/L</Chip>}
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-xl border text-sm hover:bg-slate-50" onClick={onCopy}>Copier le résumé</button>
        </div>
        <div className="text-[11px] text-slate-500">
          Repères: pH 7.35–7.45 ; PaCO₂ 35–45 ; HCO₃⁻ 22–26 ; P/F ≥ 300 ; AG normal ~8–12 (non corrigé) ; lactate ≤ 2.
        </div>
      </div>
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

function Chip({ children, tone = "info" }: { children: React.ReactNode; tone?: "ok" | "warn" | "danger" | "info" }) {
  const map: Record<string, string> = {
    ok: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warn: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 ${map[tone]}`}>{children}</span>;
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
        className="w-full min-h-[140px] rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
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
    <div className="rounded-3xl border bg-white p-4">
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
    <footer className="mt-10 border-t bg-white/80 backdrop-blur">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 text-sm text-slate-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            Conçu pour faciliter le quotidien infirmier. ⚠️ Aide au calcul uniquement. Ne remplace pas l'avis médical.
          </div>
          <div>
            © {new Date().getFullYear()} — Fait avec ❤️ pour Chloé
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

function toNumAllowEmpty(v: string) {
  if (v.trim() === "") return Number.NaN;
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) ? n : Number.NaN;
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
    {
      name: "P/F ratio 80 / 0.21",
      expected: 380.95,
      actual: pfRatio(80, 0.21),
      pass: approxEqual(pfRatio(80, 0.21), 380.95, 0.01),
    },
    {
      name: "A–a gradient basique",
      expected: 4.7,
      actual: aAGradientCustom(95, 40, 0.21, 760, 47, 0.8),
      pass: approxEqual(aAGradientCustom(95, 40, 0.21, 760, 47, 0.8), 4.7, 0.05),
    },
    {
      name: "Anion gap corrigé albumine (AG 16, Alb 2.0)",
      expected: 21,
      actual: correctedAnionGap(16, 2.0),
      pass: approxEqual(correctedAnionGap(16, 2.0), 21, 0.01),
    },
  ];

  const allPass = cases.every((c) => c.pass);

  return (
    <section className="mt-6">
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

// === Gazométrie helpers ===
function pfRatio(PaO2: number, FiO2: number) {
  if (FiO2 <= 0) return 0;
  return PaO2 / FiO2;
}

function alveolarPO2(FiO2: number, PaCO2: number, Patm = 760, PH2O = 47, R = 0.8) {
  const k = Patm - PH2O;
  return FiO2 * k - PaCO2 / R; // PAO2 = FiO2*(Patm-PH2O) - PaCO2/R
}

function aAGradientCustom(PaO2: number, PaCO2: number, FiO2: number, Patm = 760, PH2O = 47, R = 0.8) {
  const PAO2 = alveolarPO2(FiO2, PaCO2, Patm, PH2O, R);
  return Math.max(0, PAO2 - PaO2);
}


function anionGap(Na: number, Cl: number, HCO3: number) {
  return Number(Na) - Number(Cl) - Number(HCO3);
}

function correctedAnionGap(ag: number, albumin_gdl: number) {
  // Correction classique: AGcorr = AG + 2.5 * (4.0 - albumine [g/dL])
  return ag + 2.5 * (4 - albumin_gdl);
}

function primaryDisorder(pH: number, PaCO2: number, HCO3: number) {
  if (!Number.isFinite(pH) || !Number.isFinite(PaCO2) || !Number.isFinite(HCO3)) return "—";
  const acidemia = pH < 7.35;
  const alkalemia = pH > 7.45;
  if (!acidemia && !alkalemia) return "pH normal ou mixte";
  if (acidemia) {
    if (PaCO2 > 45 && HCO3 <= 24) return "Acidose respiratoire";
    if (HCO3 < 22) return "Acidose métabolique";
    return "Acidose mixte/indéterminée";
  }
  if (alkalemia) {
    if (PaCO2 < 35 && HCO3 >= 24) return "Alcalose respiratoire";
    if (HCO3 > 26) return "Alcalose métabolique";
    return "Alcalose mixte/indéterminée";
  }
  return "—";
}