# Strimzi + Debezium Outbox Debugging Guide

This guide helps debug an Event-Driven Architecture using:

- PostgreSQL
- Debezium Outbox Pattern
- Kafka Connect (Strimzi)
- Apache Kafka
- Consumer Service

---

# Event Flow

```text
Application
      │
      ▼
Insert into Outbox
      │
      ▼
PostgreSQL WAL
      │
      ▼
Debezium Connector
      │
      ▼
Kafka Topic
      │
      ▼
Consumer
      │
      ▼
Projection Database
```

Always debug in this order.

---

# Step 1 - Verify Outbox Table

Check whether your application actually inserted the event.

```sql
SELECT *
FROM outbox
ORDER BY created_at DESC;
```

Things to verify

- payload contains JSON object
- topic is correct
- aggregate_id is correct
- event_type is correct

Example

```json
{
  "eventId": "...",
  "payload": {
    "id": "...",
    "name": "Screen 1"
  },
  "eventType": "screen-created"
}
```

---

# Step 2 - Verify PostgreSQL Replication

Check publication

```sql
SELECT * FROM pg_publication;
```

Expected

```
theater_publication
```

---

Check replication slot

```sql
SELECT * FROM pg_replication_slots;
```

Expected

```
slot_name : theater_slot
active    : true
```

If active = false

→ Debezium isn't connected.

---

Check replication

```sql
SELECT * FROM pg_stat_replication;
```

---

# Step 3 - Verify Kafka Connector

List connectors

```bash
kubectl get kafkaconnector -n kafka
```

Expected

```
READY
True
```

---

Describe connector

```bash
kubectl describe kafkaconnector theater-outbox -n kafka
```

Look for

- Failed Tasks
- Connector Errors
- Authentication Errors

---

Get connector yaml

```bash
kubectl get kafkaconnector theater-outbox \
-o yaml \
-n kafka
```

Expected

```yaml
status:
  connectorStatus:
    state: RUNNING

tasks:
  - state: RUNNING
```

---

# Step 4 - Kafka Connect Logs

Find pod

```bash
kubectl get pods -n kafka
```

Example

```
bookmymovie-connect-connect-0
```

View logs

```bash
kubectl logs -f <connect-pod-name> -n kafka
```

Things to look for

- Connector Started
- Reading WAL
- Publishing Events
- Serialization Errors
- Database Connection Errors

---

# Step 5 - Kafka Connect REST API

Port forward

```bash
kubectl port-forward svc/bookmymovie-connect-connect-api 8083:8083 -n kafka
```

List connectors

```bash
curl localhost:8083/connectors
```

Status

```bash
curl localhost:8083/connectors/theater-outbox/status
```

Expected

```json
{
  "connector": {
    "state": "RUNNING"
  },
  "tasks": [
    {
      "state": "RUNNING"
    }
  ]
}
```

---

# Step 6 - Verify Kafka Topic

List topics

```bash
kubectl exec -it bookmymovie-kafka-0 -n kafka -- \
bin/kafka-topics.sh \
--bootstrap-server localhost:9092 \
--list
```

Expected

```
theater-topic
```

---

# Step 7 - Consume Messages Directly

This removes your consumer from the equation.

```bash
kubectl exec -it bookmymovie-kafka-0 -n kafka -- \
bin/kafka-console-consumer.sh \
--bootstrap-server localhost:9092 \
--topic theater-topic \
--from-beginning
```

If messages appear

✅ Debezium is working

If not

Problem exists before Kafka.

---

# Step 8 - Verify Consumer

Print raw Kafka message

```ts
console.log(message.value?.toString());
```

Expected

```json
{
  "eventId": "...",
  "payload": {
    "id": "..."
  }
}
```

Then

```ts
const event = JSON.parse(message.value.toString());
```

Only **one JSON.parse()** should be needed.

---

# Step 9 - Projection Verification

Check projection table

```sql
SELECT *
FROM screen_projections;
```

If update fails

```
P2025
No record found
```

Possible reasons

- Create event never processed
- Projection deleted
- Consumer started from latest offset
- Event ordering issue

---

# Useful Kafka Commands

List topics

```bash
kubectl exec -it bookmymovie-kafka-0 -n kafka -- \
bin/kafka-topics.sh \
--bootstrap-server localhost:9092 \
--list
```

Describe topic

```bash
kubectl exec -it bookmymovie-kafka-0 -n kafka -- \
bin/kafka-topics.sh \
--bootstrap-server localhost:9092 \
--describe \
--topic theater-topic
```

Console consumer

```bash
kubectl exec -it bookmymovie-kafka-0 -n kafka -- \
bin/kafka-console-consumer.sh \
--bootstrap-server localhost:9092 \
--topic theater-topic \
--from-beginning
```

Console producer

```bash
kubectl exec -it bookmymovie-kafka-0 -n kafka -- \
bin/kafka-console-producer.sh \
--bootstrap-server localhost:9092 \
--topic theater-topic
```

---

# Useful Kubernetes Commands

Pods

```bash
kubectl get pods -n kafka
```

Logs

```bash
kubectl logs -f <pod-name> -n kafka
```

Describe Pod

```bash
kubectl describe pod <pod-name> -n kafka
```

Restart Connector

```bash
kubectl annotate kafkaconnector theater-outbox \
strimzi.io/restart="true" \
-n kafka
```

---

# End-to-End Debug Checklist

```
Application
     │
     ▼
Outbox Table
     │
     ▼
Publication
     │
     ▼
Replication Slot
     │
     ▼
Debezium Connector
     │
     ▼
Kafka Topic
     │
     ▼
Kafka Console Consumer
     │
     ▼
Application Consumer
     │
     ▼
Projection Table
```

Never start debugging from the consumer.

Always debug from the Outbox.

---

# Best Practices

## ✅ Store payload as JSON

```prisma
payload Json
```

NOT

```ts
JSON.stringify(payload);
```

---

## ✅ Add eventId

```json
{
  "eventId": "...",
  "correlationId": "...",
  "payload": {}
}
```

Makes tracing much easier.

---

## ✅ Log eventId everywhere

Application

```
Inserted Outbox Event
eventId=123
```

Consumer

```
Received Event
eventId=123
```

Projection

```
Projection Updated
eventId=123
```

---

## Golden Debugging Rule

Always debug in this order:

```
Application
    ↓
Outbox
    ↓
Replication Slot
    ↓
Debezium
    ↓
Kafka Topic
    ↓
Kafka Consumer
    ↓
Projection
```

If you skip layers, you'll spend much longer finding the root cause.
