import React, { useState } from "react";
import OpenAI from "openai";
import "./styles.css"; // Update this line
import VoiceRecorder from './VoiceRecorder';

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
}`
          },
          { role: "user", content: text },
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
    <div className="container mx-auto px-4 py-8">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">One on One Analyzer</h1>
        
        {/* Modern Coaching Guide Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-100 p-4">
            <h2 className="text-lg font-semibold text-gray-800">Coaching Session Guide</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Section 1 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                1
              </div>
              <div className="flex-grow">
                <h3 className="text-gray-800 font-semibold flex justify-between items-center">
                  Opening Discussion
                  <span className="text-sm text-blue-600 font-medium">5-10 mins</span>
                </h3>
                <p className="text-gray-600 mt-1">Open-ended discussion to understand agent's perspective</p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                2
              </div>
              <div className="flex-grow">
                <h3 className="text-gray-800 font-semibold flex justify-between items-center">
                  KPI Review
                  <span className="text-sm text-blue-600 font-medium">5-10 mins</span>
                </h3>
                <div className="mt-2 space-y-2">
                  <p className="text-gray-600">• Review performance metrics</p>
                  <p className="text-gray-600">• Focus on previous session's action items</p>
                  <p className="text-gray-600">• Identify lowest hanging fruit KPI</p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                3
              </div>
              <div className="flex-grow">
                <h3 className="text-gray-800 font-semibold flex justify-between items-center">
                  Call Review
                  <span className="text-sm text-blue-600 font-medium">30-40 mins</span>
                </h3>
                <div className="mt-2 space-y-2">
                  <p className="text-gray-600">• Review 30-50 minute call at 1.25x or 1.5x speed</p>
                  <p className="text-gray-600">• Pause to discuss key moments</p>
                  <p className="text-gray-600">• Grade script adherence and soft skills</p>
                  <p className="text-gray-600">• Focus on rapport, objections, and closing</p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                4
              </div>
              <div className="flex-grow">
                <h3 className="text-gray-800 font-semibold flex justify-between items-center">
                  Set Focus Area
                  <span className="text-sm text-blue-600 font-medium">5-10 mins</span>
                </h3>
                <p className="text-gray-600 mt-2">Identify primary focus for next week:</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <p className="text-gray-600">• KPI improvement</p>
                  <p className="text-gray-600">• Script adherence</p>
                  <p className="text-gray-600">• Objection handling</p>
                  <p className="text-gray-600">• Call control</p>
                  <p className="text-gray-600">• Rapport building</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">Analyze your 1:1 meetings for insights and improvements.</p>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Record Conversation</h3>
            <VoiceRecorder onTranscriptionComplete={setTranscript} openai={openai} />
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              Or paste a transcript below (Maximum length: ~24000 characters)
            </p>
            <textarea
              placeholder="Paste your 1:1 meeting transcript here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full h-40 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={analyzeTranscript}
            disabled={loading || !transcript.trim()}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing..." : "Analyze Transcript"}
          </button>

          {error && (
            <div className="text-red-500 text-sm mt-2 p-3 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          {summary && (
            <div className="mt-6 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Agent Presence & Tone</h3>
                <p className="text-gray-700">{summary.tone}</p>
              </div>

              {summary.queueMetrics && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Queue Metrics</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700"><strong>Queue Type:</strong> {summary.queueMetrics.queueType}</p>
                    <p className="text-gray-700"><strong>Required Leads:</strong> {summary.queueMetrics.leadsTarget}</p>
                    <p className="text-gray-700"><strong>Close Rate Target:</strong> {summary.queueMetrics.closeTarget}</p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Performance Metrics</h3>
                <ul className="space-y-2">
                  {Array.isArray(summary.metrics) && summary.metrics.map((metric, i) => (
                    <li key={i} className="text-gray-700">{metric}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Critical Challenge</h3>
                <p className="text-gray-700">{summary.challenge}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Development Plan</h3>
                <p className="text-gray-700 mb-2"><strong>Focus Area:</strong> {summary.weeklyFocus?.focus}</p>
                <ul className="space-y-2">
                  {summary.weeklyFocus?.actions?.map((action, i) => (
                    <li key={i} className="text-gray-700">• {action}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranscriptAnalyzer;
