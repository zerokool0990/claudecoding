import { describe, it, expect, vi, afterEach } from "vitest";
import { getZodiacSign, isBirthdayMonth } from "@/lib/utils/zodiac";

describe("getZodiacSign", () => {
  it("returns Aries for Mar 21 - Apr 19", () => {
    expect(getZodiacSign(new Date("2000-03-21"))).toBe("Aries");
    expect(getZodiacSign(new Date("2000-04-19"))).toBe("Aries");
  });

  it("returns Taurus for Apr 20 - May 20", () => {
    expect(getZodiacSign(new Date("2000-04-20"))).toBe("Taurus");
    expect(getZodiacSign(new Date("2000-05-20"))).toBe("Taurus");
  });

  it("returns Gemini for May 21 - Jun 20", () => {
    expect(getZodiacSign(new Date("2000-05-21"))).toBe("Gemini");
    expect(getZodiacSign(new Date("2000-06-20"))).toBe("Gemini");
  });

  it("returns Cancer for Jun 21 - Jul 22", () => {
    expect(getZodiacSign(new Date("2000-06-21"))).toBe("Cancer");
    expect(getZodiacSign(new Date("2000-07-22"))).toBe("Cancer");
  });

  it("returns Leo for Jul 23 - Aug 22", () => {
    expect(getZodiacSign(new Date("2000-07-23"))).toBe("Leo");
    expect(getZodiacSign(new Date("2000-08-22"))).toBe("Leo");
  });

  it("returns Virgo for Aug 23 - Sep 22", () => {
    expect(getZodiacSign(new Date("2000-08-23"))).toBe("Virgo");
    expect(getZodiacSign(new Date("2000-09-22"))).toBe("Virgo");
  });

  it("returns Libra for Sep 23 - Oct 22", () => {
    expect(getZodiacSign(new Date("2000-09-23"))).toBe("Libra");
    expect(getZodiacSign(new Date("2000-10-22"))).toBe("Libra");
  });

  it("returns Scorpio for Oct 23 - Nov 21", () => {
    expect(getZodiacSign(new Date("2000-10-23"))).toBe("Scorpio");
    expect(getZodiacSign(new Date("2000-11-21"))).toBe("Scorpio");
  });

  it("returns Sagittarius for Nov 22 - Dec 21", () => {
    expect(getZodiacSign(new Date("2000-11-22"))).toBe("Sagittarius");
    expect(getZodiacSign(new Date("2000-12-21"))).toBe("Sagittarius");
  });

  it("returns Capricorn for Dec 22 - Jan 19", () => {
    expect(getZodiacSign(new Date("2000-12-22"))).toBe("Capricorn");
    expect(getZodiacSign(new Date("2000-01-19"))).toBe("Capricorn");
  });

  it("returns Aquarius for Jan 20 - Feb 18", () => {
    expect(getZodiacSign(new Date("2000-01-20"))).toBe("Aquarius");
    expect(getZodiacSign(new Date("2000-02-18"))).toBe("Aquarius");
  });

  it("returns Pisces for Feb 19 - Mar 20", () => {
    expect(getZodiacSign(new Date("2000-02-19"))).toBe("Pisces");
    expect(getZodiacSign(new Date("2000-03-20"))).toBe("Pisces");
  });

  // Edge cases
  it("handles leap year Feb 29 as Pisces", () => {
    expect(getZodiacSign(new Date("2000-02-29"))).toBe("Pisces");
  });

  it("handles Jan 1 as Capricorn", () => {
    expect(getZodiacSign(new Date("2000-01-01"))).toBe("Capricorn");
  });

  it("handles Dec 31 as Capricorn", () => {
    expect(getZodiacSign(new Date("2000-12-31"))).toBe("Capricorn");
  });
});

describe("isBirthdayMonth", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true when DOB month matches current month", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    expect(isBirthdayMonth(new Date("1995-03-10"))).toBe(true);
  });

  it("returns false when DOB month does not match current month", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    expect(isBirthdayMonth(new Date("1995-07-10"))).toBe(false);
  });

  it("works for December", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-12-01"));
    expect(isBirthdayMonth(new Date("1990-12-25"))).toBe(true);
  });

  it("works for January", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15"));
    expect(isBirthdayMonth(new Date("2000-01-01"))).toBe(true);
  });
});
