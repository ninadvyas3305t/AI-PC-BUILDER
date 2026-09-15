export function checkCompatibility(parts) {
  const issues = [];
  const { cpu, motherboard, ram, gpu, storage, psu, case: pcCase } = parts;

  if (cpu && motherboard && cpu.specs.socket !== motherboard.specs.socket) {
    issues.push({
      rule: 'CPU ↔ Motherboard',
      categories: ['cpu', 'motherboard'],
      message: `${cpu.name} requires ${cpu.specs.socket}; ${motherboard.name} supports ${motherboard.specs.socket}.`,
    });
  }
  if (ram && motherboard && ram.specs.memory_type !== motherboard.specs.memory_type) {
    issues.push({
      rule: 'RAM ↔ Motherboard',
      categories: ['ram', 'motherboard'],
      message: `${ram.name} is ${ram.specs.memory_type}; ${motherboard.name} supports ${motherboard.specs.memory_type}.`,
    });
  }
  if (gpu && pcCase && gpu.specs.length_mm > pcCase.specs.max_gpu_length_mm) {
    issues.push({
      rule: 'GPU ↔ Case',
      categories: ['gpu', 'case'],
      message: `${gpu.name} is ${gpu.specs.length_mm} mm; ${pcCase.name} allows up to ${pcCase.specs.max_gpu_length_mm} mm.`,
    });
  }
  if (motherboard && pcCase && !pcCase.specs.supported_form_factors.includes(motherboard.specs.form_factor)) {
    issues.push({
      rule: 'Motherboard ↔ Case',
      categories: ['motherboard', 'case'],
      message: `${pcCase.name} does not support ${motherboard.specs.form_factor} motherboards.`,
    });
  }

  const estimatedWatts =
    65 +
    (cpu?.specs.tdp_watts ?? 0) +
    (gpu?.specs.tdp_watts ?? 0) +
    (ram?.specs.power_watts ?? 0) +
    (storage?.specs.power_watts ?? 0);
  const recommendedWatts = Math.ceil(estimatedWatts * 1.25);

  if (psu && psu.specs.wattage < recommendedWatts) {
    issues.push({
      rule: 'PSU capacity',
      categories: ['psu'],
      message: `${psu.name} supplies ${psu.specs.wattage}W; this build needs at least ${recommendedWatts}W with headroom.`,
    });
  }

  return { compatible: issues.length === 0, issues, estimatedWatts, recommendedWatts };
}
