import { ChevronLeftIcon } from "@/assets/icons";

export default function InstructionsBackButton({ onClick }) {
  return (
    <button
      type="button"
      aria-label="Back"
      onClick={onClick}
      className="flex w-fit items-center gap-1.5 text-dark-900 transition-colors duration-300 hover:cursor-pointer hover:text-dark-0"
    >
      <ChevronLeftIcon aria-hidden="true" className="size-4" />
      <span className="font-S-500">Back</span>
    </button>
  );
}
