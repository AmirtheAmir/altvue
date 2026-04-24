import { Plane16Icon } from "@/assets/icons";

export default function FlightRouteProgress({
  fromCode,
  fromLabel = "From",
  toCode,
  toLabel = "To",
  progress,
  compact = false,
}) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const startLabel = fromCode || fromLabel;
  const endLabel = toCode || toLabel;
  const progressPercent = `${clampedProgress * 100}%`;
  const planeGap = compact ? 16 : 16;
  const planePosition = `clamp(${planeGap}px, ${progressPercent}, calc(100% - ${planeGap}px))`;

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 mt-1">
      <span className="font-S-500 uppercase text-dark-0">
        {startLabel}
      </span>
      <div className="relative h-8 min-w-0">
        <div
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-dark-0"
          style={{ width: `max(0px, calc(${planePosition} - ${planeGap}px))` }}
        />
        <div
          className="absolute right-0 top-1/2 h-1 -translate-y-1/2 border-t-4 border-dashed border-dark-0"
          style={{ left: `min(100%, calc(${planePosition} + ${planeGap}px))` }}
        />
        <div
          className="absolute top-4 -translate-x-1/2 -translate-y-1/2 p-2 "
          style={{ left: planePosition }}
        >
          <Plane16Icon aria-hidden="true" className="text-dark-0" />
        </div>
      </div>
      <span className="font-S-500 uppercase text-dark-0 text-right">
        {endLabel}
      </span>
    </div>
  );
}
