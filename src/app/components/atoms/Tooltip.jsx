import { useState } from "react";

export default function Tooltip({
  children,
  className = "",
  isVisible = false,
  label,
  position = "top",
  showOnHover = true,
  variant = "neutral",
}) {
  const [isDismissed, setIsDismissed] = useState(false);
  const isInline = position === "inline";
  const isTop = position === "top";
  const tooltipPosition = isInline
    ? "left-1/2 top-0 -translate-x-1/2"
    : isTop
      ? "bottom-full left-1/2 mb-3 -translate-x-1/2"
      : "left-1/2 top-full mt-3 -translate-x-1/2";
  const arrowPosition =
    isInline || isTop
      ? "left-1/2 top-full -translate-x-1/2 border-x-8 border-t-8 border-x-transparent"
      : "bottom-full left-1/2 -translate-x-1/2 border-x-8 border-b-8 border-x-transparent";
  const variantClassName =
    variant === "error"
      ? "bg-crim-200 text-dark-100"
      : "bg-dark-950 text-dark-100";
  const arrowColorClassName =
    variant === "error" ? "border-t-crim-200 border-b-crim-200" : "border-t-dark-950 border-b-dark-950";
  const visibilityClassName = isVisible
    ? "opacity-100"
    : showOnHover && !isDismissed
      ? "opacity-0 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100"
      : "opacity-0";

  const handlePointerEnter = () => {
    setIsDismissed(false);
  };

  const handlePointerDown = () => {
    if (showOnHover) {
      setIsDismissed(true);
    }
  };

  return (
    <span
      className={`group/tooltip relative inline-flex ${className}`}
      onPointerDownCapture={handlePointerDown}
      onPointerEnter={handlePointerEnter}
    >
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-md px-2 py-1 font-XS-700 shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-opacity duration-300 ease-in-out ${tooltipPosition} ${variantClassName} ${visibilityClassName}`}
      >
        {label}
        <span
          aria-hidden="true"
          className={`absolute h-0 w-0 ${arrowPosition} ${arrowColorClassName}`}
        />
      </span>
    </span>
  );
}
