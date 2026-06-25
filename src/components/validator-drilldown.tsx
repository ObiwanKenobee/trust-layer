import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { ValidatorClass } from "@/lib/trust-data";

interface Props {
  validator: ValidatorClass | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function ValidatorDrilldown({ validator, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-border bg-obsidian p-0 font-sans text-foreground sm:max-w-4xl">
        {validator ? (
          <div className="flex max-h-[85vh] flex-col">
            <DialogTitle className="sr-only">{validator.name} — Validator class</DialogTitle>
            <DialogDescription className="sr-only">
              Node-level uptime, stake-at-risk, attestations and slashing events.
            </DialogDescription>

            <header className="border-b border-border px-6 py-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-trust-blue">
                Validator Class · {validator.id.toUpperCase()}
              </div>
              <div className="mt-1 flex items-end justify-between gap-6">
                <div>
                  <div className="text-2xl text-foreground">{validator.name}</div>
                  <p className="mt-1 max-w-xl text-sm text-muted-foreground">{validator.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-6 text-right font-mono">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Nodes</div>
                    <div className="text-xl text-foreground">{validator.count.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Network Share</div>
                    <div className="text-xl text-foreground">{validator.share}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Consensus</div>
                    <div className="text-xl text-trust-green">{validator.consensus.toFixed(2)}%</div>
                  </div>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-trust-blue">
                Sample Nodes ({validator.nodes.length} of {validator.count.toLocaleString()})
              </div>
              <div className="overflow-hidden rounded border border-border">
                <table className="w-full font-mono text-[11px]">
                  <thead className="bg-panel-soft/50 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 text-left">Alias</th>
                      <th className="px-3 py-2 text-left">Region</th>
                      <th className="px-3 py-2 text-right">Uptime</th>
                      <th className="px-3 py-2 text-right">Stake $M</th>
                      <th className="px-3 py-2 text-right">Attests/24h</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-left">Last Slash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validator.nodes.map((n) => (
                      <tr key={n.id} className="border-t border-border/60">
                        <td className="px-3 py-2 text-foreground">{n.alias}</td>
                        <td className="px-3 py-2 text-muted-foreground">{n.region}</td>
                        <td className={`px-3 py-2 text-right ${n.uptime >= 99 ? "text-trust-green" : n.uptime >= 96 ? "text-foreground" : "text-trust-red"}`}>
                          {n.uptime.toFixed(2)}%
                        </td>
                        <td className="px-3 py-2 text-right text-foreground">${n.stake.toFixed(1)}</td>
                        <td className="px-3 py-2 text-right text-foreground">{n.attestations.toLocaleString()}</td>
                        <td className="px-3 py-2">
                          <span
                            className={`rounded border px-2 py-0.5 text-[9px] uppercase tracking-widest ${
                              n.status === "active"
                                ? "border-trust-green/40 text-trust-green"
                                : n.status === "probation"
                                ? "border-trust-amber/50 text-trust-amber"
                                : "border-trust-red/50 text-trust-red"
                            }`}
                          >
                            {n.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{n.lastSlash ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 font-mono text-[10px] uppercase tracking-widest">
                <div className="rounded border border-trust-green/30 bg-panel-soft/30 p-3">
                  <div className="text-muted-foreground">Active</div>
                  <div className="mt-1 text-lg text-trust-green">
                    {validator.nodes.filter((n) => n.status === "active").length}
                  </div>
                </div>
                <div className="rounded border border-trust-amber/40 bg-panel-soft/30 p-3">
                  <div className="text-muted-foreground">Probation</div>
                  <div className="mt-1 text-lg text-trust-amber">
                    {validator.nodes.filter((n) => n.status === "probation").length}
                  </div>
                </div>
                <div className="rounded border border-trust-red/40 bg-panel-soft/30 p-3">
                  <div className="text-muted-foreground">Slashed (90d)</div>
                  <div className="mt-1 text-lg text-trust-red">
                    {validator.nodes.filter((n) => n.status === "slashed").length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
