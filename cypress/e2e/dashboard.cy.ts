describe("Dashboard", () => {
  beforeEach(() => {
    // Mock authentication
    cy.intercept("POST", "/api/auth/**", { statusCode: 200 }).as("auth");
    cy.intercept("GET", "/api/feedback*", { fixture: "feedback.json" }).as(
      "getFeedback",
    );

    // Login and visit dashboard
    cy.visit("/sign-in");
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get("button").contains("Sign in").click();
    cy.url().should("include", "/dashboard");
  });

  it("should display dashboard overview", () => {
    cy.get("h1").should("contain", "Dashboard");
    cy.get("div").contains("Total Feedback").should("exist");
    cy.get("div").contains("Positive Sentiment").should("exist");
    cy.get("div").contains("Negative Sentiment").should("exist");
    cy.get("div").contains("Active Alerts").should("exist");
  });

  it("should switch between dashboard tabs", () => {
    cy.get("button").contains("Sentiment Analysis").click();
    cy.get("h2").contains("Sentiment Trends").should("be.visible");

    cy.get("button").contains("Theme Analysis").click();
    cy.get("h2").contains("Theme Distribution").should("be.visible");

    cy.get("button").contains("Overview").click();
    cy.get("div").contains("Recent Alerts").should("be.visible");
  });

  it("should navigate to feedback page", () => {
    cy.get("a").contains("Feedback Management").click();
    cy.url().should("include", "/dashboard/feedback");
    cy.get("h1").should("contain", "Feedback Management");
  });

  it("should navigate to analytics page", () => {
    cy.get("a").contains("Website Analytics").click();
    cy.url().should("include", "/dashboard/analytics");
    cy.get("h1").should("contain", "Website Analytics");
  });

  it("should navigate to social media page", () => {
    cy.get("a").contains("Social Media").click();
    cy.url().should("include", "/dashboard/social-media");
    cy.get("h1").should("contain", "Social Media Engagement");
  });
});
