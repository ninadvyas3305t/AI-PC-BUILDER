-- Run this AFTER init.sql and seed_expansion.sql:
--   psql -d ai_pc_builder -f database/add_performance_tiers.sql
--
-- Adds a performance_tier (1=entry, 2=mid-range, 3=high-end, 4=enthusiast) to
-- CPUs and GPUs, based on each part's real-world market position. This is a
-- qualitative classification, not a benchmark-derived number — deliberately
-- avoids inventing specific FPS figures we can't back up with real data.

ALTER TABLE cpus ADD COLUMN IF NOT EXISTS performance_tier SMALLINT NOT NULL DEFAULT 2
  CHECK (performance_tier BETWEEN 1 AND 4);
ALTER TABLE gpus ADD COLUMN IF NOT EXISTS performance_tier SMALLINT NOT NULL DEFAULT 2
  CHECK (performance_tier BETWEEN 1 AND 4);

-- CPUs
UPDATE cpus SET performance_tier = 3 WHERE product_id = 1;  -- Ryzen 5 7600
UPDATE cpus SET performance_tier = 4 WHERE product_id = 2;  -- Ryzen 7 7800X3D
UPDATE cpus SET performance_tier = 2 WHERE product_id = 14; -- Core i5-13400F
UPDATE cpus SET performance_tier = 3 WHERE product_id = 15; -- Core i5-14600K
UPDATE cpus SET performance_tier = 4 WHERE product_id = 16; -- Ryzen 9 7900X
UPDATE cpus SET performance_tier = 2 WHERE product_id = 17; -- Ryzen 5 5600

-- GPUs
UPDATE gpus SET performance_tier = 2 WHERE product_id = 7;  -- RTX 4060
UPDATE gpus SET performance_tier = 3 WHERE product_id = 8;  -- RX 7700 XT
UPDATE gpus SET performance_tier = 3 WHERE product_id = 25; -- RTX 4070
UPDATE gpus SET performance_tier = 2 WHERE product_id = 26; -- RTX 4060 Ti
UPDATE gpus SET performance_tier = 1 WHERE product_id = 27; -- RX 6600
