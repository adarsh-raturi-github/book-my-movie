/**
 * Concurrent Booking Handler
 *
 * This module demonstrates strategies for handling concurrent seat bookings
 * where multiple users might try to book the same seats simultaneously.
 */

import type { Seat, ConcurrentBookingRequest, SeatLock } from "../types/seat";

/**
 * Strategy 1: Optimistic Locking with Version Control
 * Use when you expect low conflict rates
 */
export class OptimisticBookingHandler {
  private seatLocks: Map<string, SeatLock> = new Map();
  private lockDuration = 300000; // 5 minutes

  async acquireLock(seatId: string, userId: string): Promise<string> {
    const lockId = `lock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.lockDuration);

    const lock: SeatLock = {
      seatId,
      userId,
      lockedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    this.seatLocks.set(lockId, lock);

    // Auto-release lock after duration
    setTimeout(() => {
      this.seatLocks.delete(lockId);
    }, this.lockDuration);

    return lockId;
  }

  isLocked(seatId: string, userId: string): boolean {
    for (const [_, lock] of this.seatLocks.entries()) {
      if (lock.seatId === seatId && lock.userId !== userId) {
        const expiresAt = new Date(lock.expiresAt);
        if (expiresAt > new Date()) {
          return true;
        }
      }
    }
    return false;
  }

  releaseLock(lockId: string): boolean {
    return this.seatLocks.delete(lockId);
  }

  extendLock(lockId: string, additionalTime: number): boolean {
    const lock = this.seatLocks.get(lockId);
    if (lock) {
      const newExpiry = new Date(new Date().getTime() + additionalTime);
      lock.expiresAt = newExpiry.toISOString();
      return true;
    }
    return false;
  }
}

/**
 * Strategy 2: Pessimistic Locking
 * Use when you expect high conflict rates or strict consistency
 */
export class PessimisticBookingHandler {
  private lockedSeats: Set<string> = new Set();
  private seatOwners: Map<string, string> = new Map();

  canLockSeat(seatId: string): boolean {
    return !this.lockedSeats.has(seatId);
  }

  lockSeat(seatId: string, userId: string): boolean {
    if (this.lockedSeats.has(seatId)) {
      return false;
    }
    this.lockedSeats.add(seatId);
    this.seatOwners.set(seatId, userId);
    return true;
  }

  unlockSeat(seatId: string, userId: string): boolean {
    if (this.seatOwners.get(seatId) === userId) {
      this.lockedSeats.delete(seatId);
      this.seatOwners.delete(seatId);
      return true;
    }
    return false;
  }

  getLockOwner(seatId: string): string | undefined {
    return this.seatOwners.get(seatId);
  }
}

/**
 * Strategy 3: Queue-based Booking with Transaction Support
 * Ensures sequential processing and atomic operations
 */
export class QueuedBookingHandler {
  private bookingQueue: ConcurrentBookingRequest[] = [];
  private processing = false;
  private processedBookings = new Map<string, boolean>();

  enqueueBooking(request: ConcurrentBookingRequest): string {
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.bookingQueue.push(request);
    this.processQueue();
    return bookingId;
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.bookingQueue.length === 0) {
      return;
    }

    this.processing = true;

    try {
      while (this.bookingQueue.length > 0) {
        const booking = this.bookingQueue.shift();
        if (booking) {
          await this.processBooking(booking);
        }
      }
    } finally {
      this.processing = false;
    }
  }

  private async processBooking(
    request: ConcurrentBookingRequest,
  ): Promise<void> {
    // Simulate atomic transaction
    return new Promise((resolve) => {
      setTimeout(() => {
        // Process booking
        this.processedBookings.set(request.userId, true);
        resolve();
      }, 100);
    });
  }

  getBookingStatus(userId: string): boolean {
    return this.processedBookings.get(userId) ?? false;
  }
}

/**
 * Retry Strategy for Failed Bookings
 */
export class RetryableBookingHandler {
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  async bookWithRetry(
    seatIds: string[],
    userId: string,
    bookingFn: (seatIds: string[], userId: string) => Promise<boolean>,
  ): Promise<{ success: boolean; attempt: number; error?: string }> {
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < this.maxRetries) {
      try {
        attempt++;
        const success = await bookingFn(seatIds, userId);

        if (success) {
          return { success: true, attempt };
        }

        // Wait before retry
        await this.delay(this.retryDelay * attempt);
      } catch (error) {
        lastError = error as Error;
      }
    }

    return {
      success: false,
      attempt,
      error: lastError?.message || "Booking failed after retries",
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Circuit Breaker Pattern for Booking Service
 * Prevents cascading failures
 */
export class CircuitBreakerBookingHandler {
  private failureCount = 0;
  private successCount = 0;
  private state: "closed" | "open" | "half-open" = "closed";
  private failureThreshold = 5;
  private successThreshold = 2;
  private timeout = 30000; // 30 seconds

  async executeBooking(
    bookingFn: () => Promise<boolean>,
  ): Promise<{ success: boolean; circuitOpen: boolean }> {
    if (this.state === "open") {
      throw new Error("Circuit breaker is OPEN. Service unavailable.");
    }

    try {
      const success = await bookingFn();

      if (this.state === "half-open") {
        this.successCount++;
        if (this.successCount >= this.successThreshold) {
          this.state = "closed";
          this.failureCount = 0;
          this.successCount = 0;
        }
      }

      return { success, circuitOpen: false };
    } catch (error) {
      this.failureCount++;

      if (this.failureCount >= this.failureThreshold) {
        this.state = "open";
        setTimeout(() => {
          this.state = "half-open";
          this.failureCount = 0;
        }, this.timeout);
      }

      throw error;
    }
  }

  getCircuitState(): string {
    return `Circuit State: ${this.state}, Failures: ${this.failureCount}, Successes: ${this.successCount}`;
  }
}
