import { useEffect, useMemo, useState } from 'react';
import { Cpu, CircuitBoard, MemoryStick, Monitor, HardDrive, Zap, Box } from 'lucide-react';
import ComponentPicker from './components/ComponentPicker.jsx';
import BuildSummary from './components/BuildSummary.jsx';
import CompatibilityPanel from './components/CompatibilityPanel.jsx';
import BuildScene from './components/BuildScene.jsx';
import { fetchComponents, checkCompatibility as checkCompatibilityRequest } from './lib/api.js';

const categories = [
  ['cpu', 'CPU', Cpu],
  ['motherboard', 'Motherboard', CircuitBoard],
  ['ram', 'Memory', MemoryStick],
  ['gpu', 'Graphics card', Monitor],
  ['storage', 'Storage', HardDrive],
  ['psu', 'Power supply', Zap],
  ['case', 'Case', Box],
];

export default function App() {
  const [catalogue, setCatalogue] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({});
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all(categories.map(async ([key]) => [key, await fetchComponents(key)]))
      .then((entries) => setCatalogue(Object.fromEntries(entries)))
      .catch(() => setError('Could not load components. Start the API and ensure PostgreSQL is running.'))
      .finally(() => setLoading(false));
  }, []);

  const total = useMemo(
    () =>
      Object.entries(selected).reduce(
        (sum, [category, id]) => sum + (catalogue[category]?.find((item) => item.id === Number(id))?.price_inr ?? 0),
        0
      ),
    [catalogue, selected]
  );

  const selectedCount = Object.values(selected).filter(Boolean).length;

  useEffect(() => {
    if (selectedCount < 2) {
      setResult(null);
      return undefined;
    }

    const timeout = setTimeout(async () => {
      setChecking(true);
      setError('');
      try {
        const components = Object.fromEntries(
          Object.entries(selected)
            .filter(([, value]) => value)
            .map(([key, value]) => [key, Number(value)])
        );
        setResult(await checkCompatibilityRequest(components));
      } catch {
        setError('Compatibility check failed. Confirm that the API and database are running.');
      } finally {
        setChecking(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [selected, selectedCount]);

  function updateSelection(key, value) {
    setSelected((prev) => {
      if (!value) {
        const { [key]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
  }

  const issueCategories = new Set(result?.issues.flatMap((issue) => issue.categories ?? []) ?? []);

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-neutral-50/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-xl font-semibold tracking-tight">
            Build<span className="text-blue-500">wise</span>
          </span>
          <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            MVP 1 · Component Builder
          </span>
        </div>
      </header>

      <section className="relative mx-auto max-w-6xl px-6 py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"
        />

        <div className="relative">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            Live compatibility checking
          </span>
          <p className="mb-3 text-sm font-medium text-blue-500">Start with a compatible build</p>
          <h1 className="max-w-2xl text-5xl font-semibold tracking-tight sm:text-6xl">
            Build your PC with confidence.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-neutral-500">
            Pick your parts and watch compatibility update live — no button required.
          </p>
        </div>

        {error && (
          <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>
        )}

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4 sm:grid-cols-2">
            {loading
              ? categories.map(([key]) => (
                  <div
                    key={key}
                    className="h-[132px] animate-pulse rounded-2xl border border-neutral-200 bg-white"
                  />
                ))
              : categories.map(([key, label, Icon], i) => (
                  <ComponentPicker
                    key={key}
                    icon={Icon}
                    label={label}
                    index={String(i + 1).padStart(2, '0')}
                    options={catalogue[key]}
                    value={selected[key]}
                    onChange={(value) => updateSelection(key, value)}
                    hasIssue={issueCategories.has(key)}
                  />
                ))}
          </div>

          <aside className="h-fit rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <div className="mb-6 h-72 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
              <BuildScene selected={selected} />
            </div>
            <BuildSummary total={total} checking={checking} />
            <CompatibilityPanel result={result} checking={checking} />
            {selectedCount > 0 && selectedCount < 2 && (
              <p className="mt-4 text-xs text-neutral-400">Pick at least two parts to see compatibility.</p>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
