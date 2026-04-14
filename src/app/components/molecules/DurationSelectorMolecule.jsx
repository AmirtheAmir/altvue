"use client";

import { useEffect, useRef, useState } from "react";
import DropdownTriggerAtom from "../atoms/DropdownTriggerAtom";

export default function DurationSelectorMolecule({
  selectedMinutes,
  optionsMinutes,
  onSelect,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const hasSelection = Number.isFinite(selectedMinutes);

  return (
    <div ref={containerRef} className="relative w-full max-w-[232px]">
      <DropdownTriggerAtom
        leftText={hasSelection ? `${selectedMinutes}:00` : "Select Timer"}
        isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        placeholder={!hasSelection}
        centerText={hasSelection}
        showArrow={!hasSelection || isOpen}
      />

      {isOpen ? (
        <div className="absolute top-[calc(100%+8px)] right-0 left-0 z-[90] rounded-[14px] border border-dark-800 bg-dark-50 p-2 shadow-[0_12px_28px_rgba(0,0,0,0.55)]">
          {optionsMinutes.map((minutes) => {
            const isSelected = selectedMinutes === minutes;

            return (
              <button
                key={minutes}
                type="button"
                onClick={() => {
                  onSelect(minutes);
                  setIsOpen(false);
                }}
                className="flex h-10 w-full items-center rounded-lg px-2 text-left"
              >
                <span
                  className={`font-L-700 ${
                    isSelected ? "text-dark-0" : "text-dark-700"
                  }`}
                >
                  {minutes}:00
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
