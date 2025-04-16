import React, { useEffect, useState } from 'react';
import { CrashRecoveryAlert } from '@/components/versions';
import { initializePersistence } from '@/store/initialize';

interface PersistenceProviderProps {
  children: React.ReactNode;
}

/**
 * PersistenceProvider initializes the persistence middleware and adds
 * crash recovery alerts to the application.
 */
export function PersistenceProvider({ children }: PersistenceProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize persistence middleware on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializePersistence();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize persistence middleware:', error);
        // Still set as initialized to not block the UI
        setIsInitialized(true);
      }
    };

    initialize();

    // Cleanup function
    return () => {
      // Any cleanup needed for the persistence system
    };
  }, []);

  // Display a loading state while initializing
  if (!isInitialized) {
    // You could return a loading spinner here if needed
    return null;
  }

  return (
    <>
      {children}
      <CrashRecoveryAlert />
    </>
  );
} 