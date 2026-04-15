export default function AirportCodeAtom({ code, Icon = null }) {
  const hasIcon = Boolean(Icon);

  const wrapperClassName = hasIcon
    ? "flex items-center gap-1 rounded-lg border-2 border-orange-500 bg-dark-50 pr-2.5 pl-2 py-1.5"
    : "flex items-center gap-1 rounded-lg bg-dark-50 px-2.5 py-1.5";

  const codeClassName = hasIcon
    ? "font-S-700 text-orange-500"
    : "font-S-700 text-orange-700";

  return (
    <div className={wrapperClassName}>
      {hasIcon ? (
        <span className="flex items-center justify-center text-orange-500">
          <Icon className="" />
        </span>
      ) : null}

      <span className={codeClassName}>{code}</span>
    </div>
  );
}
