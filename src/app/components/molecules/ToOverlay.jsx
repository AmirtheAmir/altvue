"use client";

import { useRef, useState } from "react";
import DurationFilterButton from "../atoms/DurationFilterButton";
import AirportCodeChip from "../atoms/AirportCodeChip";

const FILTER_MINUTES = [15, 40, 65, 90, 115];

const getDurationBucket = (minutes) => {
  if (!minutes) {
    return FILTER_MINUTES[FILTER_MINUTES.length - 1];
  }

  return (
    FILTER_MINUTES.find((filterMinutes) => minutes <= filterMinutes) ??
    FILTER_MINUTES[FILTER_MINUTES.length - 1]
  );
};

export default function ToOverlay({
  airportItems,
  cardIcon,
  onSelect,
  selectedAirport,
}) {
  const [activeFilter, setActiveFilter] = useState(FILTER_MINUTES[0]);
  const dragStateRef = useRef({
    isDragging: false,
    startScrollLeft: 0,
    startX: 0,
  });
  const hasDraggedRef = useRef(false);
  const sectionRefs = useRef({});
  const scrollerRef = useRef(null);

  const groupedAirportItems = FILTER_MINUTES.map((minutes) => ({
    minutes,
    airports: airportItems
      .filter((airport) => getDurationBucket(airport.focusMinutes) === minutes)
      .sort((firstAirport, secondAirport) => {
        return (firstAirport.focusMinutes ?? 0) - (secondAirport.focusMinutes ?? 0);
      }),
  }));

  const handleFilterClick = (minutes) => {
    setActiveFilter(minutes);
    sectionRefs.current[minutes]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const handlePointerDown = (event) => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    dragStateRef.current = {
      isDragging: true,
      startScrollLeft: scroller.scrollLeft,
      startX: event.clientX,
    };
    hasDraggedRef.current = false;
    scroller.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const scroller = scrollerRef.current;
    const dragState = dragStateRef.current;

    if (!scroller || !dragState.isDragging) {
      return;
    }

    const dragDelta = event.clientX - dragState.startX;

    if (Math.abs(dragDelta) > 4) {
      hasDraggedRef.current = true;
    }

    scroller.scrollLeft = dragState.startScrollLeft - dragDelta;
  };

  const handlePointerUp = (event) => {
    const scroller = scrollerRef.current;

    dragStateRef.current.isDragging = false;

    if (scroller?.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }
  };

  const handleClickCapture = (event) => {
    if (!hasDraggedRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    hasDraggedRef.current = false;
  };

  return (
    <div className="absolute flex flex-col gap-3 left-0 top-14 z-30 w-74 max-w-[calc(100vw-3rem)] rounded-2xl bg-dark-200 p-2 shadow-[0_0_72px_rgba(0,0,0,0.56)] ring-2 ring-dark-400">
      <div className=" flex gap-1 overflow-x-auto">
        {FILTER_MINUTES.map((minutes) => (
          <DurationFilterButton
            key={minutes}
            active={activeFilter === minutes}
            minutes={minutes}
            onClick={() => handleFilterClick(minutes)}
          />
        ))}
      </div>

      <div
        ref={scrollerRef}
        className="flex cursor-grab overflow-x-auto active:cursor-grabbing"
        onClickCapture={handleClickCapture}
        onPointerDown={handlePointerDown}
        onPointerLeave={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {groupedAirportItems.map(({ airports, minutes }) => (
          <div
            key={minutes}
            ref={(element) => {
              if (element) {
                sectionRefs.current[minutes] = element;
              }
            }}
            className="flex shrink-0 gap-2"
          >
            {airports.map((airport) => {
              const isActive = selectedAirport?.code === airport.code;

              return (
                <button
                  key={`${airport.city}-${airport.code}`}
                  type="button"
                  onClick={() => onSelect(airport)}
                  className={`flex h-21 w-50 shrink-0 flex-col justify-between rounded-xl p-3 text-left transition-colors duration-300 hover:cursor-pointer ${
                    isActive
                      ? "bg-dark-0 text-dark-100"
                      : "bg-dark-300 text-dark-0 hover:bg-dark-0 hover:text-dark-100"
                  }`}
                >
                  <div className="flex min-w-0 items-center justify-between gap-3">
                    <div className="truncate font-S-700">{airport.city}</div>
                    <AirportCodeChip
                      code={airport.code}
                      icon={cardIcon}
                      className={`shrink-0 ${
                        isActive
                          ? "bg-crim-500 text-dark-100 ring-dark-100"
                          : "ring-crim-500 text-crim-500"
                      }`}
                    />
                  </div>

                  <div className="flex min-w-0 items-center justify-between gap-3">
                    <div className="truncate font-S-500 text-dark-600">
                      {airport.country}
                    </div>
                    {airport.focusMinutes ? (
                      <div className="shrink-0 font-S-700 text-dark-600">
                        {airport.focusMinutes} min
                      </div>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
