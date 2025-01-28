import React, { useState } from "react";
import OpenAI from "openai";
import "../index.css";
import VoiceRecorder from './VoiceRecorder';
import SessionTimer from './SessionTimer';
import SessionController from './SessionController';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const TranscriptAnalyzer = () => {
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [completedSections, setCompletedSections] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

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
        
        {/* Enhanced Coaching Guide Section */}
        <div className="coaching-guide">
          <div className="guide-header">
            <h2 className="text-xl font-bold text-gray-900">Coaching Session Guide</h2>
          </div>
          
          <SessionController isRecording={isRecording} />
          
          <div className="guide-content">
            {/* Section 1 */}
            <div className="section-item">
              <div className="section-number">1</div>
              <div className="section-content">
                <div className="section-header">
                  <span className="section-title">Opening Discussion</span>
                  <span className="time-badge">5-10 mins</span>
                </div>
                <div className="section-details">
                  Open-ended discussion to understand agent's perspective
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="section-item">
              <div className="section-number">2</div>
              <div className="section-content">
                <div className="section-header">
                  <span className="section-title">KPI Review</span>
                  <span className="time-badge">5-10 mins</span>
                </div>
                <div className="section-details">
                  <ul>
                    <li>Review performance metrics</li>
                    <li>Focus on previous session's action items</li>
                    <li>Identify lowest hanging fruit KPI</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="section-item">
              <div className="section-number">3</div>
              <div className="section-content">
                <div className="section-header">
                  <span className="section-title">Call Review</span>
                  <span className="time-badge">30-40 mins</span>
                </div>
                <div className="section-details">
                  <ul>
                    <li>Review 30-50 minute call at 1.25x or 1.5x speed</li>
                    <li>Pause to discuss key moments</li>
                    <li>Grade script adherence and soft skills</li>
                    <li>Focus on rapport, objections, and closing</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="section-item">
              <div className="section-number">4</div>
              <div className="section-content">
                <div className="section-header">
                  <span className="section-title">Set Focus Area</span>
                  <span className="time-badge">5-10 mins</span>
                </div>
                <div className="section-details">
                  <p>Identify primary focus for next week:</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <ul>
                      <li>KPI improvement</li>
                      <li>Script adherence</li>
                      <li>Objection handling</li>
                      <li>Call control</li>
                      <li>Rapport building</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">Analyze your 1:1 meetings for insights and improvements.</p>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Record Conversation</h3>
            <VoiceRecorder 
              onTranscriptionComplete={setTranscript} 
              openai={openai}
              onRecordingChange={setIsRecording}
            />
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
              {/* Agent Presence & Tone */}
              <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3">Agent Presence & Tone</h3>
                <p className="text-gray-700 leading-relaxed">{summary.tone}</p>
              </div>

              {/* Queue Metrics */}
              {summary.queueMetrics && (
                <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-4">Queue Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium mb-1">Queue Type</p>
                      <p className="text-lg font-semibold text-gray-800 capitalize">{summary.queueMetrics.queueType}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium mb-1">Required Leads</p>
                      <p className="text-lg font-semibold text-gray-800">{summary.queueMetrics.leadsTarget}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium mb-1">Close Rate Target</p>
                      <p className="text-lg font-semibold text-gray-800">{summary.queueMetrics.closeTarget}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Metrics */}
              <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-1 gap-3">
                  {Array.isArray(summary.metrics) && summary.metrics.map((metric, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <p className="text-gray-700">{metric}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Challenge */}
              <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
                <h3 className="text-lg font-bold text-red-900 mb-3">Critical Challenge</h3>
                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                  <p className="text-gray-700">{summary.challenge}</p>
                </div>
              </div>

              {/* Development Plan */}
              <div className="bg-white rounded-lg shadow-sm border border-green-100 p-6">
                <h3 className="text-lg font-bold text-green-900 mb-4">Development Plan</h3>
                <div className="mb-4">
                  <p className="text-gray-600 text-sm uppercase tracking-wide mb-2">Focus Area</p>
                  <p className="text-gray-800 font-medium">{summary.weeklyFocus?.focus}</p>
                </div>
                <div className="space-y-3">
                  {summary.weeklyFocus?.actions?.map((action, i) => (
                    <div key={i} className="flex items-start bg-green-50 rounded-lg p-4">
                      <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-gray-700">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranscriptAnalyzer;
