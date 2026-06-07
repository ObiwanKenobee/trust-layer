import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  computeRuleChecks,
  toggleEvidence,
  useTrustStore,
} from "@/lib/trust-data";

/**
 * Interactive Constitutional Verification Engine. Pick an entity, toggle
 * evidence validity, and watch consensus/conflict checks recompute the
 * final TrustScore live.
 */
export function ConstitutionEngine() {
  const store = useTrustStore();
  const [entityId, setEntityId] = useState(store.entities[0]?.id);
  const entity = store.entities.find((e) => e.id === entityId) ?? store.entities[0];
  const rules = useMemo(() => computeRuleChecks(entity), [entity, store.tick]);
  const passed = rules.filter((r) => r.pass).length;
  const valid = entity.evidence.filter((e) => e.valid);
  const conflict = entity.evidence.filter((e) => !e.valid).length;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div className="font-mono text-[10px] uppercase tracking-widest text-trust-blue">
          Entity under verification
        </div>
        <Select value={entity.id} onValueChange={setEntityId}>
          <SelectTrigger className="h-8 w-56 border-border bg-panel-soft/40 font-mono text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-border bg-obsidian font-mono text-xs">
            {store.entities.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.name} · {e.kind}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-px bg-border lg:grid-cols-3">
        {/* Live score */}
        <div className="bg-obsidian p-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Recomputed TrustScore
          </div>
          <div className="mt-2 font-mono text-5xl font-bold text-foreground">
            {entity.score.toFixed(1)}
          </div>
          <div className={`mt-1 font-mono text-xs ${entity.delta >= 0 ? "text-trust-green" : "text-trust-red"}`}>
            {entity.delta >= 0 ? "▲" : "▼"} {Math.abs(entity.delta).toFixed(2)}% rolling
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <div className="rounded border border-border p-2">
              <div>Rules passed</div>
              <div className="mt-1 text-foreground">{passed}/{rules.length}</div>
            </div>
            <div className="rounded border border-border p-2">
              <div>Valid evidence</div>
              <div className="mt-1 text-foreground">{valid.length}/{entity.evidence.length}</div>
            </div>
            <div className="rounded border border-border p-2">
              <div>Conflicts</div>
              <div className={`mt-1 ${conflict ? "text-trust-red" : "text-foreground"}`}>{conflict}</div>
            </div>
            <div className="rounded border border-border p-2">
              <div>Source classes</div>
              <div className="mt-1 text-foreground">
                {new Set(valid.map((v) => v.sourceKind)).size}
              </div>
            </div>
          </div>
        </div>

        {/* Evidence toggles */}
        <div className="bg-obsidian p-5">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-trust-blue">
            Evidence Validity Toggles
          </div>
          <ul className="space-y-2">
            {entity.evidence.map((ev) => (
              <li
                key={ev.id}
                className="flex items-center gap-3 rounded border border-border/60 px-3 py-2"
              >
                <Switch
                  checked={ev.valid}
                  onCheckedChange={() => toggleEvidence(entity.id, ev.id)}
                  aria-label={`Toggle ${ev.source}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs text-foreground">{ev.source}</div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    {ev.sourceKind} · w {(ev.weight * 100).toFixed(0)}% · {ev.confidence.toFixed(0)}% conf
                  </div>
                </div>
                <span
                  className={`font-mono text-xs ${ev.valid ? "text-trust-green" : "text-trust-red"}`}
                >
                  {ev.attests.toFixed(1)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Rule pipeline */}
        <div className="bg-obsidian p-5">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-trust-blue">
            Constitutional Pipeline
          </div>
          <ol className="space-y-3">
            {rules.map((r, i) => (
              <li key={r.id} className="rounded border border-border/60 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm text-foreground">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {r.label}
                  </span>
                  <span
                    className={`size-2.5 rounded-full ${r.pass ? "bg-trust-green shadow-glow-green" : "bg-trust-red"}`}
                  />
                </div>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">{r.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
