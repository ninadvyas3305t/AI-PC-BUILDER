export default function PerformancePanel({ performance }) {
  if (!performance) return null;

  return (
    <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Performance estimate</p>
      <p className="mt-1 font-semibold text-blue-700">
        {performance.label} · best suited for {performance.resolution}
      </p>
      <p className="mt-2 text-sm text-neutral-600">{performance.detail}</p>
      {performance.bottleneck && (
        <p className="mt-3 text-sm text-amber-700">
          <strong>Note:</strong> your {performance.bottleneck === 'cpu' ? 'CPU' : 'GPU'} is the limiting factor here —
          upgrading the {performance.bottleneck === 'cpu' ? 'GPU' : 'CPU'} alone won't fully use its potential.
        </p>
      )}
      <p className="mt-3 text-xs text-neutral-400">
        Based on each part's real-world class, not per-game benchmarks — treat this as a general guide.
      </p>
    </div>
  );
}
