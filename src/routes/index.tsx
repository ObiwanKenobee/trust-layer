import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import trustMap from "@/assets/trust-map.jpg";
import { TerminalTicker } from "@/components/terminal-ticker";
import { TrustRadar } from "@/components/trust-radar";
import { EntityDrilldown } from "@/components/entity-drilldown";
import { ConstitutionEngine } from "@/components/constitution-engine";
import { TrustExchange } from "@/components/trust-exchange";
import { AccuracyVault } from "@/components/accuracy-vault";
import { ValidatorDrilldown } from "@/components/validator-drilldown";
import { EntityCompare } from "@/components/entity-compare";
import { EvidenceSubmission } from "@/components/evidence-submission";
import { useTrustStore, type Entity, type ValidatorClass } from "@/lib/trust-data";

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

const verificationSteps = [
  { label: "Evidence Multi-Source Verification", state: "ok" },
  { label: "Oracle Consensus Agreement", state: "ok" },
  { label: "Historical Variance Check", state: "ok" },
  { label: "Conflict-of-Interest Sweep", state: "ok" },
  { label: "Constitutional Rule Compliance", state: "ok" },
  { label: "Re-attestation Window …", state: "pending" },
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

function TrustTerminal() {
  const store = useTrustStore();
  const [selected, setSelected] = useState<Entity | null>(null);
  const [selectedValidator, setSelectedValidator] = useState<ValidatorClass | null>(null);

  const avgByKind = (kind: Entity["kind"]) => {
    const xs = store.entities.filter((e) => e.kind === kind);
    return xs.length ? (xs.reduce((s, e) => s + e.score, 0) / xs.length).toFixed(1) : "—";
  };

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
              href="#constitution"
              className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 font-mono text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-panel-soft"
            >
              <span className="font-mono text-[10px] opacity-50">03</span>
              Open Constitution Engine
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

            {store.entities.map((n) => {
              const up = n.delta >= 0;
              return (
                <button
                  key={n.id}
                  onClick={() => setSelected(n)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  aria-label={`Open ${n.name} drilldown`}
                >
                  <span className={`relative flex size-2.5 rounded-full ${up ? "bg-trust-green" : "bg-trust-red"}`}>
                    <span className={`absolute inset-0 animate-ping rounded-full opacity-40 ${up ? "bg-trust-green" : "bg-trust-red"}`} />
                  </span>
                  <span className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded border border-border bg-obsidian/95 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground group-hover:block">
                    {n.name} · <span className={up ? "text-trust-green" : "text-trust-red"}>{n.score.toFixed(1)}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-px border-t border-border bg-border md:grid-cols-4">
            {[
              { k: "Sovereign Avg", v: avgByKind("Sovereign") },
              { k: "NGO Avg", v: avgByKind("NGO") },
              { k: "Corporate Avg", v: avgByKind("Corporate") },
              { k: "Institutional Avg", v: avgByKind("Institution") },
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
                    <div className="h-full bg-gradient-to-r from-trust-blue to-trust-green" style={{ width: `${g.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST ASSET EXPLORER */}
        <section className="col-span-12 panel">
          <PanelHeader index="SCREEN_02" title="Trust Asset Explorer · Live Index" status="STREAM_OK" />
          <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-3 lg:grid-cols-6">
            {store.entities.map((e) => {
              const up = e.delta >= 0;
              return (
                <button
                  key={e.id}
                  onClick={() => setSelected(e)}
                  className="group flex flex-col gap-3 bg-obsidian p-5 text-left transition-colors hover:bg-panel-soft"
                >
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {e.kind} · {e.id.toUpperCase()}
                  </div>
                  <div className="text-sm text-foreground">{e.name}</div>
                  <div className="mt-auto flex items-end justify-between">
                    <span className="font-mono text-4xl font-bold text-foreground">{e.score.toFixed(1)}</span>
                    <span className={`font-mono text-xs ${up ? "text-trust-green" : "text-trust-red"}`}>
                      {up ? "▲" : "▼"} {Math.abs(e.delta).toFixed(2)}%
                    </span>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-trust-blue">
                    Liquidity ${e.liquidity}B · drilldown →
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* CONSTITUTIONAL ENGINE */}
        <section id="constitution" className="col-span-12 panel">
          <PanelHeader index="SCREEN_03" title="Constitutional Verification Engine · Interactive" status="LIVE_RECOMPUTE" />
          <ConstitutionEngine />
        </section>

        {/* HISTORICAL ACCURACY VAULT */}
        <section className="col-span-12 panel">
          <PanelHeader index="SCREEN_04" title="Historical Accuracy Vault" status="BACKTEST" />
          <AccuracyVault />
        </section>

        {/* TRUST EXCHANGE */}
        <section id="exchange" className="col-span-12 panel">
          <PanelHeader index="SCREEN_05" title="Trust Exchange · Instruments" status="MARKET_OPEN" />
          <TrustExchange />
        </section>

        {/* ENTITY COMPARE */}
        <section id="compare" className="col-span-12 panel">
          <PanelHeader index="SCREEN_05B" title="Sovereign Spread · Entity Comparison" status="LIVE" />
          <div className="p-5">
            <EntityCompare />
          </div>
        </section>

        {/* EVIDENCE SUBMISSION */}
        <section id="submit" className="col-span-12 panel lg:col-span-6">
          <PanelHeader index="SCREEN_05C" title="Attestation Submission" status="OPEN" />
          <div className="p-5">
            <EvidenceSubmission />
          </div>
        </section>

        {/* CONSTITUTION ENGINE PROMOTED (filling lg:col-span-6 slot) */}

        {/* VALIDATOR NETWORK */}
        <section id="validators" className="col-span-12 panel lg:col-span-8 flex flex-col">
          <PanelHeader index="SCREEN_06" title="Validator Network · Live" status="CONSENSUS_97.4%" />
          <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-3">
            <div className="bg-obsidian p-6">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Validators Online</div>
              <div className="mt-2 font-mono text-4xl text-foreground">12,432</div>
              <div className="mt-1 font-mono text-[11px] text-trust-green">▲ 184 in last hour</div>
            </div>
            <div className="bg-obsidian p-6">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Consensus Accuracy</div>
              <div className="mt-2 font-mono text-4xl text-foreground">97.4%</div>
              <div className="mt-2 h-1 w-full bg-grid">
                <div className="h-full bg-trust-blue" style={{ width: "97.4%" }} />
              </div>
            </div>
            <div className="bg-obsidian p-6">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Evidence Processed</div>
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
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{step.p}</div>
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
          <div className="border-t border-border p-5">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-trust-blue">
              Legacy Protocol Reference
            </div>
            <ul className="space-y-2">
              {verificationSteps.map((s) => (
                <li key={s.label} className="flex items-center gap-2 font-mono text-[11px]">
                  <span className={`size-1.5 rounded-full ${s.state === "ok" ? "bg-trust-green" : "border border-grid"}`} />
                  <span className={s.state === "ok" ? "text-foreground" : "text-muted-foreground"}>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

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

      <EntityDrilldown entity={selected} open={!!selected} onOpenChange={(v) => !v && setSelected(null)} />
    </div>
  );
}
