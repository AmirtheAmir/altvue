import { LocationSearching } from "../../../../public/icons";

export default function SearchInputAtom({
  value,
  onChange,
  placeholder = "Search",
}) {
  return (
    <label className="group flex w-full items-center gap-2 border-b-2 border-dark-300 pl-1 pr-3 py-3">
      <span className="shrink-0 text-dark-700 transition-colors duration-300 group-focus-within:text-dark-0">
        <LocationSearching className="" />
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-full w-full bg-transparent font-M-500 text-dark-0 transition-colors duration-300 placeholder:text-dark-600 focus:outline-none "
      />
    </label>
  );
}
