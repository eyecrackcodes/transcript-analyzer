import React, { useState, useEffect } from 'react';

const SessionController = ({ isRecording }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sectionTimes, setSectionTimes] = useState({});

  const sections = [
    { id: 1, title: "Opening Discussion", duration: "5-10" },
    { id: 2, title: "KPI Review", duration: "5-10" },
    { id: 3, title: "Call Review", duration: "30-40" },
    { id: 4, title: "Set Focus Area", duration: "5-10" }
  ];

  useEffect(() => {
    if (isRecording && !sessionStartTime) {
      setSessionStartTime(new Date());
      setActiveSection(1);
    }
  }, [isRecording, sessionStartTime]);

  const handleNextSection = () => {
    if (activeSection < sections.length) {
      // Record completion time for current section
      setSectionTimes(prev => ({
        ...prev,
        [activeSection]: {
          completedAt: new Date(),
          duration: getDuration(activeSection)
        }
      }));
      setActiveSection(activeSection + 1);
    }
  };

  const getDuration = (sectionId) => {
    if (!sectionTimes[sectionId]?.completedAt) return "";
    const startTime = sectionId === 1 ? sessionStartTime : sectionTimes[sectionId - 1]?.completedAt;
    const endTime = sectionTimes[sectionId]?.completedAt;
    const minutes = Math.round((endTime - startTime) / (1000 * 60));
    return `${minutes} mins`;
  };

  if (!isRecording) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="space-y-4">
        {sections.map((section) => (
          <div 
            key={section.id}
            className={`flex items-center p-3 rounded-lg ${
              activeSection === section.id 
                ? 'bg-blue-50 border-2 border-blue-500'
                : section.id < activeSection
                ? 'bg-green-50'
                : 'bg-gray-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
              activeSection === section.id
                ? 'bg-blue-500 text-white'
                : section.id < activeSection
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-white'
            }`}>
              {section.id}
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <span className="font-medium">{section.title}</span>
                <span className="text-sm text-gray-600">
                  {sectionTimes[section.id]?.duration || `Target: ${section.duration} mins`}
                </span>
              </div>
              {activeSection === section.id && (
                <button
                  onClick={handleNextSection}
                  className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  Complete & Next Section →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionController;
