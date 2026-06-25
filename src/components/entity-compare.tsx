import { useMemo, useState } from "react";
import { useTrustStore, type Entity } from "@/lib/trust-data";


const PALETTE = ["#22d3ee", "#fbbf24", "#a78bfa", "#34d399"];

function genomeFor(e: Entity) {
  const valid = e.evidence.filter((v) => v.valid);
  const byKind = (k: string) =>
    valid.filter((v) => v.sourceKind === k).reduce((s, v) => s + v.attests * v.weight, 0) /
    Math.max(0.01, valid.filter((v) => v.sourceKind === k).reduce((s, v) => s + v.weight, 0));
  const safe = (n: number) => (Number.isFinite(n) ? Math.max(20, Math.min(100, n)) : 40);
  return [
    { axis: "Academic", value: safe(byKind("University")) },
    { axis: "Audit", value: safe(byKind("Auditor")) },
    { axis: "Sensor", value: safe(byKind("Sensor")) },
    { axis: "NGO", value: safe(byKind("NGO")) },
    { axis: "Citizen", value: safe(byKind("Citizen")) },
    { axis: "AI Agent", value: safe(byKind("AI Agent")) },
  ];
}

function Spark({ points, color }: { points: number[]; color: string }) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 28 - ((p - min) / range) * 26;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" className="h-7 w-full" preserveAspectRatio="none">
      <path d={d} fill="none" stroke={color} strokeWidth={1.4} />
    </svg>
  );
}

export function EntityCompare() {
  const store = useTrustStore();
  const [selected, setSelected] = useState<string[]>(["rwa", "sgp", "ken"]);

  const toggle = (id: string) =>
    setSelected((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= 4 ? [...cur.slice(1), id] : [...cur, id],
    );

  const picked = useMemo(
    () => selected.map((id) => store.entities.find((e) => e.id === id)).filter((e): e is Entity => !!e),
    [selected, store.entities],
  );

  const radarSeries = picked.map((e, i) => ({
    name: e.name,
    color: PALETTE[i % PALETTE.length],
    points: genomeFor(e),
  }));

  return (
    <div className="rounded-md border border-border bg-panel-soft/30 p-5">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
        <span className="text-trust-blue">Entity Spread · Comparative Trust Genome</span>
        <span className="text-muted-foreground">Select up to 4</span>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {store.entities.map((e) => {
          const on = selected.includes(e.id);
          return (
            <button
              key={e.id}
              onClick={() => toggle(e.id)}
              className={`rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                on
                  ? "border-trust-blue/60 bg-trust-blue/10 text-trust-blue"
                  : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
              }`}
            >
              {e.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded border border-border bg-obsidian/60 p-3">
          <TrustRadarOverlay series={radarSeries} />
          <div className="mt-2 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-widest">
            {radarSeries.map((s) => (
              <span key={s.name} className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2 rounded-sm" style={{ background: s.color }} />
                {s.name}
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded border border-border">
          <table className="w-full font-mono text-[11px]">
            <thead className="bg-panel-soft/50 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left">Entity</th>
                <th className="px-3 py-2 text-right">Score</th>
                <th className="px-3 py-2 text-right">Δ%</th>
                <th className="px-3 py-2">History (24t)</th>
              </tr>
            </thead>
            <tbody>
              {picked.map((e, i) => (
                <tr key={e.id} className="border-t border-border/60">
                  <td className="px-3 py-2">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-sm" style={{ background: PALETTE[i % PALETTE.length] }} />
                      <span className="text-foreground">{e.name}</span>
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right text-foreground">{e.score.toFixed(2)}</td>
                  <td className={`px-3 py-2 text-right ${e.delta >= 0 ? "text-trust-green" : "text-trust-red"}`}>
                    {e.delta >= 0 ? "+" : ""}
                    {e.delta.toFixed(2)}
                  </td>
                  <td className="px-3 py-2">
                    <Spark points={e.history ?? []} color={PALETTE[i % PALETTE.length]} />
                  </td>
                </tr>
              ))}
              {picked.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">
                    Select entities to compare.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/** Multi-series radar overlay built on the same axes as TrustRadar. */
function TrustRadarOverlay({
  series,
}: {
  series: { name: string; color: string; points: { axis: string; value: number }[] }[];
}) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 86;
  const axes = series[0]?.points.map((p) => p.axis) ?? ["Academic", "Audit", "Sensor", "NGO", "Citizen", "AI"];
  const angle = (i: number) => (Math.PI * 2 * i) / axes.length - Math.PI / 2;
  const pt = (v: number, i: number) => {
    const a = angle(i);
    const rr = (v / 100) * r;
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr] as const;
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto h-56 w-full max-w-[260px]">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon
          key={f}
          points={axes.map((_, i) => pt(f * 100, i).join(",")).join(" ")}
          fill="none"
          stroke="oklch(0.35 0.02 240)"
          strokeWidth={0.5}
        />
      ))}
      {axes.map((label, i) => {
        const [x, y] = pt(112, i);
        return (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground font-mono"
            fontSize={8}
          >
            {label}
          </text>
        );
      })}
      {series.map((s) => {
        const pts = s.points.map((p, i) => pt(p.value, i).join(",")).join(" ");
        return (
          <g key={s.name}>
            <polygon points={pts} fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={1.4} />
            {s.points.map((p, i) => {
              const [x, y] = pt(p.value, i);
              return <circle key={i} cx={x} cy={y} r={2} fill={s.color} />;
            })}
          </g>
        );
      })}
    </svg>
  );
}
