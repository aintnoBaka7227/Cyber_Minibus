// Stripe removed; webhooks stub for compatibility
export const stripeWebhooks = async (_req, res) => {
  return res.json({ success: true, message: "Stripe disabled. Using mock payments." });
};
