import { ArrowTo } from "../../../../public/icons";
import RouteRadio from "../atoms/RouteRadio";

export default function AutopilotTimerOption({
  route,
  checked,
  onSelect,
}) {
  const textClassName = checked ? "text-dark-0" : "text-dark-700";
  const hoverTextClassName = `${textClassName} transition-colors duration-300 group-hover:cursor-pointer group-hover:text-dark-0`;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group grid w-full grid-cols-[40px_minmax(0,1fr)_24px_minmax(0,1fr)] items-center gap-2 text-left"
    >
      <div className="p-3">
        <RouteRadio checked={checked} className="group-hover:text-dark-0" />
      </div>
      <div className="flex flex-row justify-between items-center">
        <span className={` font-M-700 ${hoverTextClassName}`}>
          {route.from.city}, {route.from.country}
        </span>
        <span className={` font-M-700 ${hoverTextClassName}`}>
          {route.from.code}
        </span>
      </div>
      <span className={`shrink-0 ${hoverTextClassName}`}>
        <ArrowTo className="" />
      </span>
      <div className="flex flex-row justify-between ">
        <span className={`flex items-center justify-center font-M-700 ${hoverTextClassName}`}>
          {route.to.city}, {route.to.country}
        </span>
        <span className={` font-M-700 ${hoverTextClassName}`}>
          {route.to.code}
        </span>
      </div>
    </button>
  );
}
