describe("Feedback API", () => {
  beforeEach(() => {
    // Mock authentication
    cy.intercept("POST", "/api/auth/**", { statusCode: 200 }).as("auth");

    // Login first to get authenticated
    cy.visit("/sign-in");
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get("button").contains("Sign in").click();
  });

  it("should fetch feedback entries", () => {
    // Mock the GET response
    cy.intercept("GET", "/api/feedback*", {
      statusCode: 200,
      body: {
        data: [
          {
            id: "1",
            text_content: "Great service!",
            source: "email",
            sentiment_score: 0.8,
            sentiment_label: "positive",
          },
        ],
        meta: {
          total: 1,
          page: 1,
          page_size: 10,
          total_pages: 1,
        },
      },
    }).as("getFeedback");

    // Make the API request
    cy.request("/api/feedback?organization_id=org_123").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.length(1);
      expect(response.body.meta.total).to.eq(1);
    });
  });

  it("should create a new feedback entry", () => {
    // Mock the POST response
    cy.intercept("POST", "/api/feedback", {
      statusCode: 201,
      body: {
        id: "123",
        text_content: "Test feedback",
        source: "api",
        sentiment_score: 0.5,
        sentiment_label: "neutral",
      },
    }).as("postFeedback");

    // Make the API request
    cy.request({
      method: "POST",
      url: "/api/feedback",
      body: {
        organization_id: "org_123",
        text_content: "Test feedback",
        source: "api",
        analyze_sentiment: true,
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.text_content).to.eq("Test feedback");
      expect(response.body.sentiment_label).to.eq("neutral");
    });
  });

  it("should update a feedback entry", () => {
    // Mock the PUT response
    cy.intercept("PUT", "/api/feedback?id=123", {
      statusCode: 200,
      body: {
        id: "123",
        text_content: "Updated feedback",
        source: "api",
        sentiment_score: 0.5,
        sentiment_label: "neutral",
      },
    }).as("updateFeedback");

    // Make the API request
    cy.request({
      method: "PUT",
      url: "/api/feedback?id=123",
      body: {
        text_content: "Updated feedback",
        source: "api",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.text_content).to.eq("Updated feedback");
    });
  });

  it("should delete a feedback entry", () => {
    // Mock the DELETE response
    cy.intercept("DELETE", "/api/feedback?id=123", {
      statusCode: 200,
      body: { success: true },
    }).as("deleteFeedback");

    // Make the API request
    cy.request({
      method: "DELETE",
      url: "/api/feedback?id=123",
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
    });
  });
});
