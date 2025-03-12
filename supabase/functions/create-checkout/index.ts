import { createServer } from "http";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-01-27.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-customer-email",
};

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  try {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const { price_id, user_id, return_url = "/success" } = JSON.parse(body);

      if (!price_id || !user_id) {
        throw new Error("Missing required parameters");
      }

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: price_id,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.origin}${return_url}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/pricing?canceled=true`,
        customer_email: req.headers["x-customer-email"] as string,
        metadata: {
          user_id,
        },
      });

      res.writeHead(200, {
        ...corsHeaders,
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ sessionId: session.id, url: session.url }));
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.writeHead(400, { ...corsHeaders, "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: (error as Error).message }));
  }
});

server.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
