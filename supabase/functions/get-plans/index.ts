import Stripe from "stripe";
import { createServer } from "http";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-01-27.acacia",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  try {
    const plans = await stripe.plans.list({
      active: true,
    });

    res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" });
    res.end(JSON.stringify(plans.data));
  } catch (error) {
    console.error("Error getting products:", error);
    res.writeHead(400, { ...corsHeaders, "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: (error as Error).message }));
  }
});

server.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
