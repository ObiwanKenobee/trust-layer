import { createFileRoute } from "@tanstack/react-router";
import trustMap from "@/assets/trust-map.jpg";
import { TerminalTicker } from "@/components/terminal-ticker";
import { TrustRadar } from "@/components/trust-radar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrustScore — The Reserve Currency of Trust" },
      {
        name: "description",
        content:
          "Measure, verify, and price trust across institutions, companies, communities and nations. The Bloomberg Terminal for the global trust layer.",
      },
      { property: "og:title", content: "TrustScore — The Reserve Currency of Trust" },
      {
        property: "og:description",
        content:
          "Measure, verify, and price trust across institutions, companies, communities and nations.",
      },
      { property: "og:image", content: trustMap },
      { name: "twitter:image", content: trustMap },
    ],
  }),
  component: TrustTerminal,
});

/* ---------------- data ---------------- */

const mapNodes = [
  { name: "Rwanda", kind: "Sovereign", score: 87.1, delta: "+2.4%", x: 56, y: 62, status: "up" },
  { name: "Kenya", kind: "Sovereign", score: 84.3, delta: "+0.6%", x: 58.5, y: 59, status: "up" },
  { name: "Singapore", kind: "Sovereign", score: 91.8, delta: "+0.1%", x: 76, y: 60, status: "up" },
  { name: "Helios Energy", kind: "Corporate", score: 62.5, delta: "−0.8%", x: 22, y: 46, status: "down" },
  { name: "UNICEF G-Pool", kind: "Institution", score: 94.2, delta: "+0.3%", x: 49.5, y: 36, status: "up" },
  { name: "Amazon Guardian", kind: "NGO", score: 81.0, delta: "−0.4%", x: 30, y: 66, status: "down" },
];

const assets = [
  { id: "H2O-RECOVER-24", name: "Nile Basin Water Recovery", score: 92, delta: "+1.2%", liq: "$4.2B", dir: "up" },
  { id: "SVR-CRED-T1", name: "Sovereign Credit Tier-1", score: 81, delta: "+0.2%", liq: "$12.8B", dir: "up" },
  { id: "NGO-IMP-X", name: "Global Literacy Impact Pool", score: 73, delta: "−4.1%", liq: "$840M", dir: "down" },
  { id: "CARB-OFF-T", name: "Carbon Recovery Trust", score: 95, delta: "+2.8%", liq: "$1.1B", dir: "up" },
];

const verificationSteps = [
  { label: "Evidence Multi-Source Verification", state: "ok" },
  { label: "Oracle Consensus Agreement", state: "ok" },
  { label: "Historical Variance Check", state: "ok" },
  { label: "Conflict-of-Interest Sweep", state: "ok" },
  { label: "Constitutional Rule Compliance", state: "ok" },
  { label: "Re-attestation Window …", state: "pending" },
];

const accuracyBars = [
  { year: "2024", predicted: 78, actual: 80 },
  { year: "2025", predicted: 82, actual: 81 },
  { year: "2026", predicted: 85, actual: 86 },
  { year: "2027", predicted: 88, actual: 87 },
  { year: "2028", predicted: 94, actual: 93 },
  { year: "2029", predicted: 91, actual: 92 },
];

const exchangeInstruments = [
  { ticker: "WRBN-92", name: "Water Restoration Notes", yield: "4.82%", trust: 92 },
  { ticker: "CRBD-88", name: "Carbon Recovery Bonds", yield: "5.40%", trust: 88 },
  { ticker: "CDPL-73", name: "Community Dev. Pools", yield: "6.10%", trust: 73 },
  { ticker: "SVRT-81", name: "Sovereign Trust Bonds", yield: "3.95%", trust: 81 },
];

const validatorTypes = [
  { name: "Universities", count: 2_148, share: 17 },
  { name: "Auditors", count: 1_902, share: 15 },
  { name: "NGOs", count: 2_540, share: 20 },
  { name: "Sensors", count: 3_120, share: 25 },
  { name: "Citizens", count: 1_840, share: 15 },
  { name: "AI Agents", count: 882, share: 8 },
];

const genome = [
  { label: "Integrity", value: 93 },
  { label: "Transparency", value: 87 },
  { label: "Delivery", value: 91 },
  { label: "Impact", value: 95 },
  { label: "Stewardship", value: 88 },
  { label: "Accountability", value: 90 },
];

/* ---------------- shared atoms ---------------- */

function PanelHeader({ index, title, status }: { index: string; title: string; status?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3">
      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
        <span className="text-trust-blue">{index}</span>
        <span className="text-muted-foreground">{title}</span>
      </div>
      {status ? (
        <span className="rounded border border-trust-blue/30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-trust-blue">
          {status}
        </span>
      ) : null}
    </div>
  );
}

function StatRow({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "up" | "down" | "gold" }) {
  const toneClass =
    tone === "up" ? "text-trust-green" : tone === "down" ? "text-trust-red" : tone === "gold" ? "text-trust-gold" : "text-foreground";
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-2 font-mono text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className={toneClass}>{value}</span>
    </div>
  );
}

/* ---------------- main ---------------- */

function TrustTerminal() {
  return (
    <div className="min-h-screen bg-obsidian text-foreground">
      <TerminalTicker />

      <main className="mx-auto grid max-w-[1600px] grid-cols-12 gap-6 px-6 pb-24 pt-10 md:pt-16">
        {/* HERO */}
        <section className="col-span-12 border-b border-border/60 pb-12">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-trust-blue">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-trust-blue shadow-glow-blue" />
            Protocol 01.A · Civilization Trust Layer
          </div>
          <h1 className="mt-6 max-w-5xl text-balance text-5xl font-extrabold leading-[1.02] tracking-tight text-foreground md:text-7xl">
            Trust is the new{" "}
            <span className="bg-gradient-to-r from-trust-blue via-trust-green to-trust-gold bg-clip-text text-transparent">
              reserve currency
            </span>
            .
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Measure, verify, and price trust across institutions, companies, communities and
            nations. A constitutional rating layer for the attention economy — observed, not
            advertised.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#map"
              className="group inline-flex items-center gap-2 rounded-md bg-trust-blue px-5 py-3 font-mono text-xs uppercase tracking-widest text-obsidian transition-colors hover:bg-foreground"
            >
              <span className="font-mono text-[10px] opacity-70">01</span>
              View Trust Network
            </a>
            <a
              href="#exchange"
              className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 font-mono text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-panel-soft"
            >
              <span className="font-mono text-[10px] opacity-50">02</span>
              Explore Trust Assets
            </a>
            <a
              href="#validators"
              className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 font-mono text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-panel-soft"
            >
              <span className="font-mono text-[10px] opacity-50">03</span>
              Become a Validator
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
            {[
              { k: "Entities Indexed", v: "184,302" },
              { k: "Evidence Processed", v: "4.3B" },
              { k: "Validator Network", v: "12,432" },
              { k: "5-yr Prediction Variance", v: "1.04%" },
            ].map((s) => (
              <div key={s.k} className="bg-obsidian p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.k}</div>
                <div className="mt-2 font-mono text-2xl text-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* GLOBAL TRUST MAP */}
        <section id="map" className="col-span-12 panel lg:col-span-8 flex flex-col">
          <PanelHeader index="SCREEN_01" title="Global Trust Layer · Map View" status="REALTIME_FEED" />
          <div className="relative aspect-[21/10] w-full overflow-hidden bg-obsidian">
            <img
              src={trustMap}
              alt="Global trust map showing live trust scores across continents"
              width={1600}
              height={760}
              className="absolute inset-0 size-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 left-0 h-full w-full">
              <div className="animate-scan h-1/3 w-full bg-gradient-to-b from-transparent via-trust-blue/10 to-transparent" />
            </div>

            {mapNodes.map((n) => (
              <div
                key={n.name}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                <span
                  className={`relative flex size-2.5 rounded-full ${n.status === "up" ? "bg-trust-green" : "bg-trust-red"}`}
                >
                  <span
                    className={`absolute inset-0 animate-ping rounded-full opacity-40 ${n.status === "up" ? "bg-trust-green" : "bg-trust-red"}`}
                  />
                </span>
              </div>
            ))}

            {/* Two callout cards */}
            <div className="absolute left-[8%] top-[18%] hidden w-44 rounded-lg border border-trust-blue/30 bg-obsidian/85 p-3 backdrop-blur md:block">
              <div className="font-mono text-[9px] uppercase tracking-widest text-trust-blue">Sovereign · Rwanda</div>
              <div className="mt-1 font-mono text-2xl text-foreground">87.1</div>
              <div className="font-mono text-[10px] text-trust-green">▲ 2.4% vs prev qtr</div>
            </div>
            <div className="absolute bottom-[18%] right-[6%] hidden w-44 rounded-lg border border-border bg-obsidian/85 p-3 backdrop-blur md:block">
              <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Corp · Helios Energy
              </div>
              <div className="mt-1 font-mono text-2xl text-foreground">62.5</div>
              <div className="font-mono text-[10px] text-trust-red">▼ 0.8% variance flagged</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px border-t border-border bg-border md:grid-cols-4">
            {[
              { k: "Sovereign Avg", v: "74.2" },
              { k: "NGO Avg", v: "82.1" },
              { k: "Corporate Avg", v: "61.4" },
              { k: "Institutional Avg", v: "78.6" },
            ].map((s) => (
              <div key={s.k} className="bg-obsidian px-4 py-3">
                <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{s.k}</div>
                <div className="mt-1 font-mono text-base text-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* TRUST GENOME */}
        <section className="col-span-12 panel lg:col-span-4 flex flex-col">
          <PanelHeader index="SCREEN_07" title="Trust Genome · Entity Profile" status="ORG_Δ" />
          <div className="flex flex-1 flex-col items-center gap-6 p-6">
            <TrustRadar axes={genome} size={260} />
            <div className="w-full space-y-3">
              {genome.map((g) => (
                <div key={g.label}>
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="uppercase tracking-widest text-muted-foreground">{g.label}</span>
                    <span className="text-foreground">{g.value}</span>
                  </div>
                  <div className="mt-1 h-px w-full overflow-hidden bg-grid">
                    <div
                      className="h-full bg-gradient-to-r from-trust-blue to-trust-green"
                      style={{ width: `${g.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST ASSET EXPLORER */}
        <section className="col-span-12 panel">
          <PanelHeader index="SCREEN_02" title="Trust Asset Explorer · Live Index" status="STREAM_OK" />
          <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-4">
            {assets.map((a) => (
              <div key={a.id} className="group flex flex-col gap-4 bg-obsidian p-5 transition-colors hover:bg-panel-soft">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {a.id}
                </div>
                <div className="text-sm text-foreground">{a.name}</div>
                <div className="mt-auto flex items-end justify-between">
                  <span className="font-mono text-4xl font-bold text-foreground">{a.score}</span>
                  <span className={`font-mono text-xs ${a.dir === "up" ? "text-trust-green" : "text-trust-red"}`}>
                    {a.dir === "up" ? "▲" : "▼"} {a.delta}
                  </span>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-trust-blue">
                  Liquidity {a.liq}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONSTITUTIONAL VERIFICATION + HISTORICAL ACCURACY */}
        <section className="col-span-12 panel">
          <PanelHeader index="SCREEN_03·04" title="Constitution Engine · Historical Accuracy Vault" status="LOCKED_RULES" />
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Constitution */}
            <div className="border-b border-border p-6 lg:col-span-2 lg:border-b-0 lg:border-r">
              <div className="mb-5 font-mono text-[10px] uppercase tracking-widest text-trust-blue">
                Verification Protocol
              </div>
              <ul className="space-y-3.5">
                {verificationSteps.map((s) => (
                  <li key={s.label} className="flex items-center gap-3 text-sm">
                    {s.state === "ok" ? (
                      <span className="size-2 rounded-full bg-trust-green shadow-glow-green" />
                    ) : (
                      <span className="size-2 rounded-full border border-grid" />
                    )}
                    <span className={s.state === "ok" ? "text-foreground" : "text-muted-foreground"}>
                      {s.label}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-md border border-border bg-panel-soft/40 p-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Rule Hash · last commit
                </div>
                <div className="mt-1 font-mono text-xs text-trust-blue">
                  0xC0NSTITUTIO…9F42 · signed by 9 / 11 stewards
                </div>
              </div>
            </div>

            {/* Accuracy Vault */}
            <div className="p-6 lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Prediction vs Outcome · Rolling 6yr
                </div>
                <span className="rounded border border-trust-gold/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-trust-gold">
                  Mean Variance 1.04%
                </span>
              </div>

              <div className="grid grid-cols-6 items-end gap-3 h-44">
                {accuracyBars.map((b) => {
                  const variance = Math.abs(b.actual - b.predicted);
                  return (
                    <div key={b.year} className="flex h-full flex-col items-stretch justify-end gap-1">
                      <div className="relative flex h-full items-end gap-1">
                        <div className="flex-1 rounded-t-sm border-t border-trust-blue bg-trust-blue/20" style={{ height: `${b.predicted}%` }} />
                        <div className="flex-1 rounded-t-sm border-t border-trust-green bg-trust-green/30" style={{ height: `${b.actual}%` }} />
                      </div>
                      <div className="text-center font-mono text-[10px] text-muted-foreground">{b.year}</div>
                      <div className="text-center font-mono text-[10px] text-trust-gold">±{variance}</div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span className="flex items-center gap-2"><span className="h-2 w-3 bg-trust-blue/40" />Predicted</span>
                <span className="flex items-center gap-2"><span className="h-2 w-3 bg-trust-green/60" />Actual</span>
                <span className="text-trust-gold">Accuracy Compounds · replication moat widens annually</span>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST EXCHANGE */}
        <section id="exchange" className="col-span-12 panel">
          <PanelHeader index="SCREEN_05" title="Trust Exchange · Instruments" status="MARKET_OPEN" />
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="px-5 py-3 font-normal uppercase tracking-widest">Ticker</th>
                  <th className="px-5 py-3 font-normal uppercase tracking-widest">Instrument</th>
                  <th className="px-5 py-3 font-normal uppercase tracking-widest">TrustScore</th>
                  <th className="px-5 py-3 font-normal uppercase tracking-widest">Implied Yield</th>
                  <th className="px-5 py-3 font-normal uppercase tracking-widest">Trust-Adj. Curve</th>
                  <th className="px-5 py-3 font-normal uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {exchangeInstruments.map((row) => (
                  <tr key={row.ticker} className="border-b border-border/60 transition-colors hover:bg-panel-soft/50">
                    <td className="px-5 py-4 text-trust-blue">{row.ticker}</td>
                    <td className="px-5 py-4 text-foreground">{row.name}</td>
                    <td className="px-5 py-4">
                      <span className="text-base text-foreground">{row.trust}</span>
                    </td>
                    <td className="px-5 py-4 text-trust-green">{row.yield}</td>
                    <td className="px-5 py-4">
                      <div className="h-1 w-32 overflow-hidden bg-grid">
                        <div
                          className="h-full bg-gradient-to-r from-trust-blue to-trust-green"
                          style={{ width: `${row.trust}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="rounded border border-border px-3 py-1 text-[10px] uppercase tracking-widest text-foreground transition-colors hover:border-trust-blue hover:text-trust-blue">
                        Quote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* VALIDATOR NETWORK */}
        <section id="validators" className="col-span-12 panel lg:col-span-8 flex flex-col">
          <PanelHeader index="SCREEN_06" title="Validator Network · Live" status="CONSENSUS_97.4%" />
          <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-3">
            <div className="bg-obsidian p-6">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Validators Online
              </div>
              <div className="mt-2 font-mono text-4xl text-foreground">12,432</div>
              <div className="mt-1 font-mono text-[11px] text-trust-green">▲ 184 in last hour</div>
            </div>
            <div className="bg-obsidian p-6">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Consensus Accuracy
              </div>
              <div className="mt-2 font-mono text-4xl text-foreground">97.4%</div>
              <div className="mt-2 h-1 w-full bg-grid">
                <div className="h-full bg-trust-blue" style={{ width: "97.4%" }} />
              </div>
            </div>
            <div className="bg-obsidian p-6">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Evidence Processed
              </div>
              <div className="mt-2 font-mono text-4xl text-foreground">4.3B</div>
              <div className="mt-1 font-mono text-[11px] text-muted-foreground">All-time, all sources</div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Composition · Validator Class
            </div>
            <div className="flex h-3 w-full overflow-hidden rounded-sm bg-grid">
              {validatorTypes.map((v, i) => (
                <div
                  key={v.name}
                  className={i % 2 === 0 ? "bg-trust-blue" : "bg-trust-green"}
                  style={{ width: `${v.share}%`, opacity: 1 - i * 0.1 }}
                />
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-2 md:grid-cols-3">
              {validatorTypes.map((v) => (
                <div key={v.name} className="flex items-center justify-between border-b border-border/60 py-2 font-mono text-xs">
                  <span className="text-muted-foreground">{v.name}</span>
                  <span className="text-foreground">{v.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PHASE ROADMAP */}
        <section className="col-span-12 panel lg:col-span-4 flex flex-col">
          <PanelHeader index="ROADMAP" title="Atlas Sanctum · Mythic Build" status="PHASE_02" />
          <ol className="flex-1 divide-y divide-border">
            {[
              { p: "Phase 1", t: "Trust Dashboard", state: "shipped" },
              { p: "Phase 2", t: "Trust Registry", state: "live" },
              { p: "Phase 3", t: "Trust Oracle Network", state: "next" },
              { p: "Phase 4", t: "Trust Exchange", state: "queued" },
              { p: "Phase 5", t: "Trust Reserve Currency", state: "endgame" },
            ].map((step) => (
              <li key={step.p} className="flex items-center justify-between gap-4 p-5">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {step.p}
                  </div>
                  <div className="mt-1 text-sm text-foreground">{step.t}</div>
                </div>
                <span
                  className={`rounded border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${
                    step.state === "live"
                      ? "border-trust-green/40 text-trust-green"
                      : step.state === "shipped"
                      ? "border-trust-blue/40 text-trust-blue"
                      : step.state === "endgame"
                      ? "border-trust-gold/40 text-trust-gold"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {step.state}
                </span>
              </li>
            ))}
          </ol>
          <div className="border-t border-border p-5">
            <StatRow label="Default trust layer for" value="UN · IMF · World Bank" />
            <StatRow label="Replication moat" value="time-keyed accuracy" tone="gold" />
            <StatRow label="Status" value="building infrastructure" tone="up" />
          </div>
        </section>
      </main>

      {/* TERMINAL FOOTER */}
      <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-obsidian/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-6 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-md bg-trust-blue px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-obsidian transition-colors hover:bg-foreground">
              Request Terminal Access
            </button>
            <button className="rounded-md border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-foreground transition-colors hover:bg-panel-soft">
              Validator Registry
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>System Load 2.1%</span>
            <span className="hidden md:inline">Encryption AES-256-GCM</span>
            <span className="flex items-center gap-2 text-trust-green">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-trust-green" />
              Network Live
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
