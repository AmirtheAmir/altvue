import {
  InsCompactIcon,
  InsDestinationIcon,
  InsGpsIcon,
  InsMusicIcon,
  InsNavigationIcon,
  InsPlaneIcon,
  InsTakeoffIcon,
} from "@/assets/icons";
import InstructionTextItem from "../atoms/InstructionTextItem";

const instructionItems = [
  {
    icon: InsPlaneIcon,
    title: "Panel Minimizer",
    text: "Click the plane icon to shrink the main panel into its smallest version. This gives you a cleaner view of the map, the route, and the moving plane. Click it again whenever you want to bring the full panel back.",
  },
  {
    icon: InsNavigationIcon,
    title: "Navigation Reset",
    text: "Click the navigation icon when you want to start fresh. It clears both destination inputs, moves the map back to its default center, and resets the zoom to the original wide view.",
  },
  {
    icon: InsCompactIcon,
    title: "Compact Panel",
    text: "Click the compact icon to minimize the panel without hiding it completely. This keeps the main controls visible while giving more space to the map. Click it again to return the panel to its normal size.",
  },
  {
    icon: InsMusicIcon,
    title: "Music Control",
    text: "Click the music icon to mute or unmute the background audio during your focus flight. The timer and plane continue running either way, so you can focus with music or keep the experience silent.",
  },
  {
    icon: InsGpsIcon,
    title: "GPS Lock",
    text: "Click the GPS icon to switch between free camera movement and airplane lock mode. Free movement lets you explore the map, while lock mode keeps the plane centered as it travels along the route.",
  },
  {
    icon: InsDestinationIcon,
    title: "Destination Inputs",
    text: "Choose your From and To destinations directly from the map or by clicking the input fields. The To destination list also includes time filters, letting you jump to routes based on the focus duration you want.",
  },
  {
    icon: InsTakeoffIcon,
    title: "Take Off",
    text: "Click the Take Off button once both destinations are selected. Your focus flight begins, the timer starts, the route appears on the map, and the plane begins moving toward the selected destination.",
  },
];

export default function InstructionsTextList() {
  return (
    <div className="flex flex-col gap-3">
      {instructionItems.map((item) => (
        <InstructionTextItem
          key={item.title}
          icon={item.icon}
          text={item.text}
          title={item.title}
        />
      ))}
    </div>
  );
}
