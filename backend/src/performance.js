// Qualitative performance tiers based on each part's real-world market
// position (set in the database), not per-game benchmark numbers we can't
// back up. The overall tier is the weaker of the CPU and GPU tiers, since
// that's typically what a system is bottlenecked by.

const TIERS = {
  1: {
    label: 'Entry',
    resolution: '1080p',
    detail: 'Smooth 1080p on medium–high settings for most titles. Not built for demanding AAA games at max settings.',
  },
  2: {
    label: 'Mid-range',
    resolution: '1080p / 1440p',
    detail: 'Comfortable 1080p high settings, and playable 1440p on most titles with some settings tuned down.',
  },
  3: {
    label: 'High-end',
    resolution: '1440p',
    detail: 'Strong 1440p performance at high–ultra settings, with light 4K viable in less demanding titles.',
  },
  4: {
    label: 'Enthusiast',
    resolution: '4K',
    detail: 'Built for 4K gaming and demanding creative workloads like video editing and 3D rendering.',
  },
};

export function estimatePerformance(parts) {
  const { cpu, gpu } = parts;
  if (!cpu || !gpu) return null;

  const cpuTier = cpu.specs.performance_tier;
  const gpuTier = gpu.specs.performance_tier;
  const overallTier = Math.min(cpuTier, gpuTier);
  const bottleneck = cpuTier < gpuTier ? 'cpu' : gpuTier < cpuTier ? 'gpu' : null;

  return {
    tier: overallTier,
    label: TIERS[overallTier].label,
    resolution: TIERS[overallTier].resolution,
    detail: TIERS[overallTier].detail,
    bottleneck,
  };
}
