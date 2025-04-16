import { useCallback, useEffect, useRef } from 'react';
import { createRecoveryPoint } from '@/store/initialize';
import { usePersistedStore } from '@/store/index';

/**
 * Hook for automatically creating recovery points during operations
 * that could potentially fail or crash.
 * 
 * This hook can be used in two ways:
 * 1. As a decorator for async functions, to automatically create recovery points
 * 2. To manually create recovery points at specific points during an operation
 */
export function useAutoRecovery() {
  const currentPresentationId = usePersistedStore(state => state.currentPresentationId);
  const isActiveRef = useRef<boolean>(false);
  const operationNameRef = useRef<string>('');
  
  // Create a recovery point if the component unmounts while an operation is in progress
  useEffect(() => {
    return () => {
      if (isActiveRef.current && operationNameRef.current) {
        createRecoveryPoint(`Recovery during ${operationNameRef.current} (component unmounted)`);
        isActiveRef.current = false;
      }
    };
  }, []);
  
  /**
   * Wraps an async function with recovery point creation
   */
  const withRecovery = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>, 
    operationName: string
  ) => {
    return async (...args: T): Promise<R> => {
      if (!currentPresentationId) {
        // No need for recovery if there's no active presentation
        return fn(...args);
      }
      
      try {
        // Start recovery tracking
        isActiveRef.current = true;
        operationNameRef.current = operationName;
        
        // Create a recovery point
        await createRecoveryPoint(`Before ${operationName}`);
        
        // Execute the function
        const result = await fn(...args);
        
        // Create another recovery point after successful completion
        await createRecoveryPoint(`After ${operationName}`);
        
        // End recovery tracking
        isActiveRef.current = false;
        operationNameRef.current = '';
        
        return result;
      } catch (error) {
        // Create a recovery point on error
        await createRecoveryPoint(`Error during ${operationName}`);
        
        // End recovery tracking
        isActiveRef.current = false;
        operationNameRef.current = '';
        
        throw error;
      }
    };
  }, [currentPresentationId]);
  
  /**
   * Create a recovery point manually
   */
  const createOperationRecoveryPoint = useCallback(async (description: string) => {
    if (!currentPresentationId) return false;
    
    return await createRecoveryPoint(description);
  }, [currentPresentationId]);
  
  /**
   * Start tracking an operation
   */
  const startOperation = useCallback((operationName: string) => {
    if (!currentPresentationId) return;
    
    isActiveRef.current = true;
    operationNameRef.current = operationName;
    
    createRecoveryPoint(`Starting ${operationName}`);
  }, [currentPresentationId]);
  
  /**
   * End tracking an operation
   */
  const endOperation = useCallback((success: boolean = true) => {
    if (!currentPresentationId || !isActiveRef.current) return;
    
    const status = success ? 'completed' : 'failed';
    createRecoveryPoint(`${operationNameRef.current} ${status}`);
    
    isActiveRef.current = false;
    operationNameRef.current = '';
  }, [currentPresentationId]);
  
  return {
    withRecovery,
    createRecoveryPoint: createOperationRecoveryPoint,
    startOperation,
    endOperation
  };
} 