import { useCallback, useMemo } from 'react';
import { useStore } from '@/store';
import { 
  GenerationType, 
  GenerationTask, 
  GenerationTaskStatus,
  GenerationSettings
} from '@/store/slices/generation';

/**
 * Custom hook for accessing and interacting with the generation state machine
 * Provides all the necessary functions to manage generation tasks
 */
export const useGenerationStateMachine = (taskId?: string) => {
  const store = useStore();
  
  // Get the specific task if taskId is provided
  const task = useMemo(() => {
    if (!taskId) return null;
    return store.tasks[taskId] || null;
  }, [store.tasks, taskId]);
  
  // Selector for all tasks
  const tasks = useMemo(() => store.tasks, [store.tasks]);
  
  // Selector for tasks in the queue
  const queuedTasks = useMemo(() => {
    return store.queue.map(id => store.tasks[id]).filter(Boolean);
  }, [store.queue, store.tasks]);
  
  // Get tasks by status
  const getTasksByStatus = useCallback((status: GenerationTaskStatus) => {
    return Object.values(store.tasks).filter(task => task.status === status);
  }, [store.tasks]);
  
  // Selector for active tasks (either in_progress or queued)
  const activeTasks = useMemo(() => {
    return Object.values(store.tasks).filter(
      task => task.status === 'in_progress' || task.status === 'queued'
    );
  }, [store.tasks]);
  
  // Selector for completed tasks
  const completedTasks = useMemo(() => {
    return getTasksByStatus('completed');
  }, [getTasksByStatus]);
  
  // Selector for failed tasks
  const failedTasks = useMemo(() => {
    return getTasksByStatus('failed');
  }, [getTasksByStatus]);
  
  // Get current task
  const currentTask = useMemo(() => {
    if (!store.currentTaskId) return null;
    return store.tasks[store.currentTaskId] || null;
  }, [store.currentTaskId, store.tasks]);
  
  // Is the system currently generating something?
  const isGenerating = useMemo(() => store.isGenerating, [store.isGenerating]);
  
  // Task creation
  const createTask = useCallback((
    type: GenerationType, 
    prompt: string, 
    metadata?: Record<string, any>
  ) => {
    return store.createTask(type, prompt, metadata);
  }, [store.createTask]);
  
  // Start a task
  const startTask = useCallback((id: string) => {
    store.startTask(id);
  }, [store.startTask]);
  
  // Update task progress
  const updateProgress = useCallback((
    id: string, 
    progress: number, 
    partialData?: any
  ) => {
    store.updateTaskProgress(id, progress, partialData);
  }, [store.updateTaskProgress]);
  
  // Complete a task
  const completeTask = useCallback((
    id: string, 
    result: any
  ) => {
    store.completeTask(id, result);
  }, [store.completeTask]);
  
  // Fail a task
  const failTask = useCallback((
    id: string, 
    error: string
  ) => {
    store.failTask(id, error);
  }, [store.failTask]);
  
  // Cancel a task
  const cancelTask = useCallback((id: string) => {
    store.cancelTask(id);
  }, [store.cancelTask]);
  
  // Pause a task
  const pauseTask = useCallback((id: string) => {
    store.pauseTask(id);
  }, [store.pauseTask]);
  
  // Resume a task
  const resumeTask = useCallback((id: string) => {
    store.resumeTask(id);
  }, [store.resumeTask]);
  
  // Retry a task
  const retryTask = useCallback((
    id: string, 
    usePartial: boolean = true
  ) => {
    return store.retryTask(id, usePartial);
  }, [store.retryTask]);
  
  // Queue management
  const clearQueue = useCallback(() => {
    store.clearQueue();
  }, [store.clearQueue]);
  
  // Settings management
  const updateSettings = useCallback((
    settings: Partial<GenerationSettings>
  ) => {
    store.updateGlobalSettings(settings);
  }, [store.updateGlobalSettings]);
  
  // High-level generation actions
  const generateOutline = useCallback((
    topic: string, 
    numSlides: number, 
    settings?: Partial<GenerationSettings>
  ) => {
    return store.generateOutline(topic, numSlides, settings);
  }, [store.generateOutline]);
  
  const generateContent = useCallback((
    outlineId: string, 
    settings?: Partial<GenerationSettings>
  ) => {
    return store.generateContent(outlineId, settings);
  }, [store.generateContent]);
  
  const generateImage = useCallback((
    prompt: string, 
    settings?: Partial<GenerationSettings>
  ) => {
    return store.generateImage(prompt, settings);
  }, [store.generateImage]);
  
  const generateFullPresentation = useCallback((
    topic: string, 
    numSlides: number, 
    settings?: Partial<GenerationSettings>
  ) => {
    return store.generateFullPresentation(topic, numSlides, settings);
  }, [store.generateFullPresentation]);
  
  // Get task history
  const getTaskHistory = useCallback((taskId: string) => {
    return store.getTaskHistory(taskId);
  }, [store.getTaskHistory]);
  
  // Task status checks
  const isTaskActive = useCallback((id: string) => {
    const task = store.tasks[id];
    if (!task) return false;
    return task.status === 'in_progress' || task.status === 'queued';
  }, [store.tasks]);
  
  const isTaskCompleted = useCallback((id: string) => {
    const task = store.tasks[id];
    if (!task) return false;
    return task.status === 'completed';
  }, [store.tasks]);
  
  const isTaskFailed = useCallback((id: string) => {
    const task = store.tasks[id];
    if (!task) return false;
    return task.status === 'failed';
  }, [store.tasks]);
  
  // Check if a state transition is valid
  const isValidTransition = useCallback((
    currentStatus: GenerationTaskStatus,
    event: 'QUEUE' | 'START' | 'PROGRESS' | 'PAUSE' | 'RESUME' | 'COMPLETE' | 'FAIL' | 'CANCEL' | 'RETRY'
  ) => {
    return store.isValidStateTransition(currentStatus, event);
  }, [store.isValidStateTransition]);
  
  return {
    // State
    task,
    tasks,
    queuedTasks,
    activeTasks,
    completedTasks,
    failedTasks,
    currentTask,
    isGenerating,
    
    // Selectors
    getTasksByStatus,
    
    // Actions
    createTask,
    startTask,
    updateProgress,
    completeTask,
    failTask,
    cancelTask,
    pauseTask,
    resumeTask,
    retryTask,
    clearQueue,
    
    // Settings
    updateSettings,
    
    // High-level actions
    generateOutline,
    generateContent,
    generateImage,
    generateFullPresentation,
    
    // History
    getTaskHistory,
    
    // Status checks
    isTaskActive,
    isTaskCompleted,
    isTaskFailed,
    
    // State machine utilities
    isValidTransition
  };
}; 