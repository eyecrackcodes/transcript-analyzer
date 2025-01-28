import React, { useState } from "react";
import OpenAI from "openai";
import "../index.css";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Rough approximation of tokens (4 characters ≈ 1 token)
const estimateTokens = (text) => {
  return Math.ceil(text.length / 4);
};

// Maximum allowed transcript length (leaving room for system prompt)
const MAX_TRANSCRIPT_TOKENS = 6000; // Conservative limit to leave room for system message and response

const TranscriptAnalyzer = () => {
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeWithAI = async (text) => {
    try {
      setLoading(true);
      setError(null);

      const estimatedTokens = estimateTokens(text);
      if (estimatedTokens > MAX_TRANSCRIPT_TOKENS) {
        throw new Error(`Transcript is too long. Please reduce it to approximately ${MAX_TRANSCRIPT_TOKENS * 4} characters or less.`);
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert final expense telesales coach. IMPORTANT: You must respond with ONLY valid JSON - no other text, no explanations, no commentary. Your response must exactly match this format:

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
}

Any deviation from this exact JSON format will cause an error.`
          },
          { 
            role: "user", 
            content: `Analyze this transcript and respond ONLY with the JSON format specified above, with no additional text: ${text}` 
          },
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const responseContent = response.choices[0].message.content;
      
      try {
        const parsedResponse = JSON.parse(responseContent.trim());
        setSummary(parsedResponse);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        setError("Failed to parse AI response. Please try again.");
        setSummary(null);
      }
    } catch (apiError) {
      console.error("API Error:", apiError);
      const errorMessage = apiError.message.includes('maximum context length') 
        ? "Transcript is too long. Please submit a shorter transcript."
        : "Failed to analyze transcript. Please try again.";
      setError(errorMessage);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTranscriptChange = (e) => {
    const newText = e.target.value;
    setTranscript(newText);
    
    // Clear error when user starts typing
    if (error) setError(null);
    
    // Show warning if transcript is getting too long
    const estimatedTokens = estimateTokens(newText);
    if (estimatedTokens > MAX_TRANSCRIPT_TOKENS) {
      setError(`Transcript is too long. Please reduce it to approximately ${MAX_TRANSCRIPT_TOKENS * 4} characters.`);
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
        <p className="text-sm text-gray-600">
          Maximum length: ~{MAX_TRANSCRIPT_TOKENS * 4} characters
        </p>
        <textarea
          placeholder="Paste your 1:1 meeting transcript here..."
          value={transcript}
          onChange={handleTranscriptChange}
          className={`transcript-input ${error ? 'error' : ''}`}
        />
        <div className="text-sm text-gray-600 mb-2">
          Characters: {transcript.length} / {MAX_TRANSCRIPT_TOKENS * 4}
        </div>
        <button 
          onClick={analyzeTranscript} 
          disabled={loading || !transcript.trim() || error}
          className="analyze-button"
        >
          {loading ? "Analyzing..." : "Analyze Transcript"}
        </button>

        {error && (
          <div className="error-message mt-2 p-2 bg-red-100 text-red-700 rounded">
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
