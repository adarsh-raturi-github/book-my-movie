# Debugging a Node.js Microservice Running in Kubernetes (VS Code)

This guide explains how to debug a Node.js/TypeScript microservice running inside Kubernetes while using VS Code as the debugger.

## Why Debug Inside Kubernetes?

Running the service inside Kubernetes has several advantages:

- Uses the same networking as production.
- No need to port-forward Kafka, PostgreSQL, Redis, etc.
- Kafka brokers and Kubernetes DNS work without additional configuration.
- Easy to debug distributed systems (Kafka, Debezium, Event Driven Architecture).

---

# 1. Install ts-node

If your application starts from TypeScript (`src/index.ts`), install `ts-node` as a production dependency.

```bash
npm install ts-node
```

> **Note**
>
> Since the Docker image installs production dependencies (`npm install --omit=dev`), `ts-node` must exist under `dependencies`.

---

# 2. Add Debug Script

Update `package.json`.

```json
{
  "scripts": {
    "start": "ts-node-dev --poll src/index.ts",
    "debug": "node --inspect=0.0.0.0:9229 -r ts-node/register src/index.ts"
  }
}
```

---

# 3. Update Kubernetes Deployment

Replace the container startup command.

```yaml
command:
  - sh
  - -c
args:
  - npx prisma migrate deploy && npm run debug
```

Expose the debugger port.

```yaml
ports:
  - containerPort: 3003
  - containerPort: 9229
```

Example:

```yaml
containers:
  - name: show-container
    image: your-image

    command:
      - sh
      - -c

    args:
      - npx prisma migrate deploy && npm run debug

    ports:
      - containerPort: 3003
      - containerPort: 9229
```

---

# 4. Rebuild the Image

```bash
skaffold dev
```

or

```bash
skaffold run
```

---

# 5. Verify Debugger Started

```bash
kubectl logs -f <pod-name>
```

Expected output:

```text
Debugger listening on ws://0.0.0.0:9229/xxxxxxxx
```

---

# 6. Port Forward Debug Port

Find the pod.

```bash
kubectl get pods
```

Forward debugger port.

```bash
kubectl port-forward pod/<pod-name> 9229:9229
```

Example:

```bash
kubectl port-forward pod/show-depl-65c747d8cd-k5jn5 9229:9229
```

Keep this terminal running.

---

# 7. Configure VS Code

Create

```
.vscode/launch.json
```

Paste:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Attach Kubernetes Service",
      "type": "node",
      "request": "attach",
      "address": "localhost",
      "port": 9229,
      "restart": true,
      "localRoot": "${workspaceFolder}",
      "remoteRoot": "/app",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

---

# 8. Start Debugging

Open **Run and Debug** in VS Code.

Select

```
Attach Kubernetes Service
```

Press

```
F5
```

If everything is configured correctly you'll see:

```
Debugger attached.
```

---

# 9. Set Breakpoints

You can now debug:

- Controllers
- Services
- Kafka Producers
- Kafka Consumers
- Prisma Queries
- Event Handlers
- Middleware

Simply click in the gutter next to a line number to create a breakpoint.

---

# 10. Debug Shared Packages

If you're using a shared package (for example `@adarsh-tickets/shared`):

1. Open the file under

```
node_modules/@adarsh-tickets/shared
```

2. Place a breakpoint.

3. Execute the code path.

VS Code will stop inside the package.

This is useful for debugging:

- Kafka Wrapper
- Producer Manager
- Consumer Manager
- Serializer / Deserializer
- Common Middleware
- Shared Utilities

---

# Useful Kubernetes Commands

## Get Pods

```bash
kubectl get pods
```

---

## View Logs

```bash
kubectl logs -f <pod-name>
```

---

## Port Forward Debugger

```bash
kubectl port-forward pod/<pod-name> 9229:9229
```

---

## Restart Deployment

```bash
kubectl rollout restart deployment <deployment-name>
```

---

## Scale Down Deployment

```bash
kubectl scale deployment <deployment-name> --replicas=0
```

---

## Scale Up Deployment

```bash
kubectl scale deployment <deployment-name> --replicas=1
```

---

# After Debugging

Restore the deployment startup command.

```yaml
command:
  - sh
  - -c

args:
  - npx prisma migrate deploy && npm start
```

Redeploy.

```bash
skaffold dev
```

---

# Advantages of this Approach

- No Kafka networking issues.
- No PostgreSQL port forwarding.
- Uses Kubernetes DNS.
- Same environment as production.
- Easy to debug distributed systems.
- Can debug shared libraries.
- Works with Kafka, Debezium, Redis, PostgreSQL, and other in-cluster services.
