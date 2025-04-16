import { useState, useCallback } from 'react';
import { ProgressInfo } from '../services/aiService';

export type ProgressState = {
  stage: string;
  progress: number;
  message: string;
  isComplete: boolean;
  error?: string;
  timestamp: number;
};

/**
 * Hook for tracking progress of AI generation tasks
 * Provides methods for updating progress and retrieving current progress state
 */
const useAIProgress = () => {
  const [progress, setProgress] = useState<ProgressState>({
    stage: 'Idle',
    progress: 0,
    message: 'Ready to start',
    isComplete: false,
    timestamp: Date.now()
  });

  // Callback function that can be passed to AI services
  const updateProgress = useCallback((progressInfo: ProgressInfo) => {
    setProgress({
      stage: progressInfo.stage,
      progress: progressInfo.progress,
      message: progressInfo.message || '',
      isComplete: progressInfo.isComplete,
      timestamp: Date.now()
    });
  }, []);

  // Reset progress state
  const resetProgress = useCallback(() => {
    setProgress({
      stage: 'Idle',
      progress: 0,
      message: 'Ready to start',
      isComplete: false,
      timestamp: Date.now()
    });
  }, []);

  // Set error state
  const setError = useCallback((errorMessage: string) => {
    setProgress(prev => ({
      ...prev,
      error: errorMessage,
      message: `Error: ${errorMessage}`,
      isComplete: true,
      timestamp: Date.now()
    }));
  }, []);

  // Check if currently in progress
  const isInProgress = progress.progress > 0 && !progress.isComplete && !progress.error;

  // Check if there was an error
  const hasError = !!progress.error;

  return {
    progress,
    updateProgress,
    resetProgress,
    setError,
    isInProgress,
    hasError
  };
};

export default useAIProgress; 