# 🎬 BookMyMovie

> A production-oriented movie ticket booking platform inspired by **BookMyShow**, built to explore scalable backend architecture, event-driven microservices, and distributed systems using **Node.js, TypeScript, PostgreSQL, Apache Kafka, Debezium, Prisma, Docker, and Kubernetes**.

---

## 📌 Project Status

| Module                    | Status         |
| ------------------------- | -------------- |
| 🔐 Authentication Service | ✅ Complete    |
| 🎬 Movie Service          | ✅ Complete    |
| 🏢 Theater Service        | ✅ Complete    |
| 🎟️ Show Service           | ✅ Complete    |
| 📦 Shared SDK             | ✅ Complete    |
| 📨 Kafka Infrastructure   | ✅ Complete    |
| 📤 Transactional Outbox   | ✅ Complete    |
| 🔄 Debezium CDC           | ✅ Complete    |
| 📖 CQRS Read Projections  | ✅ Complete    |
| 🎫 Booking Service        | 🚧 In Progress |
| 💳 Payment Service        | 📋 Planned     |
| 🔔 Notification Service   | 📋 Planned     |

---

# Why This Project?

Most movie booking applications focus primarily on CRUD operations.

The objective of **BookMyMovie** is different.

This project focuses on implementing **production-grade backend engineering concepts** used in modern distributed systems, including:

- Microservice Architecture
- Domain-Driven Design (DDD)
- Event-Driven Architecture
- CQRS
- Transactional Outbox Pattern
- Debezium Change Data Capture (CDC)
- Saga Orchestration
- Eventual Consistency
- Optimistic Concurrency Control
- Kubernetes Deployment

---

# 📚 Documentation

| Document                                                                 | Description                                                            |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| [README.md](README.md)                                                   | Project overview, architecture and implementation status               |
| [INFRASTRUCTURE.md](INFRASTRUCTURE.md)                                   | Kubernetes infrastructure, Kafka, Debezium and deployment architecture |
| [migration-creation-using-prisma.md](migration-creation-using-prisma.md) | Prisma setup, PostgreSQL configuration and migration workflow          |
| [new-service-creation.md](new-service-creation.md)                       | Standard process for creating a new microservice                       |
| [debugging.md](debugging.md)                                             | Debugging guide for Kubernetes, Kafka and local development            |
| [testing.md](testing.md)                                                 | Testing strategy of strimzi and kafka                            |
| [service-port.txt](service-port.txt)                                     | Port allocation for all microservices                                  |

---

# 📁 Repository Structure

```text
book-my-movie/

├── auth/
├── movie/
├── theater/
├── show/
├── booking/
├── shared/
│
├── infra/
│
├── README.md
├── INFRASTRUCTURE.md
├── migration-creation-using-prisma.md
├── new-service-creation.md
├── debugging.md
├── testing.md
└── skaffold.yaml
```

---

# 🏗 Infrastructure

> Infrastructure architecture and Kubernetes deployment are documented in **INFRASTRUCTURE.md**.

<img width="1536" height="1024" alt="Image" src="https://github.com/user-attachments/assets/370bd87b-c77c-44a7-83e2-dac7cf274c9d" />


---

# 🏛 Architecture

The platform follows **Domain-Driven Design (DDD)**.

Every microservice owns:

- Business Logic
- Database
- Domain Events
- Read Projections

Current Services:

| Service            | Responsibility                                    |
| ------------------ | ------------------------------------------------- |
| 🔐 Auth Service    | Authentication, JWT, RBAC                         |
| 🎬 Movie Service   | Movie Catalog                                     |
| 🏢 Theater Service | Theater, Screen & Seat Management                 |
| 🎟️ Show Service    | Show Scheduling & Seat Inventory                  |
| 🎫 Booking Service | Booking Aggregate & Saga (In Progress)            |
| 📦 Shared SDK      | Authentication, Kafka Framework, Common Utilities |

---

# ✨ Features

## 🔐 Authentication

- JWT Authentication
- User Registration
- Login
- Role-Based Access Control (RBAC)
- Permission-based Authorization

---

## 🎬 Movie Service

- Movie CRUD
- Poster & Trailer Metadata
- Search
- Bulk Import

---

## 🏢 Theater Service

- Theater CRUD
- Screen Management
- Seat Layout Management
- Bulk Seat Creation
- Bulk Seat Update
- Bulk Seat Delete

---

## 🎟️ Show Service

- Show Scheduling
- Show Seat Generation
- Seat Pricing
- Seat Availability
- CQRS Read Projections
- Kafka Event Consumers

---

## 🎫 Booking Service _(In Progress)_

Implemented:

- Booking Aggregate
- Booking Seat Aggregate
- CQRS Read Projection
- Transactional Outbox
- Saga Design

Upcoming:

- Seat Locking
- Payment Workflow
- Booking Confirmation
- Booking Expiration
- Compensation Workflow

---

# 🌍 Distributed Systems

## Event-Driven Architecture

Implemented using:

- Apache Kafka
- Apache Avro
- Schema Registry
- Dead Letter Topics (DLT)

---

## Transactional Outbox Pattern

Every business transaction persists:

- Aggregate changes
- Outbox event

inside a single PostgreSQL transaction.

```
Business Transaction

        │

        ▼

+--------------------------+
| PostgreSQL Transaction   |
|--------------------------|
| Aggregate Update         |
| Insert Outbox Event      |
+--------------------------+

        │

        ▼

PostgreSQL WAL

        │

        ▼

Debezium CDC

        │

        ▼

Apache Kafka
```

---

## CQRS Read Projections

Services never directly query another service's database.

Instead, local read models are maintained by consuming Kafka events.

Current projections:

- Movie Projection
- Theater Projection
- Show Projection
- Show Seat Projection

Benefits:

- Loose Coupling
- Independent Scaling
- Local Reads
- Eventual Consistency

---

## Saga Pattern _(In Progress)_

Booking workflow follows an **Orchestrated Saga**.

```
Booking Service

        │
BookingCreated

        ▼

Show Service

        │
SeatsLocked

        ▼

Booking Service

        │
Payment Pending

        ▼

Payment Service

        │
PaymentSucceeded

        ▼

BookingConfirmed
```

Compensating actions are used instead of distributed transactions.

---

## Concurrency Control

Implemented:

- Aggregate Versioning
- Optimistic Concurrency Control

Planned:

- Pessimistic Row-Level Locking for Seat Reservation

---

## Reliable Messaging

Implemented:

- Transactional Outbox
- Debezium CDC
- Kafka Consumers
- Apache Avro
- Schema Registry
- Dead Letter Topics
- Idempotent Kafka Producer
- Retryable / Non-Retryable Consumer Errors

---

# 🛠 Technology Stack

## Backend

- Node.js
- TypeScript
- Express.js
- Prisma ORM

### Database

- PostgreSQL
- PostgreSQL WAL
- Debezium CDC

### Messaging

- Apache Kafka
- Strimzi Operator
- Apache Avro
- Confluent Schema Registry
- Dead Letter Topics

### Infrastructure

- Docker
- Kubernetes
- Skaffold
- NGINX Ingress

### Security

- JWT Authentication
- Role-Based Access Control
- Permission-Based Authorization

---

# 📦 Shared Internal SDK

Reusable package:

```text
@adarsh-tickets/shared
```

Contains:

- JWT Middleware
- RBAC
- Kafka Producer Manager
- Kafka Consumer Manager
- Event Contracts
- Avro Serialization
- Schema Registry Integration
- Common Errors
- Middleware
- Utility Functions

---

# 🚀 Engineering Highlights

### Architecture

- Microservice Architecture
- Domain-Driven Design (DDD)
- Database per Service
- Shared Internal SDK

### Distributed Systems

- Event-Driven Architecture
- Transactional Outbox Pattern
- Debezium Change Data Capture
- CQRS Read Projections
- Eventual Consistency
- Saga Orchestration

### Messaging

- Apache Kafka
- Apache Avro
- Schema Registry
- Dead Letter Topics
- Idempotent Producer
- Consumer Framework

### Reliability

- Optimistic Concurrency Control
- Aggregate Versioning
- Retryable Consumers
- Non-Retryable Consumers

### Infrastructure

- Docker
- Kubernetes
- Skaffold
- NGINX Ingress

---

# 🗺 Roadmap

## Booking

- Seat Locking
- Booking Confirmation
- Booking Expiration
- Compensation Events

## Payment

- Payment Service

## Platform

- Notification Service
- Redis

## AI

- AI Incident Summarizer
- Event Timeline Generator

---

# 📖 Key Learnings

This project was built to gain practical experience with production backend architecture.

Key concepts explored:

- Designing microservices around business domains
- Building reliable event-driven systems
- Implementing the Transactional Outbox Pattern
- Using Debezium for Change Data Capture
- Maintaining CQRS Read Projections
- Designing Saga workflows
- Building reusable internal libraries
- Applying optimistic concurrency control
- Deploying distributed systems on Kubernetes
