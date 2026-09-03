import React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { IRepresentation } from '../../lib/PipelineModels';
import buildGraphGeometry, { GRAPH_BOX } from '../../lib/graphGeometry';

/**
 * The plotted card in Make the Connections.
 *
 * Drawn from `line`, `axisRange` and `slopeAnnotation` rather than shipped as
 * an image, so a regenerated activity plots its own relationship. Inline SVG
 * because the marks are a handful of lines — a charting library would be more
 * weight than the whole card.
 *
 * Layout rule: nothing that has to stay readable is drawn over the plot.
 * Tick labels live in the gutters and the equation gets a reserved band above
 * the axes, because with an LLM choosing the line we cannot know in advance
 * where it will run. Figma sets its tick labels against the axes, which only
 * works for the one line that frame happens to draw.
 */

interface Props {
  item: IRepresentation;
}

export default function RepresentationGraph({ item }: Props) {
  const theme = useTheme();
  const { chart } = theme.palette.designSystem;
  const geometry = buildGraphGeometry(item);

  if (!geometry) return null;

  const {
    viewWidth,
    viewHeight,
    left,
    right,
    top,
    bottom,
    toX,
    toY,
    ticksX,
    ticksY,
    segment,
    points,
    riseRun,
  } = geometry;
  const { slopeAnnotation } = item;

  // Text that has to sit over the plot gets a white outline behind it, which
  // keeps it readable against the line or a gridline without any collision
  // arithmetic.
  const halo = {
    stroke: theme.palette.designSystem.surface.white,
    strokeWidth: 3,
    paintOrder: 'stroke' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%' }}>
      <Box
        component="svg"
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        role="img"
        aria-label={item.lineLabel ?? item.label}
        sx={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {/* Gridlines first, so every mark below sits on top of them. */}
        {ticksX.map((v) => (
          <line
            key={`grid-x-${v}`}
            x1={toX(v)}
            y1={top}
            x2={toX(v)}
            y2={bottom}
            stroke={chart.gridLabel}
            strokeOpacity={0.35}
          />
        ))}
        {ticksY.map((v) => (
          <line
            key={`grid-y-${v}`}
            x1={left}
            y1={toY(v)}
            x2={right}
            y2={toY(v)}
            stroke={chart.gridLabel}
            strokeOpacity={0.35}
          />
        ))}

        {/* Tick labels in the gutters, never against the axes: with yMin below
            zero the x-axis runs through the middle of the plot. */}
        {ticksX
          .filter((v) => v !== 0)
          .map((v) => (
            <text
              key={`tx-${v}`}
              x={toX(v)}
              y={bottom + 12}
              fill={chart.gridLabel}
              fontSize="9"
              textAnchor="middle"
            >
              {v}
            </text>
          ))}
        {ticksY
          .filter((v) => v !== 0)
          .map((v) => (
            <text
              key={`ty-${v}`}
              x={left - 6}
              y={toY(v) + 3}
              fill={chart.gridLabel}
              fontSize="9"
              textAnchor="end"
            >
              {v}
            </text>
          ))}

        <line
          x1={left}
          y1={toY(0)}
          x2={right}
          y2={toY(0)}
          stroke={chart.axis}
        />
        <line
          x1={toX(0)}
          y1={top}
          x2={toX(0)}
          y2={bottom}
          stroke={chart.axis}
        />
        <text
          x={right + 4}
          y={toY(0) + 3}
          fill={chart.axis}
          fontSize="11"
          textAnchor="start"
        >
          x
        </text>
        <text
          x={toX(0)}
          y={top - 5}
          fill={chart.axis}
          fontSize="11"
          textAnchor="middle"
        >
          y
        </text>

        {/* Guides sit behind the plotted line; their labels are drawn last. */}
        {riseRun && (
          <>
            <line
              x1={toX(riseRun.from.x)}
              y1={toY(riseRun.from.y)}
              x2={toX(riseRun.from.x)}
              y2={toY(riseRun.to.y)}
              stroke={chart.annotation}
              strokeDasharray="3 2"
            />
            <line
              x1={toX(riseRun.from.x)}
              y1={toY(riseRun.to.y)}
              x2={toX(riseRun.to.x)}
              y2={toY(riseRun.to.y)}
              stroke={chart.annotation}
              strokeDasharray="3 2"
            />
          </>
        )}

        <line
          x1={toX(segment[0].x)}
          y1={toY(segment[0].y)}
          x2={toX(segment[1].x)}
          y2={toY(segment[1].y)}
          stroke={chart.line}
          strokeWidth="2"
        />

        {points.map((point) => (
          <g key={point.label}>
            <circle
              cx={toX(point.x)}
              cy={toY(point.y)}
              r="3"
              fill={chart.line}
            />
            <text
              x={toX(point.x) + 6}
              y={toY(point.y) - 6}
              fill={chart.line}
              fontSize="9"
              fontWeight="700"
              {...halo}
            >
              {point.label}
            </text>
          </g>
        ))}

        {/* Last, so the plotted line and the point markers can never paint
            over them. The dashed guides above stay behind the line. */}
        {riseRun && (
          <>
            <text
              x={toX(riseRun.from.x) + 4}
              y={(toY(riseRun.from.y) + toY(riseRun.to.y)) / 2}
              fill={chart.annotation}
              fontSize="9"
              {...halo}
            >
              {slopeAnnotation?.riseLabel}
            </text>
            <text
              x={(toX(riseRun.from.x) + toX(riseRun.to.x)) / 2}
              y={toY(riseRun.to.y) - 4}
              fill={chart.annotation}
              fontSize="9"
              textAnchor="middle"
              {...halo}
            >
              {slopeAnnotation?.runLabel}
            </text>
          </>
        )}

        {/* Its own band above the plot: drawn inside, a positive slope runs
            straight through where this used to sit. */}
        {item.lineLabel && (
          <text
            x={viewWidth / 2}
            y={GRAPH_BOX.labelBand - 6}
            fill={chart.line}
            fontSize="11"
            fontWeight="700"
            textAnchor="middle"
          >
            {item.lineLabel}
          </text>
        )}
      </Box>
    </Box>
  );
}
