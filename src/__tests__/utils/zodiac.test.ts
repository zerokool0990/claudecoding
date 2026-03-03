/**
 * Test: Zodiac Utility Functions
 * PRD Section 1.3: Zodiac Sign calculation & Birthday month detection
 * - Khi khách nhập Ngày sinh, hệ thống sử dụng thuật toán cung hoàng đạo
 * - Thay đổi Theme câu hỏi vào tháng sinh nhật
 */
import { getZodiacSign, isBirthdayMonth } from "@/lib/utils/zodiac";

describe("getZodiacSign", () => {
  const testCases: { dob: string; expected: string }[] = [
    // Aries: Mar 21 - Apr 19
    { dob: "1995-03-21", expected: "Aries" },
    { dob: "1990-04-19", expected: "Aries" },
    // Taurus: Apr 20 - May 20
    { dob: "2000-04-20", expected: "Taurus" },
    { dob: "1998-05-20", expected: "Taurus" },
    // Gemini: May 21 - Jun 20
    { dob: "1992-05-21", expected: "Gemini" },
    { dob: "1997-06-20", expected: "Gemini" },
    // Cancer: Jun 21 - Jul 22
    { dob: "1993-06-21", expected: "Cancer" },
    { dob: "1988-07-22", expected: "Cancer" },
    // Leo: Jul 23 - Aug 22
    { dob: "1994-07-23", expected: "Leo" },
    { dob: "2001-08-22", expected: "Leo" },
    // Virgo: Aug 23 - Sep 22
    { dob: "1996-08-23", expected: "Virgo" },
    { dob: "1991-09-22", expected: "Virgo" },
    // Libra: Sep 23 - Oct 22
    { dob: "1999-09-23", expected: "Libra" },
    { dob: "1987-10-22", expected: "Libra" },
    // Scorpio: Oct 23 - Nov 21
    { dob: "1985-10-23", expected: "Scorpio" },
    { dob: "2002-11-21", expected: "Scorpio" },
    // Sagittarius: Nov 22 - Dec 21
    { dob: "1990-11-22", expected: "Sagittarius" },
    { dob: "1995-12-21", expected: "Sagittarius" },
    // Capricorn: Dec 22 - Jan 19
    { dob: "1998-12-22", expected: "Capricorn" },
    { dob: "2000-01-19", expected: "Capricorn" },
    // Aquarius: Jan 20 - Feb 18
    { dob: "1993-01-20", expected: "Aquarius" },
    { dob: "1997-02-18", expected: "Aquarius" },
    // Pisces: Feb 19 - Mar 20
    { dob: "1992-02-19", expected: "Pisces" },
    { dob: "1988-03-20", expected: "Pisces" },
  ];

  testCases.forEach(({ dob, expected }) => {
    it(`should return ${expected} for DOB ${dob}`, () => {
      expect(getZodiacSign(new Date(dob))).toBe(expected);
    });
  });

  it("should return a valid zodiac sign for any date", () => {
    const validSigns = [
      "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
      "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
    ];
    // Test every month
    for (let month = 1; month <= 12; month++) {
      const sign = getZodiacSign(new Date(2000, month - 1, 15));
      expect(validSigns).toContain(sign);
    }
  });
});

describe("isBirthdayMonth", () => {
  it("should return true when DOB month matches current month", () => {
    const now = new Date();
    const dob = new Date(1995, now.getMonth(), 15);
    expect(isBirthdayMonth(dob)).toBe(true);
  });

  it("should return false when DOB month does not match current month", () => {
    const now = new Date();
    // Use a different month
    const differentMonth = (now.getMonth() + 6) % 12;
    const dob = new Date(1995, differentMonth, 15);
    expect(isBirthdayMonth(dob)).toBe(false);
  });
});
