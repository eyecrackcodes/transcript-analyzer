import React, { useState } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({
 apiKey: process.env.REACT_APP_OPENAI_API_KEY,
 dangerouslyAllowBrowser: true
});

const TranscriptAnalyzer = () => {
 const [transcript, setTranscript] = useState('');
 const [summary, setSummary] = useState(null);
 const [loading, setLoading] = useState(false);

 const analyzeWithAI = async (text) => {
   try {
     setLoading(true);
     const response = await openai.chat.completions.create({
       model: "gpt-4",
       messages: [{
         role: "system",
         content: `As an expert final expense telesales coach, analyze 1:1 meetings against these KPIs:

Required KPIs:
- RPA's (revenue producing activities) per day: 120 minimum
- Talk time: 3 hours minimum or 240 minutes minimum
- Leads Taken: 8 per day minimum
- Close rate: 25%
- Average Anual premium: $900+

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
}`
       }, {
         role: "user",
         content: text
       }],
       temperature: 0.7
     });

     const parsedResponse = JSON.parse(response.choices[0].message.content);
     console.log('AI Analysis:', parsedResponse);
     return parsedResponse;
   } catch (error) {
     console.error('Error:', error);
     return null;
   } finally {
     setLoading(false);
   }
 };

 const analyzeTranscript = async () => {
   const aiAnalysis = await analyzeWithAI(transcript);
   if (aiAnalysis) {
     setSummary(aiAnalysis);
   }
 };

 return (
   <div className="min-h-screen bg-gray-50 py-8 px-4">
     <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
       <h1 className="text-3xl font-bold text-gray-900 mb-6">Final Expense Sales 1:1 Analysis</h1>
       
       <div className="space-y-6">
         <textarea 
           className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
           placeholder="Paste your 1:1 meeting transcript here..."
           value={transcript}
           onChange={(e) => setTranscript(e.target.value)}
         />
         
         <button
           className={`w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
           onClick={analyzeTranscript}
           disabled={loading}
         >
           {loading ? 'Analyzing...' : 'Analyze Transcript'}
         </button>

         {summary && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
             <div className="bg-blue-50 p-6 rounded-lg">
               <h3 className="text-lg font-semibold text-blue-900">Agent Presence & Tone</h3>
               <p className="mt-2 text-blue-800">{summary.tone}</p>
             </div>
             
             <div className="bg-green-50 p-6 rounded-lg">
               <h3 className="text-lg font-semibold text-green-900">Performance Metrics</h3>
               <ul className="mt-2 space-y-2 text-green-800">
                 {Array.isArray(summary.metrics) ? 
                   summary.metrics.map((metric, i) => (
                     <li key={i}>• {metric}</li>
                   )) : 
                   <li>Metrics data unavailable</li>
                 }
               </ul>
             </div>
             
             <div className="bg-purple-50 p-6 rounded-lg">
               <h3 className="text-lg font-semibold text-purple-900">Primary Challenge</h3>
               <p className="mt-2 text-purple-800">{summary.challenge}</p>
             </div>
             
             <div className="bg-orange-50 p-6 rounded-lg col-span-2">
               <h3 className="text-lg font-semibold text-orange-900">Development Plan</h3>
               <div className="mt-2 text-orange-800">
                 <p className="font-medium mb-2">Focus Area: {summary.weeklyFocus.focus}</p>
                 <ul className="mt-2 space-y-2">
                   {summary.weeklyFocus.steps.map((step, i) => (
                     <li key={i} className="flex items-start">
                       <span className="mr-2">•</span>
                       <span>{step}</span>
                     </li>
                   ))}
                 </ul>
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