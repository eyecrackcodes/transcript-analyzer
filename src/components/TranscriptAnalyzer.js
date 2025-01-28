import React, { useState } from "react";
import OpenAI from "openai";
import "../index.css";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const TranscriptAnalyzer = () => {
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeWithAI = async (text) => {
    try {
      setLoading(true);
      setError(null);

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert final expense telesales coach. Analyze 1:1 meetings and return ONLY a JSON response in the following format, with no additional text or explanation:

{
 "tone": "Brief analysis of agent's energy, confidence, and phone presence",
 "metrics": [
   "Format each metric as: KPI Name: Actual (Gap/Surplus vs Required)",
   "Example: 'Leads Taken: 6 (-2 from required 8)'"
 ],
 "challenge": "Identify the most critical performance blocker",
 "weeklyFocus": {
   "focus": "Specific improvement area with highest impact potential",
   "steps": [
     "Day 1-2: Specific training/practice activity",
     "Day 3-4: Implementation with measurable goals",
     "Day 5: Review and adjust approach"
   ]
 }
}`
          },
          { 
            role: "user", 
            content: `Analyze this transcript and respond ONLY with the JSON format specified above: ${text}` 
          },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }, // Enforce JSON response format
      });

      const responseContent = response.choices[0].message.content;
      
      try {
        const parsedResponse = JSON.parse(responseContent);
        setSummary(parsedResponse);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        setError("Failed to parse AI response. Please try again.");
        setSummary(null);
      }
    } catch (apiError) {
      console.error("API Error:", apiError);
      setError("Failed to analyze transcript. Please try again.");
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const analyzeTranscript = async () => {
    if (!transcript.trim()) {
      setError("Please enter a transcript to analyze");
      return;
    }
    await analyzeWithAI(transcript);
  };

  return (
    <div className="container">
      <div className="card">
        <h1>One on One Analyzer</h1>
        <p>Analyze your 1:1 meetings for insights and improvements.</p>
        <textarea
          placeholder="Paste your 1:1 meeting transcript here..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          className="transcript-input"
        />
        <button 
          onClick={analyzeTranscript} 
          disabled={loading || !transcript.trim()}
          className="analyze-button"
        >
          {loading ? "Analyzing..." : "Analyze Transcript"}
        </button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {summary && (
          <div className="summary">
            <div className="summary-item">
              <h3>Agent Presence & Tone</h3>
              <p>{summary.tone}</p>
            </div>
            <div className="summary-item">
              <h3>Performance Metrics</h3>
              <ul>
                {Array.isArray(summary.metrics) && summary.metrics.map((metric, i) => (
                  <li key={i}>{metric}</li>
                ))}
              </ul>
            </div>
            <div className="summary-item">
              <h3>Primary Challenge</h3>
              <p>{summary.challenge}</p>
            </div>
            <div className="summary-item full">
              <h3>Development Plan</h3>
              <p>Focus Area: {summary.weeklyFocus?.focus}</p>
              <ul>
                {summary.weeklyFocus?.steps?.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptAnalyzer;
