describe("Themes API", () => {
  beforeEach(() => {
    // Mock authentication
    cy.intercept("POST", "/api/auth/**", { statusCode: 200 }).as("auth");

    // Login first to get authenticated
    cy.visit("/sign-in");
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get("button").contains("Sign in").click();
  });

  it("should fetch themes", () => {
    // Mock the GET response
    cy.intercept("GET", "/api/themes*", {
      statusCode: 200,
      body: {
        data: [
          {
            id: "theme_1",
            name: "Product Quality",
            description: "Feedback related to product quality",
            organization_id: "org_123",
            count: 45,
          },
          {
            id: "theme_2",
            name: "Customer Service",
            description: "Feedback related to customer service",
            organization_id: "org_123",
            count: 32,
          },
        ],
        meta: {
          total: 2,
        },
      },
    }).as("getThemes");

    // Make the API request
    cy.request("/api/themes?organization_id=org_123").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.length(2);
      expect(response.body.data[0]).to.have.property("name");
      expect(response.body.meta.total).to.eq(2);
    });
  });

  it("should create a new theme", () => {
    // Mock the POST response
    cy.intercept("POST", "/api/themes", {
      statusCode: 201,
      body: {
        id: "theme_3",
        name: "Website Usability",
        description: "Feedback related to website usability",
        organization_id: "org_123",
        created_at: new Date().toISOString(),
      },
    }).as("createTheme");

    // Make the API request
    cy.request({
      method: "POST",
      url: "/api/themes",
      body: {
        name: "Website Usability",
        description: "Feedback related to website usability",
        organization_id: "org_123",
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.name).to.eq("Website Usability");
      expect(response.body).to.have.property("id");
    });
  });

  it("should update a theme", () => {
    // Mock the PUT response
    cy.intercept("PUT", "/api/themes?id=theme_1", {
      statusCode: 200,
      body: {
        id: "theme_1",
        name: "Updated Theme Name",
        description: "Updated theme description",
        organization_id: "org_123",
      },
    }).as("updateTheme");

    // Make the API request
    cy.request({
      method: "PUT",
      url: "/api/themes?id=theme_1",
      body: {
        name: "Updated Theme Name",
        description: "Updated theme description",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq("Updated Theme Name");
      expect(response.body.description).to.eq("Updated theme description");
    });
  });

  it("should delete a theme", () => {
    // Mock the DELETE response
    cy.intercept("DELETE", "/api/themes?id=theme_1", {
      statusCode: 200,
      body: { success: true },
    }).as("deleteTheme");

    // Make the API request
    cy.request({
      method: "DELETE",
      url: "/api/themes?id=theme_1",
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
    });
  });

  it("should associate a theme with feedback", () => {
    // Mock the POST response
    cy.intercept("POST", "/api/themes/associate", {
      statusCode: 200,
      body: { success: true },
    }).as("associateTheme");

    // Make the API request
    cy.request({
      method: "POST",
      url: "/api/themes/associate",
      body: {
        theme_id: "theme_1",
        feedback_id: "feedback_123",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
    });
  });
});
