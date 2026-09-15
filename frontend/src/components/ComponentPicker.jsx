import { money } from '../lib/format.js';

export default function ComponentPicker({ icon: Icon, label, index, options, value, onChange, hasIssue }) {
  const stateClasses = hasIssue
    ? 'border-red-300 ring-1 ring-red-200'
    : value
    ? 'border-blue-300 ring-1 ring-blue-100'
    : 'border-neutral-200 hover:border-neutral-300';

  return (
    <label
      className={`block rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${stateClasses}`}
    >
      <span className="mb-3 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-neutral-400">
        <span className="flex items-center gap-2">
          <Icon
            className={`h-4 w-4 transition-colors ${
              hasIssue ? 'text-red-500' : value ? 'text-blue-500' : 'text-neutral-400'
            }`}
          />
          {label}
        </span>
        <span className="text-neutral-300">{index}</span>
      </span>
      <select
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-blue-400 focus:bg-white"
      >
        <option value="">Select a {label.toLowerCase()}</option>
        {options?.map((item) => (
          <option key={item.id} value={item.id}>
            {item.brand} {item.name} — {money.format(item.price_inr)}
          </option>
        ))}
      </select>
    </label>
  );
}
