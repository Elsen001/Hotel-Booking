import { useBooking } from '../context/BookingContext';
import { boardTypes } from '../data';
import { computeGrandTotal, formatCurrency } from '../utils/pricing';
import DayRow from './DayRow';

interface DailyConfigProps {
  onBack: () => void;
  onNext: () => void;
}

export default function DailyConfig({ onBack, onNext }: DailyConfigProps) {
  const { state } = useBooking();
  const board = boardTypes.find((b) => b.code === state.boardType);
  const grandTotal = computeGrandTotal(state.destination, state.days);

  return (
    <section className="card animate-fade-in space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Daily Configuration</h2>
          <p className="text-sm text-slate-500">
            {state.destination} · {state.numDays} {state.numDays === 1 ? 'day' : 'days'} ·{' '}
            <span className="font-medium">{board?.name}</span>
          </p>
        </div>
        <div className="rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700">
          {board?.description}
        </div>
      </header>

      {state.boardType === 'HB' && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
          Half Board: choose <strong>either</strong> lunch <strong>or</strong> dinner per day — the
          other locks once you pick one. Clear a selection to switch.
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2 font-semibold">Day</th>
              <th className="px-3 py-2 font-semibold">Hotel</th>
              <th className="px-3 py-2 font-semibold">Lunch</th>
              <th className="px-3 py-2 font-semibold">Dinner</th>
              <th className="px-3 py-2 text-right font-semibold">Day Total</th>
            </tr>
          </thead>
          <tbody>
            {state.days.map((day, i) => (
              <DayRow key={i} index={i} day={day} />
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200">
              <td colSpan={4} className="px-3 py-3 text-right font-semibold text-slate-700">
                Running Total
              </td>
              <td className="px-3 py-3 text-right text-base font-bold text-brand-700">
                {formatCurrency(grandTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex justify-between">
        <button type="button" className="btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <button type="button" className="btn-primary" onClick={onNext}>
          Review Summary →
        </button>
      </div>
    </section>
  );
}
