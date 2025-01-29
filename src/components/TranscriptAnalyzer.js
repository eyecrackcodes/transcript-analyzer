import React, { useState } from "react";
import VoiceRecorder from './VoiceRecorder';
import OpenAI from 'openai';
import SessionTimer from './SessionTimer';
import SessionController from './SessionController';

const TranscriptAnalyzer = () => {
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const analyzeTranscript = async () => {
    if (!transcript.trim()) {
      setError("Please enter a transcript to analyze");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await window.openai.chat.completions.create({
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
- Average Annual Premium: Target $900-$1200 (below = price selling, above = placement risk)`
          },
          { role: "user", content: transcript }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const parsedResponse = JSON.parse(response.choices[0].message.content.trim());
      setSummary(parsedResponse);
    } catch (err) {
      console.error("Analysis Error:", err);
      setError("Failed to analyze transcript. Please try again.");
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">One on One Analyzer</h1>

          {/* Section 1: The Coaching Guide */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            {/* Guide Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
              <h2 className="text-2xl font-bold text-white">Coaching Session Guide</h2>
              <p className="text-blue-100 mt-2">Total Session Duration: 60 minutes</p>
            </div>
          
            {/* Timeline Steps */}
            <div className="p-6 space-y-6">
              {/* Opening Discussion */}
              <div className="flex items-start relative">
                <div className="absolute left-4 top-0 h-full w-0.5 bg-blue-100"></div>
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 z-10">
                  1
                </div>
                <div className="ml-6 bg-blue-50 rounded-xl p-4 flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-900">Opening Discussion</h3>
                    <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">5-10 mins</span>
                  </div>
                  <p className="text-gray-700">Open-ended discussion to understand agent's perspective</p>
                </div>
              </div>

              {/* KPI Review */}
              <div className="flex items-start relative">
                <div className="absolute left-4 top-0 h-full w-0.5 bg-blue-100"></div>
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 z-10">
                  2
                </div>
                <div className="ml-6 bg-blue-50 rounded-xl p-4 flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-900">KPI Review</h3>
                    <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">5-10 mins</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Review performance metrics
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Focus on previous session's action items
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Identify lowest hanging fruit KPI
                    </li>
                  </ul>
                </div>
              </div>

              {/* Call Review */}
              <div className="flex items-start relative">
                <div className="absolute left-4 top-0 h-full w-0.5 bg-blue-100"></div>
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 z-10">
                  3
                </div>
                <div className="ml-6 bg-blue-50 rounded-xl p-4 flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-900">Call Review</h3>
                    <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">30-40 mins</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Review 30-50 minute call at 1.25x or 1.5x speed
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Pause to discuss key moments
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Grade script adherence and soft skills
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Focus on rapport, objections, and closing
                    </li>
                  </ul>
                </div>
              </div>
          
              {/* Set Focus Area */}
              <div className="flex items-start relative">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 z-10">
                  4
                </div>
                <div className="ml-6 bg-blue-50 rounded-xl p-4 flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-900">Set Focus Area</h3>
                    <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">5-10 mins</span>
                  </div>
                  <p className="text-gray-700 mb-2">Identify primary focus for next week:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <ul className="space-y-2">
                        <li className="flex items-center text-gray-700">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          KPI improvement
                        </li>
                        <li className="flex items-center text-gray-700">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Script adherence
                        </li>
                        <li className="flex items-center text-gray-700">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Objection handling
                        </li>
                      </ul>
                    </div>
                    <div>
                      <ul className="space-y-2">
                        <li className="flex items-center text-gray-700">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Call control
                        </li>
                        <li className="flex items-center text-gray-700">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Rapport building
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Voice Recorder Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Record Conversation</h3>
            <VoiceRecorder 
              onTranscriptionComplete={setTranscript}
              onRecordingChange={setIsRecording}
              openai={openai}
            />
          </div>

          {/* Transcript Input Section */}
          <div className="mb-6">
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

          {/* Analysis Button */}
          <button
            onClick={analyzeTranscript}
            disabled={loading || !transcript.trim()}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing..." : "Analyze Transcript"}
          </button>

          {/* Error Display */}
          {error && (
            <div className="text-red-500 text-sm mt-2 p-3 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          {/* Section 2: The Analysis Results */}
          {summary && (
            <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Results Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Performance Analysis</h2>
                    <p className="text-indigo-200 mt-1">Comprehensive Review & Action Items</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <span className="block text-xs text-indigo-200 uppercase">Queue Type</span>
                    <span className="text-lg font-bold text-white capitalize">{summary.queueMetrics?.queueType}</span>
                  </div>
                </div>
              </div>
          
              <div className="p-6 space-y-6">
                {/* Agent Presence Section */}
                <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-6 border border-blue-100">
                  <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                    <span className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      👤
                    </span>
                    Agent Presence & Energy
                  </h3>
                  <p className="text-gray-800 text-lg leading-relaxed">{summary.tone}</p>
                </div>
          
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {summary.metrics?.map((metric, index) => {
                    const [label, value] = metric.split(':').map(str => str.trim());
                    const isPositive = value.includes('surplus');
                    const isNegative = value.includes('-');
                    
                    return (
                      <div key={index} className={`
                        rounded-xl p-4 border
                        ${isPositive ? 'bg-green-50 border-green-200' : 
                          isNegative ? 'bg-red-50 border-red-200' : 
                          'bg-blue-50 border-blue-200'}
                      `}>
                        <p className="text-sm text-gray-600 mb-1">{label}</p>
                        <p className={`text-lg font-bold
                          ${isPositive ? 'text-green-700' : 
                            isNegative ? 'text-red-700' : 
                            'text-blue-700'}
                        `}>
                          {value}
                        </p>
                      </div>
                    );
                  })}
                </div>
          
                {/* Critical Challenge */}
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center">
                    <span className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      ⚠️
                    </span>
                    Critical Challenge
                  </h3>
                  <p className="text-red-800 text-lg">{summary.challenge}</p>
                </div>
          
                {/* Development Plan */}
                <div className="bg-gradient-to-b from-emerald-50 to-white rounded-xl p-6 border border-emerald-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-emerald-900 flex items-center">
                      <span className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                        🎯
                      </span>
                      Development Plan
                    </h3>
                    <span className="px-4 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                      Priority Focus
                    </span>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 mb-6 border border-emerald-200">
                    <h4 className="text-lg font-bold text-emerald-800 mb-2">Focus Area</h4>
                    <p className="text-gray-800 text-lg">{summary.weeklyFocus?.focus}</p>
                  </div>
          
                  <div className="space-y-4">
                    {summary.weeklyFocus?.actions?.map((action, i) => (
                      <div key={i} className="flex items-start">
                        <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-grow bg-white rounded-xl p-4 border border-emerald-100">
                          <p className="text-gray-800">{action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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
