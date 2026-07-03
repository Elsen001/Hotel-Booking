const steps = ['Configuration', 'Daily Setup', 'Summary'];

interface StepperProps {
  current: number; // 0-based
}

/** Progress indicator across the three booking steps. */
export default function Stepper({ current }: StepperProps) {
  return (
    <ol className="no-print mb-6 flex items-center gap-2">
      {steps.map((label, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition ${
                active
                  ? 'bg-brand-600 text-white'
                  : done
                    ? 'bg-brand-100 text-brand-700'
                    : 'bg-slate-200 text-slate-500'
              }`}
            >
              {done ? '✓' : i + 1}
            </div>
            <span
              className={`hidden text-sm font-medium sm:inline ${
                active ? 'text-slate-900' : 'text-slate-500'
              }`}
            >
              {label}
            </span>
            {i < steps.length - 1 && <div className="mx-1 h-px flex-1 bg-slate-200" />}
          </li>
        );
      })}
    </ol>
  );
}
