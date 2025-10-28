import React, { useState } from "react";
import TokenGenerator from "./TokenGenerator";
import TokenManager, { TOKEN_SETS } from "../utils/tokenManager";

const AdminPanel = () => {
  const [tokenManager] = useState(new TokenManager());
  const [activeTab, setActiveTab] = useState("generator");
  const [stats, setStats] = useState(tokenManager.getStats());

  const refreshStats = () => {
    setStats(tokenManager.getStats());
  };

  const resetTokens = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all used tokens? This cannot be undone."
      )
    ) {
      tokenManager.resetUsedTokens();
      refreshStats();
      alert("Used tokens have been reset.");
    }
  };

  const copyPredefinedSet = (setName) => {
    const tokens = TOKEN_SETS[setName];
    const tokenArray = `const VALID_TOKENS = [\n${tokens
      .map((token) => `  "${token}"`)
      .join(",\n")}\n];`;
    navigator.clipboard.writeText(tokenArray);
    alert(`${setName} token set copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">
              Token Management Admin Panel
            </h1>
            <p className="text-gray-600 mt-2">
              Generate and manage processing tokens for the duplicate tagger
            </p>
          </div>

          {/* Stats Bar */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.totalUsed}
                  </div>
                  <div className="text-sm text-gray-600">Tokens Used</div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={refreshStats}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Refresh Stats
                </button>
                <button
                  onClick={resetTokens}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Reset Used Tokens
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("generator")}
              className={`px-6 py-4 font-semibold ${
                activeTab === "generator"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Token Generator
            </button>
            <button
              onClick={() => setActiveTab("predefined")}
              className={`px-6 py-4 font-semibold ${
                activeTab === "predefined"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Predefined Sets
            </button>
            <button
              onClick={() => setActiveTab("usage")}
              className={`px-6 py-4 font-semibold ${
                activeTab === "usage"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Usage Stats
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "generator" && <TokenGenerator />}

            {activeTab === "predefined" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Predefined Token Sets
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(TOKEN_SETS).map(([setName, tokens]) => (
                    <div
                      key={setName}
                      className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {setName} Tokens
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {tokens.length} tokens available
                      </p>

                      <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                        {tokens.slice(0, 3).map((token, index) => (
                          <div
                            key={index}
                            className="text-xs font-mono bg-white p-2 rounded border"
                          >
                            {token}
                          </div>
                        ))}
                        {tokens.length > 3 && (
                          <div className="text-xs text-gray-500 italic">
                            ...and {tokens.length - 3} more
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => copyPredefinedSet(setName)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Copy {setName} Set
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "usage" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Token Usage Statistics
                </h2>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Used Tokens ({stats.totalUsed})
                  </h3>

                  {stats.usedTokens.length === 0 ? (
                    <p className="text-gray-600 italic">
                      No tokens have been used yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                      {stats.usedTokens.map((token, index) => (
                        <div
                          key={index}
                          className="bg-white p-2 rounded border text-sm font-mono"
                        >
                          {token}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
