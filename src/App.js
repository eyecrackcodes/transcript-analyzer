import React from "react";
import TranscriptAnalyzer from "./components/TranscriptAnalyzer";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <TranscriptAnalyzer />
      </div>
    </div>
  );
}

export default App;
