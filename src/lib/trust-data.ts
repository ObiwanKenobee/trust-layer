/**
 * Trust data store — seeded reactive in-memory model.
 *
 * Everything in the terminal is derived from this single source:
 * - Entities have weighted evidence items and constitutional rule checks.
 * - TrustScore = weighted mean of *valid* evidence × rule-compliance factor.
 * - Map nodes, Asset Explorer cards, and Exchange instruments all reference
 *   an entity, so toggles in the Constitution Engine propagate everywhere.
 * - A 2s tick adds bounded random walks to simulate a live feed.
 */

import { useEffect, useSyncExternalStore } from "react";

export type EntityKind = "Sovereign" | "Corporate" | "Institution" | "NGO";

export interface EvidenceItem {
  id: string;
  source: string;
  sourceKind: "University" | "Auditor" | "Sensor" | "NGO" | "Citizen" | "AI Agent";
  weight: number; // 0..1
  confidence: number; // 0..100
  attests: number; // raw score the source attests to
  valid: boolean;
  url?: string;
}

export interface RuleCheck {
  id: string;
  label: string;
  // computed: pass if conditions met
  pass: boolean;
  detail: string;
}

export interface Entity {
  id: string;
  name: string;
  kind: EntityKind;
  region: string;
  /** Lat/long-ish projected to %, top-left origin. */
  x: number;
  y: number;
  /** Last computed trust score, 0..100. */
  score: number;
  /** Trailing 24h delta as percentage. */
  delta: number;
  evidence: EvidenceItem[];
  liquidity: number; // USD billions
  /** Recent score history for sparklines / comparison overlays. */
  history?: number[];
}

export interface ValidatorNode {
  id: string;
  alias: string;
  region: string;
  uptime: number; // %
  stake: number; // USD millions at risk
  attestations: number; // attestations submitted (24h)
  status: "active" | "probation" | "slashed";
  lastSlash: string | null; // ISO-ish label
}

export interface ValidatorClass {
  id: string;
  name: string;
  count: number;
  share: number; // % of network
  consensus: number; // %
  description: string;
  nodes: ValidatorNode[];
}

export interface Instrument {
  ticker: string;
  name: string;
  entityId: string;
  notional: number; // USD millions
  baseYield: number; // baseline yield %
  /** Trailing series of trust scores (latest last). */
  history: number[];
  /** Last computed price (per 100 face). */
  price: number;
}

export interface PredictionYear {
  year: number;
  predicted: number;
  actual: number | null; // null = unrealized future
  confidence: number; // 0..100
  notes: string;
}

/* ---------------- seed ---------------- */

const seedEntities: Entity[] = [
  {
    id: "rwa",
    name: "Rwanda",
    kind: "Sovereign",
    region: "East Africa",
    x: 56,
    y: 62,
    score: 87.1,
    delta: 2.4,
    liquidity: 4.2,
    evidence: [
      { id: "rwa-e1", source: "Univ. of Nairobi · Public Ledger Audit", sourceKind: "University", weight: 0.22, confidence: 96, attests: 88, valid: true },
      { id: "rwa-e2", source: "KPMG East Africa · Budget Trace", sourceKind: "Auditor", weight: 0.20, confidence: 94, attests: 86, valid: true },
      { id: "rwa-e3", source: "GovSat-3 · Procurement Anomaly Sensor", sourceKind: "Sensor", weight: 0.18, confidence: 91, attests: 89, valid: true },
      { id: "rwa-e4", source: "Transparency Intl. · Field Survey", sourceKind: "NGO", weight: 0.16, confidence: 88, attests: 84, valid: true },
      { id: "rwa-e5", source: "Citizen Attestations (N=14,402)", sourceKind: "Citizen", weight: 0.14, confidence: 79, attests: 85, valid: true },
      { id: "rwa-e6", source: "Atlas-Δ AI · Cross-Source Diff", sourceKind: "AI Agent", weight: 0.10, confidence: 92, attests: 88, valid: true },
    ],
  },
  {
    id: "ken",
    name: "Kenya",
    kind: "Sovereign",
    region: "East Africa",
    x: 58.5,
    y: 59,
    score: 84.3,
    delta: 0.6,
    liquidity: 3.6,
    evidence: [
      { id: "ken-e1", source: "Univ. of Cape Town · Fiscal Review", sourceKind: "University", weight: 0.24, confidence: 93, attests: 85, valid: true },
      { id: "ken-e2", source: "Deloitte · Treasury Attestation", sourceKind: "Auditor", weight: 0.22, confidence: 91, attests: 83, valid: true },
      { id: "ken-e3", source: "Open-Procure Sensor Mesh", sourceKind: "Sensor", weight: 0.18, confidence: 87, attests: 86, valid: true },
      { id: "ken-e4", source: "Code-for-Africa · Field Audit", sourceKind: "NGO", weight: 0.16, confidence: 84, attests: 81, valid: true },
      { id: "ken-e5", source: "Citizen Attestations (N=22,118)", sourceKind: "Citizen", weight: 0.12, confidence: 76, attests: 86, valid: true },
      { id: "ken-e6", source: "Atlas-Δ AI · Variance Sweep", sourceKind: "AI Agent", weight: 0.08, confidence: 90, attests: 84, valid: true },
    ],
  },
  {
    id: "sgp",
    name: "Singapore",
    kind: "Sovereign",
    region: "Southeast Asia",
    x: 76,
    y: 60,
    score: 91.8,
    delta: 0.1,
    liquidity: 12.8,
    evidence: [
      { id: "sgp-e1", source: "NUS Institute of Policy · Audit", sourceKind: "University", weight: 0.22, confidence: 97, attests: 93, valid: true },
      { id: "sgp-e2", source: "PwC Asia · Sovereign Trace", sourceKind: "Auditor", weight: 0.22, confidence: 96, attests: 92, valid: true },
      { id: "sgp-e3", source: "MAS-Sensor Net", sourceKind: "Sensor", weight: 0.20, confidence: 95, attests: 91, valid: true },
      { id: "sgp-e4", source: "Open Government Partnership", sourceKind: "NGO", weight: 0.14, confidence: 92, attests: 90, valid: true },
      { id: "sgp-e5", source: "Citizen Attestations (N=8,402)", sourceKind: "Citizen", weight: 0.12, confidence: 85, attests: 92, valid: true },
      { id: "sgp-e6", source: "Atlas-Δ AI · Cross-Source Diff", sourceKind: "AI Agent", weight: 0.10, confidence: 94, attests: 92, valid: true },
    ],
  },
  {
    id: "hel",
    name: "Helios Energy",
    kind: "Corporate",
    region: "Iberia",
    x: 22,
    y: 46,
    score: 62.5,
    delta: -0.8,
    liquidity: 0.9,
    evidence: [
      { id: "hel-e1", source: "Imperial College · Emissions Audit", sourceKind: "University", weight: 0.20, confidence: 88, attests: 64, valid: true },
      { id: "hel-e2", source: "EY · Disclosure Reconciliation", sourceKind: "Auditor", weight: 0.22, confidence: 84, attests: 58, valid: true },
      { id: "hel-e3", source: "Sat-Flare Methane Sensor", sourceKind: "Sensor", weight: 0.22, confidence: 96, attests: 51, valid: true },
      { id: "hel-e4", source: "Greenpeace · Field Audit", sourceKind: "NGO", weight: 0.14, confidence: 78, attests: 49, valid: true },
      { id: "hel-e5", source: "Whistleblower Attestation (Internal)", sourceKind: "Citizen", weight: 0.12, confidence: 71, attests: 42, valid: false },
      { id: "hel-e6", source: "Atlas-Δ AI · Conflict Sweep", sourceKind: "AI Agent", weight: 0.10, confidence: 93, attests: 56, valid: true },
    ],
  },
  {
    id: "uni",
    name: "UNICEF Global Pool",
    kind: "Institution",
    region: "Global",
    x: 49.5,
    y: 36,
    score: 94.2,
    delta: 0.3,
    liquidity: 6.4,
    evidence: [
      { id: "uni-e1", source: "ETH Zurich · Outcome Verification", sourceKind: "University", weight: 0.24, confidence: 97, attests: 95, valid: true },
      { id: "uni-e2", source: "BDO · Program Cost Audit", sourceKind: "Auditor", weight: 0.20, confidence: 95, attests: 94, valid: true },
      { id: "uni-e3", source: "Logistics IoT Mesh", sourceKind: "Sensor", weight: 0.18, confidence: 93, attests: 93, valid: true },
      { id: "uni-e4", source: "GiveWell · Independent Review", sourceKind: "NGO", weight: 0.16, confidence: 92, attests: 96, valid: true },
      { id: "uni-e5", source: "Beneficiary Attestations (N=44k)", sourceKind: "Citizen", weight: 0.12, confidence: 87, attests: 95, valid: true },
      { id: "uni-e6", source: "Atlas-Δ AI · Outcome Diff", sourceKind: "AI Agent", weight: 0.10, confidence: 94, attests: 93, valid: true },
    ],
  },
  {
    id: "amz",
    name: "Amazon Guardian",
    kind: "NGO",
    region: "South America",
    x: 30,
    y: 66,
    score: 81.0,
    delta: -0.4,
    liquidity: 0.74,
    evidence: [
      { id: "amz-e1", source: "USP São Paulo · Ecology Audit", sourceKind: "University", weight: 0.22, confidence: 92, attests: 83, valid: true },
      { id: "amz-e2", source: "Mazars · Grant Reconciliation", sourceKind: "Auditor", weight: 0.18, confidence: 88, attests: 80, valid: true },
      { id: "amz-e3", source: "Canopy LIDAR Network", sourceKind: "Sensor", weight: 0.22, confidence: 95, attests: 79, valid: true },
      { id: "amz-e4", source: "Indigenous Federation Audit", sourceKind: "NGO", weight: 0.16, confidence: 86, attests: 84, valid: true },
      { id: "amz-e5", source: "Field Volunteer Attestations", sourceKind: "Citizen", weight: 0.12, confidence: 78, attests: 80, valid: true },
      { id: "amz-e6", source: "Atlas-Δ AI · Deforestation Diff", sourceKind: "AI Agent", weight: 0.10, confidence: 91, attests: 78, valid: true },
    ],
  },
];

const seedInstruments: Instrument[] = [
  { ticker: "WRBN-92", name: "Water Restoration Notes", entityId: "uni", notional: 1200, baseYield: 4.82, history: [], price: 0 },
  { ticker: "CRBD-88", name: "Carbon Recovery Bonds", entityId: "amz", notional: 840, baseYield: 5.40, history: [], price: 0 },
  { ticker: "CDPL-73", name: "Community Dev. Pools", entityId: "ken", notional: 410, baseYield: 6.10, history: [], price: 0 },
  { ticker: "SVRT-81", name: "Sovereign Trust Bonds", entityId: "rwa", notional: 2200, baseYield: 3.95, history: [], price: 0 },
  { ticker: "SGPT-92", name: "Singapore Reserve Notes", entityId: "sgp", notional: 4800, baseYield: 3.10, history: [], price: 0 },
  { ticker: "HELC-62", name: "Helios Convertible", entityId: "hel", notional: 320, baseYield: 8.70, history: [], price: 0 },
];

const seedPredictions: PredictionYear[] = [
  { year: 2022, predicted: 71, actual: 73, confidence: 86, notes: "Model v0.4 — early sovereign coverage." },
  { year: 2023, predicted: 75, actual: 74, confidence: 88, notes: "Added NGO outcome verifiers." },
  { year: 2024, predicted: 78, actual: 80, confidence: 90, notes: "Sensor mesh expanded to 1.2k nodes." },
  { year: 2025, predicted: 82, actual: 81, confidence: 92, notes: "Constitution v3 — conflict sweep mandatory." },
  { year: 2026, predicted: 85, actual: 86, confidence: 93, notes: "AI cross-source diff enabled." },
  { year: 2027, predicted: 88, actual: 87, confidence: 94, notes: "Per current rolling backtest." },
  { year: 2028, predicted: 94, actual: null, confidence: 91, notes: "Forecast · pending realization." },
  { year: 2029, predicted: 91, actual: null, confidence: 89, notes: "Forecast · sovereign baseline shift." },
  { year: 2030, predicted: 93, actual: null, confidence: 87, notes: "Forecast · institutional anchor adoption." },
];

const mkNodes = (prefix: string, count: number, region: string[], baseUptime: number, baseStake: number): ValidatorNode[] =>
  Array.from({ length: count }, (_, i) => {
    const seed = (prefix.charCodeAt(0) + i * 7) % 100;
    const uptime = +(baseUptime + ((seed % 30) - 15) / 50).toFixed(2);
    const status: ValidatorNode["status"] = uptime < 95 ? "probation" : seed === 13 ? "slashed" : "active";
    return {
      id: `${prefix}-${i + 1}`,
      alias: `${prefix.toUpperCase()}-${(1000 + i * 37).toString(36).toUpperCase()}`,
      region: region[i % region.length],
      uptime,
      stake: +(baseStake * (0.6 + ((seed % 80) / 100))).toFixed(1),
      attestations: 800 + (seed * 13) % 2200,
      status,
      lastSlash: status === "slashed" ? "2026-04-12" : null,
    };
  });

const seedValidators: ValidatorClass[] = [
  {
    id: "univ", name: "Universities", count: 2148, share: 17, consensus: 98.2,
    description: "Academic institutions providing peer-reviewed methodology audits.",
    nodes: mkNodes("univ", 6, ["Nairobi", "Zurich", "São Paulo", "Singapore", "Boston", "Lagos"], 99.1, 12.4),
  },
  {
    id: "aud", name: "Auditors", count: 1902, share: 15, consensus: 97.8,
    description: "Big-Four and regional firms running budget & disclosure traces.",
    nodes: mkNodes("aud", 6, ["London", "New York", "Tokyo", "Frankfurt", "Dubai", "Mumbai"], 98.6, 22.1),
  },
  {
    id: "ngo", name: "NGOs", count: 2540, share: 20, consensus: 95.4,
    description: "Field-based watchdogs cross-checking on-the-ground outcomes.",
    nodes: mkNodes("ngo", 6, ["Geneva", "Kigali", "Manila", "Bogotá", "Berlin", "Nairobi"], 96.4, 4.8),
  },
  {
    id: "sen", name: "Sensors", count: 3120, share: 25, consensus: 99.1,
    description: "Satellite, IoT and remote-sensing meshes emitting raw ground-truth.",
    nodes: mkNodes("sen", 6, ["LEO", "MEO", "Brazil", "Indonesia", "Iberia", "Sahel"], 99.4, 1.9),
  },
  {
    id: "cit", name: "Citizens", count: 1840, share: 15, consensus: 91.3,
    description: "Verified citizen attestation pools weighted by reputation.",
    nodes: mkNodes("cit", 6, ["Global", "EU", "LATAM", "APAC", "MENA", "SSA"], 94.2, 0.6),
  },
  {
    id: "ai", name: "AI Agents", count: 882, share: 8, consensus: 99.6,
    description: "Atlas-Δ cross-source diff agents under constitutional constraint.",
    nodes: mkNodes("ai", 6, ["Edge-A", "Edge-B", "Edge-C", "Core-1", "Core-2", "Core-3"], 99.7, 8.2),
  },
];

/* ---------------- compute ---------------- */

export function computeRuleChecks(e: Entity): RuleCheck[] {
  const valid = e.evidence.filter((x) => x.valid);
  const sourceKinds = new Set(valid.map((x) => x.sourceKind));
  const totalWeight = valid.reduce((s, x) => s + x.weight, 0);
  const attests = valid.map((x) => x.attests);
  const spread = attests.length ? Math.max(...attests) - Math.min(...attests) : 0;
  const avgConfidence = valid.length ? valid.reduce((s, x) => s + x.confidence, 0) / valid.length : 0;

  return [
    {
      id: "multi-source",
      label: "Evidence Multi-Source Verification",
      pass: sourceKinds.size >= 3,
      detail: `${sourceKinds.size} independent source classes attest (min 3).`,
    },
    {
      id: "consensus",
      label: "Oracle Consensus Agreement",
      pass: spread <= 18,
      detail: `Attestation spread ${spread.toFixed(1)} pts (max 18).`,
    },
    {
      id: "variance",
      label: "Historical Variance Check",
      pass: avgConfidence >= 80,
      detail: `Weighted confidence ${avgConfidence.toFixed(1)}% (min 80).`,
    },
    {
      id: "conflict",
      label: "Conflict-of-Interest Sweep",
      pass: totalWeight >= 0.6,
      detail: `${(totalWeight * 100).toFixed(0)}% of evidence weight retained after sweep.`,
    },
    {
      id: "constitution",
      label: "Constitutional Rule Compliance",
      pass: valid.length >= 4,
      detail: `${valid.length} valid attestations on file (min 4).`,
    },
  ];
}

export function computeTrustScore(e: Entity): { score: number; ruleFactor: number } {
  const valid = e.evidence.filter((x) => x.valid);
  if (!valid.length) return { score: 0, ruleFactor: 0 };
  const totalWeight = valid.reduce((s, x) => s + x.weight, 0);
  const weighted =
    valid.reduce((s, x) => s + x.attests * x.weight * (x.confidence / 100), 0) /
    Math.max(0.0001, totalWeight);
  const rules = computeRuleChecks(e);
  const passed = rules.filter((r) => r.pass).length;
  const ruleFactor = 0.7 + 0.3 * (passed / rules.length); // 70%..100%
  const score = Math.max(0, Math.min(100, weighted * ruleFactor));
  return { score: +score.toFixed(2), ruleFactor };
}

export function priceFor(instrument: Instrument, score: number): number {
  // Price (per 100 face) rises with trust score, falls with yield.
  // Anchor: 100-score → discount, baseYield as coupon.
  const trustPremium = (score - 70) * 0.6;
  const yieldDiscount = (instrument.baseYield - 4) * -1.8;
  return +(100 + trustPremium + yieldDiscount).toFixed(2);
}

/* ---------------- store ---------------- */

interface StoreState {
  entities: Entity[];
  instruments: Instrument[];
  predictions: PredictionYear[];
  validators: ValidatorClass[];
  /** Monotonic tick counter for cheap re-renders. */
  tick: number;
}

let state: StoreState = (() => {
  const entities = seedEntities.map((e) => ({
    ...e,
    evidence: e.evidence.map((v) => ({ ...v })),
    history: [] as number[],
  }));
  for (const e of entities) {
    e.score = computeTrustScore(e).score;
    e.history = Array.from({ length: 18 }, (_, i) => +(e.score + (Math.sin(i / 2) * 1.2)).toFixed(2));
  }
  const instruments = seedInstruments.map((i) => {
    const e = entities.find((x) => x.id === i.entityId)!;
    return { ...i, history: [e.score, e.score, e.score], price: priceFor(i, e.score) };
  });
  return {
    entities,
    instruments,
    predictions: seedPredictions.map((p) => ({ ...p })),
    validators: seedValidators,
    tick: 0,
  };
})();

const listeners = new Set<() => void>();

function emit() {
  state = { ...state, tick: state.tick + 1 };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot() {
  return state;
}

/* ---------------- live tick ---------------- */

let tickHandle: ReturnType<typeof setInterval> | null = null;
function ensureTicking() {
  if (tickHandle || typeof window === "undefined") return;
  tickHandle = setInterval(() => {
    for (const e of state.entities) {
      // Random walk on attests for valid evidence, clamped.
      for (const ev of e.evidence) {
        if (!ev.valid) continue;
        ev.attests = Math.max(0, Math.min(100, ev.attests + (Math.random() - 0.5) * 0.8));
        ev.confidence = Math.max(40, Math.min(99, ev.confidence + (Math.random() - 0.5) * 0.4));
      }
      const prev = e.score;
      e.score = computeTrustScore(e).score;
      e.delta = +(((e.score - prev) / Math.max(0.001, prev)) * 100 + e.delta * 0.92).toFixed(2);
      e.history = [...(e.history ?? []).slice(-29), e.score];
    }
    for (const v of state.validators) {
      v.consensus = +Math.max(80, Math.min(99.9, v.consensus + (Math.random() - 0.5) * 0.15)).toFixed(2);
      for (const n of v.nodes) {
        n.attestations += Math.floor((Math.random() - 0.3) * 12);
        if (n.status === "active") n.uptime = +Math.max(94, Math.min(100, n.uptime + (Math.random() - 0.5) * 0.05)).toFixed(2);
      }
    }
    for (const i of state.instruments) {
      const e = state.entities.find((x) => x.id === i.entityId)!;
      i.history = [...i.history.slice(-23), e.score];
      i.price = priceFor(i, e.score);
    }
    emit();
  }, 2000);
}

/* ---------------- hooks ---------------- */

export function useTrustStore() {
  useEffect(() => {
    ensureTicking();
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/* ---------------- mutators ---------------- */

export function toggleEvidence(entityId: string, evidenceId: string) {
  const e = state.entities.find((x) => x.id === entityId);
  if (!e) return;
  const ev = e.evidence.find((v) => v.id === evidenceId);
  if (!ev) return;
  ev.valid = !ev.valid;
  const prev = e.score;
  e.score = computeTrustScore(e).score;
  e.delta = +(((e.score - prev) / Math.max(0.001, prev)) * 100).toFixed(2);
  for (const i of state.instruments) {
    if (i.entityId !== entityId) continue;
    i.history = [...i.history.slice(-23), e.score];
    i.price = priceFor(i, e.score);
  }
  emit();
}

export interface NewEvidenceInput {
  entityId: string;
  source: string;
  sourceKind: EvidenceItem["sourceKind"];
  weight: number;
  confidence: number;
  attests: number;
}

export function addEvidence(input: NewEvidenceInput): EvidenceItem | null {
  const e = state.entities.find((x) => x.id === input.entityId);
  if (!e) return null;
  const ev: EvidenceItem = {
    id: `${input.entityId}-u${Math.random().toString(36).slice(2, 7)}`,
    source: input.source.trim(),
    sourceKind: input.sourceKind,
    weight: Math.max(0.01, Math.min(0.5, input.weight)),
    confidence: Math.max(40, Math.min(99, input.confidence)),
    attests: Math.max(0, Math.min(100, input.attests)),
    valid: true,
  };
  e.evidence = [...e.evidence, ev];
  const prev = e.score;
  e.score = computeTrustScore(e).score;
  e.delta = +(((e.score - prev) / Math.max(0.001, prev)) * 100).toFixed(2);
  for (const i of state.instruments) {
    if (i.entityId !== input.entityId) continue;
    i.history = [...i.history.slice(-23), e.score];
    i.price = priceFor(i, e.score);
  }
  emit();
  return ev;
}

export interface Trade {
  id: string;
  ticker: string;
  side: "buy" | "sell";
  qty: number;
  price: number;
  ts: number;
}

const trades: Trade[] = [];
const tradeListeners = new Set<() => void>();

export function placeTrade(t: Omit<Trade, "id" | "ts">) {
  const trade: Trade = { ...t, id: crypto.randomUUID(), ts: Date.now() };
  trades.unshift(trade);
  tradeListeners.forEach((l) => l());
  return trade;
}

export function useTrades() {
  return useSyncExternalStore(
    (l) => {
      tradeListeners.add(l);
      return () => tradeListeners.delete(l);
    },
    () => trades,
    () => trades,
  );
}
