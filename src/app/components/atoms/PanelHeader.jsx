"use client";

import { GlobeIcon, ArrowDropDownIcon, ArrowDropUpIcon } from "@/assets/icons";

export default function PanelHeader({ isOpen, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center hover:cursor-pointer transition-all duration-300 ease-in-out justify-between"
    >
      <div className="flex items-center gap-3">
        <GlobeIcon aria-hidden="true" />
        <span className="font-S-700 text-dark-0">ALTVUE</span>
      </div>

      {isOpen ? (
        <ArrowDropUpIcon aria-hidden="true" className="text-dark-0" />
      ) : (
        <ArrowDropDownIcon aria-hidden="true" className="text-dark-0" />
      )}
    </button>
  );
}
