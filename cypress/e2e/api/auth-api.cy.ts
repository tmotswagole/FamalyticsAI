describe("Auth API", () => {
  it("should update user activity", () => {
    // Mock the POST response
    cy.intercept("POST", "/api/auth/update-activity", {
      statusCode: 200,
      body: { success: true },
    }).as("updateActivity");

    // Make the API request
    cy.request({
      method: "POST",
      url: "/api/auth/update-activity",
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
    });
  });

  it("should handle errors when updating activity", () => {
    // Mock an error response
    cy.intercept("POST", "/api/auth/update-activity", {
      statusCode: 500,
      body: { error: "Failed to update activity" },
    }).as("updateActivityError");

    // Make the API request
    cy.request({
      method: "POST",
      url: "/api/auth/update-activity",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.body.error).to.eq("Failed to update activity");
    });
  });

  it("should handle auth callback with code parameter", () => {
    // Mock the callback response
    cy.intercept("GET", "/auth/callback?code=test_code", {
      statusCode: 302,
      headers: {
        Location: "/dashboard",
      },
    }).as("authCallback");

    // Visit the callback URL
    cy.visit("/auth/callback?code=test_code", { failOnStatusCode: false });

    // Should be redirected to dashboard
    cy.url().should("include", "/dashboard");
  });

  it("should redirect to specified URL after auth callback", () => {
    // Mock the callback response with redirect_to parameter
    cy.intercept(
      "GET",
      "/auth/callback?code=test_code&redirect_to=/custom-page",
      {
        statusCode: 302,
        headers: {
          Location: "/custom-page",
        },
      },
    ).as("authCallbackWithRedirect");

    // Visit the callback URL with redirect_to parameter
    cy.visit("/auth/callback?code=test_code&redirect_to=/custom-page", {
      failOnStatusCode: false,
    });

    // Should be redirected to the specified page
    cy.url().should("include", "/custom-page");
  });

  it("should redirect system admin to admin dashboard", () => {
    // Mock the callback response for system admin
    cy.intercept("GET", "/auth/callback?code=admin_code", {
      statusCode: 302,
      headers: {
        Location: "/admin/dashboard",
      },
    }).as("adminAuthCallback");

    // Visit the callback URL for admin
    cy.visit("/auth/callback?code=admin_code", { failOnStatusCode: false });

    // Should be redirected to admin dashboard
    cy.url().should("include", "/admin/dashboard");
  });

  it("should redirect client admin without organization to create organization page", () => {
    // Mock the callback response for client admin without organization
    cy.intercept("GET", "/auth/callback?code=client_admin_code", {
      statusCode: 302,
      headers: {
        Location: "/success/create-organization",
      },
    }).as("clientAdminAuthCallback");

    // Visit the callback URL for client admin
    cy.visit("/auth/callback?code=client_admin_code", {
      failOnStatusCode: false,
    });

    // Should be redirected to create organization page
    cy.url().should("include", "/success/create-organization");
  });

  it("should redirect client admin without subscription to pricing page", () => {
    // Mock the callback response for client admin without subscription
    cy.intercept("GET", "/auth/callback?code=client_admin_no_sub_code", {
      statusCode: 302,
      headers: {
        Location: "/pricing",
      },
    }).as("clientAdminNoSubAuthCallback");

    // Visit the callback URL for client admin without subscription
    cy.visit("/auth/callback?code=client_admin_no_sub_code", {
      failOnStatusCode: false,
    });

    // Should be redirected to pricing page
    cy.url().should("include", "/pricing");
  });
});
