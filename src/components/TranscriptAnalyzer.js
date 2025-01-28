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
        
        {/* Enhanced Coaching Guide Section */}
        <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl mb-6 shadow-sm border border-blue-100">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-blue-800">Coaching Session Guide</h2>
            <div className="ml-3 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">60 Minutes</div>
          </div>
          
          <div className="space-y-6">
            {/* Section 1 */}
            <div className="relative pl-8 pb-6 border-l-2 border-blue-200">
              <div className="absolute -left-3 top-0">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold shadow-md">1</span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-blue-900">Opening Discussion</h3>
                  <span className="text-blue-600 text-sm font-medium">5-10 mins</span>
                </div>
                <p className="text-gray-700 font-medium">"How's everything going?"</p>
                <p className="text-gray-500 text-sm mt-1">Open-ended discussion to understand agent's perspective</p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="relative pl-8 pb-6 border-l-2 border-blue-200">
              <div className="absolute -left-3 top-0">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold shadow-md">2</span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-blue-900">KPI Review</h3>
                  <span className="text-blue-600 text-sm font-medium">5-10 mins</span>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    Review performance metrics
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    Focus on previous session's action items
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    Identify lowest hanging fruit KPI
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="relative pl-8 pb-6 border-l-2 border-blue-200">
              <div className="absolute -left-3 top-0">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold shadow-md">3</span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-blue-900">Call Review</h3>
                  <span className="text-blue-600 text-sm font-medium">30-40 mins</span>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    Review 30-50 minute call at 1.25x or 1.5x speed
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    Pause to discuss key moments
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    Grade script adherence and soft skills
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    Focus on rapport, objections, and closing
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 4 */}
            <div className="relative pl-8">
              <div className="absolute -left-3 top-0">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold shadow-md">4</span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-blue-900">Set Focus Area</h3>
                  <span className="text-blue-600 text-sm font-medium">5-10 mins</span>
                </div>
                <p className="text-gray-700 mb-2">Identify primary focus for next week:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center text-gray-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    KPI improvement
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    Script adherence
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    Objection handling
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    Call control
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    Rapport building
                  </div>
                </div>
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
