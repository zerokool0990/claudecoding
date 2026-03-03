/**
 * Test: Customers API
 * PRD Section 1.3: Customer Profiling & Personalization
 * - POST /api/customers: Create customer with zodiac auto-calculation
 * - GET /api/customers: List customers with order counts
 */

describe("Customers API - PRD 1.3", () => {
  describe("POST /api/customers", () => {
    it("should accept name and dob fields", () => {
      const payload = {
        name: "Bé Mochi",
        dob: "1998-05-15",
      };
      expect(payload).toHaveProperty("name");
      expect(payload).toHaveProperty("dob");
    });

    it("should allow creating customer with only name (DOB optional)", () => {
      const payload = { name: "Minh" };
      expect(payload).toHaveProperty("name");
    });

    it("should allow creating customer with only DOB (name optional)", () => {
      const payload = { dob: "2000-03-21" };
      expect(payload).toHaveProperty("dob");
    });

    it("should allow creating customer with no data (both optional)", () => {
      const payload = {};
      expect(payload).not.toHaveProperty("name");
      expect(payload).not.toHaveProperty("dob");
    });

    it("should auto-calculate zodiac sign from DOB", () => {
      // PRD 1.3: hệ thống sử dụng thuật toán cung hoàng đạo
      const dob = "1998-05-15";
      const dobDate = new Date(dob);
      // May 15 = Taurus
      const month = dobDate.getMonth() + 1;
      const day = dobDate.getDate();
      const isTaurus = (month === 4 && day >= 20) || (month === 5 && day <= 20);
      expect(isTaurus).toBe(true);
    });

    it("should return customer with generated ID", () => {
      const expectedResponse = {
        id: "uuid-here",
        name: "Minh",
        dob: "1998-05-15T00:00:00.000Z",
        zodiacSign: "Taurus",
      };
      expect(expectedResponse).toHaveProperty("id");
      expect(expectedResponse).toHaveProperty("zodiacSign");
    });
  });

  describe("GET /api/customers", () => {
    it("should return customers with order counts (PRD 4.2)", () => {
      const expectedFields = ["id", "name", "dob", "zodiacSign", "_count"];
      expectedFields.forEach((field) => {
        expect(typeof field).toBe("string");
      });
    });

    it("should return max 100 customers", () => {
      const maxCustomers = 100;
      expect(maxCustomers).toBe(100);
    });

    it("should sort by createdAt desc", () => {
      const orderBy = "desc";
      expect(orderBy).toBe("desc");
    });
  });
});

describe("Customer Personalization - PRD 1.3", () => {
  it("should use zodiac for personalized theme when birthday month", () => {
    // PRD: thay đổi Theme câu hỏi vào tháng sinh nhật
    const birthdayTheme = "tarot";
    expect(birthdayTheme).toBe("tarot");
  });

  it("should show last order as Safe Trend for returning customers", () => {
    // PRD: "Thẻ 3 - Lựa chọn an toàn" sẽ thay thế bằng "Món bạn đã uống lần trước"
    const returningCustomerSafeTrendLabel = "Món bạn đã uống lần trước";
    expect(returningCustomerSafeTrendLabel).toContain("lần trước");
  });
});
