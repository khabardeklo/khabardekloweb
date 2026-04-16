type SectionHeadingProps = {
  title: string;
  description?: string;
};

export function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-black tracking-tight text-slate-950">{title}</h2>
      {description ? <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p> : null}
    </div>
  );
}