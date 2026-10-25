"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const INK = "#06150D";
const CRIMSON = "#6B0812";
const OLIVE = "#444F2E";

const GRID_X = [48, 84, 120, 156, 192];
const GRID_Y = [18, 54, 90, 126, 162];

function Grid() {
  return (
    <g stroke={INK} strokeOpacity={0.16} strokeWidth={1}>
      {GRID_X.map((value) => (
        <line
          key={`x${value}`}
          x1={value}
          y1={GRID_Y[0]}
          x2={value}
          y2={GRID_Y[GRID_Y.length - 1]}
        />
      ))}
      {GRID_Y.map((value) => (
        <line
          key={`y${value}`}
          x1={GRID_X[0]}
          y1={value}
          x2={GRID_X[GRID_X.length - 1]}
          y2={value}
        />
      ))}
    </g>
  );
}

function Dot({ cx, cy, r = 9 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill={CRIMSON} />;
}

function Square() {
  return (
    <rect
      x={72}
      y={42}
      width={96}
      height={96}
      fill="none"
      stroke={INK}
      strokeWidth={2}
    />
  );
}

function diagram(
  visual: string,
  arrowOlive: string,
  arrowCrimson: string,
): ReactNode {
  switch (visual) {
    case "mirror_vertical":
      return (
        <>
          <Grid />
          <line
            x1={120}
            y1={10}
            x2={120}
            y2={170}
            stroke={OLIVE}
            strokeWidth={2}
            strokeDasharray="7 6"
          />
          <Dot cx={66} cy={36} />
        </>
      );
    case "water_reflection":
      return (
        <>
          <Dot cx={66} cy={36} />
          <path
            d="M40 104 q10 -9 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0"
            fill="none"
            stroke={OLIVE}
            strokeWidth={2}
          />
          <text
            x={120}
            y={132}
            textAnchor="middle"
            fontSize={11}
            fill={INK}
            fillOpacity={0.45}
          >
            water line
          </text>
        </>
      );
    case "rotation_cw90":
      return (
        <>
          <Square />
          <Dot cx={120} cy={42} />
          <path
            d="M120 12 A 78 78 0 0 1 198 90"
            fill="none"
            stroke={OLIVE}
            strokeWidth={2}
            markerEnd={`url(#${arrowOlive})`}
          />
        </>
      );
    case "rotation_180":
      return (
        <>
          <Square />
          <Dot cx={88} cy={122} />
          <path
            d="M120 12 A 78 78 0 0 1 120 168"
            fill="none"
            stroke={OLIVE}
            strokeWidth={2}
            markerEnd={`url(#${arrowOlive})`}
          />
        </>
      );
    case "path_nes":
      return (
        <>
          <Grid />
          <line
            x1={66}
            y1={144}
            x2={66}
            y2={108}
            stroke={OLIVE}
            strokeWidth={2.5}
            markerEnd={`url(#${arrowOlive})`}
          />
          <line
            x1={66}
            y1={108}
            x2={102}
            y2={108}
            stroke={OLIVE}
            strokeWidth={2.5}
            markerEnd={`url(#${arrowOlive})`}
          />
          <line
            x1={102}
            y1={108}
            x2={102}
            y2={144}
            stroke={OLIVE}
            strokeWidth={2.5}
            markerEnd={`url(#${arrowOlive})`}
          />
          <Dot cx={66} cy={144} r={6} />
        </>
      );
    case "path_e3n1":
      return (
        <>
          <Grid />
          <line
            x1={66}
            y1={144}
            x2={174}
            y2={144}
            stroke={OLIVE}
            strokeWidth={2.5}
            markerEnd={`url(#${arrowOlive})`}
          />
          <line
            x1={174}
            y1={144}
            x2={174}
            y2={108}
            stroke={OLIVE}
            strokeWidth={2.5}
            markerEnd={`url(#${arrowOlive})`}
          />
          <Dot cx={66} cy={144} r={6} />
        </>
      );
    case "path_right_angle":
      return (
        <>
          <Grid />
          <line
            x1={120}
            y1={90}
            x2={156}
            y2={90}
            stroke={OLIVE}
            strokeWidth={2.5}
            markerEnd={`url(#${arrowOlive})`}
          />
          <line
            x1={156}
            y1={90}
            x2={156}
            y2={54}
            stroke={OLIVE}
            strokeWidth={2.5}
            markerEnd={`url(#${arrowOlive})`}
          />
          <Dot cx={120} cy={90} r={6} />
        </>
      );
    case "grid_rotation_cw90":
      return (
        <>
          <Grid />
          <Dot cx={174} cy={144} />
          <path
            d="M120 12 A 78 78 0 0 1 198 90"
            fill="none"
            stroke={OLIVE}
            strokeWidth={2}
            markerEnd={`url(#${arrowOlive})`}
          />
        </>
      );
    case "direction_turns":
      return (
        <>
          <circle
            cx={120}
            cy={90}
            r={58}
            fill="none"
            stroke={INK}
            strokeOpacity={0.2}
            strokeWidth={1.5}
          />
          <text x={120} y={46} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK} fillOpacity={0.6}>
            N
          </text>
          <text x={120} y={150} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK} fillOpacity={0.6}>
            S
          </text>
          <text x={172} y={95} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK} fillOpacity={0.6}>
            E
          </text>
          <text x={68} y={95} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK} fillOpacity={0.6}>
            W
          </text>
          <line
            x1={120}
            y1={90}
            x2={166}
            y2={90}
            stroke={CRIMSON}
            strokeWidth={3}
            markerEnd={`url(#${arrowCrimson})`}
          />
        </>
      );
    case "line_mirror_horizontal":
      return (
        <>
          <line
            x1={40}
            y1={104}
            x2={200}
            y2={104}
            stroke={OLIVE}
            strokeWidth={2}
            strokeDasharray="7 6"
          />
          <line x1={76} y1={76} x2={168} y2={40} stroke={CRIMSON} strokeWidth={3} />
          <text
            x={120}
            y={128}
            textAnchor="middle"
            fontSize={11}
            fill={INK}
            fillOpacity={0.45}
          >
            mirror
          </text>
        </>
      );
    case "line_mirror_vertical":
      return (
        <>
          <line
            x1={120}
            y1={12}
            x2={120}
            y2={168}
            stroke={OLIVE}
            strokeWidth={2}
            strokeDasharray="7 6"
          />
          <line x1={104} y1={40} x2={104} y2={140} stroke={CRIMSON} strokeWidth={3} />
        </>
      );
    case "arrow_rotate_ccw90":
      return (
        <>
          <line
            x1={120}
            y1={40}
            x2={120}
            y2={138}
            stroke={CRIMSON}
            strokeWidth={3}
            markerEnd={`url(#${arrowCrimson})`}
          />
          <path
            d="M120 12 A 78 78 0 0 0 42 90"
            fill="none"
            stroke={OLIVE}
            strokeWidth={2}
            markerEnd={`url(#${arrowOlive})`}
          />
        </>
      );
    case "coordinate_nw":
      return (
        <>
          <Grid />
          <polyline
            points="120,90 120,18 84,18"
            fill="none"
            stroke={OLIVE}
            strokeWidth={2.5}
            markerEnd={`url(#${arrowOlive})`}
          />
          <Dot cx={120} cy={90} r={6} />
        </>
      );
    case "cube_roll":
      return (
        <>
          <rect x={72} y={72} width={76} height={76} fill="none" stroke={INK} strokeWidth={2} />
          <polygon points="72,72 92,52 168,52 148,72" fill="none" stroke={INK} strokeWidth={2} />
          <polygon points="148,72 168,52 168,128 148,148" fill="none" stroke={INK} strokeWidth={2} />
          <Dot cx={120} cy={62} r={8} />
          <line
            x1={60}
            y1={166}
            x2={182}
            y2={166}
            stroke={OLIVE}
            strokeWidth={2}
            markerEnd={`url(#${arrowOlive})`}
          />
        </>
      );
    default:
      return null;
  }
}

export function QuestionVisual({
  visual,
  className,
}: {
  visual: string;
  className?: string;
}) {
  const raw = useId();
  const uid = raw.replace(/[^a-zA-Z0-9]/g, "");
  const arrowOlive = `qv-${uid}-o`;
  const arrowCrimson = `qv-${uid}-c`;

  return (
    <div className={cn("flex justify-center", className)}>
      <svg
        viewBox="0 0 240 180"
        role="img"
        aria-label="Spatial perception diagram"
        className="h-auto w-full max-w-[320px]"
      >
        <defs>
          <marker
            id={arrowOlive}
            markerWidth="9"
            markerHeight="9"
            refX="7"
            refY="4.5"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L9 4.5 L0 9 Z" fill={OLIVE} />
          </marker>
          <marker
            id={arrowCrimson}
            markerWidth="9"
            markerHeight="9"
            refX="7"
            refY="4.5"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L9 4.5 L0 9 Z" fill={CRIMSON} />
          </marker>
        </defs>
        {diagram(visual, arrowOlive, arrowCrimson)}
      </svg>
    </div>
  );
}
