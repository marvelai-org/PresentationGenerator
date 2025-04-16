import React from 'react';
import { ProgressState } from '../hooks/useAIProgress';

type AIProgressBarProps = {
  progress: ProgressState;
  className?: string;
};

const AIProgressBar: React.FC<AIProgressBarProps> = ({ progress, className = '' }) => {
  // Don't render anything when not in progress and no error
  if (progress.progress === 0 && !progress.error) {
    return null;
  }

  // Calculate progress width
  const progressWidth = `${Math.min(progress.progress, 100)}%`;

  // Determine color based on status
  let colorClass = 'bg-blue-500';
  if (progress.isComplete && !progress.error) {
    colorClass = 'bg-green-500';
  } else if (progress.error) {
    colorClass = 'bg-red-500';
  }

  return (
    <div className={`w-full p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">{progress.stage}</div>
        <div className="text-sm text-gray-600">
          {progress.isComplete ? '100%' : `${Math.round(progress.progress)}%`}
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full transition-all duration-300 ease-in-out ${colorClass}`} 
          style={{ width: progressWidth }}
        ></div>
      </div>
      
      <div className="mt-2 text-sm">
        {progress.error ? (
          <div className="text-red-500">{progress.message}</div>
        ) : (
          <div>{progress.message}</div>
        )}
      </div>
    </div>
  );
};

export default AIProgressBar; 