export default function FlightControlButton({
  icon: Icon,
  label,
  onClick,
  active = false,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex  min-w-0 items-center justify-center py-3  gap-2 rounded-xl transition-all duration-300 ease-in-out ${
        active ? "bg-dark-300 text-gold-500" : "bg-dark-300 text-dark-0"
      } ${disabled ? "cursor-not-allowed" : "hover:cursor-pointer hover:ring-2 hover:ring-dark-500"}`}
    >
      {Icon ? <Icon aria-hidden="true" className="" /> : null}
      <span className="font-S-700">{label}</span>
    </button>
  );
}
