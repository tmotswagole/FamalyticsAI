describe("Get Plans API", () => {
  beforeEach(() => {
    // Mock authentication
    cy.intercept("POST", "/api/auth/**", { statusCode: 200 }).as("auth");

    // Login first to get authenticated
    cy.visit("/sign-in");
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get("button").contains("Sign in").click();
  });

  it("should fetch pricing plans", () => {
    // Mock the GET response
    cy.intercept("GET", "/api/get-plans", {
      statusCode: 200,
      fixture: "pricing-plans.json",
    }).as("getPlans");

    // Make the API request
    cy.request("/api/get-plans").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.at.least(1);

      // Check the structure of the first plan
      const firstPlan = response.body[0];
      expect(firstPlan).to.have.property("id");
      expect(firstPlan).to.have.property("name");
      expect(firstPlan).to.have.property("amount");
      expect(firstPlan).to.have.property("interval");
      expect(firstPlan).to.have.property("features").that.is.an("array");
    });
  });

  it("should handle Stripe API errors gracefully", () => {
    // Mock an error response
    cy.intercept("GET", "/api/get-plans", {
      statusCode: 400,
      body: { error: "Error fetching plans from Stripe" },
    }).as("getPlansError");

    // Make the API request
    cy.request({
      url: "/api/get-plans",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("error");
    });
  });

  it("should sort plans by price", () => {
    // Mock the GET response with multiple plans
    cy.intercept("GET", "/api/get-plans", {
      statusCode: 200,
      body: [
        {
          id: "price_pro",
          name: "Pro",
          amount: 7900,
          interval: "month",
          features: ["Feature 1", "Feature 2"],
          popular: true,
        },
        {
          id: "price_starter",
          name: "Starter",
          amount: 2900,
          interval: "month",
          features: ["Feature 1"],
          popular: false,
        },
        {
          id: "price_enterprise",
          name: "Enterprise",
          amount: 19900,
          interval: "month",
          features: ["Feature 1", "Feature 2", "Feature 3"],
          popular: false,
        },
      ],
    }).as("getPlansMultiple");

    // Make the API request
    cy.request("/api/get-plans").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.eq(3);

      // Check that plans are sorted by price (ascending)
      expect(response.body[0].amount).to.be.lessThan(response.body[1].amount);
      expect(response.body[1].amount).to.be.lessThan(response.body[2].amount);
    });
  });
});
