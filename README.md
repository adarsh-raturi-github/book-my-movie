# BookMyMovie

A scalable movie ticket booking platform inspired by BookMyShow, built using Node.js, TypeScript, PostgreSQL, Prisma, Kubernetes, and event-driven architecture.

## Overview

BookMyMovie allows users to browse movies, discover theaters, view show timings, reserve seats, and book tickets. The project is designed to demonstrate modern backend engineering concepts including microservices, distributed systems, role-based access control (RBAC), event-driven communication, and Saga orchestration.

## Infrastructure diagram

<img width="2837" height="4300" alt="Movie Booking Auth Service-2026-06-22-174452" src="https://github.com/user-attachments/assets/c7cbea0f-e56a-4b08-840e-103f75a552d0" />

https://miro.com/app/board/uXjVHDx8I3A=/?share_link_id=878606900324

## Features

### Authentication & Authorization

- User registration and login
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Predefined roles:
  - ADMIN
  - THEATER_OWNER
  - USER

- Permission-based route authorization

### Movie Management

- Movie catalog management
- Poster and trailer support
- Bulk movie import support
- Search and filtering capabilities

### Theater Management

- Theater creation and management
- Screen management
- Seat layout configuration
- Theater owner onboarding

### Show Management

- Show scheduling
- Screen allocation
- Show seat generation
- Seat availability tracking

### Booking System

- Seat reservation
- Booking confirmation
- Booking cancellation
- Booking history

### Distributed Systems Concepts

- Event-driven communication using NATS
- Service-to-service messaging
- Event sourcing patterns
- Saga orchestration for booking workflows
- Compensation handling for payment failures

### AI Incident Summarizer (Planned)

- Consumes distributed system events
- Generates human-readable incident summaries
- Assists in operational monitoring and debugging
- Demonstrates practical GenAI integration in backend systems

## Technology Stack

### Backend

- Node.js
- TypeScript
- Express.js

### Database

- PostgreSQL
- Prisma ORM

### Infrastructure

- Docker
- Kubernetes
- Skaffold
- NGINX Ingress

### Messaging

- NATS

### Authentication

- JWT
- RBAC

### AI (Planned)

- LangChain
- LLM-based Incident Analysis

## Architecture

Services are designed around business capabilities:

- Auth Service
- Movie Service
- Theater Service
- Booking Service

Shared utilities are published as a reusable npm package:

@adarsh-tickets/shared

```mermaid
flowchart LR

    Client

    subgraph Theater Service

        API[REST API]

        Prisma

    end

    subgraph PostgreSQL

        Screen[(screen)]

        Outbox[(outbox)]

        WAL[(WAL)]

    end

    subgraph Debezium

        Publication

        Slot

        Connector

        SMT[Outbox Event Router]

    end

    subgraph Kafka

        Topic[(theater-topic)]
    end

    subgraph Show Service

        Consumer

        Projection[(Local Database)]

    end

    Client --> API

    API --> Prisma

    Prisma --> Screen

    Prisma --> Outbox

    Screen --> WAL
    Outbox --> WAL

    WAL --> Publication

    Publication --> Slot

    Slot --> Connector

    Connector --> SMT

    SMT --> Topic

    Topic --> Consumer

    Consumer --> Projection
```

## Goals

This project focuses on learning and demonstrating:

- Microservice Architecture
- Distributed Systems
- Event-Driven Design
- Saga Pattern
- Kubernetes Deployment
- High-Level System Design
- Production-Oriented Backend Development
