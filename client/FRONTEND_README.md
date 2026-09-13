# BookMyMovie - Frontend Home Page

A professional React TypeScript home page for a movie booking application, built for SDE2 interview preparation.

## Project Structure

```
client/src/
├── components/          # Reusable React components
│   ├── Header.tsx      # Navigation header
│   ├── HeroSection.tsx # Featured movie section
│   ├── SearchFilter.tsx # Search and genre filter
│   ├── MovieCard.tsx   # Individual movie card
│   ├── MoviesGrid.tsx  # Movie grid layout
│   ├── CTASection.tsx  # Call-to-action section
│   ├── Footer.tsx      # Footer component
│   ├── Seat.tsx        # Individual seat button
│   ├── SeatRow.tsx     # Row of seats
│   ├── SeatLayout.tsx  # Complete seat grid
│   ├── SeatLegend.tsx  # Seat status legend
│   ├── SeatSummary.tsx # Booking summary sidebar
│   ├── types.ts        # TypeScript interfaces
│   └── index.ts        # Component exports
├── pages/              # Full page components
│   └── SeatSelectionPage.tsx # Complete seat selection flow
├── hooks/              # Custom React hooks
│   ├── useMovies.ts       # Fetch and manage movies
│   ├── useBooking.ts      # Booking functionality
│   ├── useSeatSelection.ts # Seat selection state management
│   ├── useSeatData.ts     # Fetch seat data
│   └── index.ts           # Hook exports
├── services/           # Business logic
│   └── concurrentBookingHandler.ts # 5 booking strategies
├── types/              # TypeScript definitions
│   └── seat.ts         # Seat system types
├── constants/          # Application constants
│   └── index.ts        # API endpoints, genres, mock data
├── utils/              # Utility functions
│   ├── helpers.ts      # Helper functions
│   └── seatUtils.ts    # Seat-specific utilities
├── styles/             # CSS files
│   └── SeatSelection.css # Seat layout styling
├── examples/           # Integration examples
│   └── SeatSelectionIntegration.tsx
├── App.tsx             # Main application component
├── App.css             # Global styles
├── main.tsx            # Entry point
└── index.css           # Global CSS
```

## Key Features

### ✨ Component Architecture

- **Modular Components**: Each section is a separate, reusable component
- **Props-based Communication**: Clean data flow using TypeScript interfaces
- **Single Responsibility**: Each component handles one specific feature

### 🎨 Styling

- Modern CSS with CSS variables for theming
- Gradient backgrounds and smooth animations
- Fully responsive design (mobile, tablet, desktop)
- Dark theme optimized for movie browsing

### 🔧 Advanced React Patterns

- **Custom Hooks**: `useMovies` for data fetching, `useBooking` for booking logic
- **useMemo**: Optimized filtering logic to prevent unnecessary re-renders
- **useCallback**: Memoized event handlers
- **TypeScript**: Full type safety throughout

### 📱 Responsive Design

- Mobile-first approach
- Breakpoints for tablets (768px) and phones (480px)
- Flexible grid layout for movie cards
- Adaptive navigation menu

### 🎯 SDE2 Interview Highlights

1. **Code Organization**
   - Clear separation of concerns
   - Modular component structure
   - Centralized constants and utilities

2. **React Best Practices**
   - Functional components with hooks
   - Proper state management
   - Performance optimizations (useMemo, useCallback)

3. **TypeScript**
   - Strong type definitions
   - Interface-based prop passing
   - Type safety for data structures

4. **Performance**
   - Memoized computations
   - Lazy loading ready
   - Optimized re-renders

5. **Accessibility**
   - Semantic HTML
   - Proper heading hierarchy
   - Alt text for images

## Components Overview

### Header

- Sticky navigation with active link indicators
- Logo with gradient effect
- Sign-in button
- Navigation links with hover effects

### HeroSection

- Featured movie display
- Background image with overlay
- Movie details (rating, genres)
- Call-to-action button

### SearchFilter

- Real-time search input
- Genre filter buttons
- Active state indicators
- Responsive layout

### MovieCard

- Poster image with hover effect
- Movie information (title, rating, genre)
- Book tickets overlay button
- Smooth animations

### MoviesGrid

- Dynamic grid layout
- Movie count display
- No results state handling
- Responsive columns

### CTASection

- Newsletter subscription prompt
- Gradient background
- Call-to-action button

### SeatSelectionPage

**Purpose**: Full seat selection flow with category tabs, seat grid, legend, and booking summary

**Why Needed**:

- Orchestrates all seat components
- Manages page-level state and navigation
- Integrates with hooks for seat data and selection
- Provides complete booking interface

**Usage**:

```typescript
<SeatSelectionPage
  movieId="movie_1"
  movieTitle="The Quantum Paradox"
  screenId="screen_5"
  showTime="7:00 PM - 9:30 PM"
/>
```

**Key Props**:

- `movieId`: Movie identifier
- `movieTitle`: Display movie name
- `screenId`: Theater screen ID
- `showTime`: Show timing display

**Features**:

- Category filtering tabs (All, Premium, Standard, Economy)
- Real-time seat selection
- Automatic price calculation
- Sticky header with back button
- Responsive sidebar/full-width layout

---

## Seat Components

### Seat.tsx

**Purpose**: Individual clickable seat button

**Why Needed**:

- Atomic unit of seat selection UI
- Handles individual seat state
- Provides visual feedback (hover, selected, booked)
- Independent, reusable component

**Props**:

```typescript
interface SeatProps {
  seat: Seat;
  onSelect: (seat: Seat) => void;
  isSelected: boolean;
}
```

**Usage**:

```typescript
<Seat
  seat={seatData}
  onSelect={handleSeatClick}
  isSelected={isSelected}
/>
```

---

### SeatRow.tsx

**Purpose**: Displays a horizontal row of seats with row label

**Why Needed**:

- Organizes seats into rows
- Adds row letter (A, B, C...)
- Manages multiple seat components
- Ensures proper alignment and spacing

**Props**:

```typescript
interface SeatRowProps {
  row: string; // Row letter
  seats: Seat[]; // Seats in this row
  selectedSeats: Seat[]; // Currently selected
  onSeatSelect: (seat: Seat) => void;
}
```

**Composition**: SeatRow contains Seat × N

---

### SeatLayout.tsx

**Purpose**: Complete seat grid organized by rows and category

**Why Needed**:

- Groups all seat rows together
- HanSeat Selection Feature\*\*:
  - Why modular components matter (testability, reusability)
  - Concurrent booking patterns (5 strategies explained)
  - State management across multiple components
  - Performance optimization (memoization)

2. **Component Design**:
   - Explain Seat → SeatRow → SeatLayout hierarchy
   - Data flow from parent to child
   - Event propagation up the tree
   - Why SeatSummary is separate (single responsibility)

3. **Concurrent Booking**:
   - Optimistic vs Pessimistic locking trade-offs
   - Lock expiration strategy
   - Failure recovery patterns
   - When to use each strategy

4. **React Patterns**:
   - Custom hooks for business logic
   - Component composition over inheritance
   - Performance optimization (useMemo, useCallback)
   - Type safety with TypeScript

5. **Scalability**:
   - Mock data → Real API migration
   - WebSocket for real-time updates
   - Caching strategies
   - Database considerations

---

## How to Test Seat Selection

```bash
# 1. Start dev server
npm run dev

# 2. Navigate to http://localhost:5173

# 3. Click any "Book" button on a movie

# 4. Test scenarios:
   - Select multiple seats (check price updates)
   - Toggle seat selection (should deselect)
   - Click "Clear Selection" (reset all)
   - Check different seat categories
   - Try booking (will simulate)

# 5. Test concurrent booking:
   - Open 2 tabs to same seat page
   - Try booking same seat in both
   - Observe conflict resolution
```

---

## Component Communication Diagram

```
App.tsx
├── (Home Mode) → HomePage
│   ├── Header
│   ├── HeroSection
│   ├── SearchFilter
│   ├── MoviesGrid (Movie[] → onBookClick)
│   ├── CTASection
│   └── Footer
│
└── (Seats Mode) → SeatSelectionPage
    ├── useSeatData (Fetch seats)
    ├── useSeatSelection (Manage selection)
    ├── Header (Back to home)
    ├── Category Tabs
    ├── SeatLayout
    │   └── SeatRow[] → Seat[] (onSelect)
    ├── SeatLegend
    └── SeatSummary (Display prices)
```

---

## Technologies & Best Practices

**React**:

- Functional components
- Hooks-based state management
- Custom hooks for logic extraction
- Composition over inheritance

**TypeScript**:

- Strong typing throughout
- Interface-based contracts
- Type safety for props
- Compile-time error detection

**CSS**:

- CSS variables for theming
- Mobile-first responsive design
- CSS Grid and Flexbox layouts
- Smooth animations

**State Management**:

- `useState` for component state
- `useMemo` for expensive calculations
- Custom hooks for shared logic
- Local state when possible

**Performance**:

- Memoized computations
- Debounced search
- Component code splitting ready
- Lazy loading ready

---

## Deployment

### Build

```bash
npm run build
```

### Output

- Optimized bundle in `dist/`
- Tree-shaking removes unused code
- Code splitting for chunks
- Source maps for debugging

### Environment Variables

Create `.env`:

```
VITE_API_URL=https://api.bookmymovie.com
```

### Run Production Build

```bash
npm run preview
```

---

## Interview Talking Point

seats: Seat[]
selectedSeats: Seat[]
category?: SeatCategory
onSeatSelect: (seat: Seat) => void
}

````

**Usage**:
```typescript
// Show all seats
<SeatLayout seats={allSeats} ... />

// Show only premium seats
<SeatLayout seats={allSeats} category="premium" ... />
````

**Composition**: SeatLayout → SeatRow × N → Seat × N

---

### SeatLegend.tsx

**Purpose**: Color-coded legend showing seat statuses

**Why Needed**:

- Educates users about seat states
- Shows meaning of colors
- Improves UI clarity
- Standard in booking interfaces

**Visual Reference**:

- 🔵 Blue: Available seats
- 🩷 Pink: Your selected seats
- ⚪ Gray: Already booked
- 🔴 Red: Blocked seats

---

### SeatSummary.tsx

**Purpose**: Sidebar showing booking summary and total cost

**Why Needed**:

- Real-time price calculation
- Selected seats preview
- Convenience fee display
- Call-to-action buttons
- User confirmation before payment

**Displays**:

- Number of seats selected
- Individual seat prices
- Subtotal
- Convenience fee (5%)
- **Total price**

**Actions**:

- Clear Selection (reset)
- Proceed to Payment (confirm)

**Composition**: Shows selected seats list + price breakdown

---

## Custom Hooks (Seat Feature)

### useSeatSelection.ts

**Purpose**: Manages seat selection state and booking logic

**Why Needed**:

- Centralized seat selection logic
- Toggle seat state
- Track multiple selections
- Handle booking submission
- Manage loading/error states

**API**:

```typescript
const {
  selectedSeats, // Array of selected Seat objects
  toggleSeat, // (seat: Seat) => void
  clearSelection, // () => void
  processBooking, // () => Promise<void>
  getStats, // () => { selectedCount, totalPrice, maxSeats }
  isProcessing, // boolean
  error, // string | null
  lockId, // string (booking lock ID)
} = useSeatSelection({ movieId, screenId });
```

**Usage**:

```typescript
const { selectedSeats, toggleSeat, processBooking } = useSeatSelection({
  movieId: "1",
  screenId: "5",
});

const handleSeatClick = (seat: Seat) => {
  toggleSeat(seat); // Toggle selection
};

const handleBook = async () => {
  await processBooking(); // Submit booking
};
```

---

### useSeatData.ts

**Purpose**: Fetches and manages seat availability data

**Why Needed**:

- Handles seat data fetching
- Generates mock seat layout
- Updates seat status (booked, blocked)
- Manages loading/error states

**API**:

```typescript
const {
  seats, // Array of all available seats
  loading, // boolean
  error, // string | null
  setSeatStatus, // (seatId: string, status: SeatStatus) => void
} = useSeatData(screenId, rows, seatsPerRow);
```

**Default Config**:

- 10 rows (A-J)
- 12 seats per row
- Pricing: Premium ₹250, Standard ₹200, Economy ₹150

**Usage**:

```typescript
const { seats } = useSeatData("screen_5", 10, 12);

// Update a seat's status
setSeatStatus("A-1", "booked");
```

---

## Utility Functions

### seatUtils.ts

**Why Needed**: Encapsulates seat-related business logic

**Key Functions**:

| Function                  | Purpose                              | Example                           |
| ------------------------- | ------------------------------------ | --------------------------------- |
| `generateSeats()`         | Create seat grid with pricing        | `generateSeats(10, 12)`           |
| `groupSeatsByRow()`       | Organize seats by row letter         | Returns Map<string, Seat[]>       |
| `groupSeatsByCategory()`  | Organize by premium/standard/economy | Returns Map<SeatCategory, Seat[]> |
| `calculatePrice()`        | Sum of selected seat prices          | `calculatePrice([seat1, seat2])`  |
| `validateSeatSelection()` | Check max seats limit                | Returns boolean                   |
| `getSeatStatusColor()`    | Get CSS color for status             | `"#6366f1"` for available         |
| `getSeatCategoryLabel()`  | Get display name                     | `"Premium Seats"`                 |

---

## Services (Concurrent Booking)

### concurrentBookingHandler.ts

**Purpose**: 5 strategies for handling concurrent seat bookings

**Why Needed**:

- Multiple users booking simultaneously
- Prevent double-booking
- Handle failures gracefully
- Production-ready patterns

**5 Strategies**:

#### 1. OptimisticBookingHandler

- **Use When**: Low conflict scenarios
- **How**: User proceeds immediately, conflict checked at confirmation
- **Lock Duration**: 5 minutes auto-release
- **Trade-off**: Better UX, eventual consistency

```typescript
const handler = new OptimisticBookingHandler();
const lockId = await handler.acquireLock(seatId, userId);
```

#### 2. PessimisticBookingHandler

- **Use When**: High conflict (>50% concurrent)
- **How**: Locks seat before user interaction
- **Guarantee**: Immediate consistency
- **Trade-off**: Lower throughput, longer wait

```typescript
const handler = new PessimisticBookingHandler();
const locked = handler.lockSeat(seatId, userId);
```

#### 3. QueuedBookingHandler

- **Use When**: Massive scale (1000+ req/sec)
- **How**: Sequential queue processing
- **Guarantee**: Atomic transactions, fair ordering
- **Trade-off**: 2-10 second wait, guaranteed success

```typescript
const handler = new QueuedBookingHandler();
const bookingId = handler.enqueueBooking(request);
```

#### 4. RetryableBookingHandler

- **Use When**: Unstable network
- **How**: Automatic retries with exponential backoff
- **Max Retries**: 3 (configurable)
- **Trade-off**: Resilience to transient failures

```typescript
const result = await handler.bookWithRetry(seatIds, userId, bookingFn);
```

#### 5. CircuitBreakerBookingHandler

- **Use When**: Critical system reliability needed
- **How**: Prevents cascading failures
- **States**: closed → open → half-open
- **Trade-off**: Better fault isolation, graceful degradation

```typescript
await handler.executeBooking(bookingFn);
```

---

## Type Definitions

### seat.ts

```typescript
type SeatStatus = "available" | "selected" | "booked" | "blocked";
type SeatCategory = "premium" | "standard" | "economy";

interface Seat {
  id: string; // "A-1"
  row: string; // "A"
  number: number; // 1
  status: SeatStatus;
  category: SeatCategory;
  price: number; // In rupees
}

interface SeatBooking {
  id: string;
  movieId: string;
  userId: string;
  seats: Seat[];
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  timestamp: string;
}

interface SeatLock {
  seatId: string;
  userId: string;
  lockedAt: string;
  expiresAt: string;
}
```

---

## How Seat Selection Works

**Flow**:

1. User clicks "Book" on movie → `SeatSelectionPage` loads
2. `useSeatData` fetches seats for screen
3. Seats render as `SeatLayout` → `SeatRow` → `Seat`
4. User clicks seats → `toggleSeat()` updates selection
5. `SeatSummary` displays real-time price
6. User clicks "Proceed" → `processBooking()` submits
7. Concurrent handler prevents double-booking
8. Success → navigate to payment

**Component Hierarchy**:

```
SeatSelectionPage
├── Header (back button)
├── Category Tabs
├── SeatLayout
│   └── SeatRow (×10 rows)
│       └── Seat (×12 seats)
├── SeatLegend
└── SeatSummary
    └── Selected seats list
```

---

### useMovies

```typescript
const { movies, loading, error } = useMovies({
  searchQuery: "",
  selectedGenre: null,
});
```

Handles movie data fetching and state management.

### useBooking

```typescript
const { bookMovie, getBookings } = useBooking();
```

Manages booking operations and local storage persistence.

## Utility Functions

- `formatDate()`: Format dates to readable string
- `formatRating()`: Format movie ratings
- `truncateText()`: Truncate long text
- `debounce()`: Debounce function calls
- `getCategoryIcon()`: Get emoji icon for genre

## Getting Started

### Installation

```bash
cd client
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## API Integration

The app is ready for API integration. Replace mock data in:

- `hooks/useMovies.ts` - Fetch movies from API
- `hooks/useBooking.ts` - Send booking requests
- `constants/index.ts` - Update API endpoints

## Performance Optimizations

- Memoized filtered movies list
- Debounced search input
- Image lazy loading ready
- Component code splitting ready

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Authentication system
- [ ] User bookings history
- [ ] Movie reviews and ratings
- [ ] Advanced filtering
- [ ] Theater selection
- [ ] Payment integration
- [ ] Notification system
- [ ] Dark/Light theme toggle

## Interview Talking Points

1. **Component Design**: Explain how each component is self-contained and reusable
2. **State Management**: Discuss custom hooks vs Context vs Redux
3. **Performance**: Talk about useMemo and useCallback optimizations
4. **TypeScript**: Highlight type safety benefits
5. **Scalability**: Explain how to scale from mock data to real API
6. **Testing**: Ready for unit and integration tests
7. **Accessibility**: Semantic HTML and ARIA considerations

## Technologies Used

- React 18+
- TypeScript
- Vite
- CSS3 (with CSS variables)
- ES6+

## Author

Created for SDE2 interview preparation demonstrating modern React development practices.
