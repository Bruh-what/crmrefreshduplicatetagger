import React from "react";
import TokenGenerator from "./components/TokenGenerator";

function TokenGeneratorApp() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Token Generator
          </h1>
          <p className="text-gray-600">
            Generate processing tokens for the Simple Duplicate Tagger
          </p>
        </div>
        <TokenGenerator />
      </div>
    </div>
  );
}

export default TokenGeneratorApp;
