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

IMPORTANT: 
1. Respond with ONLY this JSON format - no other text
2. The focus area must be ONE specific, measurable improvement that will have the biggest impact on performance
3. Actions must be specific, measurable steps to improve that ONE focus area

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
   "focus": "ONE specific improvement area that will make them the MOST MONEY fastest",
   "actions": [
     "Day 1-2: Specific drill/practice focused on the ONE improvement area",
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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">One on One Analyzer</h1>
          <p className="mt-2 text-gray-600">Analyze your sales performance and get actionable insights</p>
        </div>

        {/* Recording Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Record Conversation</h2>
          <VoiceRecorder 
            onTranscriptionComplete={setTranscript} 
            openai={openai}
            onRecordingChange={setIsRecording}
          />
        </div>

        {/* Transcript Input */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Manual Transcript</h2>
            <p className="text-sm text-gray-500">Or paste your transcript below</p>
          </div>
          <textarea
            placeholder="Paste your sales call transcript here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full min-h-[200px] p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="mt-4">
            <button
              onClick={analyzeTranscript}
              disabled={loading || !transcript.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : "Analyze Transcript"}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Analysis Results */}
        {summary && (
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Performance Analysis</h2>
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl">
                    <span className="block text-sm text-blue-100">Queue Type</span>
                    <span className="text-xl font-bold text-white capitalize">{summary.queueMetrics?.queueType}</span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* Agent Presence & Tone */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    Agent Presence & Tone
                  </h3>
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-6">
                    <p className="text-gray-800 text-lg leading-relaxed">{summary.tone}</p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <span className="text-sm text-gray-500 block mb-1">Required Leads</span>
                      <span className="text-2xl font-bold text-gray-900">{summary.queueMetrics?.leadsTarget}</span>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <span className="text-sm text-gray-500 block mb-1">Close Rate Target</span>
                      <span className="text-2xl font-bold text-gray-900">{summary.queueMetrics?.closeTarget}</span>
                    </div>
                    {Array.isArray(summary.metrics) && summary.metrics.map((metric, i) => (
                      <div key={i} className={`rounded-xl p-4 ${
                        metric.includes('surplus') ? 'bg-green-50' : 
                        metric.includes('target') ? 'bg-blue-50' : 'bg-red-50'
                      }`}>
                        <span className="text-sm text-gray-500 block mb-1">{metric.split(':')[0]}</span>
                        <span className={`text-xl font-bold ${
                          metric.includes('surplus') ? 'text-green-700' : 
                          metric.includes('target') ? 'text-blue-700' : 'text-red-700'
                        }`}>
                          {metric.split(':')[1]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Critical Challenge */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </span>
                    Critical Challenge
                  </h3>
                  <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-500">
                    <p className="text-gray-800 text-lg">{summary.challenge}</p>
                  </div>
                </div>

                {/* Action Plan */}
                <div className="bg-gradient-to-b from-green-50 to-white rounded-xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </span>
                      Development Plan
                    </h3>
                    <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Priority Focus</span>
                  </div>
                  <div className="bg-white rounded-xl border border-green-100 p-6 mb-6">
                    <h4 className="text-lg font-bold text-green-800 mb-2">Focus Area:</h4>
                    <p className="text-gray-800 text-lg">{summary.weeklyFocus?.focus}</p>
                  </div>
                  <div className="space-y-4">
                    {summary.weeklyFocus?.actions?.map((action, i) => (
                      <div key={i} className="flex items-start bg-white rounded-xl p-4 border border-gray-100">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-gray-800">{action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptAnalyzer;
