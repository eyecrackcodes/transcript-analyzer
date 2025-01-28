import React, { useState } from "react";
import OpenAI from "openai";
import "../index.css"; // Import global styles

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const TranscriptAnalyzer = () => {
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeWithAI = async (text) => {
    try {
      setLoading(true);
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `As an expert final expense telesales coach, analyze 1:1 meetings against these KPIs:

Required KPIs:
- RPA's (revenue producing activities) per day: 300 minimum average
- Talk time: 3 hours minimum or 240 minutes minimum
- Leads Taken: 8 per day minimum on performance queue or 10 per day in training queue
- Close rate: 25% in performance queue and 13% in training queue
- Average Anual premium: Between $900-$1200. If below 900 then agent is selling on price if above 1200 their placement may be impacted.

Key Areas to Assess:
- Phone presence and energy level
- Script compliance and customization
- Objection handling skills
- Closing techniques
- Follow-up strategies
- Time management
- CRM usage

Return analysis as JSON:
{
 "tone": "Analyze agent's energy, confidence, and phone presence",
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
}`,
          },
          { role: "user", content: text },
        ],
        temperature: 0.7,
      });

      const parsedResponse = JSON.parse(response.choices[0].message.content);
      setSummary(parsedResponse);
    } catch (error) {
      console.error("Error:", error);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const analyzeTranscript = async () => {
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
        />
        <button onClick={analyzeTranscript} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Transcript"}
        </button>

        {summary && (
          <div className="summary">
            <div className="summary-item">
              <h3>Agent Presence & Tone</h3>
              <p>{summary.tone}</p>
            </div>
            <div className="summary-item">
              <h3>Performance Metrics</h3>
              <ul>
                {Array.isArray(summary.metrics)
                  ? summary.metrics.map((metric, i) => (
                      <li key={i}>{metric}</li>
                    ))
                  : "Metrics data unavailable"}
              </ul>
            </div>
            <div className="summary-item">
              <h3>Primary Challenge</h3>
              <p>{summary.challenge}</p>
            </div>
            <div className="summary-item full">
              <h3>Development Plan</h3>
              <p>Focus Area: {summary.weeklyFocus.focus}</p>
              <ul>
                {summary.weeklyFocus.steps.map((step, i) => (
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
