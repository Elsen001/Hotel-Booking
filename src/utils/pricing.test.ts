import { describe, it, expect } from 'vitest';
import {
  canSelectMeal,
  computeDayCost,
  computeGrandTotal,
  findHotel,
  findMeal,
  addDays,
} from './pricing';
import type { DaySelection } from '../types';

const emptyDay: DaySelection = { hotelId: null, lunchId: null, dinnerId: null };

describe('lookups', () => {
  it('finds a hotel by id in a country', () => {
    expect(findHotel('Turkey', 101)?.name).toBe('Hilton Istanbul');
    expect(findHotel('Turkey', 999)).toBeUndefined();
    expect(findHotel('Turkey', null)).toBeUndefined();
  });

  it('finds meals by type and id', () => {
    expect(findMeal('UAE', 'dinner', 7)?.price).toBe(25);
    expect(findMeal('Italy', 'lunch', 13)?.name).toBe('Pizza Margherita');
    expect(findMeal('Italy', 'lunch', 7)).toBeUndefined();
  });
});

describe('canSelectMeal — board rules', () => {
  it('FB allows both lunch and dinner', () => {
    expect(canSelectMeal('FB', 'lunch', emptyDay)).toBe(true);
    expect(canSelectMeal('FB', 'dinner', emptyDay)).toBe(true);
  });

  it('NB disables all meals', () => {
    expect(canSelectMeal('NB', 'lunch', emptyDay)).toBe(false);
    expect(canSelectMeal('NB', 'dinner', emptyDay)).toBe(false);
  });

  it('HB is mutually exclusive', () => {
    expect(canSelectMeal('HB', 'lunch', emptyDay)).toBe(true);
    expect(canSelectMeal('HB', 'dinner', emptyDay)).toBe(true);
    const withLunch: DaySelection = { ...emptyDay, lunchId: 4 };
    expect(canSelectMeal('HB', 'dinner', withLunch)).toBe(false);
    expect(canSelectMeal('HB', 'lunch', withLunch)).toBe(true);
    const withDinner: DaySelection = { ...emptyDay, dinnerId: 1 };
    expect(canSelectMeal('HB', 'lunch', withDinner)).toBe(false);
  });
});

describe('cost calculation', () => {
  it('sums hotel + selected meals for a day', () => {
    const day: DaySelection = { hotelId: 101, lunchId: 4, dinnerId: 1 };
    const cost = computeDayCost('Turkey', day);
    expect(cost).toEqual({ hotel: 120, lunch: 10, dinner: 15, total: 145 });
  });

  it('treats unselected items as zero', () => {
    const day: DaySelection = { hotelId: 102, lunchId: null, dinnerId: null };
    expect(computeDayCost('Turkey', day).total).toBe(90);
  });

  it('computes a grand total across days', () => {
    const days: DaySelection[] = [
      { hotelId: 101, lunchId: 4, dinnerId: 1 },
      { hotelId: 102, lunchId: null, dinnerId: 2 },
    ];
    expect(computeGrandTotal('Turkey', days)).toBe(253);
  });
});

describe('addDays', () => {
  it('advances a calendar date', () => {
    expect(addDays('2026-07-03', 0)).toBe('2026-07-03');
    expect(addDays('2026-07-03', 2)).toBe('2026-07-05');
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
  });
});
