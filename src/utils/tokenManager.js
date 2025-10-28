// Token Management Utility
// This can be used to generate, validate, and manage tokens

class TokenManager {
  constructor() {
    this.usedTokens = new Set(
      JSON.parse(localStorage.getItem("usedTokens") || "[]")
    );
  }

  // Generate a single token with specific format
  generateToken(type = "STANDARD") {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();

    const prefixes = {
      STANDARD: "TOKEN",
      PREMIUM: "PREM",
      DEMO: "DEMO",
      BATCH: "BATCH",
      TEST: "TEST",
    };

    const prefix = prefixes[type] || "TOKEN";
    return `${prefix}-${timestamp}-${random}`;
  }

  // Generate multiple tokens
  generateBatch(count = 10, type = "STANDARD") {
    const tokens = [];
    for (let i = 0; i < count; i++) {
      tokens.push(this.generateToken(type));
    }
    return tokens;
  }

  // Validate token format (basic validation)
  isValidFormat(token) {
    const pattern = /^(TOKEN|PREM|DEMO|BATCH|TEST)-[A-Z0-9]+-[A-Z0-9]+$/;
    return pattern.test(token);
  }

  // Check if token has been used
  isTokenUsed(token) {
    return this.usedTokens.has(token);
  }

  // Mark token as used
  useToken(token) {
    this.usedTokens.add(token);
    localStorage.setItem("usedTokens", JSON.stringify([...this.usedTokens]));
  }

  // Get usage statistics
  getStats() {
    return {
      totalUsed: this.usedTokens.size,
      usedTokens: [...this.usedTokens],
    };
  }

  // Reset used tokens (admin function)
  resetUsedTokens() {
    this.usedTokens.clear();
    localStorage.removeItem("usedTokens");
  }

  // Export tokens in various formats
  exportTokens(tokens, format = "array") {
    switch (format) {
      case "array":
        return `const VALID_TOKENS = [\n${tokens
          .map((token) => `  "${token}"`)
          .join(",\n")}\n];`;

      case "json":
        return JSON.stringify(tokens, null, 2);

      case "csv":
        return tokens.join("\n");

      case "text":
        return tokens.join("\n");

      default:
        return tokens;
    }
  }
}

// Server-side token validation (for future use)
export const validateTokenOnServer = async (token) => {
  // This would make an API call to your server to validate the token
  try {
    const response = await fetch("/api/validate-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const result = await response.json();
    return result.valid;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};

// Token expiration management
export const createExpiringToken = (baseToken, expirationHours = 24) => {
  const expirationTime = Date.now() + expirationHours * 60 * 60 * 1000;
  return {
    token: baseToken,
    expiresAt: expirationTime,
    isExpired: () => Date.now() > expirationTime,
  };
};

// Predefined token sets for different use cases
export const TOKEN_SETS = {
  DEMO: [
    "DEMO-001-ACTIVE",
    "DEMO-002-ACTIVE",
    "DEMO-003-ACTIVE",
    "DEMO-004-ACTIVE",
    "DEMO-005-ACTIVE",
  ],

  PREMIUM: [
    "PREM-001-UNLIMITED",
    "PREM-002-UNLIMITED",
    "PREM-003-UNLIMITED",
    "PREM-004-UNLIMITED",
    "PREM-005-UNLIMITED",
  ],

  STANDARD: [
    "TOKEN-001-STANDARD",
    "TOKEN-002-STANDARD",
    "TOKEN-003-STANDARD",
    "TOKEN-004-STANDARD",
    "TOKEN-005-STANDARD",
    "TOKEN-006-STANDARD",
    "TOKEN-007-STANDARD",
    "TOKEN-008-STANDARD",
    "TOKEN-009-STANDARD",
    "TOKEN-010-STANDARD",
  ],
};

export default TokenManager;
