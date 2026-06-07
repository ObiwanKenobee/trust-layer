import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTrades, useTrustStore, placeTrade, type Instrument } from "@/lib/trust-data";

type SortKey = "ticker" | "trust" | "yield" | "price" | "notional";
type SortDir = "asc" | "desc";

function trendOf(history: number[]): { dir: "up" | "down" | "flat"; bps: number } {
  if (history.length < 2) return { dir: "flat", bps: 0 };
  const first = history[0];
  const last = history[history.length - 1];
  const bps = ((last - first) / Math.max(0.001, first)) * 10000;
  return { dir: bps > 5 ? "up" : bps < -5 ? "down" : "flat", bps: +bps.toFixed(0) };
}

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = Math.max(0.1, max - min);
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`)
    .join(" ");
  const up = data[data.length - 1] >= data[0];
  return (
    <svg viewBox="0 0 100 100" className="h-6 w-20" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={up ? "var(--trust-green)" : "var(--trust-red)"}
        strokeWidth="3"
        points={pts}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function TrustExchange() {
  const store = useTrustStore();
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "trust", dir: "desc" });
  const [filter, setFilter] = useState("");
  const [kind, setKind] = useState<string>("all");
  const [active, setActive] = useState<{ inst: Instrument; side: "buy" | "sell" } | null>(null);

  const rows = useMemo(() => {
    const filtered = store.instruments.filter((i) => {
      const ent = store.entities.find((e) => e.id === i.entityId);
      const matchesQ =
        !filter ||
        i.ticker.toLowerCase().includes(filter.toLowerCase()) ||
        i.name.toLowerCase().includes(filter.toLowerCase()) ||
        ent?.name.toLowerCase().includes(filter.toLowerCase());
      const matchesKind = kind === "all" || ent?.kind === kind;
      return matchesQ && matchesKind;
    });

    const getVal = (i: Instrument): number | string => {
      const ent = store.entities.find((e) => e.id === i.entityId)!;
      switch (sort.key) {
        case "ticker": return i.ticker;
        case "trust": return ent.score;
        case "yield": return i.baseYield;
        case "price": return i.price;
        case "notional": return i.notional;
      }
    };
    return [...filtered].sort((a, b) => {
      const va = getVal(a);
      const vb = getVal(b);
      const cmp = typeof va === "number" && typeof vb === "number"
        ? va - vb
        : String(va).localeCompare(String(vb));
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [store, sort, filter, kind]);

  const headers: { key: SortKey; label: string; align?: "right" }[] = [
    { key: "ticker", label: "Ticker" },
    { key: "trust", label: "Trust" },
    { key: "yield", label: "Yield" },
    { key: "price", label: "Price" },
    { key: "notional", label: "Notional" },
  ];

  function toggleSort(k: SortKey) {
    setSort((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "desc" }));
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search ticker / entity"
            className="h-8 w-56 border-border bg-panel-soft/40 font-mono text-xs"
          />
          <Select value={kind} onValueChange={setKind}>
            <SelectTrigger className="h-8 w-40 border-border bg-panel-soft/40 font-mono text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-border bg-obsidian font-mono text-xs">
              <SelectItem value="all">All classes</SelectItem>
              <SelectItem value="Sovereign">Sovereign</SelectItem>
              <SelectItem value="Corporate">Corporate</SelectItem>
              <SelectItem value="Institution">Institution</SelectItem>
              <SelectItem value="NGO">NGO</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {rows.length} of {store.instruments.length} instruments
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              {headers.map((h) => (
                <th
                  key={h.key}
                  onClick={() => toggleSort(h.key)}
                  className="cursor-pointer select-none px-5 py-3 font-normal uppercase tracking-widest transition-colors hover:text-trust-blue"
                >
                  {h.label}
                  {sort.key === h.key ? (
                    <span className="ml-1 text-trust-blue">{sort.dir === "asc" ? "▲" : "▼"}</span>
                  ) : null}
                </th>
              ))}
              <th className="px-5 py-3 font-normal uppercase tracking-widest">Trend</th>
              <th className="px-5 py-3 text-right font-normal uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((inst) => {
              const ent = store.entities.find((e) => e.id === inst.entityId)!;
              const t = trendOf(inst.history);
              return (
                <tr key={inst.ticker} className="border-b border-border/60 transition-colors hover:bg-panel-soft/50">
                  <td className="px-5 py-4">
                    <div className="text-trust-blue">{inst.ticker}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {inst.name} · {ent.name}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-foreground">{ent.score.toFixed(1)}</td>
                  <td className="px-5 py-4 text-trust-green">{inst.baseYield.toFixed(2)}%</td>
                  <td className="px-5 py-4 text-foreground">{inst.price.toFixed(2)}</td>
                  <td className="px-5 py-4 text-muted-foreground">${inst.notional}M</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Sparkline data={inst.history} />
                      <span className={t.dir === "up" ? "text-trust-green" : t.dir === "down" ? "text-trust-red" : "text-muted-foreground"}>
                        {t.dir === "flat" ? "—" : `${t.bps > 0 ? "+" : ""}${t.bps}bps`}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setActive({ inst, side: "buy" })}
                        className="rounded border border-trust-green/40 px-3 py-1 text-[10px] uppercase tracking-widest text-trust-green transition-colors hover:bg-trust-green/10"
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => setActive({ inst, side: "sell" })}
                        className="rounded border border-trust-red/40 px-3 py-1 text-[10px] uppercase tracking-widest text-trust-red transition-colors hover:bg-trust-red/10"
                      >
                        Sell
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!rows.length ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                  No instruments match filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <TradeBlotter />

      <TradeDialog
        open={!!active}
        ticket={active}
        onClose={() => setActive(null)}
      />
    </div>
  );
}

function TradeBlotter() {
  const trades = useTrades();
  if (!trades.length) return null;
  return (
    <div className="border-t border-border px-5 py-3">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-trust-blue">
        Recent Trades · session blotter
      </div>
      <ul className="grid grid-cols-1 gap-1 font-mono text-[11px] md:grid-cols-2">
        {trades.slice(0, 6).map((t) => (
          <li key={t.id} className="flex items-center justify-between border-b border-border/40 py-1.5">
            <span className="text-muted-foreground">
              <span className={t.side === "buy" ? "text-trust-green" : "text-trust-red"}>
                {t.side.toUpperCase()}
              </span>{" "}
              {t.qty} × {t.ticker}
            </span>
            <span className="text-foreground">@ {t.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TradeDialog({
  open,
  ticket,
  onClose,
}: {
  open: boolean;
  ticket: { inst: Instrument; side: "buy" | "sell" } | null;
  onClose: () => void;
}) {
  const store = useTrustStore();
  const [qty, setQty] = useState("100");
  if (!ticket) return null;
  const live = store.instruments.find((i) => i.ticker === ticket.inst.ticker) ?? ticket.inst;
  const ent = store.entities.find((e) => e.id === live.entityId)!;
  const notional = (Number(qty) || 0) * live.price;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md border-border bg-obsidian text-foreground">
        <DialogTitle className="font-mono text-xs uppercase tracking-widest text-trust-blue">
          {ticket.side === "buy" ? "Buy Order" : "Sell Order"} · {live.ticker}
        </DialogTitle>
        <DialogDescription className="text-xs text-muted-foreground">
          Trust-priced quote. Price = base ± trust premium − yield discount.
        </DialogDescription>

        <div className="mt-2 space-y-3 font-mono text-xs">
          <div className="flex justify-between border-b border-border/60 py-2">
            <span className="text-muted-foreground">Reference Entity</span>
            <span className="text-foreground">{ent.name} · {ent.score.toFixed(1)}</span>
          </div>
          <div className="flex justify-between border-b border-border/60 py-2">
            <span className="text-muted-foreground">Live Price</span>
            <span className="text-foreground">{live.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-border/60 py-2">
            <span className="text-muted-foreground">Implied Yield</span>
            <span className="text-trust-green">{live.baseYield.toFixed(2)}%</span>
          </div>

          <label className="block">
            <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">Quantity</div>
            <Input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="border-border bg-panel-soft/40 font-mono"
            />
          </label>

          <div className="flex justify-between border-t border-border pt-3 text-sm">
            <span className="text-muted-foreground">Notional</span>
            <span className="text-foreground">${notional.toFixed(2)}</span>
          </div>

          <button
            onClick={() => {
              placeTrade({ ticker: live.ticker, side: ticket.side, qty: Number(qty) || 0, price: live.price });
              onClose();
            }}
            className={`mt-2 w-full rounded-md px-4 py-2 text-[10px] uppercase tracking-widest text-obsidian transition-colors ${
              ticket.side === "buy" ? "bg-trust-green hover:bg-trust-green/80" : "bg-trust-red hover:bg-trust-red/80"
            }`}
          >
            Confirm {ticket.side}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
