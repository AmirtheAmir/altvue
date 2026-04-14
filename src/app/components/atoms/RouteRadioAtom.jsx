import {
  RadioButtonChecked,
  RadioButtonUnchecked,
} from "../../../../public/icons";

export default function RouteRadioAtom({ checked }) {
  const Icon = checked ? RadioButtonChecked : RadioButtonUnchecked;

  return (
    <span className={checked ? "text-dark-0" : "text-dark-700"}>
      <Icon className="" />
    </span>
  );
}
