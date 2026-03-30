import { describe, it, expect } from "vitest";
import { timeToMinutes, calculateShiftHours } from "../../src/utils/calculations.js";

describe("Shift Calculation Utilities", () => {
  
  describe("timeToMinutes", () => {
    it("should convert morning time to minutes", () => {
      expect(timeToMinutes("09:00")).toBe(540);
    });

    it("should convert evening time to minutes", () => {
      expect(timeToMinutes("23:30")).toBe(1410);
    });

    it("should handle midnight", () => {
      expect(timeToMinutes("00:00")).toBe(0);
    });
  });

  describe("calculateShiftHours", () => {
    it("should calculate standard day shift correctly", () => {
      // 09:00 to 17:00 (8 hours) with no break
      expect(calculateShiftHours("09:00", "17:00", 0)).toBe(8);
    });

    it("should subtract break duration correctly", () => {
      // 09:00 to 17:00 (8 hours) with 30 min break (7.5 hours)
      expect(calculateShiftHours("09:00", "17:00", 30)).toBe(7.5);
    });

    it("should handle overnight shifts correctly (cross midnight)", () => {
      // 22:00 to 06:00 (8 hours)
      expect(calculateShiftHours("22:00", "06:00", 0)).toBe(8);
    });

    it("should handle overnight shifts with breaks", () => {
      // 22:00 to 06:00 (8 hours) with 60 min break (7 hours)
      expect(calculateShiftHours("22:00", "06:00", 60)).toBe(7);
    });

    it("should round to 2 decimal places", () => {
      // 09:00 to 10:10 = 70 mins = 1.1666... hours
      expect(calculateShiftHours("09:00", "10:10", 0)).toBe(1.17);
    });
  });
});
