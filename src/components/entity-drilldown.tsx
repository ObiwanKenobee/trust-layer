import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { computeRuleChecks, toggleEvidence, type Entity } from "@/lib/trust-data";
import { useMemo } from "react";

interface Props {
  entity: Entity | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function EntityDrilldown({ entity, open, onOpenChange }: Props) {
  const rules = useMemo(() => (entity ? computeRuleChecks(entity) : []), [entity]);
  const validCount = entity?.evidence.filter((e) => e.valid).length ?? 0;
  const total = entity?.evidence.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-border bg-obsidian p-0 font-sans text-foreground sm:max-w-3xl">
        {entity ? (
          <div className="flex max-h-[85vh] flex-col">
            <DialogTitle className="sr-only">{entity.name} — Trust profile</DialogTitle>
            <DialogDescription className="sr-only">
              Evidence sources, verification counts and constitutional rule breakdown.
            </DialogDescription>

            <header className="border-b border-border px-6 py-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-trust-blue">
                {entity.kind} · {entity.region}
              </div>
              <div className="mt-1 flex items-end justify-between gap-6">
                <div>
                  <div className="text-2xl text-foreground">{entity.name}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    ID {entity.id.toUpperCase()} · Liquidity ${entity.liquidity}B
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-4xl font-bold text-foreground">{entity.score.toFixed(1)}</div>
                  <div className={`font-mono text-xs ${entity.delta >= 0 ? "text-trust-green" : "text-trust-red"}`}>
                    {entity.delta >= 0 ? "▲" : "▼"} {Math.abs(entity.delta).toFixed(2)}%
                  </div>
                </div>
              </div>
            </header>

            <div className="grid flex-1 grid-cols-1 gap-px overflow-y-auto bg-border md:grid-cols-2">
              {/* Evidence */}
              <section className="bg-obsidian p-5">
                <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
                  <span className="text-trust-blue">Evidence Sources</span>
                  <span className="text-muted-foreground">
                    {validCount}/{total} active
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {entity.evidence.map((ev) => (
                    <li
                      key={ev.id}
                      className="flex items-start gap-3 rounded border border-border/60 bg-panel-soft/30 p-3"
                    >
                      <Switch
                        checked={ev.valid}
                        onCheckedChange={() => toggleEvidence(entity.id, ev.id)}
                        className="mt-0.5"
                        aria-label={`Toggle ${ev.source}`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-foreground">{ev.source}</div>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          <span>{ev.sourceKind}</span>
                          <span>w {(ev.weight * 100).toFixed(0)}%</span>
                          <span>conf {ev.confidence.toFixed(0)}%</span>
                          <span className={ev.valid ? "text-trust-green" : "text-trust-red"}>
                            attests {ev.attests.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Rules */}
              <section className="bg-obsidian p-5">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-trust-blue">
                  Constitutional Rule Breakdown
                </div>
                <ul className="space-y-3">
                  {rules.map((r) => (
                    <li key={r.id} className="rounded border border-border/60 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-foreground">{r.label}</span>
                        <span
                          className={`rounded border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${
                            r.pass
                              ? "border-trust-green/40 text-trust-green"
                              : "border-trust-red/40 text-trust-red"
                          }`}
                        >
                          {r.pass ? "pass" : "fail"}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-[11px] text-muted-foreground">{r.detail}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded border border-trust-blue/30 bg-panel-soft/40 p-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Toggle any evidence source to observe how multi-source consensus
                  and conflict checks recompute the final TrustScore in realtime.
                </div>
              </section>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
