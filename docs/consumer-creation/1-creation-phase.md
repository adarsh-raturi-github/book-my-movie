# Projection Consumer — CREATE Process

Whenever you create a consumer for a CQRS projection that handles a `CREATE` event, follow these **4 steps**.

---

## 1. Check Idempotency

First, check whether the projection already exists using the unique identifier from the event.

If the projection already exists, the event was already processed.

```text
CREATE EVENT
     │
     ▼
Check Projection
     │
     ├── Exists ──► Return
     │
     └── Not Exists ──► Continue
```

### Example

```typescript
const existing = await prisma.showSeatProjection.findUnique({
  where: {
    id: event.payload.id,
  },
});

if (existing) {
  return;
}
```

---

## 2. Create the Projection

If the projection does not exist, create it using the data received from the event.

The projection should be created from the event data without requiring a synchronous call to the source service.

### Example

```typescript
await prisma.showSeatProjection.create({
  data: {
    id,
    showId,
    seatId,
    price,
    status,
    bookingId,
    lockedUntil,
    entityVersion,
  },
});
```

The projection must have a database-level unique identifier, such as a `PRIMARY KEY` or `UNIQUE` constraint.

### Example

```sql
CONSTRAINT "show_seat_projection_pkey"
PRIMARY KEY ("id")
```

This protects the projection even if two deliveries are processed concurrently.

---

## 3. Handle Errors

Do not silently swallow errors.

Errors should be classified based on how they should be handled.

```text
Duplicate / Already Exists
        │
        ▼
Idempotent Success
        │
        ▼
      Return
```

```text
Temporary DB / Infrastructure Failure
        │
        ▼
   RetryableError
        │
        ▼
 ConsumerManager Retries
```

```text
Permanent / Invalid Event
        │
        ▼
 NonRetryableError
        │
        ▼
        DLQ
```

For the current implementation, a database or infrastructure failure should be propagated as a `RetryableError`.

### Example

```typescript
try {
  const existing = await prisma.showSeatProjection.findUnique({
    where: {
      id,
    },
  });

  if (existing) {
    return;
  }

  await prisma.showSeatProjection.create({
    data: {
      id,
      showId,
      seatId,
      price,
      status,
      bookingId,
      lockedUntil,
      entityVersion,
    },
  });
} catch (err) {
  console.error(`Failed to create ShowSeat projection: ${id}`, err);

  throw new RetryableError(`Failed to create ShowSeat projection: ${id}`);
}
```

If a duplicate `CREATE` is detected by the initial idempotency check, simply return.

---

## 4. Let ConsumerManager Handle Kafka Offset

The projection consumer should **not commit the Kafka offset itself**.

The consumer only processes the event and returns successfully when processing is complete.

### Successful Processing

```text
Projection processed
       │
       ▼
Handler returns
       │
       ▼
ConsumerManager
       │
       ▼
Commit Kafka Offset
```

For a retryable failure:

```text
Handler
   │
   ▼
RetryableError
   │
   ▼
ConsumerManager
   │
   ▼
Retry
```

For a permanent failure:

```text
Handler
   │
   ▼
NonRetryableError
   │
   ▼
ConsumerManager
   │
   ├──► Publish to DLQ
   │
   └──► Commit Offset
```

The responsibility is therefore:

- **Projection Consumer** → Process the event and update the projection.
- **ConsumerManager** → Handle retries, DLQ, and Kafka offset commits.

---

# CREATE Consumer Flow

```text
                  CREATE EVENT
                       │
                       ▼
              1. Check Idempotency
                       │
                  ┌────┴────┐
                  │         │
               Exists    Not Exists
                  │         │
                  ▼         ▼
                Return   2. Create
                            │
                       ┌────┴────┐
                       │         │
                    Success     Error
                       │         │
                       │     3. Classify
                       │         │
                       └────┬────┘
                            │
                            ▼
                   4. ConsumerManager
                      handles offset
```

# Rules to Remember

1. **Check idempotency**
2. **Create the projection**
3. **Handle/classify errors**
4. **Let ConsumerManager handle retry, DLQ, and offset commit**
