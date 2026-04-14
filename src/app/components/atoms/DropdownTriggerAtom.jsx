import { ArrowDropDown, ArrowDropUp } from "../../../../public/icons";

export default function DropdownTriggerAtom({
  leftText,
  rightText = null,
  isOpen,
  onClick,
  placeholder = false,
  centerText = false,
  showArrow = true,
  className = "",
}) {
  const ArrowIcon = isOpen ? ArrowDropUp : ArrowDropDown;

  const containerClassName = centerText
    ? "flex h-11 w-full items-center justify-center rounded-[12px] border border-dark-400 bg-dark-50 px-4"
    : "flex h-11 w-full items-center justify-between rounded-[12px] border border-dark-400 bg-dark-50 px-4";

  const textClassName = placeholder ? "font-L-500 text-dark-700" : "font-L-700 text-dark-0";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${containerClassName} ${className}`}
    >
      <span className={`truncate ${textClassName}`}>{leftText}</span>

      {centerText ? null : (
        <span className="ml-3 flex shrink-0 items-center gap-2">
          {rightText ? <span className="font-L-700 text-dark-0">{rightText}</span> : null}

          {showArrow ? (
            <span className="text-dark-700">
              <ArrowIcon className="" />
            </span>
          ) : null}
        </span>
      )}
    </button>
  );
}
