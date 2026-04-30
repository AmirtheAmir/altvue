import InstructionsBackButton from "../atoms/InstructionsBackButton";
import InstructionsTextList from "../molecules/InstructionsTextList";

export default function InstructionsPanel({ onBack }) {
  return (
    <section className="fixed left-1/2 top-1/2 z-40 flex h-120 w-108 max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-6 overflow-y-auto rounded-3xl bg-dark-072 p-3 text-dark-0 shadow-[0_0_72px_rgba(0,0,0,0.72)] backdrop-blur-lg">
      <InstructionsBackButton onClick={onBack} />
      <p className="font-S-500 text-dark-0">
        <span className="font-Brand">Altvue</span> is a focus flight experience
        that helps you choose a route, start a timer, and stay locked into your
        work while a plane moves across the map. You can pick destinations,
        control the panel, manage music, and decide whether the camera follows
        the flight or stays free.
      </p>
      <InstructionsTextList />
      <p className="font-S-500 text-dark-0">
        Created with care by Amir, the mind behind{" "}
        <span className="font-Brand">Altvue</span>, designed to make focus feel
        calmer, more visual, and a little more cinematic.
      </p>
    </section>
  );
}
