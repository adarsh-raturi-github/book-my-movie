# Book My Movie - Kubernetes Infrastructure

## Pods & Containers Flow Diagram

```mermaid
graph TD
    A["🌐 Ingress Service<br/>book-my-movie.dev<br/>nginx"] -->|/api/auth/*| B["⚙️ Auth Service<br/>auth-cluster-ip-srv<br/>Port 3000"]

    B --> C["📦 Auth Pod<br/>auth-depl"]
    C --> D["🐳 Container<br/>auth-container<br/>adarsh893/book-my-movie-auth"]

    D -->|Connect DB<br/>postgresql://...| E["📦 Auth Postgres Pod<br/>auth-postgres-depl"]
    E --> F["🐳 Container<br/>auth-postgres-container<br/>postgres:16"]

    G["⚙️ Movie Service<br/>movie-cluster-ip-srv<br/>Port 3001"] --> H["📦 Movie Pod<br/>movie-depl"]
    H --> I["🐳 Container<br/>movie-container<br/>adarsh893/book-my-movie-movie"]

    I -->|Connect DB<br/>postgresql://...| J["📦 Movie Postgres Pod<br/>movie-postgres-depl"]
    J --> K["🐳 Container<br/>movie-postgres-container<br/>postgres:16"]

    D -.->|JWT_KEY| L["🔐 Secrets<br/>jwt-secret"]
    I -.->|JWT_KEY| L

    style A fill:#ff6b6b
    style B fill:#4ecdc4
    style G fill:#4ecdc4
    style L fill:#ffd93d
    style C fill:#95e1d3
    style H fill:#95e1d3
    style E fill:#a8dadc
    style J fill:#a8dadc
```

## Architecture Overview

### Kubernetes Cluster Components

| Component          | Pod                   | Container                  | Image                           | Replicas | Port |
| ------------------ | --------------------- | -------------------------- | ------------------------------- | -------- | ---- |
| **Auth Service**   | `auth-depl`           | `auth-container`           | `adarsh893/book-my-movie-auth`  | 1        | 3000 |
| **Auth Database**  | `auth-postgres-depl`  | `auth-postgres-container`  | `postgres:16`                   | 1        | 5432 |
| **Movie Service**  | `movie-depl`          | `movie-container`          | `adarsh893/book-my-movie-movie` | 1        | 3001 |
| **Movie Database** | `movie-postgres-depl` | `movie-postgres-container` | `postgres:16`                   | 1        | 5432 |

### Services

#### Ingress

- **Type**: Ingress (nginx)
- **Host**: `book-my-movie.dev`
- **Routes**:
  - `/api/auth/*` → `auth-cluster-ip-srv:3000`

#### Cluster Services

- **auth-cluster-ip-srv**: ClusterIP on port 3000 (Auth microservice)
- **auth-postgres-cluster-ip-srv**: ClusterIP on port 5432 (Auth database)
- **movie-cluster-ip-srv**: ClusterIP on port 3001 (Movie microservice)
- **movie-postgres-cluster-ip-srv**: ClusterIP on port 5432 (Movie database)

### Environment Variables & Secrets

**Auth Service (`auth-depl`)**

```yaml
JWT_KEY: (from secret: jwt-secret)
DATABASE_URL: postgresql://postgres:postgres@auth-postgres-cluster-ip-srv:5432/auth
```

**Movie Service (`movie-depl`)**

```yaml
JWT_KEY: (from secret: jwt-secret)
DATABASE_URL: postgresql://postgres:postgres@movie-postgres-cluster-ip-srv:5432/movie
```

**Database Pods**

```yaml
POSTGRES_DB: auth / movie
POSTGRES_USER: postgres
POSTGRES_PASSWORD: postgres
```

## Data Flow

1. **Client Request** → Ingress (`book-my-movie.dev`)
2. **Ingress** routes to Auth/Movie services via ClusterIP
3. **Microservices** (`auth-container`, `movie-container`) process requests
4. **Database Connections**: Microservices connect to their respective PostgreSQL databases
5. **Authentication**: Both services use shared JWT secret

## How to Deploy

```bash
# Apply all k8s configurations
kubectl apply -f infra/k8s/

# Create JWT secret (if not exists)
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=your-jwt-secret

# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get services
```

## Development Notes

- **Skaffold** is configured for local development (see `skaffold.yaml`)
- Services communicate via ClusterIP (internal cluster networking)
- PostgreSQL databases are persistent within pods (no PersistentVolumes configured)
- JWT authentication shared across services via Kubernetes secrets
