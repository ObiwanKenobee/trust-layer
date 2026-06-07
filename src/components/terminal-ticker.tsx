import { useEffect, useState } from "react";

const tickerItems = [
  { label: "GLOBAL TRUST INDEX", value: "74.28", delta: "+0.42%", dir: "up" as const },
  { label: "RWANDA", value: "87.1", delta: "+2.4%", dir: "up" as const },
  { label: "KENYA", value: "84.3", delta: "+0.6%", dir: "up" as const },
  { label: "SINGAPORE", value: "91.8", delta: "+0.1%", dir: "up" as const },
  { label: "HELIOS ENERGY", value: "62.5", delta: "-0.8%", dir: "down" as const },
  { label: "UNICEF G-POOL", value: "94.2", delta: "+0.3%", dir: "up" as const },
  { label: "AMAZON GUARDIAN", value: "81.0", delta: "-0.4%", dir: "down" as const },
  { label: "NILE BASIN INIT.", value: "92.4", delta: "+1.2%", dir: "up" as const },
  { label: "VALIDATORS ONLINE", value: "12,432", delta: "+184", dir: "up" as const },
  { label: "CONSENSUS", value: "99.82%", delta: "STABLE", dir: "up" as const },
];

function formatUtc(d: Date) {
  return d.toISOString().slice(11, 19);
}

export function TerminalTicker() {
  const [now, setNow] = useState<string>("--:--:--");

  useEffect(() => {
    setNow(formatUtc(new Date()));
    const i = setInterval(() => setNow(formatUtc(new Date())), 1000);
    return () => clearInterval(i);
  }, []);

  const items = [...tickerItems, ...tickerItems];

  return (
    <div className="sticky top-0 z-50 border-b border-border bg-obsidian/90 backdrop-blur-md">
      <div className="flex items-stretch">
        <div className="flex shrink-0 items-center gap-3 border-r border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-trust-blue">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-trust-green shadow-glow-green" />
          <span>TrustScore // Terminal v1.0</span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max animate-ticker gap-10 py-2 pr-10 font-mono text-[10px] uppercase tracking-widest">
            {items.map((it, idx) => (
              <span key={idx} className="flex items-center gap-2 whitespace-nowrap text-muted-foreground">
                <span className="text-foreground/60">{it.label}</span>
                <span className="text-foreground">{it.value}</span>
                <span className={it.dir === "up" ? "text-trust-green" : "text-trust-red"}>
                  {it.dir === "up" ? "▲" : "▼"} {it.delta}
                </span>
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-obsidian to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-obsidian to-transparent" />
        </div>
        <div className="hidden shrink-0 items-center gap-6 border-l border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest md:flex">
          <span className="text-muted-foreground">UTC {now}</span>
          <span className="text-trust-blue">0x1A2…F09C</span>
        </div>
      </div>
    </div>
  );
}
