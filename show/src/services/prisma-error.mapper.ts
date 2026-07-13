import { Prisma } from "@prisma/client";
import { RetryableError, NonRetryableError } from "@adarsh-tickets/shared";

export class PrismaErrorMapper {
  static map(error: unknown): never {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      throw error;
    }

    switch (error.code) {
      // Record not found
      case "P2025":
        throw new RetryableError(
          error.meta?.cause?.toString() ?? "Required record was not found.",
        );

      // Unique constraint violation
      case "P2002":
        throw new NonRetryableError("Unique constraint violation.");

      // Foreign key violation
      case "P2003":
        throw new NonRetryableError("Foreign key constraint failed.");

      // Database unavailable
      case "P1001":
      case "P1002":
      case "P1008":
      case "P1017":
        throw new RetryableError("Database temporarily unavailable.");

      default:
        throw new NonRetryableError(error?.message);
    }
  }
}
