import React, { useState } from 'react';
import SessionTimer from './SessionTimer';

const SessionController = () => {
  const [activeSection, setActiveSection] = useState(0); // 0 means not started
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const sections = [
    { id: 1, title: "Opening Discussion", duration: 10 },
    { id: 2, title: "KPI Review", duration: 10 },
    { id: 3, title: "Call Review", duration: 40 },
    { id: 4, title: "Set Focus Area", duration: 10 }
  ];

  const startSession = () => {
    setActiveSection(1);
    setIsTimerRunning(true);
  };

  const handleSectionComplete = () => {
    if (activeSection < sections.length) {
      setActiveSection(activeSection + 1);
    } else {
      setIsTimerRunning(false);
      setActiveSection(0);
    }
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  return (
    <div className="session-controls bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Session Timer</h3>
        {activeSection === 0 ? (
          <button
            onClick={startSession}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Session
          </button>
        ) : (
          <button
            onClick={toggleTimer}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isTimerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isTimerRunning ? 'Pause' : 'Resume'}
          </button>
        )}
      </div>

      {activeSection > 0 && (
        <div className="flex items-center space-x-4">
          <SessionTimer
            duration={sections[activeSection - 1].duration}
            isRunning={isTimerRunning}
            onComplete={handleSectionComplete}
          />
          <div>
            <h4 className="font-medium text-gray-700">
              Current Section: {sections[activeSection - 1].title}
            </h4>
            <p className="text-sm text-gray-500">
              {activeSection} of {sections.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionController;
