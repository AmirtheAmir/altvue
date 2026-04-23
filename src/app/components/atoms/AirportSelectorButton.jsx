"use client";

import AirportCodeBadge from "./AirportCodeBadge";

export default function AirportSelectorButton({
  icon: Icon,
  placeholder,
  city,
  country,
  code,
  isSelected = false,
  className = "",
  iconClassName = "",
  placeholderClassName = "font-M-500",
  cityClassName = "font-M-700",
  countryClassName = "font-S-500",
  codeClassName = "",
  codeLabelClassName,
}) {
  if (!isSelected) {
    return (
      <div
        className={`flex w-67 items-center gap-2 rounded-xl border-2 border-dark-300 px-2 py-3 text-dark-600 transition-colors duration-300 ease-in-out group-hover:border-dark-400 hover:bg-dark-200 ${className}`}
      >
        {Icon ? <Icon aria-hidden="true" className={iconClassName} /> : null}
        <span className={placeholderClassName}>{placeholder}</span>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center gap-2">
      <div
        className={`flex w-69 min-w-0 items-center gap-2 rounded-xl border-2 border-dark-300 px-2 py-3 text-dark-0 ${className}`}
      >
        {Icon ? <Icon aria-hidden="true" className={iconClassName} /> : null}
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <div className={`min-w-0 truncate ${cityClassName}`}>{city}</div>
          {country ? (
            <div className={`shrink-0 whitespace-nowrap text-right ${countryClassName}`}>
              {country}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-center">
        <AirportCodeBadge
          code={code}
          className={codeClassName}
          labelClassName={codeLabelClassName}
        />
      </div>
    </div>
  );
}
