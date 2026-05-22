"use client";

import { PEDAGOGY_DIMENSIONS } from "@/lib/constants";
import { mockStudent } from "@/lib/mock-data";

export default function PedagogyChart() {
  const vector = mockStudent.pedagogyVector;
  const dimensions = PEDAGOGY_DIMENSIONS;
  const cx = 120;
  const cy = 120;
  const maxR = 90;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / dimensions.length - Math.PI / 2;
    const r = maxR * value;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const polygonPoints = dimensions
    .map((_, i) => {
      const val = vector[dimensions[i].key as keyof typeof vector];
      const p = getPoint(i, val);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">Learning Style</h3>
          <p className="text-xs text-slate-400">Your pedagogy vector</p>
        </div>
        <span className="text-xs text-violet-400 bg-violet-400/10 px-2 py-1 rounded-full">
          Auto-updating
        </span>
      </div>

      <div className="flex justify-center">
        <svg viewBox="0 0 240 240" width="240" height="240">
          {/* Grid circles */}
          {[0.25, 0.5, 0.75, 1].map((scale) => (
            <polygon
              key={scale}
              points={dimensions
                .map((_, i) => {
                  const p = getPoint(i, scale);
                  return `${p.x},${p.y}`;
                })
                .join(" ")}
              fill="none"
              stroke="#334155"
              strokeWidth="0.5"
              opacity={0.5}
            />
          ))}

          {/* Axis lines */}
          {dimensions.map((_, i) => {
            const p = getPoint(i, 1);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                stroke="#334155"
                strokeWidth="0.5"
                opacity={0.5}
              />
            );
          })}

          {/* Data polygon */}
          <polygon
            points={polygonPoints}
            fill="rgba(139, 92, 246, 0.15)"
            stroke="#8B5CF6"
            strokeWidth="2"
          />

          {/* Data points */}
          {dimensions.map((dim, i) => {
            const val = vector[dim.key as keyof typeof vector];
            const p = getPoint(i, val);
            return (
              <circle
                key={dim.key}
                cx={p.x}
                cy={p.y}
                r="4"
                fill={dim.color}
                stroke="#0f172a"
                strokeWidth="2"
              />
            );
          })}

          {/* Labels */}
          {dimensions.map((dim, i) => {
            const p = getPoint(i, 1.22);
            const val = vector[dim.key as keyof typeof vector];
            return (
              <text
                key={dim.key}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#94a3b8"
                fontSize="9"
                fontWeight="500"
              >
                <tspan x={p.x} dy="-4">{dim.label}</tspan>
                <tspan x={p.x} dy="12" fill={dim.color} fontWeight="700">
                  {Math.round(val * 100)}%
                </tspan>
              </text>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2">
        {dimensions.map((dim) => {
          const val = vector[dim.key as keyof typeof vector];
          return (
            <div key={dim.key} className="text-center">
              <div className="h-1 rounded-full bg-slate-800 mb-1">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${val * 100}%`, backgroundColor: dim.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
