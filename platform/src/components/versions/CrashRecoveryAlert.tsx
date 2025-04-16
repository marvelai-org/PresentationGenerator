import React, { useEffect, useState } from 'react';
import { usePresentationVersions } from '@/store/hooks/usePresentationVersions';

interface CrashRecoveryAlertProps {
  presentationId?: string;
  onRestore?: () => void;
}

const CrashRecoveryAlert: React.FC<CrashRecoveryAlertProps> = ({ 
  presentationId,
  onRestore
}) => {
  const [hasRecoveryData, setHasRecoveryData] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { checkRecovery } = usePresentationVersions(presentationId);
  
  // Check for recovery data on mount
  useEffect(() => {
    const checkForRecovery = async () => {
      const recoveryData = await checkRecovery();
      const hasData = !!recoveryData;
      setHasRecoveryData(hasData);
      setIsVisible(hasData);
    };
    
    checkForRecovery();
  }, [checkRecovery, presentationId]);
  
  // If no recovery data, don't render anything
  if (!hasRecoveryData || !isVisible) {
    return null;
  }
  
  const handleRestore = async () => {
    const recoveryData = await checkRecovery();
    if (recoveryData) {
      // Close the alert
      setIsVisible(false);
      // Trigger the onRestore callback if provided
      if (onRestore) {
        onRestore();
      }
    }
  };
  
  const handleDismiss = () => {
    setIsVisible(false);
  };
  
  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-amber-50 border-l-4 border-amber-400 p-4 rounded shadow-lg z-50">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-amber-800">Unsaved Changes Found</h3>
          <div className="mt-2 text-sm text-amber-700">
            <p>We found unsaved changes from a previous session. Would you like to restore these changes?</p>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex">
              <button
                onClick={handleRestore}
                className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-md text-sm font-medium hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Restore Changes
              </button>
              <button
                onClick={handleDismiss}
                className="ml-3 px-3 py-1.5 bg-white text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrashRecoveryAlert; 