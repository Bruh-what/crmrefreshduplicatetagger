// /api/validate-token-kv.js
// Production version using Vercel KV (Redis) for persistence
import { kv } from "@vercel/kv";

const VALID_TOKENS = [
  "TOKEN001-ACTIVE",
  "TOKEN002-ACTIVE",
  "TOKEN003-ACTIVE",
  "DEMO123-ACTIVE",
  "TEST456-ACTIVE",
  "BATCH01-ACTIVE",
  "BATCH02-ACTIVE",
  "BATCH03-ACTIVE",
  "PREMIUM-001-ACTIVE",
  "PREMIUM-002-ACTIVE",
];

const USED_TOKENS_KEY = "dupetagger:used_tokens";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-key");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, action } = req.body;

  try {
    switch (action) {
      case "validate":
        if (!token) {
          return res.status(400).json({ error: "Token is required" });
        }

        const normalizedToken = token.trim().toUpperCase();

        // Check if token is in valid list
        const isValidFormat = VALID_TOKENS.includes(normalizedToken);

        // Check if token is already used (stored in KV)
        const isUsed = await kv.sismember(USED_TOKENS_KEY, normalizedToken);
        const isNotUsed = !isUsed;

        const isValid = isValidFormat && isNotUsed;

        return res.status(200).json({
          valid: isValid,
          reason: !isValidFormat
            ? "Invalid token format"
            : !isNotUsed
            ? "Token already used"
            : "Valid",
        });

      case "consume":
        if (!token) {
          return res.status(400).json({ error: "Token is required" });
        }

        const tokenToConsume = token.trim().toUpperCase();

        // Double-check validity
        if (!VALID_TOKENS.includes(tokenToConsume)) {
          return res.status(400).json({ error: "Invalid token" });
        }

        // Check if already used
        const alreadyUsed = await kv.sismember(USED_TOKENS_KEY, tokenToConsume);
        if (alreadyUsed) {
          return res.status(400).json({ error: "Token already used" });
        }

        // Add to used tokens set
        await kv.sadd(USED_TOKENS_KEY, tokenToConsume);

        // Also store with timestamp for analytics
        await kv.hset(`dupetagger:token_usage:${tokenToConsume}`, {
          used_at: new Date().toISOString(),
          ip:
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            "unknown",
        });

        return res.status(200).json({
          success: true,
          message: "Token consumed successfully",
          consumed_at: new Date().toISOString(),
        });

      case "reset":
        // Admin function to reset used tokens
        const adminKey = req.headers["x-admin-key"];
        if (adminKey !== process.env.ADMIN_RESET_KEY) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        // Clear the used tokens set
        await kv.del(USED_TOKENS_KEY);

        return res.status(200).json({
          success: true,
          message: "All tokens reset",
          reset_at: new Date().toISOString(),
        });

      case "stats":
        // Get usage statistics
        const usedTokensList = (await kv.smembers(USED_TOKENS_KEY)) || [];

        return res.status(200).json({
          totalValid: VALID_TOKENS.length,
          totalUsed: usedTokensList.length,
          remainingTokens: VALID_TOKENS.length - usedTokensList.length,
          usedTokensList: usedTokensList,
          lastChecked: new Date().toISOString(),
        });

      default:
        return res.status(400).json({ error: "Invalid action" });
    }
  } catch (error) {
    console.error("Token validation error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
}
