describe("Analytics", () => {
  beforeEach(() => {
    // Mock authentication and API responses
    cy.intercept("POST", "/api/auth/**", { statusCode: 200 }).as("auth");
    cy.intercept("GET", "/api/analytics*", { fixture: "analytics.json" }).as(
      "getAnalytics",
    );

    // Login and visit analytics page
    cy.visit("/sign-in");
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get("button").contains("Sign in").click();
    cy.visit("/dashboard/analytics");
  });

  it("should display analytics page", () => {
    cy.get("h1").should("contain", "Website Analytics");
    cy.get("div").contains("Real-time Active Users").should("exist");
    cy.get("div").contains("Total Sessions").should("exist");
    cy.get("div").contains("Total Users").should("exist");
    cy.get("div").contains("Page Views").should("exist");
  });

  it("should display engagement metrics chart", () => {
    cy.get("h2").contains("Daily Engagement Metrics").should("be.visible");
    cy.get("canvas").should("be.visible");
  });

  it("should change date range", () => {
    cy.get("select").select("30 Days");
    cy.wait("@getAnalytics");
    cy.get("canvas").should("be.visible");

    cy.get("select").select("90 Days");
    cy.wait("@getAnalytics");
    cy.get("canvas").should("be.visible");

    cy.get("select").select("7 Days");
    cy.wait("@getAnalytics");
    cy.get("canvas").should("be.visible");
  });
});
