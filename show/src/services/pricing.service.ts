import { ScreenTypeEnum, SeatTypeEnum } from "@adarsh-tickets/shared";

export class PricingService {
  /**
   * Calculates the ticket price for a seat.
   *
   * Currently uses static pricing.
   * Later this can support:
   * - Weekend pricing
   * - Dynamic pricing
   * - Festival pricing
   * - Movie-specific pricing
   * - Promotions
   */
  calculateSeatPrice(
    screenType: ScreenTypeEnum,
    seatType: SeatTypeEnum,
  ): number {
    // Base price based on screen type
    let basePrice = 0;

    switch (screenType) {
      case ScreenTypeEnum.REGULAR:
        basePrice = 200;
        break;

      case ScreenTypeEnum.IMAX:
        basePrice = 450;
        break;

      case ScreenTypeEnum.DOLBY:
        basePrice = 350;
        break;

      case ScreenTypeEnum.FOUR_DX:
        basePrice = 600;
        break;

      default:
        throw new Error("Unsupported screen type");
    }

    // Seat premium
    switch (seatType) {
      case SeatTypeEnum.REGULAR:
        return basePrice;

      case SeatTypeEnum.PREMIUM:
        return basePrice + 100;

      case SeatTypeEnum.RECLINER:
        return basePrice + 250;

      case SeatTypeEnum.WHEELCHAIR:
        // Same price as regular seat
        return basePrice;

      default:
        throw new Error("Unsupported seat type");
    }
  }
}

export const pricingService = new PricingService();
