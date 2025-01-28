import React, { useState, useEffect } from 'react';
import SessionTimer from './SessionTimer';

const SessionController = ({ 
  isRecording, 
  activeSection, 
  setActiveSection, 
  completedSections, 
  setCompletedSections 
}) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const sections = [
    { id: 1, title: "Opening Discussion", duration: 10 },
    { id: 2, title: "KPI Review", duration: 10 },
    { id: 3, title: "Call Review", duration: 40 },
    { id: 4, title: "Set Focus Area", duration: 10 }
  ];

  useEffect(() => {
    if (isRecording && activeSection === 0) {
      setActiveSection(1);
      setIsTimerRunning(true);
    }
  }, [isRecording, activeSection, setActiveSection]);

  const handleSectionComplete = () => {
    if (activeSection > 0 && activeSection <= sections.length) {
      setCompletedSections([...completedSections, activeSection]);
      if (activeSection < sections.length) {
        setActiveSection(activeSection + 1);
      } else {
        setIsTimerRunning(false);
        setActiveSection(0);
      }
    }
  };

  const handleManualComplete = () => {
    handleSectionComplete();
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  if (activeSection === 0) {
    return null;
  }

  return (
    <div className="session-controls bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Session Timer</h3>
        <div className="flex gap-2">
          <button
            onClick={toggleTimer}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isTimerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
          </button>
          <button
            onClick={handleManualComplete}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
          >
            Complete Section
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {activeSection > 0 && activeSection <= sections.length && (
          <>
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
                Section {activeSection} of {sections.length}
              </p>
              <div className="mt-2 flex gap-1">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className={`w-6 h-1 rounded ${
                      completedSections.includes(index + 1)
                        ? 'bg-green-500'
                        : index + 1 === activeSection
                        ? 'bg-blue-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SessionController;
