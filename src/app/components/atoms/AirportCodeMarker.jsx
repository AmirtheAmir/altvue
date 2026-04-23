export default function AirportCodeMarker({ code, isHovered = false }) {
  return (
    <div
      className={`flex items-center justify-center rounded-md px-2 py-1 font-S-700 transition-all duration-300 ease-in-out hover:cursor-pointer ${
        isHovered
          ? "bg-gold-500 text-dark-100"
          : "bg-dark-200 text-dark-800"
      }`}
    >
      {code}
    </div>
  );
}
