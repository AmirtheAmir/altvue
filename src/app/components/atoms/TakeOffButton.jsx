"use client";

import { useEffect, useRef, useState } from "react";
import { TicketMainIcon, TicketRestIcon } from "@/assets/icons";

export default function TakeOffButton({
  label = "Take Off",
  className = "",
  labelClassName = "font-S-700",
  onBeforeAnimation,
  onClick,
  ...props
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef(null);

  const handleClick = (event) => {
    if (isAnimating) {
      return;
    }

    if (onBeforeAnimation?.(event) === false) {
      return;
    }

    setIsAnimating(true);

    timeoutRef.current = window.setTimeout(() => {
      onClick?.(event);
      setIsAnimating(false);
      timeoutRef.current = null;
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full rounded-xl bg-crim-500 py-2.5 text-dark-100 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-crim-600 ${className}`}
      {...props}
    >
      <span className="flex items-center justify-center flex-row ">
        <span className="flex items-center">
          <div className="flex flex-row mr-1">
            <TicketMainIcon
              aria-hidden="true"
              className="shrink-0 transition-transform duration-2000 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
            <TicketRestIcon
              aria-hidden="true"
              className={`-ml-1 shrink-0 transition-transform duration-2000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isAnimating ? "translate-x-14" : "translate-x-0"
              }`}
            />
          </div>
          <span
            className={`${labelClassName} transition-all duration-500 ease-out ${
              isAnimating
                ? "-translate-x-2 opacity-0"
                : "translate-x-0 opacity-100"
            }`}
          >
            {label}
          </span>
        </span>
      </span>
    </button>
  );
}
