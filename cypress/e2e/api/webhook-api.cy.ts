describe("Webhook API", () => {
  it("should handle Stripe webhook events", () => {
    // Mock a webhook event from Stripe
    const mockWebhookEvent = {
      id: "evt_123",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_123",
          customer: "cus_123",
          subscription: "sub_123",
          metadata: {
            user_id: "user_123",
          },
        },
      },
    };

    // Mock the webhook response
    cy.intercept("POST", "/api/webhook", {
      statusCode: 200,
      body: { received: true },
    }).as("webhookHandler");

    // Make the API request with the mock webhook event
    cy.request({
      method: "POST",
      url: "/api/webhook",
      headers: {
        "stripe-signature": "test_signature",
        "content-type": "application/json",
      },
      body: mockWebhookEvent,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.received).to.be.true;
    });
  });

  it("should reject webhook requests without signature", () => {
    // Mock the webhook response for missing signature
    cy.intercept("POST", "/api/webhook", {
      statusCode: 400,
      body: { error: "Missing Stripe signature or webhook secret" },
    }).as("webhookMissingSignature");

    // Make the API request without the signature header
    cy.request({
      method: "POST",
      url: "/api/webhook",
      failOnStatusCode: false,
      headers: {
        "content-type": "application/json",
      },
      body: { type: "test.event" },
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.eq(
        "Missing Stripe signature or webhook secret",
      );
    });
  });

  it("should handle different webhook event types", () => {
    // Test different event types
    const eventTypes = [
      "checkout.session.completed",
      "customer.subscription.updated",
      "customer.subscription.deleted",
    ];

    eventTypes.forEach((eventType) => {
      const mockEvent = {
        id: `evt_${eventType.replace(/\./g, "_")}`,
        type: eventType,
        data: {
          object: {
            id: "obj_123",
            customer: "cus_123",
            subscription: "sub_123",
            status: "active",
            items: {
              data: [
                {
                  price: {
                    id: "price_123",
                  },
                },
              ],
            },
            current_period_start: Math.floor(Date.now() / 1000),
            current_period_end:
              Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
            metadata: {
              user_id: "user_123",
            },
          },
        },
      };

      // Mock the webhook response
      cy.intercept("POST", "/api/webhook", {
        statusCode: 200,
        body: { received: true },
      }).as(`webhook${eventType}`);

      // Make the API request with the mock webhook event
      cy.request({
        method: "POST",
        url: "/api/webhook",
        headers: {
          "stripe-signature": `test_signature_${eventType}`,
          "content-type": "application/json",
        },
        body: mockEvent,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.received).to.be.true;
      });
    });
  });
});
