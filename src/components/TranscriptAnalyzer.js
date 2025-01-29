import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import VoiceRecorder from './VoiceRecorder';
import SessionTimer from './SessionTimer';
import SessionController from './SessionController';


const TranscriptAnalyzer = () => {
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
      <Card>
        <CardHeader>
          <CardTitle>One on One Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Coaching Guide Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Coaching Session Guide</h2>
            <div className="space-y-4">
              {/* Section 1: Opening Discussion */}
              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Opening Discussion</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">5-10 mins</span>
                  </div>
                  <p className="text-gray-600">Open-ended discussion to understand agent's perspective</p>
                </div>
              </div>

              {/* Section 2: KPI Review */}
              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">KPI Review</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">5-10 mins</span>
                  </div>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Review performance metrics</li>
                    <li>Focus on previous session's action items</li>
                    <li>Identify lowest hanging fruit KPI</li>
                  </ul>
                </div>
              </div>

              {/* Section 3: Call Review */}
              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Call Review</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">30-40 mins</span>
                  </div>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Review 30-50 minute call at 1.25x or 1.5x speed</li>
                    <li>Pause to discuss key moments</li>
                    <li>Grade script adherence and soft skills</li>
                    <li>Focus on rapport, objections, and closing</li>
                  </ul>
                </div>
              </div>

              {/* Section 4: Set Focus Area */}
              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Set Focus Area</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">5-10 mins</span>
                  </div>
                  <div className="text-gray-600">
                    <p className="mb-2">Identify primary focus for next week:</p>
                    <ul className="list-disc list-inside grid grid-cols-2 gap-2">
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

          {/* Voice Recorder Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Record Conversation</h3>
            <VoiceRecorder 
              onTranscriptionComplete={setTranscript}
              onRecordingChange={setIsRecording}
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

          {/* Results Display */}
          {summary && (
            <div className="mt-8">
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">Performance Analysis</CardTitle>
                    <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg">
                      <span className="block text-xs text-blue-200 uppercase">Queue Type</span>
                      <span className="text-lg font-bold text-white capitalize">
                        {summary.queueMetrics?.queueType}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6 mt-6">
                  {/* Agent Presence & Tone */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Agent Presence & Energy</h3>
                    <p className="text-gray-700">{summary.tone}</p>
                  </div>

                  {/* Performance Metrics */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {summary.metrics?.map((metric, index) => {
                        const isPositive = metric.includes('surplus');
                        const isNeutral = metric.includes('target');
                        return (
                          <div 
                            key={index}
                            className={`p-4 rounded-lg ${
                              isPositive ? 'bg-green-50' : 
                              isNeutral ? 'bg-blue-50' : 
                              'bg-red-50'
                            }`}
                          >
                            <p className={`text-lg ${
                              isPositive ? 'text-green-700' :
                              isNeutral ? 'text-blue-700' :
                              'text-red-700'
                            }`}>
                              {metric}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Critical Challenge */}
                  <div className="bg-red-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-red-900 mb-4">Critical Challenge</h3>
                    <p className="text-red-800">{summary.challenge}</p>
                  </div>

                  {/* Development Plan */}
                  <div className="bg-gradient-to-b from-green-50 to-white rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Development Plan</h3>
                      <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Priority Focus
                      </span>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 mb-6 border border-green-100">
                      <h4 className="text-lg font-bold text-green-800 mb-2">Focus Area:</h4>
                      <p className="text-gray-800">{summary.weeklyFocus?.focus}</p>
                    </div>
                    
                    <div className="space-y-4">
                      {summary.weeklyFocus?.actions?.map((action, i) => (
                        <div key={i} className="flex items-start bg-white rounded-lg p-4 border border-gray-100">
                          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-gray-800">{action}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TranscriptAnalyzer;
