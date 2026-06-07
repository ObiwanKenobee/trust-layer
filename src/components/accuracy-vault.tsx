import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTrustStore } from "@/lib/trust-data";

export function AccuracyVault() {
  const store = useTrustStore();
  const [yearStr, setYearStr] = useState(String(store.predictions[5]?.year ?? store.predictions[0].year));
  const year = Number(yearStr);
  const selected = store.predictions.find((p) => p.year === year)!;

  const stats = useMemo(() => {
    const realized = store.predictions.filter((p) => p.actual !== null);
    const totalVar = realized.reduce((s, p) => s + Math.abs((p.actual ?? 0) - p.predicted), 0);
    const meanVar = realized.length ? totalVar / realized.length : 0;
    const meanConf = store.predictions.reduce((s, p) => s + p.confidence, 0) / store.predictions.length;
    return { meanVar, meanConf, realized: realized.length, total: store.predictions.length };
  }, [store.predictions]);

  const max = 100;

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-trust-blue">
            Selected vintage
          </span>
          <Select value={yearStr} onValueChange={setYearStr}>
            <SelectTrigger className="h-8 w-32 border-border bg-panel-soft/40 font-mono text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-border bg-obsidian font-mono text-xs">
              {store.predictions.map((p) => (
                <SelectItem key={p.year} value={String(p.year)}>
                  {p.year} {p.actual === null ? "· forecast" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>Mean variance <span className="text-trust-gold">±{stats.meanVar.toFixed(2)}</span></span>
          <span>Mean confidence <span className="text-trust-blue">{stats.meanConf.toFixed(1)}%</span></span>
          <span>{stats.realized}/{stats.total} realized</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-px bg-border lg:grid-cols-3">
        {/* Detail card */}
        <div className="bg-obsidian p-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Vintage {selected.year}
          </div>
          <div className="mt-3 space-y-3">
            <Row label="Predicted" value={selected.predicted.toFixed(1)} tone="blue" />
            <Row
              label="Actual"
              value={selected.actual === null ? "— pending —" : selected.actual.toFixed(1)}
              tone={selected.actual === null ? "muted" : "green"}
            />
            <Row
              label="Variance"
              value={
                selected.actual === null
                  ? "n/a"
                  : `±${Math.abs(selected.actual - selected.predicted).toFixed(2)}`
              }
              tone="gold"
            />
            <Row label="Confidence" value={`${selected.confidence}%`} tone="default" />
          </div>
          <p className="mt-4 font-mono text-[11px] leading-relaxed text-muted-foreground">{selected.notes}</p>
        </div>

        {/* Variance bars */}
        <div className="bg-obsidian p-5 lg:col-span-2">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-trust-blue">
            Prediction vs Outcome
          </div>
          <div className="grid h-48 items-end gap-2" style={{ gridTemplateColumns: `repeat(${store.predictions.length}, minmax(0,1fr))` }}>
            {store.predictions.map((p) => {
              const isSel = p.year === year;
              const pendingActual = p.actual === null;
              return (
                <div key={p.year} className="flex h-full flex-col items-stretch justify-end gap-1">
                  <div className="relative flex h-full items-end gap-1">
                    <div
                      className={`flex-1 rounded-t-sm border-t border-trust-blue bg-trust-blue/25 ${isSel ? "outline outline-1 outline-trust-blue" : ""}`}
                      style={{ height: `${(p.predicted / max) * 100}%` }}
                      title={`predicted ${p.predicted}`}
                    />
                    <div
                      className={`flex-1 rounded-t-sm border-t border-trust-green ${pendingActual ? "border-dashed bg-trust-green/5" : "bg-trust-green/35"} ${isSel ? "outline outline-1 outline-trust-green" : ""}`}
                      style={{ height: `${((p.actual ?? p.predicted) / max) * 100}%` }}
                      title={pendingActual ? "actual pending" : `actual ${p.actual}`}
                    />
                  </div>
                  <div className={`text-center font-mono text-[10px] ${isSel ? "text-trust-blue" : "text-muted-foreground"}`}>
                    {p.year}
                  </div>
                  <div className="text-center font-mono text-[10px] text-trust-gold">
                    {p.actual === null ? "·" : `±${Math.abs(p.actual - p.predicted)}`}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confidence ribbon */}
          <div className="mt-6">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Confidence Band
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${store.predictions.length}, minmax(0,1fr))` }}>
              {store.predictions.map((p) => (
                <div key={p.year} className="space-y-1">
                  <div className="relative h-1 w-full overflow-hidden bg-grid">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-trust-blue to-trust-green"
                      style={{ width: `${p.confidence}%` }}
                    />
                  </div>
                  <div className="text-center font-mono text-[9px] text-muted-foreground">{p.confidence}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-2"><span className="h-2 w-3 bg-trust-blue/40" />Predicted</span>
            <span className="flex items-center gap-2"><span className="h-2 w-3 bg-trust-green/60" />Actual</span>
            <span className="flex items-center gap-2"><span className="h-2 w-3 border border-dashed border-trust-green/60" />Forecast (unrealized)</span>
            <span className="text-trust-gold">Accuracy compounds — replication moat widens annually</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone: "blue" | "green" | "gold" | "muted" | "default" }) {
  const cls =
    tone === "blue" ? "text-trust-blue" :
    tone === "green" ? "text-trust-green" :
    tone === "gold" ? "text-trust-gold" :
    tone === "muted" ? "text-muted-foreground" : "text-foreground";
  return (
    <div className="flex items-baseline justify-between border-b border-border/60 pb-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className={`font-mono text-xl ${cls}`}>{value}</span>
    </div>
  );
}
