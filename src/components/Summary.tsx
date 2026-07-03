import { useBooking } from '../context/BookingContext';
import { boardTypes } from '../data';
import {
  computeDayCost,
  computeGrandTotal,
  findHotel,
  findMeal,
  formatCurrency,
  formatDate,
  addDays,
} from '../utils/pricing';

interface SummaryProps {
  onBack: () => void;
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4 py-1.5">
    <dt className="text-slate-500">{label}</dt>
    <dd className="text-right font-medium text-slate-900">{value}</dd>
  </div>
);

export default function Summary({ onBack }: SummaryProps) {
  const { state } = useBooking();
  const { destination, days, startDate, numDays } = state;
  const board = boardTypes.find((b) => b.code === state.boardType);
  const grandTotal = computeGrandTotal(destination, days);
  const endDate = startDate ? addDays(startDate, Math.max(0, numDays - 1)) : '';

  return (
    <section className="space-y-6 animate-fade-in">
      <div className="card">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Configuration Summary</h2>
        <dl className="text-sm">
          <Row label="Citizenship" value={state.citizenship || '—'} />
          <Row
            label="Travel Dates"
            value={
              startDate
                ? `${formatDate(startDate)} → ${formatDate(endDate)} (${numDays} ${
                    numDays === 1 ? 'day' : 'days'
                  })`
                : '—'
            }
          />
          <Row label="Destination" value={destination || '—'} />
          <Row label="Board Type" value={board ? `${board.name} (${board.code})` : '—'} />
        </dl>
      </div>

      <div className="card">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Daily Selections</h2>
        <div className="space-y-3">
          {days.map((day, i) => {
            const hotel = findHotel(destination, day.hotelId);
            const lunch = findMeal(destination, 'lunch', day.lunchId);
            const dinner = findMeal(destination, 'dinner', day.dinnerId);
            const cost = computeDayCost(destination, day);
            return (
              <div key={i} className="rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">
                    Day {i + 1}
                    {startDate && (
                      <span className="ml-2 text-xs font-normal text-slate-500">
                        {formatDate(addDays(startDate, i))}
                      </span>
                    )}
                  </h3>
                  <span className="font-semibold text-brand-700">{formatCurrency(cost.total)}</span>
                </div>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li className="flex justify-between">
                    <span>🏨 {hotel ? hotel.name : 'No hotel selected'}</span>
                    <span>{formatCurrency(cost.hotel)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>🍽️ Lunch: {lunch ? lunch.name : '—'}</span>
                    <span>{formatCurrency(cost.lunch)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>🌙 Dinner: {dinner ? dinner.name : '—'}</span>
                    <span>{formatCurrency(cost.dinner)}</span>
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card bg-brand-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-100">Grand Total</p>
            <p className="text-xs text-brand-200">
              Σ (hotel + selected meals) across {numDays} {numDays === 1 ? 'day' : 'days'}
            </p>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(grandTotal)}</p>
        </div>
      </div>

      <div className="no-print flex flex-wrap justify-between gap-3">
        <button type="button" className="btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <button type="button" className="btn-primary" onClick={() => window.print()}>
          🖨️ Print / Save as PDF
        </button>
      </div>
    </section>
  );
}
