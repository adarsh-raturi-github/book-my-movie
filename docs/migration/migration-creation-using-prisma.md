# Prisma Setup with PostgreSQL (Kubernetes)

This project uses **Prisma ORM** with **PostgreSQL** running inside a Kubernetes cluster. Each microservice owns its own database following the **Database per Service** pattern.

---

## 1. Install Prisma

Install Prisma CLI and Prisma Client inside the microservice.

```bash
npm install prisma@6.10.1 --save-dev
npm install @prisma/client@6.10.1
```

---

## 2. Initialize Prisma

Create the Prisma project structure.

```bash
npx prisma init
```

Generated files:

```text
prisma/
│
├── schema.prisma

.env
```

---

## 3. Configure Database Connection

Update `.env`.

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/auth"
```

Example connection:

| Property   | Value    |
| ---------- | -------- |
| Database   | auth     |
| Username   | postgres |
| Password   | postgres |
| Local Port | 5433     |

> Every microservice has its own PostgreSQL database.

---

## 4. Define Database Schema

Create database models inside:

```text
prisma/schema.prisma
```

Example:

```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  phone        String   @unique
  passwordHash String

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

---

## 5. Generate Database Migration

Create and apply a migration.

```bash
npx prisma migrate dev --name init
```

Prisma automatically:

- Creates SQL migration files
- Applies migrations to PostgreSQL
- Generates Prisma Client

Generated structure:

```text
prisma/
│
├── schema.prisma
│
└── migrations/
    └── <timestamp>_init/
        └── migration.sql
```

---

## 6. PostgreSQL on Kubernetes

Each microservice runs its own PostgreSQL instance inside Kubernetes.

```
Auth Service
      │
      ▼
auth-postgres-cluster-ip-srv

Movie Service
      │
      ▼
movie-postgres-cluster-ip-srv

Theater Service
      │
      ▼
theater-postgres-cluster-ip-srv

Show Service
      │
      ▼
show-postgres-cluster-ip-srv

Booking Service
      │
      ▼
booking-postgres-cluster-ip-srv
```

Since ClusterIP services are only accessible inside the cluster, PostgreSQL must be exposed locally for development.

---

## 7. Port Forward PostgreSQL

Expose PostgreSQL to the local machine.

Example:

```bash
kubectl port-forward svc/auth-postgres-cluster-ip-srv 5433:5432
```

Meaning:

```text
Local Machine              Kubernetes

localhost:5433  ───────▶  auth-postgres:5432
```

Keep the terminal running while using Prisma or pgAdmin.

---

## 8. Connect pgAdmin

Create a new PostgreSQL server.

| Property | Value     |
| -------- | --------- |
| Host     | localhost |
| Port     | 5433      |
| Database | auth      |
| Username | postgres  |
| Password | postgres  |

These values match the Kubernetes Deployment.

```yaml
POSTGRES_DB=auth
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

---

## 9. Verify Migration

After running

```bash
npx prisma migrate dev --name init
```

Refresh pgAdmin.

```
Servers

└── auth

    └── Schemas

        └── public

            └── Tables
```

All generated tables should now be visible.

---

# Common Prisma Commands

Generate Prisma Client

```bash
npx prisma generate
```

Create a migration

```bash
npx prisma migrate dev --name <migration_name>
```

Apply pending migrations

```bash
npx prisma migrate deploy
```

Open Prisma Studio

```bash
npx prisma studio
```

Reset database

```bash
npx prisma migrate reset
```

Format schema

```bash
npx prisma format
```

---

# Development Workflow

```text
Update schema.prisma

        │

        ▼

Create Migration

        │

        ▼

Apply Migration

        │

        ▼

Generate Prisma Client

        │

        ▼

Port Forward PostgreSQL

        │

        ▼

Verify Tables in pgAdmin
```

---

# Architecture Notes

- Each microservice owns its own PostgreSQL database.
- Prisma Client is generated independently for every service.
- Database schemas are version-controlled through Prisma Migrations.
- Services never access another service's database directly.
- Cross-service communication happens asynchronously through Apache Kafka using the Transactional Outbox Pattern.
