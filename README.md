# LZFlow SaaS API

A multi-tenant inventory management REST API built with **Node.js**, **Express**, **TypeScript**, **TypeORM**, and **PostgreSQL**. Designed for SaaS environments where each organization operates in isolated data contexts.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Run the Server](#run-the-server)
- [API Documentation](#api-documentation)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Modules](#modules)
- [Authentication & Authorization](#authentication--authorization)

## Features

- **Multi-tenant architecture** — Data isolation by organization
- **Product management** — CRUD with SKU, categories, suppliers, stock control
- **Sales tracking** — Register sales with line items, automatic stock deduction
- **Category & Supplier management** — Organize and trace product sourcing
- **User management** — Role-based access within organizations
- **Reporting** — Dashboard metrics, sales trends, low-stock alerts
- **JWT authentication** — Access & refresh token flow
- **Input validation** — Request schemas via Zod
- **Swagger documentation** — Interactive API explorer at `/api/docs`
- **Security** — Helmet, CORS, bcrypt password hashing

## Tech Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| Runtime        | Node.js                                 |
| Language       | TypeScript                              |
| Framework      | Express                                 |
| ORM            | TypeORM                                 |
| Database       | PostgreSQL                              |
| Validation     | Zod                                     |
| Auth           | JWT (jsonwebtoken + bcrypt)             |
| Documentation  | Swagger (swagger-jsdoc + swagger-ui)    |
| Testing        | Jest + Supertest                        |
| Lint/Format    | ESLint + Prettier                       |

## Architecture

```
src/
├── app.ts                    # Express app setup
├── server.ts                 # Entry point (DB init + listen)
├── config/                   # Environment configuration
├── database/                 # Data source, base repository, migrations, seeds
├── modules/                  # Feature modules (auth, products, sales, ...)
│   ├── auth/                 # Authentication & authorization
│   ├── categories/           # Product categories
│   ├── organizations/        # Multi-tenant organizations
│   ├── products/             # Product CRUD
│   ├── reports/              # Reporting & analytics
│   ├── sales/                # Sales & sale items
│   ├── suppliers/            # Suppliers
│   └── users/                # User management
├── routes/                   # Route aggregation
├── shared/                   # Cross-cutting concerns
│   ├── constants/            # Enums & constants
│   ├── errors/               # Custom error classes
│   ├── middleware/            # Auth, validation, error handling
│   ├── types/                # Shared TypeScript types
│   └── utils/                # Helpers
└── swagger.ts                # Swagger configuration
```

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **PostgreSQL** >= 14

### Installation

```bash
git clone <repository-url>
cd LZFlow-backend
npm install
```

### Environment Variables

Copy the example file and adjust the values:

```bash
cp .env.example .env
```

| Variable               | Default               | Description                    |
| ---------------------- | --------------------- | ------------------------------ |
| `NODE_ENV`             | `development`         | Runtime environment            |
| `PORT`                 | `3000`                | Server port                    |
| `HOST`                 | `localhost`           | Server host                    |
| `DB_HOST`              | `localhost`           | PostgreSQL host                |
| `DB_PORT`              | `5432`                | PostgreSQL port                |
| `DB_USER`              | `postgres`            | Database user                  |
| `DB_PASSWORD`          | `postgres`            | Database password              |
| `DB_NAME`              | `inventory_saas`      | Database name                  |
| `JWT_SECRET`           | —                     | JWT signing secret             |
| `JWT_REFRESH_SECRET`   | —                     | Refresh token secret           |
| `JWT_EXPIRES_IN`       | `15m`                 | Access token TTL               |
| `JWT_REFRESH_EXPIRES_IN` | `7d`                | Refresh token TTL              |
| `BCRYPT_SALT_ROUNDS`   | `12`                  | Bcrypt cost factor             |
| `CORS_ORIGIN`          | `http://localhost:5173`| Allowed CORS origin            |

### Database Setup

Create the database in PostgreSQL:

```bash
createdb inventory_saas
```

Run TypeORM migrations:

```bash
npm run migration:run
```

Optionally seed initial data:

```bash
npm run seed
```

### Run the Server

```bash
# Development (with hot-reload)
npm run dev

# Production
npm run build && npm start
```

The server starts at `http://localhost:3000` and the API docs at `http://localhost:3000/api/docs`.

## API Documentation

Once the server is running, visit:

- **Swagger UI** — [`/api/docs`](http://localhost:3000/api/docs)
- **OpenAPI JSON** — [`/api/docs.json`](http://localhost:3000/api/docs.json)

## Available Scripts

| Script                    | Description                          |
| ------------------------- | ------------------------------------ |
| `npm run dev`             | Start dev server with hot-reload     |
| `npm run build`           | Compile TypeScript to `dist/`        |
| `npm start`               | Run compiled production server       |
| `npm run lint`            | Lint source files with ESLint        |
| `npm run lint:fix`        | Auto-fix lint issues                 |
| `npm run format`          | Format code with Prettier            |
| `npm test`                | Run all tests                        |
| `npm run test:unit`       | Run unit tests only                  |
| `npm run test:integration`| Run integration tests only           |
| `npm run test:coverage`   | Run tests with coverage report       |
| `npm run migration:run`   | Execute pending database migrations  |
| `npm run migration:generate` | Generate a new migration from entities |
| `npm run seed`            | Seed the database with initial data  |

## Modules

### Auth
Register, login, token refresh, and logout. Issues JWT access tokens (short-lived) and refresh tokens (long-lived).

### Users
CRUD for organization users. Supports role assignment for authorization.

### Products
Full product lifecycle — create, read, update, delete, search by SKU/name. Each product belongs to an organization and can be linked to a category and supplier.

### Categories
Hierarchical or flat product categorization.

### Suppliers
Vendor/supplier management with contact details.

### Sales
Register sales with multiple line items. Automatically adjusts product stock on sale creation (`stockQuantity` decrement).

### Reports
Aggregated endpoints:
- Dashboard summary (total products, sales, low-stock items)
- Sales trends over time
- Low-stock product alerts
- Top-selling products

## Authentication & Authorization

The API uses **JWT bearer tokens**. Include the access token in the `Authorization` header:

```
Authorization: Bearer <access-token>
```

**Endpoints:**

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | `/api/auth/register` | Register a new user    |
| POST   | `/api/auth/login`    | Login, get tokens      |
| POST   | `/api/auth/refresh`  | Refresh access token   |
| POST   | `/api/auth/logout`   | Invalidate refresh token |

All protected routes require a valid token. Access is scoped to the authenticated user's organization.
