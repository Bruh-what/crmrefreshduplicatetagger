// /api/validate-token.js
// This is a Vercel serverless function for token validation

// In production, you'd store this in a database
// For now, we'll use a simple in-memory store with Vercel KV or similar
let usedTokens = new Set();

// God token - never expires, always valid, for admin use
const GOD_TOKEN = "ADMIN-GOD-TOKEN-NEVER-EXPIRES";

const VALID_TOKENS = [
  "TOKEN347-KR8-ACTIVE",
  "BATCH892-ZN4-ACTIVE",
  "PREMIUM158-WQ2-ACTIVE",
  "TEST741-HM9-ACTIVE",
  "DEMO523-FV7-ACTIVE",
  "TOKEN619-XL3-ACTIVE",
  "BATCH274-GP6-ACTIVE",
  "PREMIUM936-BT1-ACTIVE",
  "TEST485-YC5-ACTIVE",
  "DEMO167-JK0-ACTIVE",
  "TOKEN892-DP4-ACTIVE",
  "BATCH531-RW8-ACTIVE",
  "PREMIUM704-MH2-ACTIVE",
  "TEST256-NS7-ACTIVE",
  "DEMO638-AE1-ACTIVE",
  "TOKEN415-VZ9-ACTIVE",
  "BATCH109-LX3-ACTIVE",
  "PREMIUM827-QF6-ACTIVE",
  "TEST964-IU0-ACTIVE",
  "DEMO372-WK5-ACTIVE",
  "TOKEN583-BP8-ACTIVE",
  "BATCH746-YR2-ACTIVE",
  "PREMIUM291-DM7-ACTIVE",
  "TEST809-GN1-ACTIVE",
  "DEMO456-TH4-ACTIVE",
  "TOKEN128-SC9-ACTIVE",
  "BATCH673-PL3-ACTIVE",
  "PREMIUM549-XV6-ACTIVE",
  "TEST932-JW0-ACTIVE",
  "DEMO215-AK5-ACTIVE",
  "TOKEN794-FQ8-ACTIVE",
  "BATCH368-RD2-ACTIVE",
  "PREMIUM082-MZ7-ACTIVE",
  "TEST527-BN1-ACTIVE",
  "DEMO691-HU4-ACTIVE",
  "TOKEN246-VC9-ACTIVE",
  "BATCH913-LP3-ACTIVE",
  "PREMIUM475-YG6-ACTIVE",
  "TEST158-WT0-ACTIVE",
  "DEMO824-JE5-ACTIVE",
  "TOKEN637-PK8-ACTIVE",
  "BATCH491-DR2-ACTIVE",
  "PREMIUM763-XM7-ACTIVE",
  "TEST385-AN1-ACTIVE",
  "DEMO972-SH4-ACTIVE",
  "TOKEN514-FU9-ACTIVE",
  "BATCH259-BW3-ACTIVE",
  "PREMIUM628-QC6-ACTIVE",
  "TEST746-VL0-ACTIVE",
  "DEMO103-IR5-ACTIVE",
  "TOKEN871-MG8-ACTIVE",
  "BATCH432-YP2-ACTIVE",
  "PREMIUM195-DN7-ACTIVE",
  "TEST689-HT1-ACTIVE",
  "DEMO347-JK4-ACTIVE",
  "TOKEN926-SX9-ACTIVE",
  "BATCH564-AZ3-ACTIVE",
  "PREMIUM839-FQ6-ACTIVE",
  "TEST271-RV0-ACTIVE",
  "DEMO715-BM5-ACTIVE",
  "TOKEN458-WE8-ACTIVE",
  "BATCH182-PN2-ACTIVE",
  "PREMIUM607-LC7-ACTIVE",
  "TEST943-YH1-ACTIVE",
  "DEMO526-DU4-ACTIVE",
  "TOKEN369-GR9-ACTIVE",
  "BATCH758-VN3-ACTIVE",
  "PREMIUM421-IW6-ACTIVE",
  "TEST894-MK0-ACTIVE",
  "DEMO652-XP5-ACTIVE",
  "TOKEN137-AE8-ACTIVE",
  "BATCH985-SL2-ACTIVE",
  "PREMIUM314-FT7-ACTIVE",
  "TEST578-QG1-ACTIVE",
  "DEMO289-BZ4-ACTIVE",
  "TOKEN643-HC9-ACTIVE",
  "BATCH826-VU3-ACTIVE",
  "PREMIUM791-JM6-ACTIVE",
  "TEST465-RP0-ACTIVE",
  "DEMO918-DN5-ACTIVE",
  "TOKEN572-YW8-ACTIVE",
  "BATCH394-LK2-ACTIVE",
  "PREMIUM657-PE7-ACTIVE",
  "TEST129-XG1-ACTIVE",
  "DEMO783-AS4-ACTIVE",
  "TOKEN946-FR9-ACTIVE",
  "BATCH218-QN3-ACTIVE",
  "PREMIUM581-VC6-ACTIVE",
  "TEST862-IM0-ACTIVE",
  "DEMO475-HU5-ACTIVE",
  "TOKEN319-BT8-ACTIVE",
  "BATCH937-WL2-ACTIVE",
  "PREMIUM164-YP7-ACTIVE",
  "TEST698-DK1-ACTIVE",
  "DEMO521-GE4-ACTIVE",
  "TOKEN784-MR9-ACTIVE",
  "BATCH453-SZ3-ACTIVE",
  "PREMIUM826-AN6-ACTIVE",
  "TEST237-FV0-ACTIVE",
  "DEMO694-JW5-ACTIVE",
  "TOKEN861-PH8-ACTIVE",
  "BATCH576-QC2-ACTIVE",
  "PREMIUM942-DL7-ACTIVE",
  "TEST419-XT1-ACTIVE",
  "DEMO758-BG4-ACTIVE",
  "TOKEN625-VU9-ACTIVE",
  "BATCH341-IR3-ACTIVE",
  "PREMIUM189-MN6-ACTIVE",
  "TEST973-YK0-ACTIVE",
  "DEMO536-HP5-ACTIVE",
  "TOKEN298-AW8-ACTIVE",
  "BATCH714-SE2-ACTIVE",
  "PREMIUM467-FQ7-ACTIVE",
  "TEST852-RC1-ACTIVE",
  "DEMO163-LZ4-ACTIVE",
  "TOKEN439-DN9-ACTIVE",
  "BATCH987-GT3-ACTIVE",
  "PREMIUM725-VM6-ACTIVE",
  "TEST584-JE0-ACTIVE",
  "DEMO817-PK5-ACTIVE",
  "TOKEN176-XH8-ACTIVE",
  "BATCH629-BU2-ACTIVE",
  "PREMIUM891-QW7-ACTIVE",
  "TEST345-MC1-ACTIVE",
  "DEMO682-YL4-ACTIVE",
  "TOKEN513-AR9-ACTIVE",
  "BATCH956-FN3-ACTIVE",
  "PREMIUM278-DP6-ACTIVE",
  "TEST761-SG0-ACTIVE",
  "DEMO429-HT5-ACTIVE",
  "TOKEN894-IV8-ACTIVE",
  "BATCH132-VK2-ACTIVE",
  "PREMIUM653-BE7-ACTIVE",
  "TEST987-WM1-ACTIVE",
  "DEMO345-QP4-ACTIVE",
  "TOKEN728-JZ9-ACTIVE",
  "BATCH869-LR3-ACTIVE",
  "PREMIUM514-XC6-ACTIVE",
  "TEST623-AN0-ACTIVE",
  "DEMO976-FW5-ACTIVE",
  "TOKEN457-DH8-ACTIVE",
  "BATCH291-SU2-ACTIVE",
  "PREMIUM786-GK7-ACTIVE",
  "TEST138-VT1-ACTIVE",
  "DEMO652-PE4-ACTIVE",
  "TOKEN869-IM9-ACTIVE",
  "BATCH547-YL3-ACTIVE",
  "PREMIUM329-BZ6-ACTIVE",
  "TEST794-QG0-ACTIVE",
  "DEMO418-HN5-ACTIVE",
  "TOKEN631-RC8-ACTIVE",
  "BATCH975-DP2-ACTIVE",
  "PREMIUM182-XW7-ACTIVE",
  "TEST456-AE1-ACTIVE",
  "DEMO729-VK4-ACTIVE",
  "TOKEN947-SU9-ACTIVE",
  "BATCH364-FT3-ACTIVE",
  "PREMIUM698-MH6-ACTIVE",
  "TEST821-JR0-ACTIVE",
  "DEMO513-BN5-ACTIVE",
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
      // Check if it's the god token (always valid)
      if (normalizedToken === GOD_TOKEN) {
        return res.status(200).json({
          valid: true,
          reason: "God token - always valid",
          isGodToken: true,
        });
      }

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
      // God token never gets consumed
      if (normalizedToken === GOD_TOKEN) {
        return res.status(200).json({
          success: true,
          message: "God token - never consumed",
          isGodToken: true,
        });
      }

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
