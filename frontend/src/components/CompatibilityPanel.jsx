export default function CompatibilityPanel({ result, checking }) {
  if (checking && !result) {
    return (
      <div className="mt-6 animate-pulse rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
        <div className="h-4 w-2/3 rounded bg-neutral-200" />
        <div className="mt-3 h-3 w-1/2 rounded bg-neutral-200" />
      </div>
    );
  }

  if (!result) return null;

  return (
    <div
      className={`mt-6 rounded-2xl border p-4 transition-all duration-300 ${
        result.compatible ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Status</p>
      <p className={`mt-1 font-semibold ${result.compatible ? 'text-green-700' : 'text-red-700'}`}>
        {result.compatible
          ? '✓ Compatible build'
          : `${result.issues.length} compatibility issue${result.issues.length > 1 ? 's' : ''} found`}
      </p>
      <p className="mt-2 text-sm text-neutral-500">
        Estimated draw: {result.estimatedWatts}W · Recommended PSU: {result.recommendedWatts}W+
      </p>
      {result.issues.map((issue) => (
        <p key={issue.rule} className="mt-3 text-sm text-red-700">
          <strong>{issue.rule}:</strong> {issue.message}
        </p>
      ))}
    </div>
  );
}
