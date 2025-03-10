describe("Social Media API", () => {
  beforeEach(() => {
    // Mock authentication
    cy.intercept("POST", "/api/auth/**", { statusCode: 200 }).as("auth");

    // Login first to get authenticated
    cy.visit("/sign-in");
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get("button").contains("Sign in").click();
  });

  it("should fetch social media accounts", () => {
    // Mock the GET response
    cy.intercept("GET", "/api/social-media*", {
      statusCode: 200,
      fixture: "social-media-accounts.json",
    }).as("getAccounts");

    // Make the API request
    cy.request("/api/social-media?organization_id=org_123").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length.at.least(1);
      expect(response.body[0]).to.have.property("platform");
    });
  });

  it("should add a new social media account", () => {
    // Mock the POST response
    cy.intercept("POST", "/api/social-media", {
      statusCode: 201,
      body: {
        id: "new_account_123",
        platform: "facebook",
        name: "New Test Account",
        username: "testaccount",
        is_active: true,
        organization_id: "org_123",
      },
    }).as("addAccount");

    // Make the API request
    cy.request({
      method: "POST",
      url: "/api/social-media",
      body: {
        organization_id: "org_123",
        platform: "facebook",
        name: "New Test Account",
        username: "testaccount",
        credentials: {
          access_token: "test_token",
          app_id: "test_app_id",
        },
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.name).to.eq("New Test Account");
      expect(response.body.platform).to.eq("facebook");
      // Ensure sensitive credentials are not returned
      expect(response.body).to.not.have.property("credentials");
    });
  });

  it("should fetch social media engagement metrics", () => {
    // Mock the GET response
    cy.intercept("GET", "/api/social-media/engagement*", {
      statusCode: 200,
      fixture: "social-media-engagement.json",
    }).as("getEngagement");

    // Make the API request
    cy.request("/api/social-media/engagement?organization_id=org_123").then(
      (response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.length.at.least(1);
        expect(response.body[0]).to.have.property("platform");
        expect(response.body[0]).to.have.property("likes");
        expect(response.body[0]).to.have.property("comments");
      },
    );
  });

  it("should fetch social media insights", () => {
    // Mock the GET response
    cy.intercept("GET", "/api/social-media/insights*", {
      statusCode: 200,
      body: {
        totalPosts: 150,
        totalEngagement: 5280,
        averageEngagementPerPost: 35.2,
        engagementBreakdown: {
          likes: 3500,
          comments: 1200,
          shares: 580,
          views: 25000,
        },
        sentimentDistribution: {
          positive: 65,
          neutral: 25,
          negative: 10,
        },
        platformDistribution: {
          facebook: 40,
          twitter: 35,
          instagram: 25,
        },
        topPerformingPosts: [
          {
            id: "post_123",
            platform: "facebook",
            engagement: 250,
            sentiment: "positive",
          },
        ],
      },
    }).as("getInsights");

    // Make the API request
    cy.request("/api/social-media/insights?organization_id=org_123").then(
      (response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("totalPosts");
        expect(response.body).to.have.property("sentimentDistribution");
        expect(response.body).to.have.property("topPerformingPosts");
      },
    );
  });

  it("should trigger a social media sync", () => {
    // Mock the POST response
    cy.intercept("POST", "/api/social-media/sync", {
      statusCode: 200,
      body: {
        success: true,
        message: "Social media sync initiated",
        accounts_processed: 3,
      },
    }).as("syncAccounts");

    // Make the API request
    cy.request({
      method: "POST",
      url: "/api/social-media/sync",
      body: {
        organization_id: "org_123",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body).to.have.property("accounts_processed");
    });
  });
});
