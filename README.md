# Buildwise

A PC part builder with a real compatibility engine — not just a shopping list. Pick components and get live feedback on whether they actually work together: socket matches, memory type, GPU clearance, motherboard form factor, and PSU headroom.

> **Live demo:** _add your deployed link here once hosted_
> **Screenshot / GIF:** _add a short clip of the live compatibility check updating as parts are picked_

---

## Why this exists

Most "PC builder" projects are a form that displays a price total. Buildwise instead treats compatibility as a small constraint-satisfaction problem: each pair of components (CPU↔motherboard, RAM↔motherboard, GPU↔case, motherboard↔case, PSU↔system draw) is checked against real spec data, and the UI updates live — no submit button — as soon as two or more parts are selected.

The goal was to practice designing a normalized relational schema and a deterministic rules engine, rather than hardcoding logic against a flat product list.

## Features

- **Live compatibility checking** — debounced re-check on every selection change, not a manual "check" button
- **Per-part visual feedback** — mismatched components are highlighted directly on their card, not just in a message below
- **Estimated power draw** — sums component TDPs and applies a 25% headroom recommendation for PSU wattage
- **Normalized component catalogue** — shared `products` table plus category-specific spec tables (`cpus`, `gpus`, `motherboards`, etc.)

## Tech stack

| Layer      | Choice                          |
| ---------- | -------------------------------- |
| Frontend   | React + Vite, Tailwind CSS        |
| Backend    | Node.js + Express                 |
| Database   | PostgreSQL                        |
| Icons      | lucide-react                      |

## Architecture

```
React frontend (Vite)
        │
        ▼
Node/Express API
        │
   ┌────┴────┐
   ▼         ▼
Components   Compatibility
  route         engine
   │             │
   └──────┬──────┘
          ▼
     PostgreSQL
```

The frontend never encodes compatibility logic itself — it sends the selected component IDs to the API and renders whatever the compatibility engine returns. That separation means the rules can grow (more constraints, smarter scoring) without touching the UI.

## Database design

Rather than one wide `products` table with a column for every possible spec, the schema separates shared metadata from category-specific specs:

```
products              cpus                  gpus
------------------    ------------------    ------------------
id                     product_id (FK)       product_id (FK)
name                   socket                length_mm
brand                  memory_type           tdp_watts
category               tdp_watts             vram_gb
model
price_inr
```

Each component category (`cpus`, `motherboards`, `ram_specs`, `gpus`, `storage_specs`, `psus`, `cases`) has its own table keyed on `product_id`, joined back to `products` for shared fields like name, brand, and price. This keeps the schema normalized and makes it straightforward to add a new component category without touching existing tables.

## Compatibility engine

Implemented as a pure function (`backend/src/compatibility.js`) that takes the selected parts and returns structured issues:

```js
{
  compatible: false,
  issues: [
    {
      rule: "CPU ↔ Motherboard",
      categories: ["cpu", "motherboard"],
      message: "Ryzen 7 7800X3D requires AM5; B550M PRO-VDH supports AM4."
    }
  ],
  estimatedWatts: 250,
  recommendedWatts: 313
}
```

Each issue is tagged with the categories involved, which the frontend uses to highlight the exact mismatched cards rather than only surfacing a generic error message.

Current rules checked:
- CPU socket ↔ motherboard socket
- RAM memory type ↔ motherboard memory type
- GPU length ↔ case max GPU length
- Motherboard form factor ↔ case supported form factors
- Estimated system draw ↔ PSU wattage (with 25% headroom)

## Getting started

### Prerequisites
- Node.js 18+
- PostgreSQL running locally (or a connection string to a hosted instance)

### 1. Set up the database
```bash
createdb buildwise
psql -d buildwise -f database/init.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env   # set your PostgreSQL connection details
npm install
npm run dev             # starts the API on http://localhost:3001
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev             # starts Vite on http://localhost:5173
```

## API reference

| Method | Endpoint                              | Description                                  |
| ------ | -------------------------------------- | --------------------------------------------- |
| GET    | `/api/health`                          | Health check                                  |
| GET    | `/api/components/:category`            | List all components in a category             |
| POST   | `/api/builds/check-compatibility`      | Given `{ components: { cpu: id, ... } }`, returns compatibility results |

## Roadmap

This is deliberately scoped as MVP 1 of a larger plan. Not yet built:

- Price aggregation across retailers
- Benchmark-backed performance estimation (not invented FPS numbers)
- Budget-constrained build optimization
- Natural-language build requests ("₹1 lakh, mostly competitive FPS gaming") translated into constraints for the optimizer, with an LLM as the explanation layer rather than the source of the recommendation

## License

MIT
