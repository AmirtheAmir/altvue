export default function TakeOffButton({
  label = "Take Off",
  className = "",
  onClick,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-xl bg-orange-500 flex items-start justify-center py-3 font-M-700 text-dark-100 transition-colors duration-300 hover:opacity-90 hover:cursor-pointer ${className}`}
    >
      {label}
    </button>
  );
}