import { useState } from "react";
import { addEvidence, useTrustStore, type EvidenceItem } from "@/lib/trust-data";

const KINDS: EvidenceItem["sourceKind"][] = ["University", "Auditor", "Sensor", "NGO", "Citizen", "AI Agent"];

export function EvidenceSubmission() {
  const store = useTrustStore();
  const [entityId, setEntityId] = useState(store.entities[0]?.id ?? "");
  const [source, setSource] = useState("");
  const [sourceKind, setSourceKind] = useState<EvidenceItem["sourceKind"]>("Auditor");
  const [weight, setWeight] = useState(15);
  const [confidence, setConfidence] = useState(85);
  const [attests, setAttests] = useState(80);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const trimmed = source.trim();
    if (trimmed.length < 4 || trimmed.length > 120) {
      setStatus({ ok: false, msg: "Source must be 4–120 chars." });
      return;
    }
    const added = addEvidence({
      entityId,
      source: trimmed,
      sourceKind,
      weight: weight / 100,
      confidence,
      attests,
    });
    if (!added) {
      setStatus({ ok: false, msg: "Submission rejected by constitution layer." });
      return;
    }
    setStatus({ ok: true, msg: `Attestation ${added.id.toUpperCase()} accepted into evidence pool.` });
    setSource("");
  };

  const entity = store.entities.find((e) => e.id === entityId);
  const evidenceCount = entity?.evidence.length ?? 0;

  return (
    <div className="rounded-md border border-border bg-panel-soft/30 p-5">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
        <span className="text-trust-blue">Evidence Submission · Attestation Pipeline</span>
        <span className="text-muted-foreground">Pool: {evidenceCount}</span>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Entity</span>
          <select
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            className="rounded border border-border bg-obsidian px-3 py-2 font-mono text-xs text-foreground focus:border-trust-blue focus:outline-none"
          >
            {store.entities.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Source Class</span>
          <select
            value={sourceKind}
            onChange={(e) => setSourceKind(e.target.value as EvidenceItem["sourceKind"])}
            className="rounded border border-border bg-obsidian px-3 py-2 font-mono text-xs text-foreground focus:border-trust-blue focus:outline-none"
          >
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Source / Title</span>
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. KPMG · Q3 Treasury Disclosure"
            maxLength={120}
            className="rounded border border-border bg-obsidian px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-trust-blue focus:outline-none"
          />
        </label>

        <SliderRow label="Weight" value={weight} onChange={setWeight} min={1} max={50} suffix="%" />
        <SliderRow label="Confidence" value={confidence} onChange={setConfidence} min={40} max={99} suffix="%" />
        <SliderRow label="Attests" value={attests} onChange={setAttests} min={0} max={100} suffix="" />

        <div className="flex items-end justify-end md:col-span-2">
          <button
            type="submit"
            className="rounded bg-trust-blue px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-obsidian transition-colors hover:bg-foreground"
          >
            Submit Attestation
          </button>
        </div>
      </form>

      {status && (
        <div
          className={`mt-3 rounded border px-3 py-2 font-mono text-[10px] uppercase tracking-widest ${
            status.ok
              ? "border-trust-green/40 bg-trust-green/5 text-trust-green"
              : "border-trust-red/40 bg-trust-red/5 text-trust-red"
          }`}
        >
          {status.msg}
        </div>
      )}

      <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Submitted attestations feed the Constitutional Engine in realtime — score, delta and instrument
        prices recompute immediately on acceptance.
      </p>
    </div>
  );
}

function SliderRow({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  suffix: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>{label}</span>
        <span className="text-foreground">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-trust-blue"
      />
    </label>
  );
}
