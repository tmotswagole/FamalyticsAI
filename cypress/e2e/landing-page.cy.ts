describe("Landing Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display hero section", () => {
    cy.get("h1")
      .contains("AI-Powered Customer Sentiment Analysis")
      .should("be.visible");
    cy.get("p")
      .contains("Understand what your customers are really saying")
      .should("be.visible");
    cy.get("a").contains("Get Started Free").should("be.visible");
    cy.get("a").contains("View Pricing").should("be.visible");
  });

  it("should navigate to features section", () => {
    cy.get("a").contains("Features").click();
    cy.get("h2")
      .contains("Comprehensive Sentiment Analysis")
      .should("be.visible");
  });

  it("should navigate to how it works section", () => {
    cy.get("a").contains("How It Works").click();
    cy.get("h2").contains("How Famalytics Works").should("be.visible");
  });

  it("should navigate to pricing section", () => {
    cy.get("a").contains("Pricing").click();
    cy.get("h2").contains("Simple, Transparent Pricing").should("be.visible");
  });

  it("should display features section", () => {
    cy.get("h2")
      .contains("Comprehensive Sentiment Analysis")
      .should("be.visible");
    cy.get("div").contains("Multi-Channel Dashboard").should("be.visible");
    cy.get("div").contains("Easy Data Ingestion").should("be.visible");
    cy.get("div").contains("AI-Powered Analysis").should("be.visible");
    cy.get("div").contains("Customizable Alerts").should("be.visible");
  });

  it("should display how it works section", () => {
    cy.get("h2").contains("How Famalytics Works").should("be.visible");
    cy.get("h3").contains("1. Import Your Data").should("be.visible");
    cy.get("h3").contains("2. AI Analysis").should("be.visible");
    cy.get("h3").contains("3. Actionable Insights").should("be.visible");
  });

  it("should display stats section", () => {
    cy.get("div").contains("85%").should("be.visible");
    cy.get("div").contains("3x").should("be.visible");
    cy.get("div").contains("24/7").should("be.visible");
  });

  it("should display use cases section", () => {
    cy.get("h2").contains("Who Benefits from Famalytics").should("be.visible");
    cy.get("h3").contains("Customer Support Teams").should("be.visible");
    cy.get("h3").contains("Product Teams").should("be.visible");
  });

  it("should display pricing section", () => {
    cy.get("h2").contains("Simple, Transparent Pricing").should("be.visible");
    cy.get("div.grid").children().should("have.length.at.least", 2);
  });

  it("should display CTA section", () => {
    cy.get("h2")
      .contains("Ready to Understand Your Customers Better?")
      .should("be.visible");
    cy.get("a").contains("Get Started Free").should("be.visible");
  });

  it("should display footer", () => {
    cy.get("footer").should("be.visible");
    cy.get("footer").contains("Product").should("be.visible");
    cy.get("footer").contains("Solutions").should("be.visible");
    cy.get("footer").contains("Resources").should("be.visible");
    cy.get("footer").contains("Company").should("be.visible");
  });
});
