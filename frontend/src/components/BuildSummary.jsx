import { money } from '../lib/format.js';

export default function BuildSummary({ total, checking }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Build total</p>
        {checking && <span className="text-xs font-medium text-blue-500 animate-pulse">Checking</span>}
      </div>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-neutral-900 transition-all duration-300">
        {money.format(total)}
      </p>
      <p className="mt-1 text-xs text-neutral-400">Reference prices only; live prices come later.</p>
    </div>
  );
}
