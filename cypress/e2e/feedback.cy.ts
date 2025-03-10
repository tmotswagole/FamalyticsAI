describe("Feedback Management", () => {
  beforeEach(() => {
    // Mock authentication and API responses
    cy.intercept("POST", "/api/auth/**", { statusCode: 200 }).as("auth");
    cy.intercept("GET", "/api/feedback*", { fixture: "feedback.json" }).as(
      "getFeedback",
    );
    cy.intercept("POST", "/api/feedback", {
      statusCode: 201,
      body: { id: "123", text_content: "Test feedback" },
    }).as("postFeedback");

    // Login and visit feedback page
    cy.visit("/sign-in");
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get("button").contains("Sign in").click();
    cy.visit("/dashboard/feedback");
  });

  it("should display feedback management page", () => {
    cy.get("h1").should("contain", "Feedback Management");
    cy.get("button").contains("Add Feedback").should("exist");
    cy.get("button").contains("Import from CSV").should("exist");
  });

  it("should submit feedback form", () => {
    cy.get('textarea[name="text_content"]').type(
      "This is a test feedback entry",
    );
    cy.get('input[name="source"]').type("Test Source");
    cy.get("button").contains("Submit Feedback").click();
    cy.wait("@postFeedback");
    cy.get("div")
      .contains("Feedback submitted successfully")
      .should("be.visible");
  });

  it("should show validation error on empty feedback form", () => {
    cy.get("button").contains("Submit Feedback").click();
    cy.get("textarea:invalid").should("have.length", 1);
  });

  it("should switch to CSV import tab", () => {
    cy.get("button").contains("Import from CSV").click();
    cy.get("h3").contains("Import Feedback from CSV").should("be.visible");
    cy.get("div").contains("Drag & drop a CSV file here").should("be.visible");
  });

  it("should display recent feedback entries", () => {
    cy.get("h2").contains("Recent Feedback").should("be.visible");
    cy.get("table").should("exist");
    cy.get("th").contains("Feedback").should("exist");
    cy.get("th").contains("Source").should("exist");
    cy.get("th").contains("Date").should("exist");
    cy.get("th").contains("Sentiment").should("exist");
  });
});
