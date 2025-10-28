// /api/validate-token.js
// This is a Vercel serverless function for token validation

// In production, you'd store this in a database
// For now, we'll use a simple in-memory store with Vercel KV or similar
let usedTokens = new Set();

const VALID_TOKENS = [
  "TEST960-JLP-ACTIVE",
  "TEST967-CQ5-ACTIVE",
  "BATCH248-0H1-ACTIVE",
  "PREMIUM560-1CU-ACTIVE",
  "DEMO968-5DA-ACTIVE",
  "BATCH914-TS5-ACTIVE",
  "TEST945-B38-ACTIVE",
  "BATCH487-RRG-ACTIVE",
  "TOKEN686-U99-ACTIVE",
  "DEMO653-97A-ACTIVE",
  "DEMO146-G0I-ACTIVE",
  "DEMO133-SJG-ACTIVE",
  "TOKEN691-XT2-ACTIVE",
  "BATCH668-69D-ACTIVE",
  "DEMO142-TWW-ACTIVE",
  "BATCH419-WEY-ACTIVE",
  "TOKEN178-6LW-ACTIVE",
  "TEST605-NVR-ACTIVE",
  "DEMO032-7GC-ACTIVE",
  "DEMO060-4K7-ACTIVE",
  "TEST348-JAR-ACTIVE",
  "TOKEN115-QMO-ACTIVE",
  "TOKEN540-H01-ACTIVE",
  "TOKEN805-AMU-ACTIVE",
  "TOKEN282-0BH-ACTIVE",
  "DEMO012-BGD-ACTIVE",
  "DEMO144-OE5-ACTIVE",
  "TOKEN728-K1J-ACTIVE",
  "TEST012-ZLI-ACTIVE",
  "PREMIUM477-844-ACTIVE",
  "DEMO774-END-ACTIVE",
  "TEST247-LXT-ACTIVE",
  "TOKEN888-PFY-ACTIVE",
  "DEMO286-3G2-ACTIVE",
  "TEST145-T0K-ACTIVE",
  "TEST108-3JP-ACTIVE",
  "PREMIUM709-APK-ACTIVE",
  "PREMIUM870-8BC-ACTIVE",
  "DEMO286-PYP-ACTIVE",
  "PREMIUM216-LCO-ACTIVE",
  "BATCH746-V0K-ACTIVE",
  "BATCH838-AXE-ACTIVE",
  "TOKEN807-J9K-ACTIVE",
  "TEST409-YMU-ACTIVE",
  "PREMIUM592-LR7-ACTIVE",
  "PREMIUM446-ZR3-ACTIVE",
  "TEST588-RNV-ACTIVE",
  "DEMO187-ZBH-ACTIVE",
  "TEST425-EW3-ACTIVE",
  "TEST890-YET-ACTIVE",
  "BATCH094-HD7-ACTIVE",
  "BATCH355-I5F-ACTIVE",
  "PREMIUM165-I20-ACTIVE",
  "PREMIUM372-T0X-ACTIVE",
  "BATCH026-WFR-ACTIVE",
  "DEMO402-RG1-ACTIVE",
  "DEMO743-6WC-ACTIVE",
  "DEMO667-L4Z-ACTIVE",
  "TOKEN191-2KS-ACTIVE",
  "PREMIUM678-FL4-ACTIVE",
  "PREMIUM648-K97-ACTIVE",
  "BATCH514-XLA-ACTIVE",
  "DEMO212-3N5-ACTIVE",
  "PREMIUM294-XSM-ACTIVE",
  "TEST576-OMK-ACTIVE",
  "BATCH298-5QW-ACTIVE",
  "TOKEN461-G7D-ACTIVE",
  "DEMO315-413-ACTIVE",
  "PREMIUM864-KN6-ACTIVE",
  "PREMIUM140-YVM-ACTIVE",
  "TOKEN618-B2H-ACTIVE",
  "DEMO527-KJH-ACTIVE",
  "BATCH013-3C8-ACTIVE",
  "PREMIUM452-5VT-ACTIVE",
  "TEST996-6V0-ACTIVE",
  "TOKEN775-IU1-ACTIVE",
  "PREMIUM734-84Q-ACTIVE",
  "PREMIUM745-SG9-ACTIVE",
  "BATCH193-4WO-ACTIVE",
  "TEST070-0VD-ACTIVE",
  "TOKEN587-DUY-ACTIVE",
  "BATCH996-ZQ5-ACTIVE",
  "BATCH388-QUR-ACTIVE",
  "BATCH235-D5W-ACTIVE",
  "DEMO679-BCZ-ACTIVE",
  "BATCH146-8CV-ACTIVE",
  "BATCH485-P6E-ACTIVE",
  "PREMIUM942-4PW-ACTIVE",
  "DEMO019-HTC-ACTIVE",
  "DEMO351-QHL-ACTIVE",
  "TOKEN494-H3P-ACTIVE",
  "DEMO253-BLW-ACTIVE",
  "PREMIUM033-5BK-ACTIVE",
  "DEMO739-JDT-ACTIVE",
  "PREMIUM542-ELO-ACTIVE",
  "BATCH915-4IX-ACTIVE",
  "TOKEN968-TGC-ACTIVE",
  "TOKEN655-21F-ACTIVE",
  "BATCH405-4W6-ACTIVE",
  "TEST876-S6N-ACTIVE",
  "PREMIUM327-Z4H-ACTIVE",
  "TEST266-VTG-ACTIVE",
  "TOKEN765-B5C-ACTIVE",
  "BATCH060-X07-ACTIVE",
  "TOKEN180-6ZG-ACTIVE",
  "TOKEN305-NXH-ACTIVE",
  "PREMIUM269-MN2-ACTIVE",
  "TEST084-VHT-ACTIVE",
  "DEMO802-38Z-ACTIVE",
  "PREMIUM856-QNJ-ACTIVE",
  "PREMIUM056-HHN-ACTIVE",
  "PREMIUM306-2Q1-ACTIVE",
  "BATCH910-DRK-ACTIVE",
  "TOKEN499-V1B-ACTIVE",
  "DEMO162-ZGR-ACTIVE",
  "BATCH213-Q8A-ACTIVE",
  "DEMO375-D6T-ACTIVE",
  "BATCH527-HRS-ACTIVE",
  "TOKEN965-NZ6-ACTIVE",
  "BATCH307-Y21-ACTIVE",
  "PREMIUM744-W7I-ACTIVE",
  "DEMO514-28H-ACTIVE",
  "DEMO600-LJW-ACTIVE",
  "PREMIUM023-YVG-ACTIVE",
  "BATCH911-S46-ACTIVE",
  "TEST746-4FT-ACTIVE",
  "PREMIUM717-S7E-ACTIVE",
  "PREMIUM766-M75-ACTIVE",
  "PREMIUM953-UH7-ACTIVE",
  "PREMIUM028-I5S-ACTIVE",
  "TOKEN389-YB1-ACTIVE",
  "DEMO841-M0T-ACTIVE",
  "DEMO912-CIG-ACTIVE",
  "TOKEN914-P3L-ACTIVE",
  "TOKEN388-EOL-ACTIVE",
  "DEMO009-MIJ-ACTIVE",
  "PREMIUM318-DHX-ACTIVE",
  "DEMO365-S13-ACTIVE",
  "PREMIUM359-4YA-ACTIVE",
  "BATCH782-W7U-ACTIVE",
  "TEST430-EK4-ACTIVE",
  "BATCH636-ILI-ACTIVE",
  "TEST565-XN5-ACTIVE",
  "BATCH013-QFC-ACTIVE",
  "TOKEN021-3VX-ACTIVE",
  "TOKEN089-SW6-ACTIVE",
  "TEST512-8J8-ACTIVE",
  "TEST981-6PC-ACTIVE",
  "BATCH758-PQE-ACTIVE",
  "PREMIUM507-DUH-ACTIVE",
  "BATCH513-AQQ-ACTIVE",
  "PREMIUM320-W53-ACTIVE",
  "BATCH397-QJQ-ACTIVE",
  "TEST142-MPQ-ACTIVE",
  "BATCH070-5VI-ACTIVE",
  "DEMO671-WOC-ACTIVE",
  "PREMIUM729-J45-ACTIVE",
  "PREMIUM216-9JG-ACTIVE",
  "TOKEN957-BSZ-ACTIVE",
  "DEMO138-JD3-ACTIVE",
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
