export default function FlightControlButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-0 items-center justify-center gap-2 rounded-lg bg-dark-0 py-3 text-dark-100 transition-all duration-300 ease-in-out hover:cursor-pointer  hover:bg-dark-950"
    >
      {Icon ? <Icon aria-hidden="true" className="" /> : null}
      <span className="font-S-700">{label}</span>
    </button>
  );
}
