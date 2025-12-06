'use client';

import React, { useMemo } from 'react';

interface ColonProps {
  size?: number;
}

type SegmentMapType = Record<number, string[]>;

const SEGMENT_MAP: SegmentMapType = {
  0: ['A', 'B', 'C', 'D', 'E', 'F'],
  1: ['B', 'C'],
  2: ['A', 'B', 'D', 'E', 'G'],
  3: ['A', 'B', 'C', 'D', 'G'],
  4: ['B', 'C', 'F', 'G'],
  5: ['A', 'C', 'D', 'F', 'G'],
  6: ['A', 'C', 'D', 'E', 'F', 'G'],
  7: ['A', 'B', 'C', 'F'],
  8: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  9: ['A', 'B', 'C', 'D', 'F', 'G'],
};

interface SegmentProps {
  size: number;
  gap?: number;
  tickness?: number;
  value: number;
  activeColor?: string;
  inactiveColor?: string;
}

export function Segemnt({ size, gap, tickness, value, activeColor, inactiveColor }: SegmentProps) {
  const s = size;
  const g = gap || s * 0.04;
  const t = tickness || s * 0.2;
  const ht = t / 2;

  const paths = useMemo(() => {
    return {
      A: `M ${t + g} 0 
          L ${s - t - g} 0 
          L ${s - ht - g} ${ht} 
          L ${s - t - g} ${t} 
          L ${t + g} ${t} 
          L ${ht + g} ${ht} 
          Z`,
      B: `M ${s - t} ${t + g} 
          L ${s - t} ${s - t - g} 
          L ${s - ht} ${s - ht - g} 
          L ${s} ${s - t - g} 
          L ${s} ${t + g} 
          L ${s - ht} ${ht + g} 
          Z`,
      C: `M ${s - t} ${s + g} 
          L ${s - t} ${s * 2 - t * 2 - g} 
          L ${s - ht} ${s * 2 - t - ht - g} 
          L ${s} ${s * 2 - t * 2 - g} 
          L ${s} ${s + g} 
          L ${s - ht} ${s - ht + g} 
          Z`,
      D: `M ${t + g} ${s * 2 - t * 2}
          L ${s - t - g} ${s * 2 - t * 2}
          L ${s - ht - g} ${s * 2 - t - ht}
          L ${s - t - g} ${s * 2 - t}
          L ${t + g} ${s * 2 - t}
          L ${ht + g} ${s * 2 - t - ht} 
          Z`,
      E: `M 0 ${s + g}
          L 0 ${s * 2 - t * 2 - g}
          L ${ht} ${s * 2 - t - ht - g}
          L ${t} ${s * 2 - t * 2 - g}
          L ${t} ${s + g}
          L ${ht} ${s - ht + g} Z`,
      F: `M 0 ${t + g}
          L 0 ${s - t - g}
          L ${ht} ${s - ht - g}
          L ${t} ${s - t - g}
          L ${t} ${t + g}
          L ${ht} ${ht + g} Z`,
      G: `M ${t + g} ${s - t}
          L ${s - t - g} ${s - t}
          L ${s - ht - g} ${s - ht}
          L ${s - t - g} ${s}
          L ${t + g} ${s}
          L ${ht + g} ${s - ht} Z`,
    };
  }, [s, t, g, ht]);

  const activeKeys = SEGMENT_MAP[value] || [];

  return (
    <svg width={s} height={s * 2 - t} className="inline-block bg-transparent">
      {Object.entries(paths).map(([key, d]) => {
        const isActive = activeKeys.includes(key);
        return (
          <path
            key={key}
            d={d}
            fill={isActive ? activeColor || '#ff3333' : inactiveColor || '#331111'}
            className="transition-colors duration-200"
          />
        );
      })}
    </svg>
  );
}

interface ColonProps {
  size?: number;
  color?: string;
}

export function Colon({ size = 80, color }: ColonProps) {
  return (
    <svg
      width={size * 0.3}
      height={size * 1.5}
      viewBox={`0 0 ${size * 0.3} ${size * 1.5}`}
      className="inline-block"
    >
      <circle cx={size * 0.15} cy={size * 0.5} r={size * 0.08} fill={color} />
      <circle cx={size * 0.15} cy={size} r={size * 0.08} fill={color} />
    </svg>
  );
}

interface SevenSegmentColor {
  hour: number;
  minute: number;
  seconds: number;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
}

export default function SevenSegmentClock({
  hour,
  minute,
  seconds,
  size,
  activeColor,
  inactiveColor,
}: SevenSegmentColor) {
  const segmentProps = {
    size: size || 100,
    activeColor,
    inactiveColor,
  };

  return (
    <div className="mb-4 flex items-center justify-center gap-4">
      <Segemnt {...segmentProps} value={Math.floor(hour / 10)} />
      <Segemnt {...segmentProps} value={hour % 10} />
      <Colon color={activeColor} />
      <Segemnt {...segmentProps} value={Math.floor(minute / 10)} />
      <Segemnt {...segmentProps} value={minute % 10} />
      <Colon color={activeColor} />
      <Segemnt {...segmentProps} value={Math.floor(seconds / 10)} />
      <Segemnt {...segmentProps} value={seconds % 10} />
    </div>
  );
}
