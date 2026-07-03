import { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { countries, boardTypes } from '../data';
import type { BoardCode } from '../types';
import Select from './Select';

interface ConfigFormProps {
  onSubmit: () => void;
}

interface Errors {
  citizenship?: string;
  startDate?: string;
  numDays?: string;
  destination?: string;
  boardType?: string;
}

/** Step 1 — initial trip configuration form with validation. */
export default function ConfigForm({ onSubmit }: ConfigFormProps) {
  const { state, dispatch } = useBooking();
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): boolean => {
    const e: Errors = {};
    if (!state.citizenship) e.citizenship = 'Please select your citizenship.';
    if (!state.startDate) e.startDate = 'Please choose a start date.';
    if (!state.numDays || state.numDays < 1) e.numDays = 'Trip must be at least 1 day.';
    if (!state.destination) e.destination = 'Please select a destination.';
    if (!state.boardType) e.boardType = 'Please choose a board type.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    dispatch({ type: 'GENERATE_DAYS' });
    onSubmit();
  };

  const countryOptions = countries.map((c) => ({ value: c.name, label: c.name }));

  return (
    <form onSubmit={handleSubmit} className="card animate-fade-in space-y-6" noValidate>
      <header>
        <h2 className="text-lg font-semibold text-slate-900">Trip Configuration</h2>
        <p className="text-sm text-slate-500">Tell us the basics to plan your stay.</p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Citizenship */}
        <div>
          <label htmlFor="citizenship" className="field-label">
            Citizenship
          </label>
          <Select
            id="citizenship"
            value={state.citizenship}
            onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'citizenship', value: v })}
            options={countryOptions}
            placeholder="Select country of origin"
          />
          {errors.citizenship && <p className="mt-1 text-xs text-red-600">{errors.citizenship}</p>}
        </div>

        {/* Destination */}
        <div>
          <label htmlFor="destination" className="field-label">
            Destination Country
          </label>
          <Select
            id="destination"
            value={state.destination}
            onChange={(v) => dispatch({ type: 'SET_DESTINATION', value: v })}
            options={countryOptions}
            placeholder="Select destination"
          />
          {errors.destination && <p className="mt-1 text-xs text-red-600">{errors.destination}</p>}
        </div>

        {/* Start date */}
        <div>
          <label htmlFor="startDate" className="field-label">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            className="field-input"
            value={state.startDate}
            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'startDate', value: e.target.value })}
          />
          {errors.startDate && <p className="mt-1 text-xs text-red-600">{errors.startDate}</p>}
        </div>

        {/* Number of days */}
        <div>
          <label htmlFor="numDays" className="field-label">
            Number of Days
          </label>
          <input
            id="numDays"
            type="number"
            min={1}
            max={30}
            className="field-input"
            value={state.numDays}
            onChange={(e) => dispatch({ type: 'SET_NUM_DAYS', value: parseInt(e.target.value, 10) })}
          />
          {errors.numDays && <p className="mt-1 text-xs text-red-600">{errors.numDays}</p>}
        </div>
      </div>

      {/* Board type */}
      <fieldset>
        <legend className="field-label">Board Type</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {boardTypes.map((b) => {
            const active = state.boardType === b.code;
            return (
              <label
                key={b.code}
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  active
                    ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="boardType"
                  className="sr-only"
                  value={b.code}
                  checked={active}
                  onChange={() => dispatch({ type: 'SET_BOARD', value: b.code as BoardCode })}
                />
                <span className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{b.name}</span>
                  <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
                    {b.code}
                  </span>
                </span>
                <span className="mt-1 block text-xs text-slate-500">{b.description}</span>
              </label>
            );
          })}
        </div>
        {errors.boardType && <p className="mt-1 text-xs text-red-600">{errors.boardType}</p>}
      </fieldset>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary">
          Continue to Daily Setup →
        </button>
      </div>
    </form>
  );
}
