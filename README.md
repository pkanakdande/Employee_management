# PeopleDesk — Employee Management

A responsive full-stack employee directory built with React, TypeScript, Vite, SCSS, Express, MySQL, Highcharts, and Vitest.

## Features

- Employee list and dashboard with department and workforce-status charts.
- Create, edit, and delete employees with server-side validation and delete confirmation.
- Search by employee ID or name; filter by department and active status.
- Sort table columns and navigate results with pagination.
- MySQL-backed REST API and accessible responsive layouts.
- Unit tests for filtering, sorting, and workforce summaries.

## Requirements

- Node.js 20.19+ (or 22.12+) and npm.
- MySQL 8+.

## Setup

1. Install packages with `npm install`.
2. Create the database/table by running `database/schema.sql` in MySQL. This script also inserts five sample employees for the dashboard preview; remove those insert statements if you prefer an empty database.
3. Copy `.env.example` to `.env` and set the MySQL host, port, username, password, and database. Do not commit `.env`.
4. Start the API and frontend together with `npm run dev`.
5. Open the Vite URL printed in the terminal (normally `http://localhost:5173`). The API listens on port 3001 and Vite proxies `/api` requests to it.

`npm run dev:all` is also available as an alias for `npm run dev`.

## Commands

- `npm run dev` — start API and Vite concurrently.
- `npm run build` — type-check and create the production frontend build in `dist/`.
- `npm run lint` — run ESLint.
- `npm test` — run Vitest once.
- `npm run test:watch` — run Vitest in watch mode.

## API endpoints

- `GET /api/health`
- `GET /api/employees` (optional `search`, `department`, and `active` query parameters)
- `GET /api/employees/:id`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`

The employee ID is auto-incremented by MySQL. Salary values use USD formatting in the demo UI; change the UI currency formatter if your organization uses another currency.
