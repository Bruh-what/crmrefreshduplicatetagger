// /api/validate-token.js
// This is a Vercel serverless function for token validation

// In production, you'd store this in a database
// For now, we'll use a simple in-memory store with Vercel KV or similar
let usedTokens = new Set();

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

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, action } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  const normalizedToken = token.trim().toUpperCase();

  switch (action) {
    case "validate":
      // Check if token is valid and not used
      const isValidFormat = VALID_TOKENS.includes(normalizedToken);
      const isNotUsed = !usedTokens.has(normalizedToken);
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
      // Mark token as used
      if (!VALID_TOKENS.includes(normalizedToken)) {
        return res.status(400).json({ error: "Invalid token" });
      }

      if (usedTokens.has(normalizedToken)) {
        return res.status(400).json({ error: "Token already used" });
      }

      usedTokens.add(normalizedToken);
      return res
        .status(200)
        .json({ success: true, message: "Token consumed successfully" });

    case "reset":
      // Admin function to reset used tokens
      const adminKey = req.headers["x-admin-key"];
      if (adminKey !== process.env.ADMIN_RESET_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      usedTokens.clear();
      return res
        .status(200)
        .json({ success: true, message: "All tokens reset" });

    case "stats":
      // Get usage statistics
      return res.status(200).json({
        totalValid: VALID_TOKENS.length,
        totalUsed: usedTokens.size,
        remainingTokens: VALID_TOKENS.length - usedTokens.size,
        usedTokensList: Array.from(usedTokens),
      });

    default:
      return res.status(400).json({ error: "Invalid action" });
  }
}
