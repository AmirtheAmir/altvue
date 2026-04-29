"use client";

import { useRef, useState } from "react";
import DurationFilterButton from "../atoms/DurationFilterButton";
import AirportCard from "./AirportCard";

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

const getAirportKey = (airport) => {
  return `${airport.city}-${airport.code}`;
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
  const airportCardRefs = useRef({});
  const scrollerRef = useRef(null);

  const sortedAirportItems = [...airportItems].sort((firstAirport, secondAirport) => {
    return (firstAirport.focusMinutes ?? Infinity) - (secondAirport.focusMinutes ?? Infinity);
  });

  const groupedAirportItems = FILTER_MINUTES.map((minutes) => ({
    minutes,
    airports: sortedAirportItems
      .filter((airport) => getDurationBucket(airport.focusMinutes) === minutes)
  }));

  const handleFilterClick = (minutes) => {
    const targetAirport =
      sortedAirportItems.find((airport) => airport.focusMinutes >= minutes) ??
      sortedAirportItems[sortedAirportItems.length - 1];

    setActiveFilter(minutes);

    if (!targetAirport) {
      return;
    }

    airportCardRefs.current[getAirportKey(targetAirport)]?.scrollIntoView({
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

  const handlePointerUp = () => {
    dragStateRef.current.isDragging = false;
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
      <div className=" flex gap-1 flex-row w-full">
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
            className="flex shrink-0 gap-2"
          >
            {airports.map((airport) => {
              const isActive = selectedAirport?.code === airport.code;
              const airportKey = getAirportKey(airport);

              return (
                <div
                  key={airportKey}
                  ref={(element) => {
                    if (element) {
                      airportCardRefs.current[airportKey] = element;
                      return;
                    }

                    delete airportCardRefs.current[airportKey];
                  }}
                  className="shrink-0"
                >
                  <AirportCard
                    city={airport.city}
                    className="w-36"
                    country={airport.country}
                    airportCode={airport.code}
                    codeIcon={cardIcon}
                    focusMinutes={airport.focusMinutes}
                    active={isActive}
                    onClick={() => onSelect(airport)}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
