'use client';

import React, { useState } from 'react';
import { RevenueDataPointDto, CurrencyCode } from '@theblinghaven/shared';
import { TrendingUp, BarChart2 } from 'lucide-react';

interface RevenueChartProps {
  data: RevenueDataPointDto[];
  timeRange: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange: (range: '7d' | '30d' | '90d' | '1y') => void;
  currencySymbol: string;
}

export function RevenueChart({
  data,
  timeRange,
  onTimeRangeChange,
  currencySymbol,
}: RevenueChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<RevenueDataPointDto | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 text-xs text-slate-400">
        No revenue data available for the selected period.
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1000);
  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalOrders = data.reduce((acc, curr) => acc + curr.orders, 0);

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 25;
  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;

  const getX = (index: number) => {
    if (data.length <= 1) return paddingX + chartW / 2;
    return paddingX + (index / (data.length - 1)) * chartW;
  };

  const getY = (val: number) => {
    return svgHeight - paddingY - (val / maxRevenue) * chartH;
  };

  // Build SVG path
  const points = data.map((d, i) => `${getX(i)},${getY(d.revenue)}`);
  const linePath = points.length > 0 ? `M ${points.join(' L ')}` : '';
  const areaPath =
    points.length > 0
      ? `M ${getX(0)},${svgHeight - paddingY} L ${points.join(' L ')} L ${getX(
          data.length - 1,
        )},${svgHeight - paddingY} Z`
      : '';

  return (
    <div className="rounded-2xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
      {/* Header with Title & Range Switchers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ivory-300 dark:border-obsidian-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
            <TrendingUp className="h-4 w-4" />
            <span>Revenue Trajectory & Sales Volume</span>
          </div>
          <div className="flex items-baseline space-x-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {currencySymbol}
              {totalRevenue.toLocaleString()}
            </h3>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              +{((totalOrders / (data.length || 1)) * 1.8).toFixed(1)}% Velocity
            </span>
            <span className="text-xs text-slate-500">({totalOrders} Orders)</span>
          </div>
        </div>

        {/* Time Range Pills */}
        <div className="flex items-center space-x-1 rounded-lg border border-ivory-400 dark:border-obsidian-750 bg-ivory-100 dark:bg-obsidian-850 p-1">
          {(['7d', '30d', '90d', '1y'] as const).map((r) => (
            <button
              key={r}
              onClick={() => onTimeRangeChange(r)}
              className={`rounded-md px-3 py-1 text-xs font-bold uppercase transition ${
                timeRange === r
                  ? 'bg-gold-500 text-obsidian-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-56 overflow-visible"
        >
          <defs>
            <linearGradient id="goldAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C5A880" stopOpacity="0.35" />
              <stop offset="80%" stopColor="#C5A880" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#C5A880" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = paddingY + chartH * (1 - pct);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="currentColor"
                  className="text-ivory-300 dark:text-obsidian-800"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-400 text-[9px] font-mono"
                >
                  {currencySymbol}
                  {Math.round((maxRevenue * pct) / 1000)}k
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#goldAreaGrad)" />

          {/* Stroke Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#C5A880"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Points & Hover Targets */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.revenue);
            const isHovered = hoveredIndex === i;

            return (
              <g key={i}>
                {/* Active Indicator Line */}
                {isHovered && (
                  <line
                    x1={cx}
                    y1={paddingY}
                    x2={cx}
                    y2={svgHeight - paddingY}
                    stroke="#C5A880"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Point Dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 5 : 3}
                  fill={isHovered ? '#FFFFFF' : '#C5A880'}
                  stroke="#8C6C42"
                  strokeWidth={isHovered ? 2 : 1}
                  className="transition-all"
                />

                {/* Invisible hover trigger */}
                <rect
                  x={cx - (chartW / data.length) / 2}
                  y={paddingY}
                  width={chartW / data.length}
                  height={chartH}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    setHoveredPoint(d);
                    setHoveredIndex(i);
                  }}
                  onMouseLeave={() => {
                    setHoveredPoint(null);
                    setHoveredIndex(null);
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint && hoveredIndex !== null && (
          <div
            className="pointer-events-none absolute -top-3 z-30 transform -translate-x-1/2 -translate-y-full rounded-xl border border-gold-500/50 bg-white/95 dark:bg-obsidian-950/95 p-3 shadow-xl backdrop-blur-md text-xs transition-all duration-75 animate-in fade-in zoom-in-95"
            style={{
              left: `${(getX(hoveredIndex) / svgWidth) * 100}%`,
            }}
          >
            <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
              {hoveredPoint.date} ({hoveredPoint.label})
            </p>
            <p className="font-bold text-sm text-gold-700 dark:text-gold-300">
              {hoveredPoint.formattedRevenue}
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              {hoveredPoint.orders} orders processed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
