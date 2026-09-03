import React from 'react';
import { Svg, Line, Circle, Rect, Text } from '@react-pdf/renderer';
import { IRepresentation } from '../PipelineModels';
import buildGraphGeometry, { GRAPH_BOX } from '../graphGeometry';
import { pdfColors } from './pdfTheme';

/**
 * The PDF twin of RepresentationGraph.
 *
 * Same figure, same numbers — both call buildGraphGeometry — but drawn with
 * @react-pdf's SVG primitives, which are a separate element set from the DOM's.
 *
 * One difference is forced: @react-pdf has no `paint-order`, so the halo that
 * keeps an in-plot label readable on screen is drawn here as a white rectangle
 * behind the text instead.
 */

const FIGURE_WIDTH = 210;

interface Props {
  item: IRepresentation;
}

/** Stands in for the screen's paint-order halo. */
function HaloText({
  x,
  y,
  width,
  children,
  fill,
  anchor,
}: {
  x: number;
  y: number;
  width: number;
  children: string;
  fill: string;
  anchor?: 'start' | 'middle' | 'end';
}) {
  let boxX = x - 2;
  if (anchor === 'middle') boxX = x - width / 2 - 2;
  if (anchor === 'end') boxX = x - width - 2;

  return (
    <>
      <Rect
        x={boxX}
        y={y - 8}
        width={width + 4}
        height={11}
        fill={pdfColors.white}
      />
      <Text
        x={x}
        y={y}
        style={{ fontSize: 8, fill }}
        textAnchor={anchor ?? 'start'}
      >
        {children}
      </Text>
    </>
  );
}

export default function GraphFigure({ item }: Props) {
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
  const height = (viewHeight / viewWidth) * FIGURE_WIDTH;

  return (
    <Svg
      width={FIGURE_WIDTH}
      height={height}
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
    >
      {ticksX.map((v) => (
        <Line
          key={`gx-${v}`}
          x1={toX(v)}
          y1={top}
          x2={toX(v)}
          y2={bottom}
          strokeWidth={0.5}
          stroke={pdfColors.neutralGrey}
        />
      ))}
      {ticksY.map((v) => (
        <Line
          key={`gy-${v}`}
          x1={left}
          y1={toY(v)}
          x2={right}
          y2={toY(v)}
          strokeWidth={0.5}
          stroke={pdfColors.neutralGrey}
        />
      ))}

      {ticksX
        .filter((v) => v !== 0)
        .map((v) => (
          <Text
            key={`tx-${v}`}
            x={toX(v)}
            y={bottom + 12}
            style={{ fontSize: 8, fill: pdfColors.muted }}
            textAnchor="middle"
          >
            {String(v)}
          </Text>
        ))}
      {ticksY
        .filter((v) => v !== 0)
        .map((v) => (
          <Text
            key={`ty-${v}`}
            x={left - 6}
            y={toY(v) + 3}
            style={{ fontSize: 8, fill: pdfColors.muted }}
            textAnchor="end"
          >
            {String(v)}
          </Text>
        ))}

      <Line
        x1={left}
        y1={toY(0)}
        x2={right}
        y2={toY(0)}
        strokeWidth={1}
        stroke={pdfColors.navy}
      />
      <Line
        x1={toX(0)}
        y1={top}
        x2={toX(0)}
        y2={bottom}
        strokeWidth={1}
        stroke={pdfColors.navy}
      />

      {riseRun && (
        <>
          <Line
            x1={toX(riseRun.from.x)}
            y1={toY(riseRun.from.y)}
            x2={toX(riseRun.from.x)}
            y2={toY(riseRun.to.y)}
            strokeWidth={0.75}
            strokeDasharray="3 2"
            stroke={pdfColors.prerequisite}
          />
          <Line
            x1={toX(riseRun.from.x)}
            y1={toY(riseRun.to.y)}
            x2={toX(riseRun.to.x)}
            y2={toY(riseRun.to.y)}
            strokeWidth={0.75}
            strokeDasharray="3 2"
            stroke={pdfColors.prerequisite}
          />
        </>
      )}

      <Line
        x1={toX(segment[0].x)}
        y1={toY(segment[0].y)}
        x2={toX(segment[1].x)}
        y2={toY(segment[1].y)}
        strokeWidth={2}
        stroke={pdfColors.accent}
      />

      {points.map((point) => (
        <Circle
          key={point.label}
          cx={toX(point.x)}
          cy={toY(point.y)}
          r={3}
          fill={pdfColors.accent}
        />
      ))}
      {points.map((point) => (
        <HaloText
          key={`label-${point.label}`}
          x={toX(point.x) + 6}
          y={toY(point.y) - 6}
          width={point.label.length * 4.5}
          fill={pdfColors.accent}
        >
          {point.label}
        </HaloText>
      ))}

      {/* Last, so nothing paints over them — matching the screen. */}
      {riseRun && slopeAnnotation && (
        <>
          <HaloText
            x={toX(riseRun.from.x) + 4}
            y={(toY(riseRun.from.y) + toY(riseRun.to.y)) / 2}
            width={slopeAnnotation.riseLabel.length * 4.5}
            fill={pdfColors.prerequisite}
          >
            {slopeAnnotation.riseLabel}
          </HaloText>
          <HaloText
            x={(toX(riseRun.from.x) + toX(riseRun.to.x)) / 2}
            y={toY(riseRun.to.y) - 4}
            width={slopeAnnotation.runLabel.length * 4.5}
            anchor="middle"
            fill={pdfColors.prerequisite}
          >
            {slopeAnnotation.runLabel}
          </HaloText>
        </>
      )}

      {item.lineLabel && (
        <Text
          x={viewWidth / 2}
          y={GRAPH_BOX.labelBand - 6}
          style={{ fontSize: 10, fill: pdfColors.accent }}
          textAnchor="middle"
        >
          {item.lineLabel}
        </Text>
      )}
    </Svg>
  );
}
