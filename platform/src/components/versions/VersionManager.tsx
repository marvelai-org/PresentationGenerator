import React, { useEffect, useState } from 'react';
import { usePresentationVersions } from '@/store/hooks/usePresentationVersions';
import { PresentationVersion } from '@/store/middleware/enhanced-persistence';
import { formatDistanceToNow } from 'date-fns';

// Format timestamp to relative time (e.g., "2 hours ago")
function formatTimestamp(timestamp: string): string {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch (e) {
    return 'Unknown date';
  }
}

interface VersionItemProps {
  version: PresentationVersion;
  onRestore: (versionId: string) => void;
  isActive?: boolean;
}

const VersionItem: React.FC<VersionItemProps> = ({ version, onRestore, isActive }) => {
  return (
    <div 
      className={`
        p-4 mb-2 border rounded-md transition-colors
        ${isActive 
          ? 'bg-primary-100 border-primary-300' 
          : 'bg-white hover:bg-gray-50 border-gray-200'
        }
      `}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-md font-medium">{version.description}</h3>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <span className="mr-2">{formatTimestamp(version.timestamp)}</span>
            {version.isAutosave && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                Auto-saved
              </span>
            )}
            {version.isRecoveryPoint && (
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full ml-1">
                Recovery point
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={() => onRestore(version.id)}
          className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
          disabled={isActive}
        >
          {isActive ? 'Current' : 'Restore'}
        </button>
      </div>
    </div>
  );
};

interface RecoveryAlertProps {
  onRestore: () => void;
  onDismiss: () => void;
}

const RecoveryAlert: React.FC<RecoveryAlertProps> = ({ onRestore, onDismiss }) => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-amber-700">
            We detected that your presentation was not properly saved. Would you like to restore from the most recent recovery point?
          </p>
          <div className="mt-2">
            <button
              type="button"
              onClick={onRestore}
              className="mr-2 px-2 py-1 text-xs font-medium rounded-md bg-amber-100 text-amber-800 hover:bg-amber-200"
            >
              Restore
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="px-2 py-1 text-xs font-medium rounded-md bg-transparent text-amber-800 hover:bg-amber-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface VersionManagerProps {
  presentationId?: string;
  onClose?: () => void;
}

const VersionManager: React.FC<VersionManagerProps> = ({ presentationId, onClose }) => {
  const { 
    versions, 
    isLoading, 
    error, 
    createVersion, 
    restore, 
    checkRecovery 
  } = usePresentationVersions(presentationId);
  
  const [versionName, setVersionName] = useState('');
  const [hasRecoveryData, setHasRecoveryData] = useState(false);
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  
  // Check for recovery data on mount
  useEffect(() => {
    const checkForRecovery = async () => {
      const recoveryData = await checkRecovery();
      setHasRecoveryData(!!recoveryData);
    };
    
    checkForRecovery();
  }, [checkRecovery]);
  
  // Assume latest version is active if we don't have an active version set
  useEffect(() => {
    if (versions.length > 0 && !activeVersionId) {
      setActiveVersionId(versions[0].id);
    }
  }, [versions, activeVersionId]);
  
  const handleCreateVersion = async () => {
    if (!versionName.trim()) return;
    
    const success = await createVersion(versionName);
    if (success) {
      setVersionName('');
    }
  };
  
  const handleRestore = async (versionId: string) => {
    const success = await restore(versionId);
    if (success) {
      setActiveVersionId(versionId);
    }
  };
  
  const handleRecoveryRestore = async () => {
    const recoveryData = await checkRecovery();
    if (recoveryData) {
      // Apply recovery data to the store
      // This is handled internally by the checkRecovery function
      setHasRecoveryData(false);
    }
  };
  
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Version History</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {hasRecoveryData && (
        <RecoveryAlert 
          onRestore={handleRecoveryRestore} 
          onDismiss={() => setHasRecoveryData(false)} 
        />
      )}
      
      <div className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
            placeholder="Version name (e.g., 'After adding introduction')"
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            onClick={handleCreateVersion}
            disabled={!versionName.trim()}
            className="bg-primary-500 text-white px-4 py-2 rounded-r-md hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Save Version
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Create a named version to easily revert to this state later.
        </p>
      </div>
      
      <div className="mb-2">
        <h3 className="text-lg font-medium">Version History</h3>
        <p className="text-sm text-gray-500">Restore previous versions of your presentation</p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading versions...</p>
        </div>
      ) : versions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">No versions found</p>
          <p className="text-sm text-gray-400 mt-1">Create your first version to keep track of changes</p>
        </div>
      ) : (
        <div className="space-y-3 mt-4">
          {versions.map((version) => (
            <VersionItem 
              key={version.id} 
              version={version} 
              onRestore={handleRestore}
              isActive={version.id === activeVersionId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VersionManager; 