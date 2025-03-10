describe("Analytics API", () => {
  beforeEach(() => {
    // Mock authentication
    cy.intercept("POST", "/api/auth/**", { statusCode: 200 }).as("auth");

    // Login first to get authenticated
    cy.visit("/sign-in");
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get("button").contains("Sign in").click();
  });

  it("should fetch analytics data", () => {
    // Mock the GET response
    cy.intercept("GET", "/api/analytics*", {
      statusCode: 200,
      fixture: "analytics.json",
    }).as("getAnalytics");

    // Make the API request
    cy.request("/api/analytics?organization_id=org_123").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("sessions");
      expect(response.body).to.have.property("activeUsers");
      expect(response.body).to.have.property("dailyMetrics");
    });
  });

  it("should fetch analytics with date range", () => {
    // Mock the GET response with date range
    cy.intercept(
      "GET",
      "/api/analytics?organization_id=org_123&start_date=2023-07-01&end_date=2023-07-15",
      {
        statusCode: 200,
        body: {
          sessions: 850,
          activeUsers: 620,
          screenPageViews: 2100,
          bounceRate: 0.32,
          averageSessionDuration: 175,
          dailyMetrics: [
            {
              date: "2023-07-01",
              sessions: 50,
              activeUsers: 40,
              screenPageViews: 150,
            },
            {
              date: "2023-07-15",
              sessions: 65,
              activeUsers: 52,
              screenPageViews: 180,
            },
          ],
        },
      },
    ).as("getAnalyticsWithDateRange");

    // Make the API request with date range
    cy.request(
      "/api/analytics?organization_id=org_123&start_date=2023-07-01&end_date=2023-07-15",
    ).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.dailyMetrics).to.have.length(2);
      expect(response.body.dailyMetrics[0].date).to.eq("2023-07-01");
      expect(response.body.dailyMetrics[1].date).to.eq("2023-07-15");
    });
  });

  it("should handle analytics API errors gracefully", () => {
    // Mock an error response
    cy.intercept("GET", "/api/analytics*", {
      statusCode: 500,
      body: { error: "Internal server error" },
    }).as("getAnalyticsError");

    // Make the API request and expect an error
    cy.request({
      url: "/api/analytics?organization_id=org_123",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.body).to.have.property("error");
    });
  });

  it("should require authentication for analytics API", () => {
    // Log out first
    cy.visit("/");
    cy.clearCookies();

    // Mock an unauthorized response
    cy.intercept("GET", "/api/analytics*", {
      statusCode: 401,
      body: { error: "Unauthorized" },
    }).as("getAnalyticsUnauthorized");

    // Make the API request and expect an unauthorized error
    cy.request({
      url: "/api/analytics?organization_id=org_123",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.error).to.eq("Unauthorized");
    });
  });
});
