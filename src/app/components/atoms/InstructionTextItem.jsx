export default function InstructionTextItem({ icon: Icon, text, title }) {
  return (
    <article className="flex flex-col gap-2">
      <div className="flex items-center gap-3 text-crim-800">
        <Icon aria-hidden="true" className="" />
        <h3 className="font-S-700">{title}</h3>
      </div>
      <p className="font-S-500 text-dark-0">{text}</p>
    </article>
  );
}
