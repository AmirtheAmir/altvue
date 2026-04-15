import {
  RadioButtonChecked,
  RadioButtonUnchecked,
} from "../../../../public/icons";

export default function RouteRadioAtom({ checked, className = "" }) {
  const Icon = checked ? RadioButtonChecked : RadioButtonUnchecked;
  const textClassName = checked ? "text-dark-0" : "text-dark-800";

  return (
    <Icon
      className={`${textClassName} transition-colors duration-300 ${className}`}
    />
  );
}