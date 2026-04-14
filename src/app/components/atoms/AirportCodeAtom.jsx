export default function AirportCodeAtom({ code, Icon = null }) {
  const hasIcon = Boolean(Icon);

  const wrapperClassName = hasIcon
    ? "flex items-center gap-1.5 rounded-xl border-2 border-orange-500 bg-dark-50 pr-3 pl-2.5 py-1.5"
    : "flex items-center gap-1.5 rounded-xl border-2 border-orange-900 bg-dark-50 px-3.5 py-1.5";

  const codeClassName = hasIcon
    ? "font-L-700 text-orange-500"
    : "font-L-700 text-orange-900";

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
