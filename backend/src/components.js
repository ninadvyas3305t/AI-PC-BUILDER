import { pool } from './db.js';

const specTables = {
  cpu: 'cpus', motherboard: 'motherboards', ram: 'ram_specs', gpu: 'gpus',
  storage: 'storage_specs', psu: 'psus', case: 'cases',
};

export async function listComponents(category) {
  const table = specTables[category];
  if (!table) return null;
  const { rows } = await pool.query(
    `SELECT p.id, p.name, p.brand, p.category, p.model, p.price_inr, to_jsonb(s) - 'product_id' AS specs
     FROM products p JOIN ${table} s ON s.product_id = p.id
     WHERE p.category = $1 ORDER BY p.price_inr ASC`, [category],
  );
  return rows;
}

export async function getBuildComponents(ids) {
  const entries = Object.entries(ids).filter(([, id]) => Number.isInteger(id));
  const selected = {};
  for (const [category, id] of entries) {
    const components = await listComponents(category);
    selected[category] = components?.find((component) => component.id === id) ?? null;
  }
  return selected;
}
