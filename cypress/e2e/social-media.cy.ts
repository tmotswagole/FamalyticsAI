describe("Social Media", () => {
  beforeEach(() => {
    // Mock authentication and API responses
    cy.intercept("POST", "/api/auth/**", { statusCode: 200 }).as("auth");
    cy.intercept("GET", "/api/social-media*", {
      fixture: "social-media-accounts.json",
    }).as("getAccounts");
    cy.intercept("GET", "/api/social-media/engagement*", {
      fixture: "social-media-engagement.json",
    }).as("getEngagement");

    // Login and visit social media page
    cy.visit("/sign-in");
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get("button").contains("Sign in").click();
    cy.visit("/dashboard/social-media");
  });

  it("should display social media dashboard", () => {
    cy.get("h2").should("contain", "Social Media Engagement");
    cy.get("div").contains("Total Posts").should("exist");
    cy.get("div").contains("Total Likes").should("exist");
    cy.get("div").contains("Total Comments").should("exist");
    cy.get("div").contains("Total Shares").should("exist");
  });

  it("should switch between tabs", () => {
    cy.get("button")
      .contains("Posts")
      .should("have.attr", "data-state", "active");

    cy.get("button").contains("Analytics").click();
    cy.get("button")
      .contains("Analytics")
      .should("have.attr", "data-state", "active");
    cy.get("h2").contains("Platform Distribution").should("be.visible");
    cy.get("h2").contains("Sentiment Analysis").should("be.visible");

    cy.get("button").contains("Accounts").click();
    cy.get("button")
      .contains("Accounts")
      .should("have.attr", "data-state", "active");
    cy.get("h2").contains("Connected Accounts").should("be.visible");
  });

  it("should filter by platform", () => {
    cy.get("button").contains("Platform").click();
    cy.get('div[role="option"]').contains("Facebook").click();
    cy.wait("@getEngagement");

    cy.get("button").contains("Platform").click();
    cy.get('div[role="option"]').contains("Twitter/X").click();
    cy.wait("@getEngagement");

    cy.get("button").contains("Platform").click();
    cy.get('div[role="option"]').contains("All Platforms").click();
    cy.wait("@getEngagement");
  });

  it("should change time period", () => {
    cy.get("button").contains("Time Period").click();
    cy.get('div[role="option"]').contains("Last 7 Days").click();
    cy.wait("@getEngagement");

    cy.get("button").contains("Time Period").click();
    cy.get('div[role="option"]').contains("Last 90 Days").click();
    cy.wait("@getEngagement");
  });

  it("should open add account form", () => {
    cy.get("button").contains("Add Account").click();
    cy.get("h3").contains("Add Social Media Account").should("be.visible");
    cy.get("select").should("exist");
    cy.get('input[id="name"]').should("exist");
    cy.get('input[id="accessToken"]').should("exist");
  });
});
