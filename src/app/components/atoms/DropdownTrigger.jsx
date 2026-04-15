import { ArrowDropDown, ArrowDropUp } from "../../../../public/icons";

export default function DropdownTrigger({
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
  const isSelected = !placeholder;
  const isActive = isOpen || isSelected;
  const shouldShowArrow = showArrow && !isSelected;

  const containerClassName = centerText
    ? `flex w-full cursor-pointer items-center justify-center rounded-xl ring-2 p-3 font-M-500 transition-colors hover:bg-dark-100 ${
        isActive ? "ring-dark-700 bg-dark-50" : "ring-dark-400 bg-dark-50"
      }`
    : `flex  w-full cursor-pointer items-center justify-between rounded-xl ring-2 p-3 font-M-500 transition-colors hover:bg-dark-100 ${
        isActive ? "ring-dark-700 bg-dark-50" : "ring-dark-400 bg-dark-50"
      }`;

  const textClassName = placeholder ? "font-M-500 text-dark-600" : "font-M-700 text-dark-0";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${containerClassName} ${className}`}
    >
      <span className={`truncate ${textClassName}`}>{leftText}</span>

      {centerText ? null : (
        <span className="ml-auto flex shrink-0 items-center gap-2">
          {rightText ? <span className="font-M-700 text-dark-0">{rightText}</span> : null}
          {shouldShowArrow ? (
            <span className="text-dark-700">
              <ArrowIcon className="" />
            </span>
          ) : null}
        </span>
      )}
    </button>
  );
}
