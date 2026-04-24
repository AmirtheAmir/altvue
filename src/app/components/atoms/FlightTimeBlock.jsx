const formatSystemTime = (timestamp) => {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
};

const formatSystemDate = (timestamp) => {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(new Date(timestamp))
    .replace(",", "");
};

export default function FlightTimeBlock({ timestamp, align = "left" }) {
  const isRightAligned = align === "right";

  return (
    <div className={`flex flex-col ${isRightAligned ? "text-right" : ""}`}>
      <span className="font-M-700 text-dark-0">
        {formatSystemTime(timestamp)}
      </span>
      <span className="font-XS-500 text-dark-900">
        {formatSystemDate(timestamp)}
      </span>
    </div>
  );
}
