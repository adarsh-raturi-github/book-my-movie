# Creating a New Microservice

This guide describes the standard process for creating a new microservice in the **BookMyMovie** platform.

Each microservice follows the same architecture and deployment conventions to maintain consistency across the project.

---

# 1. Create the Service Directory

From the project root:

```bash
mkdir <service-name>
cd <service-name>
```

Example:

```bash
mkdir auth
cd auth
```

---

# 2. Initialize Node.js Project

```bash
npm init -y
```

---

# 3. Install Dependencies

Install runtime dependencies.

```bash
npm install express cors
```

Install development dependencies.

```bash
npm install -D \
typescript \
ts-node-dev \
@types/node \
@types/express
```

Install the shared package.

```bash
npm install @adarsh-tickets/shared
```

---

# 4. Configure TypeScript

Initialize TypeScript.

```bash
npx tsc --init
```

Typical project structure:

```text
src/
├── index.ts
├── routes/
├── models/
├── prisma/
├── listeners/
├── publishers/
├── middlewares/
├── utils/
└── services/
```

---

# 5. Create Application Entry Point

Create:

```text
src/index.ts
```

Responsibilities:

- Initialize Express
- Register middleware
- Configure routes
- Initialize Kafka (if required)
- Connect to database
- Start HTTP server

---

# 6. Configure Package Scripts

Example:

```json
{
  "scripts": {
    "start": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "lint": "eslint ."
  }
}
```

Run locally:

```bash
npm run start
```

---

# 7. Create Dockerfile

Example:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm","run","start"]
```

Build image.

```bash
docker build -t <docker-id>/<image-name> .
```

Example:

```bash
docker build -t adarsh893/book-my-movie-auth .
```

---

# 8. Push Docker Image

```bash
docker push <docker-id>/<image-name>
```

Example:

```bash
docker push adarsh893/book-my-movie-auth
```

---

# 9. Register Service in Skaffold

Update `skaffold.yaml`.

```yaml
build:
  artifacts:
    - image: adarsh893/book-my-movie-auth
```

Skaffold will automatically:

- Build images
- Push images
- Deploy updated resources
- Sync source code during development

---

# 10. Create Kubernetes Deployment

Create:

```text
infra/k8s/<service-name>-depl.yaml
```

Responsibilities:

- Deploy service containers
- Maintain desired replica count
- Restart failed Pods
- Rolling updates
- Environment configuration

---

# 11. Create ClusterIP Service

Create:

```text
infra/k8s/<service-name>-srv.yaml
```

Example:

```
auth-cluster-ip-srv
```

Responsibilities:

- Internal service discovery
- Stable DNS name
- Inter-service communication

---

# 12. Create Database Resources

Each microservice owns its own database.

Example:

```
Auth Service

↓

auth-postgres-depl

↓

auth-postgres-cluster-ip-srv
```

The same pattern is used for:

- Movie
- Theater
- Show
- Booking
- Payment

No service directly accesses another service's database.

---

# 13. Configure Prisma

Install Prisma.

```bash
npm install prisma @prisma/client
```

Initialize Prisma.

```bash
npx prisma init
```

Create database schema.

```text
prisma/schema.prisma
```

Generate migration.

```bash
npx prisma migrate dev --name init
```

---

# 14. Configure Kafka (Event-Driven Services)

If the service publishes or consumes events:

- Configure Kafka Client
- Configure Producer Manager
- Configure Consumer Manager
- Register Consumers
- Register Publishers
- Configure Outbox Table
- Initialize Kafka during service startup

Example:

```text
Booking Service

↓

BookingCreated Event

↓

Kafka

↓

Show Service
```

---

# 15. Configure Kubernetes Secrets

Example:

```yaml
JWT_KEY

DATABASE_URL

KAFKA_BROKERS

CLIENT_ID

SERVICE_NAME

KAFKA_GROUP_ID
```

---

# 16. Update Ingress

Expose REST APIs through NGINX Ingress.

Example:

```yaml
/api/auth/*
↓
auth-cluster-ip-srv

/api/movies/*
↓
movie-cluster-ip-srv

/api/theaters/*
↓
theater-cluster-ip-srv

/api/shows/*
↓
show-cluster-ip-srv

/api/bookings/*
↓
booking-cluster-ip-srv
```

---

# 17. Start Development Environment

From the project root:

```bash
skaffold dev
```

Skaffold automatically:

- Watches source code
- Builds Docker images
- Syncs modified files
- Deploys updated containers
- Restarts Kubernetes Pods

---

# Development Workflow

```text
Create Microservice

        │

        ▼

Initialize Node.js

        │

        ▼

Install Dependencies

        │

        ▼

Configure TypeScript

        │

        ▼

Create Express Server

        │

        ▼

Configure Prisma

        │

        ▼

Create Docker Image

        │

        ▼

Configure Kubernetes

        │

        ▼

Configure Skaffold

        │

        ▼

Configure Kafka (Optional)

        │

        ▼

Run

skaffold dev
```

---

# Architecture Principles

Every microservice follows these principles:

- Database per Service
- Domain-Driven Design (DDD)
- Independent Deployment
- Event-Driven Communication
- Transactional Outbox Pattern
- CQRS Read Projections
- Shared Internal SDK (`@adarsh-tickets/shared`)
- Kubernetes-native Deployment

---

# Development Notes

### Skaffold

Skaffold is intended for **local development only**.

Typical production deployment pipelines include:

- GitHub Actions
- Jenkins
- GitLab CI/CD
- ArgoCD
- FluxCD

---

### Live Reload

Skaffold synchronizes files but does not restart the Node.js process.

Use:

- `ts-node-dev`
- `nodemon`

Example:

```json
{
  "scripts": {
    "start": "ts-node-dev --respawn src/index.ts"
  }
}
```

This enables automatic application reload during development.

---

# Checklist

- [ ] Create service directory
- [ ] Initialize Node.js project
- [ ] Install dependencies
- [ ] Configure TypeScript
- [ ] Create Express application
- [ ] Configure Prisma
- [ ] Create Dockerfile
- [ ] Register image in Skaffold
- [ ] Create Kubernetes Deployment
- [ ] Create ClusterIP Service
- [ ] Create PostgreSQL resources
- [ ] Configure Kafka (if required)
- [ ] Configure Ingress
- [ ] Run `skaffold dev`
