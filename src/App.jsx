import React from "react";
import SimpleDuplicateTagger from "./components/SimpleDuplicateTagger";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header - Commented Out */}
      {/* <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-2.5 shadow-lg">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  Simple Duplicate Tagger
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  CSV Duplicate Detection
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                v1.0
              </span>
            </div>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 pt-8 pb-6">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight leading-tight">
            Duplicate {""}
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Tagger
            </span>
          </h2>

          {/* Powered by CRM Refresh */}
          <div className="flex items-center justify-center mb-6">
            <span className="inline-flex items-center text-xs text-gray-500 font-medium">
              <span className="inline-flex items-center justify-center w-4 h-4 mr-1.5 text-xs font-bold text-gray-600 border border-gray-400 rounded-full">
                P
              </span>
              powered by CRM Refresh
            </span>
          </div>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Upload your Compass contacts and let our intelligent algorithm
            detect and tag duplicate contacts. Perfect for cleaning CRM data,
            email lists, and contact databases.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-blue-700">
                Name-based matching
              </span>
            </div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-blue-700">
                Smart tagging
              </span>
            </div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-blue-700">
                Export ready
              </span>
            </div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-blue-700">
                Merge duplicates
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 pb-20">
        <SimpleDuplicateTagger />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 mt-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-600 text-lg font-medium mb-4">
              © 2025 Simple Duplicate Tagger - Powered By CRM Refresh
            </p>
            <p className="text-gray-500">
              Built for professional contact management and data cleaning
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
