import { useEffect, useState } from 'react';
import { useBooking } from './context/BookingContext';
import ConfigForm from './components/ConfigForm';
import DailyConfig from './components/DailyConfig';
import Summary from './components/Summary';
import Stepper from './components/Stepper';

export default function App() {
  const { save, load, hasSaved } = useBooking();
  const [step, setStep] = useState(0);
  const [booting, setBooting] = useState(true);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleSave = () => {
    save();
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  };

  const handleLoad = () => {
    if (load()) setStep(1);
  };

  if (booting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          <p className="text-sm font-medium text-slate-500">Loading booking engine…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="no-print border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏨</span>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Hotel Booking System</h1>
              <p className="text-xs text-slate-500">Plan · Configure · Price</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="btn-secondary" onClick={handleSave}>
              {savedFlash ? '✓ Saved' : '💾 Save'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleLoad}
              disabled={!hasSaved()}
            >
              ↺ Load
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Stepper current={step} />

        {step === 0 && <ConfigForm onSubmit={() => setStep(1)} />}
        {step === 1 && <DailyConfig onBack={() => setStep(0)} onNext={() => setStep(2)} />}
        {step === 2 && <Summary onBack={() => setStep(1)} />}
      </main>

      <footer className="no-print mx-auto max-w-4xl px-4 pb-8 text-center text-xs text-slate-400">
        Built with React + TypeScript + Tailwind CSS · Context API state management
      </footer>
    </div>
  );
}
