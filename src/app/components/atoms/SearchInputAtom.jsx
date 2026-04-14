import { LocationSearching } from "../../../../public/icons";

export default function SearchInputAtom({
  value,
  onChange,
  placeholder = "Search",
}) {
  return (
    <label className="flex h-10 w-full items-center gap-2 border-b border-dark-400 px-1 pb-1">
      <span className="shrink-0 text-dark-700">
        <LocationSearching className="" />
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-full w-full bg-transparent font-L-500 text-dark-0 outline-none placeholder:text-dark-700"
      />
    </label>
  );
}
