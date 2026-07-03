export interface Country {
  id: number;
  name: string;
}

export interface Hotel {
  id: number;
  name: string;
  price: number;
}

export type BoardCode = 'FB' | 'HB' | 'NB';

export interface BoardType {
  code: BoardCode;
  name: string;
  description: string;
}

export interface Meal {
  id: number;
  name: string;
  price: number;
}

export type CountryName = 'Turkey' | 'UAE' | 'Italy';

export interface CountryMeals {
  lunch: Meal[];
  dinner: Meal[];
}

export interface DaySelection {
  hotelId: number | null;
  lunchId: number | null;
  dinnerId: number | null;
}

export interface BookingState {
  citizenship: string;
  startDate: string;
  numDays: number;
  destination: string;
  boardType: BoardCode | '';
  days: DaySelection[];
}
