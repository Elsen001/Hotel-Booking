import type { BoardCode, DaySelection, Meal } from '../types';
import { hotels, meals } from '../data';

export function findHotel(destination: string, hotelId: number | null) {
  if (hotelId == null) return undefined;
  return (hotels[destination] ?? []).find((h) => h.id === hotelId);
}

export function findMeal(
  destination: string,
  type: 'lunch' | 'dinner',
  mealId: number | null
): Meal | undefined {
  if (mealId == null) return undefined;
  return (meals[destination]?.[type] ?? []).find((m) => m.id === mealId);
}

export function canSelectMeal(
  board: BoardCode | '',
  type: 'lunch' | 'dinner',
  day: DaySelection
): boolean {
  switch (board) {
    case 'FB':
      return true;
    case 'HB': {
      const other = type === 'lunch' ? day.dinnerId : day.lunchId;
      return other == null;
    }
    case 'NB':
    default:
      return false;
  }
}

export interface DayCost {
  hotel: number;
  lunch: number;
  dinner: number;
  total: number;
}

export function computeDayCost(destination: string, day: DaySelection): DayCost {
  const hotel = findHotel(destination, day.hotelId)?.price ?? 0;
  const lunch = findMeal(destination, 'lunch', day.lunchId)?.price ?? 0;
  const dinner = findMeal(destination, 'dinner', day.dinnerId)?.price ?? 0;
  return { hotel, lunch, dinner, total: hotel + lunch + dinner };
}

export function computeGrandTotal(destination: string, days: DaySelection[]): number {
  return days.reduce((sum, day) => sum + computeDayCost(destination, day).total, 0);
}

export const formatCurrency = (value: number): string =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + 'T00:00:00');
  if (isNaN(d.getTime())) return '';
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatDate(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  if (isNaN(d.getTime())) return isoDate || '—';
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
