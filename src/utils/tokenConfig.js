// Token validation configuration
export const TOKEN_CONFIG = {
  // Use server-side validation in production
  USE_SERVER_VALIDATION:
    process.env.NODE_ENV === "production" ||
    process.env.REACT_APP_USE_SERVER_TOKENS === "true",

  // API endpoint for token validation
  API_ENDPOINT: "/api/validate-token",

  // Fallback to localStorage in development or if server fails
  USE_LOCALSTORAGE_FALLBACK: true,

  // Token validation timeout (ms)
  VALIDATION_TIMEOUT: 5000,

  // Debounce delay for validation (ms)
  VALIDATION_DEBOUNCE: 500,
};

// Token validation utility functions
export const tokenUtils = {
  // Normalize token format
  normalizeToken: (token) => {
    return token ? token.trim().toUpperCase() : "";
  },

  // Check if token has valid format
  isValidFormat: (token, validTokens) => {
    const normalized = tokenUtils.normalizeToken(token);
    return validTokens.includes(normalized);
  },

  // Server-side token validation
  validateTokenServer: async (token, action = "validate") => {
    try {
      const response = await fetch(TOKEN_CONFIG.API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: tokenUtils.normalizeToken(token),
          action: action,
        }),
        signal: AbortSignal.timeout(TOKEN_CONFIG.VALIDATION_TIMEOUT),
      });

      if (!response.ok) {
        throw new Error(`Server validation failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Server token validation failed:", error);
      throw error;
    }
  },

  // Local storage token validation (fallback)
  validateTokenLocal: (token, usedTokens, validTokens) => {
    const normalized = tokenUtils.normalizeToken(token);
    const isValidFormat = validTokens.includes(normalized);
    const isNotUsed = !usedTokens.includes(normalized);

    return {
      valid: isValidFormat && isNotUsed,
      reason: !isValidFormat
        ? "Invalid token format"
        : !isNotUsed
        ? "Token already used"
        : "Valid",
    };
  },
};

export default TOKEN_CONFIG;
