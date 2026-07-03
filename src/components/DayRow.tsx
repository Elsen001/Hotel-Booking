import { useBooking } from '../context/BookingContext';
import { hotels, meals } from '../data';
import type { DaySelection } from '../types';
import { canSelectMeal, computeDayCost, formatCurrency, formatDate, addDays } from '../utils/pricing';
import Select from './Select';

interface DayRowProps {
  index: number;
  day: DaySelection;
}

/** A single row in the daily-configuration table (Step 2). */
export default function DayRow({ index, day }: DayRowProps) {
  const { state, dispatch } = useBooking();
  const { destination, boardType, startDate } = state;

  const hotelOptions = (hotels[destination] ?? []).map((h) => ({
    value: h.id,
    label: `${h.name} — ${formatCurrency(h.price)}`,
  }));
  const lunchOptions = (meals[destination]?.lunch ?? []).map((m) => ({
    value: m.id,
    label: `${m.name} — ${formatCurrency(m.price)}`,
  }));
  const dinnerOptions = (meals[destination]?.dinner ?? []).map((m) => ({
    value: m.id,
    label: `${m.name} — ${formatCurrency(m.price)}`,
  }));

  const lunchEnabled = canSelectMeal(boardType, 'lunch', day);
  const dinnerEnabled = canSelectMeal(boardType, 'dinner', day);
  const cost = computeDayCost(destination, day);

  const setDay = (patch: Partial<DaySelection>) =>
    dispatch({ type: 'SET_DAY', index, patch });

  const toId = (v: string) => (v === '' ? null : Number(v));

  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
      <td className="whitespace-nowrap px-3 py-3 align-top">
        <div className="font-semibold text-slate-900">Day {index + 1}</div>
        {startDate && <div className="text-xs text-slate-500">{formatDate(addDays(startDate, index))}</div>}
      </td>

      <td className="min-w-[200px] px-3 py-3 align-top">
        <Select
          aria-label={`Hotel for day ${index + 1}`}
          value={day.hotelId ?? ''}
          onChange={(v) => setDay({ hotelId: toId(v) })}
          options={hotelOptions}
          placeholder="Select hotel"
        />
      </td>

      <td className="min-w-[190px] px-3 py-3 align-top">
        <Select
          aria-label={`Lunch for day ${index + 1}`}
          value={day.lunchId ?? ''}
          onChange={(v) => setDay({ lunchId: toId(v) })}
          options={lunchOptions}
          placeholder={boardType === 'NB' ? 'Not available' : 'No lunch'}
          disabled={!lunchEnabled && day.lunchId == null}
        />
      </td>

      <td className="min-w-[190px] px-3 py-3 align-top">
        <Select
          aria-label={`Dinner for day ${index + 1}`}
          value={day.dinnerId ?? ''}
          onChange={(v) => setDay({ dinnerId: toId(v) })}
          options={dinnerOptions}
          placeholder={boardType === 'NB' ? 'Not available' : 'No dinner'}
          disabled={!dinnerEnabled && day.dinnerId == null}
        />
      </td>

      <td className="whitespace-nowrap px-3 py-3 text-right align-top font-semibold text-slate-900">
        {formatCurrency(cost.total)}
      </td>
    </tr>
  );
}
