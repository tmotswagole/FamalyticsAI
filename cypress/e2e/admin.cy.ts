describe("Admin Dashboard", () => {
  beforeEach(() => {
    // Mock authentication and API responses for admin user
    cy.intercept("POST", "/api/auth/**", { statusCode: 200 }).as("auth");
    cy.intercept("GET", "/admin/**", { fixture: "admin-data.json" }).as(
      "getAdminData",
    );

    // Login as admin and visit admin dashboard
    cy.visit("/sign-in");
    cy.get('input[name="email"]').type("admin@example.com");
    cy.get('input[name="password"]').type("admin123");
    cy.get("button").contains("Sign in").click();
    cy.visit("/admin/dashboard");
  });

  it("should display admin dashboard", () => {
    cy.get("h1").should("contain", "System Administration");
    cy.get("div").contains("System Status").should("exist");
    cy.get("div").contains("Total Users").should("exist");
    cy.get("div").contains("API Requests").should("exist");
    cy.get("div").contains("Security Alerts").should("exist");
  });

  it("should switch between admin dashboard tabs", () => {
    cy.get("button").contains("User Data").click();
    cy.get("h2").contains("User Activity").should("be.visible");

    cy.get("button").contains("Application Performance").click();
    cy.get("h2").contains("System Performance").should("be.visible");

    cy.get("button").contains("Database Health").click();
    cy.get("h2").contains("Slow Queries").should("be.visible");

    cy.get("button").contains("API Metrics").click();
    cy.get("h2").contains("API Request Volume").should("be.visible");

    cy.get("button").contains("AI Performance").click();
    cy.get("h2").contains("Model Performance").should("be.visible");
  });

  it("should navigate to users management page", () => {
    cy.get("a").contains("Users").click();
    cy.url().should("include", "/admin/users");
    cy.get("h1").should("contain", "User Management");
  });

  it("should navigate to organizations page", () => {
    cy.get("a").contains("Organizations").click();
    cy.url().should("include", "/admin/organizations");
    cy.get("h1").should("contain", "Organizations");
  });

  it("should navigate to system logs page", () => {
    cy.get("a").contains("System Logs").click();
    cy.url().should("include", "/admin/logs");
    cy.get("h1").should("contain", "System Logs");
  });

  it("should navigate to AI performance page", () => {
    cy.get("a").contains("AI Performance").click();
    cy.url().should("include", "/admin/ai-performance");
    cy.get("h1").should("contain", "AI Performance");
  });
});
