-- Run this AFTER init.sql, against your existing database, to add more components
-- without touching what's already there:
--   psql -d buildwise -f database/seed_expansion.sql

INSERT INTO products (id, name, brand, category, model, price_inr) VALUES
  -- CPUs
  (14, 'Core i5-13400F', 'Intel', 'cpu', 'i5-13400F', 19500),
  (15, 'Core i5-14600K', 'Intel', 'cpu', 'i5-14600K', 32990),
  (16, 'Ryzen 9 7900X', 'AMD', 'cpu', 'Ryzen 9 7900X', 38990),
  (17, 'Ryzen 5 5600', 'AMD', 'cpu', 'Ryzen 5 5600', 11990),

  -- Motherboards
  (18, 'Prime B760M-A', 'ASUS', 'motherboard', 'Prime B760M-A', 13990),
  (19, 'PRO Z790-P WiFi', 'MSI', 'motherboard', 'PRO Z790-P WiFi', 24990),
  (20, 'B650 AORUS Elite AX', 'Gigabyte', 'motherboard', 'B650 AORUS Elite AX', 19990),
  (21, 'A520M-HDV', 'ASRock', 'motherboard', 'A520M-HDV', 5990),

  -- RAM
  (22, 'Fury Beast 16GB DDR4', 'Kingston', 'ram', 'KF432C16BB1/16', 3490),
  (23, 'Trident Z5 32GB DDR5', 'G.Skill', 'ram', 'F5-6000J3038F16GX2-TZ5RK', 11990),
  (24, 'Vengeance LPX 16GB DDR4', 'Corsair', 'ram', 'CMK16GX4M2B3200C16', 3990),

  -- GPUs
  (25, 'Ventus 2X RTX 4070', 'MSI', 'gpu', 'Ventus 2X RTX 4070', 54990),
  (26, 'Eagle RTX 4060 Ti', 'Gigabyte', 'gpu', 'Eagle RTX 4060 Ti', 38990),
  (27, 'SWFT210 RX 6600', 'XFX', 'gpu', 'SWFT210 RX 6600', 19990),

  -- Storage
  (28, '980 500GB NVMe', 'Samsung', 'storage', '980 500GB', 3490),
  (29, 'WD Blue 2TB SSD', 'Western Digital', 'storage', 'WD Blue 2TB', 10990),
  (30, 'Barracuda 2TB HDD', 'Seagate', 'storage', 'Barracuda 2TB', 4490),

  -- PSUs
  (31, 'RM750e', 'Corsair', 'psu', 'RM750e', 7990),
  (32, 'PF500', 'Deepcool', 'psu', 'PF500', 3490),

  -- Cases
  (33, 'Lancool 205', 'Lian Li', 'case', 'Lancool 205', 6990),
  (34, '4000D Airflow', 'Corsair', 'case', '4000D Airflow', 8990);

INSERT INTO cpus (product_id, socket, memory_type, tdp_watts) VALUES
  (14, 'LGA1700', 'DDR4', 65),
  (15, 'LGA1700', 'DDR5', 125),
  (16, 'AM5', 'DDR5', 170),
  (17, 'AM4', 'DDR4', 65);

INSERT INTO motherboards (product_id, socket, memory_type, form_factor) VALUES
  (18, 'LGA1700', 'DDR4', 'Micro-ATX'),
  (19, 'LGA1700', 'DDR5', 'ATX'),
  (20, 'AM5', 'DDR5', 'ATX'),
  (21, 'AM4', 'DDR4', 'Micro-ATX');

INSERT INTO ram_specs (product_id, memory_type, capacity_gb, speed_mts, power_watts) VALUES
  (22, 'DDR4', 16, 3200, 8),
  (23, 'DDR5', 32, 6000, 10),
  (24, 'DDR4', 16, 3200, 8);

INSERT INTO gpus (product_id, length_mm, tdp_watts, vram_gb) VALUES
  (25, 267, 200, 12),
  (26, 260, 160, 8),
  (27, 220, 132, 8);

INSERT INTO storage_specs (product_id, capacity_gb, interface, power_watts) VALUES
  (28, 500, 'NVMe PCIe 3.0', 6),
  (29, 2000, 'SATA III', 4),
  (30, 2000, 'SATA III', 7);

INSERT INTO psus (product_id, wattage, efficiency_rating) VALUES
  (31, 750, '80+ Gold'),
  (32, 500, '80+ White');

INSERT INTO cases (product_id, max_gpu_length_mm, supported_form_factors) VALUES
  (33, 330, ARRAY['ATX', 'Micro-ATX', 'Mini-ITX']),
  (34, 360, ARRAY['ATX', 'Micro-ATX', 'Mini-ITX']);

SELECT setval('products_id_seq', 34, true);
