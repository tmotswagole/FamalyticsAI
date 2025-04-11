// This file extends the JSX namespace to include the custom `stripe-pricing-table` tag.
// By declaring this, TypeScript recognizes the custom tag and prevents errors during development.
// This is particularly useful when using third-party web components like Stripe's pricing table.

declare namespace JSX {
  interface IntrinsicElements {
    "stripe-pricing-table": {
      "pricing-table-id": string; // The ID of the pricing table to display.
      "publishable-key": string; // The Stripe publishable key for authentication.
    };
  }
}
