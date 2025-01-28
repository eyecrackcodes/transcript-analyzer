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

import VoiceRecorder from './VoiceRecorder';

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
            content: `You are an elite high-performance sales coach combining the intensity of Wolf of Wall Street, the success mindset of Grant Cardone, and the insurance sales expertise of Andy Elliott and Jeremy Minor. Analyze sales calls against these CRITICAL KPIs:

Required Daily Production Standards:
- RPAs (Revenue Producing Activities): 300 minimum
- Talk Time: 240 minutes minimum (4 hours)
- Leads Taken:
  * Performance Queue: 8 minimum with 25% close rate
  * Training Queue: 10 minimum with 18% close rate
- Average Annual Premium: Target $900-$1200 (below = price selling, above = placement risk)

IMPORTANT: Respond with ONLY this JSON format - no other text:

{
 "tone": "Brutally honest analysis of energy, conviction, and phone presence. Focus on whether they're bringing enough INTENSITY and HUNGER",
 "queueMetrics": {
   "queueType": "performance or training",
   "leadsTarget": "8 or 10 based on queue",
   "closeTarget": "25% or 18% based on queue"
 },
 "metrics": [
   "Format: KPI: Actual (Gap/Surplus vs Required)",
   "Example: 'RPAs: 250 (-50 from required 300)'"
 ],
 "challenge": "Most critical MONEY-LOSING behavior that's costing them sales",
 "weeklyFocus": {
   "focus": "Specific improvement area that will make them the MOST MONEY fastest",
   "actions": [
     "Day 1-2: Specific drill/practice (must be measurable)",
     "Day 3-4: Implementation with specific metrics to hit",
     "Day 5: Review numbers and adjust approach"
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
        
        {/* New Coaching Guide Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Coaching Session Guide</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mt-1 mr-2">1</span>
              <div>
                <p className="font-medium">Opening Discussion (5-10 mins)</p>
                <p className="text-gray-600 text-sm">Start with: "How's everything going?"</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mt-1 mr-2">2</span>
              <div>
                <p className="font-medium">KPI Review (5-10 mins)</p>
                <p className="text-gray-600 text-sm">• Review performance metrics</p>
                <p className="text-gray-600 text-sm">• Focus on previous session's action items</p>
                <p className="text-gray-600 text-sm">• Identify lowest hanging fruit KPI</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mt-1 mr-2">3</span>
              <div>
                <p className="font-medium">Call Review (30-40 mins)</p>
                <p className="text-gray-600 text-sm">• Review 30-50 minute call at 1.25x or 1.5x speed</p>
                <p className="text-gray-600 text-sm">• Use recording feature below</p>
                <p className="text-gray-600 text-sm">• Pause to discuss key moments</p>
                <p className="text-gray-600 text-sm">• Focus on: script adherence, rapport, objection handling</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mt-1 mr-2">4</span>
              <div>
                <p className="font-medium">Set Focus Area (5-10 mins)</p>
                <p className="text-gray-600 text-sm">Identify primary focus for next week:</p>
                <p className="text-gray-600 text-sm">• KPI improvement</p>
                <p className="text-gray-600 text-sm">• Script adherence</p>
                <p className="text-gray-600 text-sm">• Objection handling</p>
                <p className="text-gray-600 text-sm">• Call control</p>
                <p className="text-gray-600 text-sm">• Rapport building</p>
              </div>
            </div>
          </div>
        </div>
        
        <p>Analyze your 1:1 meetings for insights and improvements.</p>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Record Conversation</h2>
          <VoiceRecorder onTranscriptionComplete={setTranscript} openai={openai} />
        </div>

        <p className="text-sm text-gray-600 mt-6">
          Or paste a transcript below (Maximum length: ~{MAX_TRANSCRIPT_TOKENS * 4} characters)
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
              <h3 className="text-xl font-bold text-gray-900">Phone Presence Analysis</h3>
              <p className="mt-2">{summary.tone}</p>
            </div>
            
            <div className="summary-item">
              <h3 className="text-xl font-bold text-gray-900">Queue Information</h3>
              <div className="mt-2">
                <p><strong>Queue Type:</strong> {summary.queueMetrics?.queueType}</p>
                <p><strong>Required Leads:</strong> {summary.queueMetrics?.leadsTarget}</p>
                <p><strong>Target Close Rate:</strong> {summary.queueMetrics?.closeTarget}</p>
              </div>
            </div>

            <div className="summary-item">
              <h3 className="text-xl font-bold text-gray-900">Performance Metrics</h3>
              <ul className="mt-2 space-y-2">
                {Array.isArray(summary.metrics) && summary.metrics.map((metric, i) => (
                  <li key={i} className="flex items-center">
                    <span className="mr-2">📊</span>
                    {metric}
                  </li>
                ))}
              </ul>
            </div>

            <div className="summary-item">
              <h3 className="text-xl font-bold text-red-600">Critical Challenge</h3>
              <p className="mt-2 font-medium">{summary.challenge}</p>
            </div>

            <div className="summary-item full">
              <h3 className="text-xl font-bold text-green-700">Action Plan</h3>
              <p className="mt-2 font-medium">Focus Area: {summary.weeklyFocus?.focus}</p>
              <ul className="mt-4 space-y-3">
                {summary.weeklyFocus?.actions?.map((action, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-2">✅</span>
                    {action}
                  </li>
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
