describe("Pricing Page", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/plans", { fixture: "pricing-plans.json" }).as(
      "getPlans",
    );
    cy.visit("/pricing");
  });

  it("should display pricing page", () => {
    cy.get("h1").contains("Simple, transparent pricing").should("be.visible");
    cy.get("p")
      .contains("Choose the perfect plan for your needs")
      .should("be.visible");
  });

  it("should display pricing cards", () => {
    cy.get(".grid").children().should("have.length.at.least", 2);

    // Check first pricing card
    cy.get(".grid")
      .children()
      .first()
      .within(() => {
        cy.get("h3").should("be.visible"); // Plan name
        cy.get("span").contains("$").should("be.visible"); // Price
        cy.get("button").contains("Get Started").should("be.visible");
      });
  });

  it("should redirect to sign in when clicking on a plan as unauthenticated user", () => {
    cy.get("button").contains("Get Started").first().click();
    cy.url().should("include", "/sign-in");
  });

  it("should navigate back to home page", () => {
    cy.get("a").contains("Logo").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });

  context("Authenticated user", () => {
    beforeEach(() => {
      // Mock authentication
      cy.intercept("POST", "/api/auth/**", { statusCode: 200 }).as("auth");

      // Login first
      cy.visit("/sign-in");
      cy.get('input[name="email"]').type("test@example.com");
      cy.get('input[name="password"]').type("password123");
      cy.get("button").contains("Sign in").click();

      // Visit pricing page
      cy.visit("/pricing");
    });

    it("should redirect to checkout when clicking on a plan as authenticated user", () => {
      cy.intercept("POST", "/api/create-checkout", {
        statusCode: 200,
        body: { url: "/success" },
      }).as("createCheckout");

      cy.get("button").contains("Get Started").first().click();
      cy.wait("@createCheckout");
      cy.url().should("include", "/success");
    });
  });
});
