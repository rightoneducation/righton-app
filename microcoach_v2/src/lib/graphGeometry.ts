import { IRepresentation } from './PipelineModels';

/**
 * The plotting maths for the Graph representation, with no JSX in sight.
 *
 * Two renderers draw this figure — the screen with DOM SVG elements and the
 * PDF export with @react-pdf's own primitives — and neither can import the
 * other's tags. Keeping the geometry here means they walk identical numbers
 * and only the element names differ, the same split activityMarks uses for
 * the correctness marks.
 */

export interface GraphBox {
  width: number;
  /** Reserved above the plot for the equation label. */
  labelBand: number;
  plotHeight: number;
  padX: number;
  padY: number;
}

/** Shared by both renderers so the figure is the same shape in each. */
export const GRAPH_BOX: GraphBox = {
  width: 300,
  labelBand: 22,
  plotHeight: 200,
  padX: 30,
  padY: 22,
};

export interface GraphPoint {
  label: string;
  x: number;
  y: number;
}

export interface GraphGeometry {
  viewWidth: number;
  viewHeight: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  toX: (x: number) => number;
  toY: (y: number) => number;
  ticksX: number[];
  ticksY: number[];
  /** The plotted line, already clipped to the visible band. */
  segment: { x: number; y: number }[];
  points: GraphPoint[];
  riseRun: { from: GraphPoint; to: GraphPoint } | null;
}

const range = (min: number, max: number) =>
  Array.from({ length: max - min + 1 }, (unused, i) => min + i);

/** Parses the "(0, 1)" strings the card already lists, so the plotted dots
 *  and their labels cannot disagree. */
function parsePoints(labels: string[] | undefined): GraphPoint[] {
  return (labels ?? [])
    .map((label) => {
      const match = label.match(/\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)/);
      return match ? { label, x: Number(match[1]), y: Number(match[2]) } : null;
    })
    .filter((point): point is GraphPoint => point !== null);
}

export default function buildGraphGeometry(
  item: IRepresentation,
  box: GraphBox = GRAPH_BOX,
): GraphGeometry | null {
  const { line, axisRange, slopeAnnotation } = item;
  if (!line || !axisRange) return null;

  const { xMin, xMax, yMin, yMax } = axisRange;
  const viewHeight = box.plotHeight + box.labelBand;
  const left = box.padX;
  const right = box.width - box.padX;
  const top = box.labelBand + box.padY;
  const bottom = viewHeight - box.padY;

  const toX = (x: number) =>
    left + ((x - xMin) / (xMax - xMin)) * (right - left);
  const toY = (y: number) =>
    bottom - ((y - yMin) / (yMax - yMin)) * (bottom - top);

  const at = (x: number) => line.slope * x + line.intercept;
  // Clip to the visible band so a steep slope can't run out of the card.
  const segment = [xMin, xMax]
    .map((x) => ({ x, y: at(x) }))
    .map(({ x, y }) => {
      if (y > yMax) return { x: (yMax - line.intercept) / line.slope, y: yMax };
      if (y < yMin) return { x: (yMin - line.intercept) / line.slope, y: yMin };
      return { x, y };
    });

  const points = parsePoints(item.plottedPoints);

  return {
    viewWidth: box.width,
    viewHeight,
    left,
    right,
    top,
    bottom,
    toX,
    toY,
    ticksX: range(xMin, xMax),
    ticksY: range(yMin, yMax),
    segment,
    points,
    riseRun:
      points.length === 2 && slopeAnnotation
        ? { from: points[0], to: points[1] }
        : null,
  };
}
