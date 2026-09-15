CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('cpu', 'motherboard', 'ram', 'gpu', 'storage', 'psu', 'case')),
  model TEXT NOT NULL,
  price_inr INTEGER NOT NULL CHECK (price_inr >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cpus (
  product_id INTEGER PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  socket TEXT NOT NULL,
  memory_type TEXT NOT NULL,
  tdp_watts INTEGER NOT NULL
);

CREATE TABLE motherboards (
  product_id INTEGER PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  socket TEXT NOT NULL,
  memory_type TEXT NOT NULL,
  form_factor TEXT NOT NULL
);

CREATE TABLE ram_specs (
  product_id INTEGER PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  memory_type TEXT NOT NULL,
  capacity_gb INTEGER NOT NULL,
  speed_mts INTEGER NOT NULL,
  power_watts INTEGER NOT NULL DEFAULT 10
);

CREATE TABLE gpus (
  product_id INTEGER PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  length_mm INTEGER NOT NULL,
  tdp_watts INTEGER NOT NULL,
  vram_gb INTEGER NOT NULL
);

CREATE TABLE storage_specs (
  product_id INTEGER PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  capacity_gb INTEGER NOT NULL,
  interface TEXT NOT NULL,
  power_watts INTEGER NOT NULL DEFAULT 8
);

CREATE TABLE psus (
  product_id INTEGER PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  wattage INTEGER NOT NULL,
  efficiency_rating TEXT NOT NULL
);

CREATE TABLE cases (
  product_id INTEGER PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  max_gpu_length_mm INTEGER NOT NULL,
  supported_form_factors TEXT[] NOT NULL
);

INSERT INTO products (id, name, brand, category, model, price_inr) VALUES
  (1, 'Ryzen 5 7600', 'AMD', 'cpu', 'Ryzen 5 7600', 18890),
  (2, 'Ryzen 7 7800X3D', 'AMD', 'cpu', 'Ryzen 7 7800X3D', 35990),
  (3, 'B650M Gaming WiFi', 'MSI', 'motherboard', 'B650M Gaming WiFi', 13990),
  (4, 'B550M PRO-VDH', 'MSI', 'motherboard', 'B550M PRO-VDH', 9490),
  (5, 'Vengeance 32GB DDR5', 'Corsair', 'ram', 'CMK32GX5M2B6000C36', 9490),
  (6, 'Vengeance 32GB DDR4', 'Corsair', 'ram', 'CMK32GX4M2E3200C16', 6490),
  (7, 'GeForce RTX 4060', 'ASUS', 'gpu', 'Dual RTX 4060', 29990),
  (8, 'Radeon RX 7700 XT', 'Sapphire', 'gpu', 'PULSE RX 7700 XT', 42990),
  (9, 'P3 Plus 1TB NVMe', 'Crucial', 'storage', 'P3 Plus 1TB', 5490),
  (10, 'MWE Bronze V2 650W', 'Cooler Master', 'psu', 'MPE-6501-ACAAB', 5690),
  (11, 'MWE Gold 750W', 'Cooler Master', 'psu', 'MPE-7501-AFAAG', 8990),
  (12, 'AIR 100 ARGB', 'Montech', 'case', 'AIR 100 ARGB', 5590),
  (13, 'NR200P', 'Cooler Master', 'case', 'NR200P', 8990);
SELECT setval('products_id_seq', 13, true);

INSERT INTO cpus VALUES (1, 'AM5', 'DDR5', 65), (2, 'AM5', 'DDR5', 120);
INSERT INTO motherboards VALUES (3, 'AM5', 'DDR5', 'Micro-ATX'), (4, 'AM4', 'DDR4', 'Micro-ATX');
INSERT INTO ram_specs VALUES (5, 'DDR5', 32, 6000, 10), (6, 'DDR4', 32, 3200, 10);
INSERT INTO gpus VALUES (7, 227, 115, 8), (8, 280, 245, 12);
INSERT INTO storage_specs VALUES (9, 1000, 'NVMe PCIe 4.0', 8);
INSERT INTO psus VALUES (10, 650, '80+ Bronze'), (11, 750, '80+ Gold');
INSERT INTO cases VALUES (12, 330, ARRAY['Micro-ATX', 'Mini-ITX']), (13, 330, ARRAY['Mini-ITX']);
