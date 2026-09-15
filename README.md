# AI PC Builder — MVP 1

The first working milestone: browse PC parts, assemble a build, and check its core compatibility rules.

## Stack

- React + Vite + Tailwind CSS
- Node.js + Express
- PostgreSQL

## Run locally

1. Copy `.env.example` to `backend/.env` and adjust its database connection if needed.
2. Create the database: `createdb ai_pc_builder`
3. From this folder run `psql -d ai_pc_builder -f database/init.sql`
4. Install packages: `npm install`
5. Start both apps: `npm run dev`

Open `http://localhost:5173`. The API health check is at `http://localhost:3001/api/health`.

## MVP rules

- CPU socket must match motherboard socket.
- RAM generation must match motherboard memory support.
- GPU length must fit the selected case.
- Estimated system wattage plus 25% headroom must not exceed PSU wattage.

Pricing, benchmarks, accounts, optimisation, and AI are deliberately deferred.
