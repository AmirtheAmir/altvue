import { ArrowTo } from "../../../../public/icons";
import RouteRadioAtom from "../atoms/RouteRadioAtom";

export default function AutopilotRouteOptionMolecule({
  route,
  checked,
  onSelect,
}) {
  const textClassName = checked ? "text-dark-0" : "text-dark-700";

  return (
    <button
      type="button"
      onClick={onSelect}
      className="grid w-full grid-cols-[24px_minmax(0,1fr)_minmax(0,1.2fr)_auto] items-center gap-3 text-left"
    >
      <RouteRadioAtom checked={checked} />

      <span className={`truncate font-L-700 ${textClassName}`}>
        {route.from.city}, {route.from.country}
      </span>

      <span className={`flex min-w-0 items-center gap-2 font-L-700 ${textClassName}`}>
        <span className="shrink-0">{route.from.code}</span>
        <span className="shrink-0 text-dark-700">
          <ArrowTo className="" />
        </span>
        <span className="truncate">
          {route.to.city}, {route.to.country}
        </span>
      </span>

      <span className={`shrink-0 font-L-700 ${textClassName}`}>{route.to.code}</span>
    </button>
  );
}
