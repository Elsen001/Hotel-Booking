import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { BoardCode, BookingState, DaySelection } from '../types';
import { hotels } from '../data';

const STORAGE_KEY = 'hotel-booking-config';

const emptyDay = (): DaySelection => ({ hotelId: null, lunchId: null, dinnerId: null });

export const initialState: BookingState = {
  citizenship: '',
  startDate: '',
  numDays: 1,
  destination: '',
  boardType: '',
  days: [],
};

type Action =
  | { type: 'SET_FIELD'; field: 'citizenship' | 'startDate' | 'destination'; value: string }
  | { type: 'SET_NUM_DAYS'; value: number }
  | { type: 'SET_BOARD'; value: BoardCode }
  | { type: 'SET_DESTINATION'; value: string }
  | { type: 'GENERATE_DAYS' }
  | { type: 'SET_DAY'; index: number; patch: Partial<DaySelection> }
  | { type: 'RESET' }
  | { type: 'LOAD'; state: BookingState };

/**
 * Resize the days array to `count`, preserving existing selections and
 * padding with empty days when the trip is extended.
 */
function resizeDays(days: DaySelection[], count: number): DaySelection[] {
  const next = days.slice(0, count);
  while (next.length < count) next.push(emptyDay());
  return next;
}

function reducer(state: BookingState, action: Action): BookingState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };

    case 'SET_NUM_DAYS': {
      const numDays = Math.max(1, Math.min(30, action.value || 1));
      return { ...state, numDays, days: resizeDays(state.days, numDays) };
    }

    case 'SET_BOARD': {
      // Clear meal selections that are no longer valid under the new board.
      const days = state.days.map((d) => {
        if (action.value === 'NB') return { ...d, lunchId: null, dinnerId: null };
        return d;
      });
      return { ...state, boardType: action.value, days };
    }

    case 'SET_DESTINATION': {
      // Destination change invalidates hotel & meal ids from the old country.
      const days = state.days.map(() => emptyDay());
      return { ...state, destination: action.value, days };
    }

    case 'GENERATE_DAYS': {
      const days = resizeDays(state.days, state.numDays).map((d) => {
        // Default each day to the first available hotel for convenience.
        if (d.hotelId == null && state.destination) {
          const first = hotels[state.destination]?.[0];
          return { ...d, hotelId: first ? first.id : null };
        }
        return d;
      });
      return { ...state, days };
    }

    case 'SET_DAY': {
      const days = state.days.map((d, i) => (i === action.index ? { ...d, ...action.patch } : d));
      return { ...state, days };
    }

    case 'LOAD':
      return action.state;

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

interface BookingContextValue {
  state: BookingState;
  dispatch: React.Dispatch<Action>;
  save: () => void;
  load: () => boolean;
  hasSaved: () => boolean;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const save = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable — ignore */
    }
  }, [state]);

  const load = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      dispatch({ type: 'LOAD', state: JSON.parse(raw) as BookingState });
      return true;
    } catch {
      return false;
    }
  }, []);

  const hasSaved = useCallback(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) != null;
    } catch {
      return false;
    }
  }, []);

  return (
    <BookingContext.Provider value={{ state, dispatch, save, load, hasSaved }}>
      {children}
    </BookingContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within a BookingProvider');
  return ctx;
}
