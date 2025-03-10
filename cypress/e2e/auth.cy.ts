describe("Authentication", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should navigate to sign in page", () => {
    cy.get("a").contains("Sign in").click();
    cy.url().should("include", "/sign-in");
    cy.get("h1").should("contain", "Sign in");
  });

  it("should navigate to sign up page", () => {
    cy.get("a").contains("Sign up").click();
    cy.url().should("include", "/sign-up");
    cy.get("h1").should("contain", "Sign up");
  });

  it("should show validation errors on sign in form", () => {
    cy.visit("/sign-in");
    cy.get("button").contains("Sign in").click();
    cy.get("input:invalid").should("have.length", 2);
  });

  it("should show validation errors on sign up form", () => {
    cy.visit("/sign-up");
    cy.get("button").contains("Sign up").click();
    cy.get("input:invalid").should("have.length", 2);
  });

  it("should navigate to forgot password page", () => {
    cy.visit("/sign-in");
    cy.get("a").contains("Forgot Password?").click();
    cy.url().should("include", "/forgot-password");
    cy.get("h1").should("contain", "Reset Password");
  });

  it("should show validation error on forgot password form", () => {
    cy.visit("/forgot-password");
    cy.get("button").contains("Reset Password").click();
    cy.get("input:invalid").should("have.length", 1);
  });
});
