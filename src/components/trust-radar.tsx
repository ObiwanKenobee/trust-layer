import { useId } from "react";

type Axis = { label: string; value: number };

interface TrustRadarProps {
  axes: Axis[];
  size?: number;
}

/** Lightweight radar chart for the Trust Genome. SVG, no deps. */
export function TrustRadar({ axes, size = 280 }: TrustRadarProps) {
  const id = useId();
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 24;
  const rings = [0.25, 0.5, 0.75, 1];
  const angleFor = (i: number) => (Math.PI * 2 * i) / axes.length - Math.PI / 2;

  const point = (i: number, v: number) => {
    const a = angleFor(i);
    const r = (v / 100) * radius;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  };

  const path =
    axes
      .map((axis, i) => {
        const [x, y] = point(i, axis.value);
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ") + " Z";

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="overflow-visible">
      <defs>
        <radialGradient id={`${id}-fill`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--trust-blue)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--trust-blue)" stopOpacity="0.05" />
        </radialGradient>
      </defs>

      {rings.map((r, idx) => (
        <circle
          key={r}
          cx={cx}
          cy={cy}
          r={radius * r}
          fill="none"
          stroke="var(--grid)"
          strokeOpacity={idx === rings.length - 1 ? 0.6 : 0.25}
          strokeDasharray={idx === rings.length - 1 ? "0" : "2 4"}
        />
      ))}

      {axes.map((_, i) => {
        const a = angleFor(i);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(a) * radius}
            y2={cy + Math.sin(a) * radius}
            stroke="var(--grid)"
            strokeOpacity={0.4}
          />
        );
      })}

      <path d={path} fill={`url(#${id}-fill)`} stroke="var(--trust-blue)" strokeWidth={1.5} />

      {axes.map((axis, i) => {
        const [x, y] = point(i, axis.value);
        return <circle key={i} cx={x} cy={y} r={3} fill="var(--trust-blue)" />;
      })}

      {axes.map((axis, i) => {
        const a = angleFor(i);
        const lx = cx + Math.cos(a) * (radius + 14);
        const ly = cy + Math.sin(a) * (radius + 14);
        return (
          <text
            key={i}
            x={lx}
            y={ly}
            textAnchor={Math.abs(Math.cos(a)) < 0.2 ? "middle" : Math.cos(a) > 0 ? "start" : "end"}
            dominantBaseline="middle"
            className="fill-muted-foreground font-mono"
            fontSize="9"
            letterSpacing="0.1em"
          >
            {axis.label.toUpperCase()}
          </text>
        );
      })}
    </svg>
  );
}
