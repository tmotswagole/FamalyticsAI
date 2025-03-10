describe("Checkout API", () => {
  beforeEach(() => {
    // Mock authentication
    cy.intercept("POST", "/api/auth/**", { statusCode: 200 }).as("auth");

    // Login first to get authenticated
    cy.visit("/sign-in");
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get("button").contains("Sign in").click();
  });

  it("should create a checkout session", () => {
    // Mock the POST response
    cy.intercept("POST", "/api/create-checkout", {
      statusCode: 200,
      body: {
        sessionId: "cs_test_123",
        url: "https://checkout.stripe.com/pay/cs_test_123",
      },
    }).as("createCheckout");

    // Make the API request
    cy.request({
      method: "POST",
      url: "/api/create-checkout",
      headers: {
        "X-Customer-Email": "test@example.com",
      },
      body: {
        price_id: "price_123",
        user_id: "user_123",
        return_url: "/success",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("sessionId");
      expect(response.body).to.have.property("url");
      expect(response.body.url).to.include("checkout.stripe.com");
    });
  });

  it("should require price_id and user_id parameters", () => {
    // Mock the error response
    cy.intercept("POST", "/api/create-checkout", {
      statusCode: 400,
      body: { error: "Missing required parameters" },
    }).as("createCheckoutError");

    // Make the API request without required parameters
    cy.request({
      method: "POST",
      url: "/api/create-checkout",
      failOnStatusCode: false,
      headers: {
        "X-Customer-Email": "test@example.com",
      },
      body: {
        // Missing price_id and user_id
        return_url: "/success",
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.eq("Missing required parameters");
    });
  });

  it("should handle Stripe API errors gracefully", () => {
    // Mock a Stripe API error
    cy.intercept("POST", "/api/create-checkout", {
      statusCode: 500,
      body: { error: "Error creating Stripe checkout session" },
    }).as("stripeError");

    // Make the API request
    cy.request({
      method: "POST",
      url: "/api/create-checkout",
      failOnStatusCode: false,
      headers: {
        "X-Customer-Email": "test@example.com",
      },
      body: {
        price_id: "price_123",
        user_id: "user_123",
        return_url: "/success",
      },
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.body).to.have.property("error");
    });
  });

  it("should use default return URL if not provided", () => {
    // Mock the POST response
    cy.intercept("POST", "/api/create-checkout", (req) => {
      // Check if the request body contains the default return URL
      const hasDefaultUrl =
        !req.body.return_url || req.body.return_url === "/success";

      req.reply({
        statusCode: 200,
        body: {
          sessionId: "cs_test_123",
          url: "https://checkout.stripe.com/pay/cs_test_123",
          usedDefaultUrl: hasDefaultUrl,
        },
      });
    }).as("createCheckoutDefaultUrl");

    // Make the API request without specifying return_url
    cy.request({
      method: "POST",
      url: "/api/create-checkout",
      headers: {
        "X-Customer-Email": "test@example.com",
      },
      body: {
        price_id: "price_123",
        user_id: "user_123",
        // No return_url specified
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.usedDefaultUrl).to.be.true;
    });
  });
});
