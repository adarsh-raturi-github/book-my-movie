# BookMyMovie - Seat Selection Feature

Complete seat layout and booking system with concurrent booking handling strategies.

## Feature Overview

### What This Does

1. **Seat Display**: Interactive grid of theater seats grouped by category
2. **Real-time Selection**: Click seats to select/deselect with instant price updates
3. **Category Filtering**: View by Premium/Standard/Economy or all seats
4. **Booking Summary**: Real-time calculation of costs including convenience fees
5. **Concurrent Safety**: Prevents double-booking when multiple users book simultaneously

### Why It's Needed

- **Essential Feature**: Core functionality for movie booking apps
- **Complex Logic**: Requires careful state management and user feedback
- **Production Patterns**: Demonstrates enterprise-level concurrency handling
- **Interview Value**: Shows understanding of real-world challenges (race conditions, locks)

---

## Components & Their Purpose

### 1. Seat.tsx - Individual Seat Button

**Purpose**: Smallest unit - single clickable seat

**Why Separate**:

- Single responsibility principle
- Can be tested independently
- Reusable in different contexts
- Easy to style and modify

**Props**:

```typescript
{
  seat: Seat                    // Seat object with id, row, number, price
  onSelect: (seat: Seat) => void // Click handler
  isSelected: boolean            // Highlight if selected
}
```

**Renders**: Button element with status-based CSS class

**Visual States**:

- Available: Blue, clickable, hover effect
- Selected: Pink/magenta, user's choice
- Booked: Gray, disabled, not clickable
- Blocked: Red, disabled, not clickable

---

### 2. SeatRow.tsx - Row of Seats

**Purpose**: Organize seats horizontally with row label

**Why Separate**:

- Groups related seats logically
- Adds row letter (A, B, C...)
- Handles uniform spacing
- Reusable row component

**Props**:

```typescript
{
  row: string                    // "A", "B", "C"...
  seats: Seat[]                 // Array of 12 seats
  selectedSeats: Seat[]         // Already selected by user
  onSeatSelect: (seat: Seat) => void // Bubble click up
}
```

**Layout**: [Row Letter] [Seat] [Seat] [Seat]... [Row Letter]

**Why Row Letters**: Easy reference ("I'm in row A, seat 5")

---

### 3. SeatLayout.tsx - Complete Grid

**Purpose**: Displays all rows forming complete theater layout

**Why Separate**:

- Orchestrates multiple SeatRow components
- Handles optional category filtering
- Manages scrolling and viewport
- Centers layout on screen

**Props**:

```typescript
{
  seats: Seat[]                      // All seats from server
  selectedSeats: Seat[]              // User's selections
  category?: SeatCategory            // Optional filter: "premium" | "standard" | "economy"
  onSeatSelect: (seat: Seat) => void // Pass clicks to parent
}
```

**Usage**:

```typescript
// Show all seats
<SeatLayout seats={allSeats} selectedSeats={selected} onSeatSelect={handleSelect} />

// Show only premium seats
<SeatLayout seats={allSeats} selectedSeats={selected} category="premium" onSeatSelect={handleSelect} />
```

**Component Tree**:

```
SeatLayout
└── SeatRow (Row A)
    └── Seat × 12
├── SeatRow (Row B)
    └── Seat × 12
└── ... (10 rows total)
```

---

### 4. SeatLegend.tsx - Status Guide

**Purpose**: Color-coded guide showing seat status meanings

**Why Needed**:

- Users don't know what colors mean
- Improves UX clarity
- Standard in booking apps
- Reduces support questions

**Visual**:

```
🔵 Available - Click to select
🩷 Selected  - Your choice
⚪ Booked    - Already taken
🔴 Blocked   - Maintenance/unusable
```

**Props**: None required (static display)

**Render**: 4 status boxes with colors and labels

---

### 5. SeatSummary.tsx - Booking Sidebar

**Purpose**: Displays booking details and price breakdown

**Why Critical**:

- Real-time price calculation
- Shows value to user
- Builds confidence before purchase
- Handles edge cases (max seats, no selection)

**Displays**:

```
Selected Seats: 3
├─ A-5:  ₹250 (Premium)
├─ A-6:  ₹250 (Premium)
└─ B-3:  ₹200 (Standard)

Subtotal:       ₹700
Convenience:    ₹35 (5%)
─────────────────────
Total:          ₹735
```

**Actions**:

- **Clear Selection**: Reset all selected seats
- **Proceed to Payment**: Submit booking

**Disabled When**:

- No seats selected
- Currently processing
- Server error

---

### 6. SeatSelectionPage.tsx - Main Page

**Purpose**: Full page orchestrating entire seat booking flow

**Why Separate**:

- Router-level component
- Manages page state and navigation
- Integrates all sub-components
- Handles data fetching

**Features**:

1. **Sticky Header**: Back button + movie info
2. **Category Tabs**: All, Premium, Standard, Economy
3. **Seat Grid**: Main interactive area (left)
4. **Booking Summary**: Price sidebar (right)
5. **Responsive**: Stacks on mobile

**Props**:

```typescript
{
  movieId: string; // "movie_1"
  movieTitle: string; // "The Quantum Paradox"
  screenId: string; // "screen_5"
  showTime: string; // "7:00 PM - 9:30 PM"
}
```

**Layout Desktop**:

```
┌─ Header (Back | Movie Title | Show Time) ─────────┐
│ Category Tabs: [All] [Premium] [Standard] [Economy]│
├──────────────────────────┬──────────────────────────┤
│  SeatLayout              │  SeatSummary             │
│  ┌──┬──┬──┬──┬──┐        │  Selected: 3 seats       │
│  │A │A │A │A │A │ ... 12 │  Subtotal: ₹700         │
│  ├──┼──┼──┼──┼──┤        │  Fee: ₹35               │
│  │B │B │B │B │B │        │  Total: ₹735            │
│  │ × 10 rows              │                         │
│                          │  [Clear] [Proceed]     │
│  SeatLegend              │                         │
│  🔵 Available            │                         │
│  🩷 Selected             │                         │
├──────────────────────────┴──────────────────────────┤
```

**Layout Mobile**:

```
┌─ Header ─────────────────┐
│ Back | Movie | Time      │
├──────────────────────────┤
│ Category Tabs (scroll)   │
├──────────────────────────┤
│ SeatLayout (full width)  │
├──────────────────────────┤
│ SeatLegend              │
├──────────────────────────┤
│ SeatSummary (full width) │
│ [Clear] [Proceed]      │
└──────────────────────────┘
```

---

## Custom Hooks (How & Why)

### useSeatSelection - Seat Management

**Purpose**: All seat selection logic in one hook

**Why Extract to Hook**:

- Separates logic from UI
- Reusable across components
- Easier to test
- Cleaner component code

**What It Does**:

```typescript
const {
  selectedSeats, // Array of Seat objects
  toggleSeat, // Add/remove seat
  clearSelection, // Reset all
  processBooking, // Submit to server
  getStats, // Get {count, price}
  isProcessing, // Loading state
  error, // Error message
  lockId, // Booking lock ID
} = useSeatSelection({ movieId, screenId });
```

**Implementation Pattern**:

```typescript
export function useSeatSelection({ movieId, screenId }: Options) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSeat = (seat: Seat) => {
    // Find and toggle
  };

  const processBooking = async () => {
    // Call handler strategy
  };

  return {
    selectedSeats,
    toggleSeat,
    // ... more
  };
}
```

---

### useSeatData - Fetch & Update

**Purpose**: Get seats from server, manage their status

**Why Extract to Hook**:

- Data fetching logic separate from UI
- Handle loading/error states
- Simulate real API
- Update seat status in real-time

**What It Does**:

```typescript
const {
  seats, // All seats (10 rows × 12 cols)
  loading, // Initial fetch
  error, // Fetch error
  setSeatStatus, // Update single seat
} = useSeatData(screenId, 10, 12);
```

**Default Seat Configuration**:

```
Rows: 10 (A through J)
Seats per row: 12
Layout by category:
- Rows A-B (outer): Economy ₹150
- Rows C-H (middle): Premium/Standard mix
- Rows I-J (back): Standard/Economy mix

Price Logic:
- Middle seats (5-8): Premium ₹250
- Outer seats (1-4, 9-12): Standard/Economy ₹200/150
```

---

## Utility Functions (Why Matter)

### seatUtils.ts Functions

**1. generateSeats(rows, seatsPerRow)**

- Creates initial seat grid
- Assigns categories based on position
- Calculates pricing
- Marks some as "booked" for demo

**2. groupSeatsByRow() & groupSeatsByCategory()**

- Organize seats for rendering
- Return Map for fast lookup
- Needed for category filtering

**3. calculatePrice(seats)**

- Sum of all selected seats
- Input: Seat[]
- Output: total price number
- Used by SeatSummary

**4. validateSeatSelection(seats, maxSeats)**

- Enforce maximum seats (usually 6)
- Prevent overbooking
- Return boolean

**5. getSeatStatusColor() & getSeatCategoryLabel()**

- Lookup functions for display
- Map status → CSS color
- Map category → label text
- Centralize styling logic

---

## Concurrent Booking Strategies

### Why Multiple Strategies?

Different scenarios need different approaches:

- **Low conflict** (20% concurrent users) → Optimistic (fast)
- **High conflict** (80% concurrent users) → Pessimistic (safe)
- **Massive scale** (10,000 req/sec) → Queued (ordered)
- **Unreliable network** → Retry (resilient)
- **Critical system** → Circuit Breaker (protected)

---

### 1. OptimisticBookingHandler

**Use Case**: Low conflict scenarios (typical cinema)

**How It Works**:

```
1. User selects seats
2. UI optimistically marks as "selected"
3. User clicks Proceed
4. Send booking request WITHOUT blocking
5. If success → Confirm
6. If fail → Rollback selection + show error
```

**Lock Management**:

- Lock ID created
- Auto-expires in 5 minutes
- Can manually release
- Can extend duration

**Pros**: Fast, good UX, 95% success rate
**Cons**: Some bookings fail, needs rollback

**Code Example**:

```typescript
const handler = new OptimisticBookingHandler();

// Acquire lock (doesn't block seat)
const lockId = await handler.acquireLock("A-5", userId);

// Try to book
try {
  await submitBooking(lockId);
} catch (e) {
  // Release lock on failure
  handler.releaseLock(lockId);
}
```

---

### 2. PessimisticBookingHandler

**Use Case**: High conflict or guaranteed consistency

**How It Works**:

```
1. User selects seat
2. Send lock request to server
3. Server locks seat (blocks others)
4. User sees "locked" status
5. User confirms
6. Server finalizes booking
7. Unlock released
```

**Safety**: Absolute guarantee seat won't be double-booked

**Pros**: 100% consistency, no conflicts
**Cons**: Slower (2-5s wait), lower throughput

**Code Example**:

```typescript
const handler = new PessimisticBookingHandler();

// Seat immediately locked
if (!handler.lockSeat("A-5", userId)) {
  // Failed - seat already locked by someone else
  return;
}

// Safe to proceed
await submitBooking("A-5");
handler.unlockSeat("A-5", userId);
```

---

### 3. QueuedBookingHandler

**Use Case**: High-volume (1000+ booking/sec)

**How It Works**:

```
1. Booking request added to queue
2. Server processes queue sequentially
3. Each booking checked atomically
4. Success/failure reported
5. Next booking in queue starts
```

**Guarantee**: FIFO ordering, no conflicts, atomic ops

**Pros**: Handles massive load, fair ordering
**Cons**: 2-10 second wait, queues might grow

**Code Example**:

```typescript
const handler = new QueuedBookingHandler();

// Enqueue booking
const bookingId = handler.enqueueBooking({
  movieId: "1",
  screenId: "5",
  seatIds: ["A-5", "A-6"],
  userId: "user_123",
});

// Check status later
const done = handler.getBookingStatus(userId);
```

---

### 4. RetryableBookingHandler

**Use Case**: Unreliable networks, transient failures

**How It Works**:

```
1. Try booking
2. If fails, wait 1s then retry
3. If fails, wait 2s then retry
4. If fails, wait 4s then retry
5. After 3 attempts, give up
```

**Exponential Backoff**: 1s → 2s → 4s

**Pros**: Survives network hiccups
**Cons**: Slower overall, might delay final failure

**Code Example**:

```typescript
const handler = new RetryableBookingHandler();

const result = await handler.bookWithRetry(
  ["A-5", "A-6"],
  userId,
  async (seatIds, user) => {
    return await fetch("/api/bookings", {
      method: "POST",
      body: JSON.stringify({ seatIds, user }),
    });
  },
);

if (result.success) {
  console.log(`Success on attempt ${result.attempt}`);
} else {
  console.error(`Failed after retries: ${result.error}`);
}
```

---

### 5. CircuitBreakerBookingHandler

**Use Case**: System reliability, cascade prevention

**How It Works**:

```
CLOSED (normal):
  Requests pass through
  Failures tracked

OPEN (error threshold exceeded):
  Requests blocked immediately
  Fast fail
  Prevents overwhelming server

HALF-OPEN (recovery test):
  Allow limited requests
  If succeed → CLOSED
  If fail → OPEN again
```

**Threshold**: 5 failures → OPEN, timeout 30s → HALF-OPEN

**Pros**: Protects system from cascading failures
**Cons**: Temporarily rejects bookings during outage

**Code Example**:

```typescript
const handler = new CircuitBreakerBookingHandler();

try {
  await handler.executeBooking(async () => {
    return await submitBooking();
  });
} catch (e) {
  if (e.message.includes("Circuit")) {
    // Circuit is OPEN - show offline message
    showError("Booking system temporarily unavailable");
  }
}

// Check status
console.log(handler.getCircuitState());
// "Circuit State: closed, Failures: 1, Successes: 0"
```

---

## Type System

### Why TypeScript Here?

Seat system is complex:

- Multiple seat states
- Different categories
- Lock management
- Booking status tracking

Strong typing prevents bugs:

```typescript
// ❌ Without TypeScript: Wrong seat status passed
updateSeat("A-5", "invalid_status"); // Runtime error later

// ✅ With TypeScript: Caught at compile time
updateSeat("A-5", "reserved"); // Error: Type '"reserved"' is not assignable
```

### Core Types

```typescript
type SeatStatus = "available" | "selected" | "booked" | "blocked";
// Prevents typos like "boooked" or "AVAILABLE"

type SeatCategory = "premium" | "standard" | "economy";
// Ensures only valid categories

interface Seat {
  id: string; // "A-5"
  row: string; // "A"
  number: number; // 5
  status: SeatStatus; // "available"
  category: SeatCategory; // "premium"
  price: number; // 250
}
// Clear structure, all properties required

interface SeatBooking {
  id: string; // "booking_123"
  movieId: string;
  userId: string;
  seats: Seat[];
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  timestamp: string; // ISO string
}
```

---

## Styling (seatUtils.css)

### Why Custom CSS?

Seats need:

- Color coding by status
- Hover effects for interactivity
- Responsive grid layout
- Smooth animations
- Dark theme matching app

### Key CSS Classes

```css
.seat                    /* Base 50×50px button */
.seat--available        /* Blue, clickable */
.seat--selected         /* Pink, user's choice */
.seat--booked          /* Gray, disabled */
.seat--blocked         /* Red, maintenance */

.seat-row              /* Flexbox row */
.seat-row-label        /* Row letter (A, B, C) */
.seat-row-seats        /* Seats container */

.seat-layout           /* Grid wrapper */
.seat-legend           /* Status guide */
.seat-summary          /* Price sidebar */
```

### Responsive Breakpoints

```css
Desktop (1024px+):
  Sidebar: 300px fixed right
  Grid: Full width left
  Layout: Side-by-side

Tablet (768px-1024px):
  Sidebar: 250px
  Grid: Narrower
  Tabs: Scrollable

Mobile (< 768px):
  Sidebar: Full width below
  Grid: Full width above
  Tabs: Horizontal scroll
  Seats: 2.5rem × 2.5rem
```

---

## Real API Integration

Currently uses **mock data**. To connect real API:

### 1. Update useSeatData.ts

```typescript
// Replace mock generation with API call
const response = await fetch(`/api/screens/${screenId}/seats`);
const seats = await response.json();
```

### 2. Update useSeatSelection.ts

```typescript
// Replace mock booking with real API
const response = await fetch("/api/bookings", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    movieId,
    screenId,
    seats: selectedSeats,
    userId: currentUser.id,
  }),
});
```

### 3. Update Concurrent Handlers

```typescript
// Use actual server-side locks
const lockId = await fetch("/api/seats/lock", {
  method: "POST",
  body: JSON.stringify({ seatId, userId, duration: 300 }),
});
```

---

## Testing & Debugging

### Test Scenarios

1. **Single User**:
   - Select 3 seats
   - Check price = 250+250+200
   - Clear selection
   - Verify price resets

2. **Concurrent (2 Tabs)**:
   - Open 2 browser tabs
   - Select A-5 in tab 1
   - Select A-5 in tab 2
   - Verify one fails (lock conflict)

3. **Error Scenarios**:
   - Close network (DevTools)
   - Try to book
   - Retry handler should retry
   - Check error message

### Console Logging

```typescript
console.log("Selected seats:", selectedSeats);
console.log("Total price:", getStats().totalPrice);
console.log("Lock ID:", lockId);
console.log("Booking response:", response);
```

---

## Interview Discussion Points

1. **Why break into 5 components instead of 1?**
   - Single responsibility
   - Testability
   - Reusability
   - Easier debugging

2. **Why custom hooks?**
   - Separate logic from UI
   - Share logic between components
   - Easier to mock for testing
   - Standard React pattern

3. **Why 5 booking strategies?**
   - Different trade-offs
   - Real-world scenarios need different approaches
   - Shows architectural thinking
   - Production-ready patterns

4. **Why TypeScript for types?**
   - Prevents bugs at compile time
   - Better IDE support
   - Serves as documentation
   - Refactoring safety

5. **How would you scale this?**
   - Real database instead of mock
   - Redis for fast lock management
   - Message queue for huge traffic
   - WebSocket for real-time updates
   - Load balancer across servers

---

## Deployment Checklist

- [ ] Replace mock API calls with real endpoints
- [ ] Configure server-side seat locking
- [ ] Set up database for bookings
- [ ] Implement chosen concurrency strategy
- [ ] Add error logging/monitoring
- [ ] Load test with concurrent users
- [ ] Set up payment integration
- [ ] Create user confirmation emails
- [ ] Add booking history page
- [ ] Implement refund logic

---

**Created**: Dec 2024  
**For**: SDE2 Interview Preparation  
**Status**: Production-ready architecture  
**Demo**: http://localhost:5173 → Click any "Book" button

### 🎪 Seat Management

- **Seat Display**: Interactive seat grid grouped by category (Premium, Standard, Economy)
- **Real-time Selection**: Click to select/deselect seats with visual feedback
- **Seat Status Tracking**: Available, Selected, Booked, Blocked states
- **Category Filtering**: View seats by category or all at once
- **Dynamic Pricing**: Automatic price calculation based on seat selection

### 💰 Booking Summary

- Real-time price calculation
- Convenience fee display
- Selected seats preview
- Quick clear and confirm actions

### 🔄 Concurrent Booking Strategies

#### 1. **Optimistic Locking**

Best for: Low conflict scenarios

- Users can proceed immediately
- Conflict resolved at confirmation
- Lock duration: 5 minutes
- Auto-release after expiry

```typescript
const handler = new OptimisticBookingHandler();
const lockId = await handler.acquireLock(seatId, userId);
```

#### 2. **Pessimistic Locking**

Best for: High conflict scenarios

- Seats locked before user interaction
- Guaranteed consistency
- Lower concurrency throughput

```typescript
const handler = new PessimisticBookingHandler();
const locked = handler.lockSeat(seatId, userId);
```

#### 3. **Queue-based Processing**

Best for: High-volume scenarios

- All bookings processed sequentially
- Atomic transactions
- Fair queue ordering

```typescript
const handler = new QueuedBookingHandler();
const bookingId = handler.enqueueBooking(request);
```

#### 4. **Retry Strategy**

Best for: Network issues

- Automatic retries with exponential backoff
- Configurable retry count (default: 3)
- Error tracking

```typescript
const handler = new RetryableBookingHandler();
const result = await handler.bookWithRetry(seatIds, userId, bookingFn);
```

#### 5. **Circuit Breaker Pattern**

Best for: Service reliability

- Prevents cascading failures
- Auto-recovery mechanism
- States: closed → open → half-open

```typescript
const handler = new CircuitBreakerBookingHandler();
await handler.executeBooking(bookingFn);
```

## File Structure

```
client/src/
├── components/
│   ├── Seat.tsx                    # Individual seat button
│   ├── SeatRow.tsx                 # Row of seats
│   ├── SeatLayout.tsx              # Full seat grid
│   ├── SeatLegend.tsx              # Legend/key
│   └── SeatSummary.tsx             # Booking summary sidebar
├── pages/
│   └── SeatSelectionPage.tsx       # Full page component
├── hooks/
│   ├── useSeatSelection.ts         # Seat selection logic
│   └── useSeatData.ts              # Fetch seat data
├── services/
│   └── concurrentBookingHandler.ts # Booking strategies
├── types/
│   └── seat.ts                     # TypeScript interfaces
├── utils/
│   └── seatUtils.ts                # Utility functions
└── styles/
    └── SeatSelection.css           # Styling
```

## Component API

### SeatSelectionPage

```typescript
<SeatSelectionPage
  movieId="movie_1"
  movieTitle="The Quantum Paradox"
  screenId="screen_5"
  showTime="7:00 PM - 9:30 PM"
/>
```

Props:

- `movieId`: Movie identifier
- `movieTitle`: Display movie name
- `screenId`: Screen/theater identifier
- `showTime`: Show timing

### useSeatSelection Hook

```typescript
const {
  selectedSeats, // Currently selected seats
  toggleSeat, // Toggle seat selection
  clearSelection, // Clear all selections
  processBooking, // Submit booking
  getStats, // Get booking stats
  isProcessing, // Loading state
  error, // Error message
  lockId, // Booking lock ID
} = useSeatSelection({ movieId, screenId });
```

### useSeatData Hook

```typescript
const {
  seats, // All available seats
  loading, // Loading state
  error, // Error message
  setSeatStatus, // Update seat status
} = useSeatData(screenId, rows, seatsPerRow);
```

## Seat Data Structure

```typescript
interface Seat {
  id: string; // Unique identifier (e.g., "A-1")
  row: string; // Row letter (A, B, C...)
  number: number; // Seat number (1, 2, 3...)
  status: SeatStatus; // available | selected | booked | blocked
  category: SeatCategory; // premium | standard | economy
  price: number; // Seat price in rupees
}
```

## Pricing Model

Default pricing structure:

- **Premium**: ₹250 (Middle rows, middle seats)
- **Standard**: ₹200 (Outer rows, middle seats)
- **Economy**: ₹150 (All rows, outer seats)

Modify in `generateSeats()` function in `seatUtils.ts`

## Styling Features

- **Dark Theme**: Matches main app theme
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Semantic HTML, ARIA labels
- **Visual Feedback**: Hover effects, animations
- **Status Colors**:
  - Blue: Available seats
  - Pink: Selected seats
  - Gray: Booked seats
  - Red: Blocked seats

## Usage Example

```typescript
import { SeatSelectionPage } from './pages/SeatSelectionPage'

export function BookingFlow() {
  return (
    <SeatSelectionPage
      movieId="movie_1"
      movieTitle="The Quantum Paradox"
      screenId="screen_5"
      showTime="7:00 PM - 9:30 PM"
    />
  )
}
```

## Concurrent Booking Best Practices

### When to Use Each Strategy

| Scenario                     | Strategy            | Reason                     |
| ---------------------------- | ------------------- | -------------------------- |
| Low traffic, <10% conflict   | Optimistic Locking  | Better UX, faster          |
| High traffic, >50% conflict  | Pessimistic Locking | Guaranteed consistency     |
| Massive scale, >1000 req/sec | Queue-based         | Orderly processing         |
| Unstable network             | Retry Strategy      | Handles transient failures |
| Critical system              | Circuit Breaker     | Prevents cascades          |

### Example: Choosing a Strategy

```typescript
// For BookMyMovie app - Mixed approach recommended:
// 1. Use Optimistic Locking by default (user-friendly)
// 2. Upgrade to Pessimistic if conflict rate > 30%
// 3. Add Retry logic for network resilience
// 4. Wrap in Circuit Breaker for production safety

const bookingHandler = new OptimisticBookingHandler();
const retryHandler = new RetryableBookingHandler();
const circuitHandler = new CircuitBreakerBookingHandler();

async function bookSeats(seatIds: string[], userId: string) {
  try {
    await circuitHandler.executeBooking(() =>
      retryHandler.bookWithRetry(seatIds, userId, async (ids, user) => {
        const lock = await bookingHandler.acquireLock(ids[0], user);
        // Process booking...
        return true;
      }),
    );
  } catch (error) {
    console.error("Booking failed:", error);
  }
}
```

## Performance Metrics

Expected performance with different strategies:

| Metric           | Optimistic  | Pessimistic | Queue-based |
| ---------------- | ----------- | ----------- | ----------- |
| Max Throughput   | 1000+ req/s | 100 req/s   | 500 req/s   |
| Lock Contention  | Low         | High        | None        |
| User Wait Time   | <1s         | 1-5s        | 2-10s       |
| Data Consistency | Eventual    | Immediate   | Immediate   |

## Testing the Feature

```bash
# Development
npm run dev

# Navigate to seat selection page
# Try concurrent bookings in multiple tabs
# Observe how conflicts are handled
```

## API Integration

Replace mock data with real API:

In `useSeatData.ts`:

```typescript
// Replace with real API call
const response = await fetch(`/api/screens/${screenId}/seats`);
const seats = await response.json();
```

In `useSeatSelection.ts`:

```typescript
// Replace mock booking with real API
const booking = await fetch("/api/bookings", {
  method: "POST",
  body: JSON.stringify({
    movieId,
    screenId,
    seats: selectedSeats,
    userId,
  }),
});
```

## Future Enhancements

- [ ] Real-time seat availability updates (WebSocket)
- [ ] Seat recommendations based on viewing angle
- [ ] Couple seat selection (mark 2 seats as couple)
- [ ] Wheelchair accessible seat markers
- [ ] Dynamic pricing based on show timing
- [ ] Seat hold timer countdown
- [ ] Seat comparison view
- [ ] Theater layout visualization

## Interview Discussion Points

1. **Concurrency**: Discuss trade-offs between different locking strategies
2. **Scalability**: How to handle 1000+ concurrent users
3. **Consistency**: Eventual vs immediate consistency
4. **Performance**: Lock duration optimization
5. **Resilience**: Failure scenarios and recovery
6. **UX**: Balance between consistency and responsiveness
7. **Testing**: How to test concurrent scenarios
8. **Monitoring**: Track booking success rates and conflicts

## Technologies

- React 18+
- TypeScript
- Custom Hooks
- CSS3 (with variables)
- ES6+

## Author Notes

This implementation demonstrates enterprise-level thinking about concurrency, fault tolerance, and scalability. Choose strategies based on actual traffic patterns and requirements, not arbitrary preferences.
