import React, { useState } from "react";

const TokenGenerator = () => {
  const [generatedTokens, setGeneratedTokens] = useState([]);
  const [batchSize, setBatchSize] = useState(10);

  // Generate a random token
  const generateToken = () => {
    const prefixes = ["TOKEN", "BATCH", "PREMIUM", "DEMO", "TEST"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(Math.random() * 999) + 1;
    const randomSuffix = Math.random()
      .toString(36)
      .substring(2, 5)
      .toUpperCase();
    return `${prefix}${randomNum
      .toString()
      .padStart(3, "0")}-${randomSuffix}-ACTIVE`;
  };

  // Generate batch of tokens
  const generateBatch = () => {
    const newTokens = [];
    for (let i = 0; i < batchSize; i++) {
      newTokens.push(generateToken());
    }
    setGeneratedTokens((prev) => [...prev, ...newTokens]);
  };

  // Copy tokens to clipboard
  const copyToClipboard = () => {
    const tokenArray = `const VALID_TOKENS = [\n${generatedTokens
      .map((token) => `  "${token}"`)
      .join(",\n")}\n];`;
    navigator.clipboard.writeText(tokenArray);
    alert("Token array copied to clipboard!");
  };

  // Clear all tokens
  const clearTokens = () => {
    setGeneratedTokens([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Token Generator</h2>

      <div className="space-y-6">
        {/* Generation Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Batch Size
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={generateBatch}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
          >
            Generate Tokens
          </button>
        </div>

        {/* Action Buttons */}
        {generatedTokens.length > 0 && (
          <div className="flex gap-4">
            <button
              onClick={copyToClipboard}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
            >
              Copy Token Array
            </button>
            <button
              onClick={clearTokens}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Generated Tokens Display */}
        {generatedTokens.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Generated Tokens ({generatedTokens.length})
            </h3>

            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm font-mono">
                {generatedTokens.map((token, index) => (
                  <div
                    key={index}
                    className="bg-white p-2 rounded border flex items-center justify-between group hover:bg-blue-50"
                  >
                    <span className="truncate">{token}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(token);
                        // You could add a toast notification here
                      }}
                      className="ml-2 opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 transition-opacity"
                      title="Copy token"
                    >
                      📋
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Preview */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Code Preview:</h4>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <pre>{`const VALID_TOKENS = [
${generatedTokens.map((token) => `  "${token}"`).join(",\n")}
];`}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Instructions:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Generate the desired number of tokens</li>
            <li>2. Copy the token array using the "Copy Token Array" button</li>
            <li>
              3. Replace the VALID_TOKENS array in your SimpleDuplicateTagger
              component
            </li>
            <li>4. Deploy your application with the new tokens</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TokenGenerator;
