import React, { useState, useEffect, useRef } from 'react';

const SessionTimer = ({ duration, isRunning, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            onComplete && onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onComplete, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
          />
          <circle
            className="text-blue-600 transition-all duration-300"
            strokeWidth="8"
            strokeDasharray={264}
            strokeDashoffset={264 - (progress * 264) / 100}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="text-lg font-semibold">{formatTime(timeLeft)}</span>
        </div>
      </div>
    </div>
  );
};

export default SessionTimer;
