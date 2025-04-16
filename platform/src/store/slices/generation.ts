import { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import { generateOutline, generateSlides, generateImages } from '@/services/aiService';

// Types for generation tasks
export type GenerationType = 'outline' | 'content' | 'slide' | 'image' | 'design';

// State machine states for generation tasks
export type GenerationTaskStatus = 
  | 'idle'       // Initial state
  | 'queued'     // Task is in queue waiting to be processed
  | 'preparing'  // Preparing for generation (e.g. validating inputs)
  | 'in_progress' // Task is actively being processed
  | 'paused'     // Task is paused by user or system
  | 'completed'  // Task completed successfully
  | 'failed'     // Task failed with error
  | 'cancelled'; // Task was cancelled by user

// Define lifecycle events for state machine transitions
export type GenerationTaskEvent = 
  | 'QUEUE'       // Queue a task
  | 'START'       // Start a task
  | 'PROGRESS'    // Update progress
  | 'PAUSE'       // Pause a task
  | 'RESUME'      // Resume a paused task
  | 'COMPLETE'    // Complete a task
  | 'FAIL'        // Fail a task
  | 'CANCEL'      // Cancel a task
  | 'RETRY';      // Retry a failed task

// Result types for partial results
export type GenerationPartialResult = {
  slideIndex?: number;  // For tracking which slide was last processed
  elementIndex?: number; // For tracking which element within a slide
  partialData?: any;    // Any partial data that was generated
  completedSteps?: string[]; // Steps that were completed
  progress: number;     // Progress as percentage (0-100)
};

export interface GenerationTask {
  id: string;
  type: GenerationType;
  status: GenerationTaskStatus;
  prompt: string;
  startTime: string;
  endTime?: string;
  progress: number; // 0-100
  result?: any;
  error?: string;
  metadata?: Record<string, any>;
  partialResults?: GenerationPartialResult[]; // Store partial results for retry
  retryCount: number; // Track number of retry attempts
  cancelToken?: AbortController; // For cancellation support
}

export interface GenerationAttempt {
  id: string;
  taskId: string;
  timestamp: string;
  status: GenerationTaskStatus;
  result?: any;
  error?: string;
}

// Types
export type GenerationStatus = 'idle' | 'loading' | 'generating' | 'success' | 'error';
export type ContentType = 'outline' | 'slide' | 'content' | 'image' | 'styling';

export interface GenerationRequest {
  id: string;
  type: ContentType;
  prompt: string;
  target?: {
    slideId?: string;
    elementId?: string;
  };
  timestamp: number;
  status: GenerationStatus;
  progress: number;
  result?: any;
  error?: string;
}

// State definition
export interface GenerationState {
  tasks: Record<string, GenerationTask>;
  taskOrder: string[];
  currentTaskId: string | null;
  isGenerating: boolean;
  queue: string[]; // IDs of queued tasks
  history: string[]; // IDs of completed tasks (most recent first)
  attempts: Record<string, GenerationAttempt[]>; // History of attempts by taskId
  error: string | null;
  preferredModel: string;
  globalSettings: GenerationSettings;
  activeRequests: Record<string, GenerationRequest>;
  currentPrompt: string;
  canGenerateContent: boolean;
  remainingCredits: number;
  isSubscribed: boolean;
  settings: {
    model: string;
    temperature: number;
    maxTokens: number;
    autoGenerateImages: boolean;
    stylePreset: string;
    useStructuredOutput: boolean;
  };
}

export interface GenerationSettings {
  temperature: number;
  maxTokens: number;
  model: string;
  imageProvider: 'dalle' | 'stability' | 'midjourney' | 'mock';
  style: string;
  autoEnhance: boolean;
  language: string;
  maxRetries: number; // Maximum number of retry attempts
  abortTimeoutMs: number; // Timeout for long-running operations in ms
}

// Actions definition
export interface GenerationActions {
  // Task management
  createTask: (type: GenerationType, prompt: string, metadata?: Record<string, any>) => string;
  startTask: (id: string) => void;
  updateTaskProgress: (id: string, progress: number, partialData?: any) => void;
  completeTask: (id: string, result: any) => void;
  failTask: (id: string, error: string) => void;
  cancelTask: (id: string) => void;
  pauseTask: (id: string) => void;
  resumeTask: (id: string) => void;
  retryTask: (id: string, usePartial?: boolean) => Promise<string>;
  
  // Queue management
  enqueueTask: (id: string) => void;
  dequeueTask: () => string | null;
  clearQueue: () => void;
  
  // Status management
  setCurrentTask: (id: string | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  
  // Settings management
  updateGlobalSettings: (settings: Partial<GenerationSettings>) => void;
  setPreferredModel: (model: string) => void;
  
  // History management
  clearHistory: () => void;
  getTaskHistory: (taskId: string) => GenerationAttempt[];
  
  // High-level generation actions
  generateOutline: (topic: string, numSlides: number, settings?: Partial<GenerationSettings>) => Promise<string>;
  generateContent: (outlineId: string, settings?: Partial<GenerationSettings>) => Promise<string>;
  generateImage: (prompt: string, settings?: Partial<GenerationSettings>) => Promise<string>;
  generateFullPresentation: (topic: string, numSlides: number, settings?: Partial<GenerationSettings>) => Promise<{
    outlineTaskId: string;
    contentTaskId: string;
    imageTaskIds: string[];
  }>;
  
  // Request management
  startGeneration: (type: ContentType, prompt: string, target?: GenerationRequest['target']) => string;
  cancelGeneration: (id: string) => void;
  updateGenerationStatus: (id: string, status: GenerationStatus, result?: any, error?: string) => void;
  updateGenerationProgress: (id: string, progress: number) => void;
  clearGenerationHistory: () => void;
  
  // Prompt handling
  setCurrentPrompt: (prompt: string) => void;
  
  // Settings management
  updateSettings: (settings: Partial<GenerationState['settings']>) => void;
  
  // Subscription and credits
  setRemainingCredits: (credits: number) => void;
  setSubscriptionStatus: (isSubscribed: boolean) => void;
  
  // Helpers
  canGenerate: (type: ContentType) => boolean;
  
  // State machine helpers
  getValidStateTransitions: (currentStatus: GenerationTaskStatus) => GenerationTaskEvent[];
  isValidStateTransition: (currentStatus: GenerationTaskStatus, event: GenerationTaskEvent) => boolean;
}

// Default settings
export const defaultGenerationSettings: GenerationSettings = {
  temperature: 0.7,
  maxTokens: 2000,
  model: 'gpt-4',
  imageProvider: 'dalle',
  style: 'modern',
  autoEnhance: true,
  language: 'en',
  maxRetries: 3,
  abortTimeoutMs: 30000, // 30 seconds
};

// Initial state
const initialState: GenerationState = {
  tasks: {},
  taskOrder: [],
  currentTaskId: null,
  isGenerating: false,
  queue: [],
  history: [],
  attempts: {},
  error: null,
  preferredModel: 'gpt-4',
  globalSettings: defaultGenerationSettings,
  activeRequests: {},
  currentPrompt: '',
  canGenerateContent: true,
  remainingCredits: 100,
  isSubscribed: false,
  settings: {
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048,
    autoGenerateImages: true,
    stylePreset: 'professional',
    useStructuredOutput: true,
  },
};

// Type for the slice creator function
export type GenerationSlice = GenerationState & GenerationActions;

// State transition definition
// This defines valid state transitions in our state machine
const stateTransitionMap: Record<GenerationTaskStatus, GenerationTaskEvent[]> = {
  'idle': ['QUEUE', 'START'],
  'queued': ['START', 'CANCEL'],
  'preparing': ['START', 'FAIL', 'CANCEL'],
  'in_progress': ['PROGRESS', 'COMPLETE', 'FAIL', 'PAUSE', 'CANCEL'],
  'paused': ['RESUME', 'CANCEL'],
  'completed': ['QUEUE'], // Can re-queue a completed task
  'failed': ['RETRY', 'QUEUE'],
  'cancelled': ['RETRY', 'QUEUE'],
};

// Helper function to simulate API calls for generation (to be replaced with real API)
const simulateGeneration = async (type: GenerationType, prompt: string, settings: GenerationSettings): Promise<any> => {
  // In a real implementation, this would call your AI service
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      switch (type) {
        case 'outline':
          resolve({
            slides: [
              { id: 1, title: 'Introduction', bullets: ['Key point 1', 'Key point 2'] },
              { id: 2, title: 'Main Concept', bullets: ['Key point 1', 'Key point 2'] },
              { id: 3, title: 'Examples', bullets: ['Example 1', 'Example 2'] },
              { id: 4, title: 'Conclusion', bullets: ['Summary point 1', 'Summary point 2'] },
            ]
          });
          break;
        case 'content':
          resolve({
            slideContents: [
              { 
                id: 1, 
                title: 'Introduction',
                content: 'This is the introduction content.',
                notes: 'Speaker notes for introduction.'
              },
              // More slides would follow...
            ]
          });
          break;
        case 'image':
          resolve({
            url: 'https://example.com/generated-image.jpg',
          });
          break;
        default:
          reject(new Error(`Unsupported generation type: ${type}`));
      }
    }, 2000); // Simulated delay
  });
};

// Create the generation slice
export const createGenerationSlice: StateCreator<
  GenerationSlice,
  [['zustand/immer', never]],
  [],
  GenerationSlice
> = immer((set, get) => ({
  ...initialState,
  
  // State machine helpers
  getValidStateTransitions: (currentStatus) => {
    return stateTransitionMap[currentStatus] || [];
  },
  
  isValidStateTransition: (currentStatus, event) => {
    const validTransitions = stateTransitionMap[currentStatus] || [];
    return validTransitions.includes(event);
  },
  
  createTask: (type, prompt, metadata = {}) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const task: GenerationTask = {
      id,
      type,
      status: 'idle',
      prompt,
      startTime: now,
      progress: 0,
      metadata,
      retryCount: 0,
      partialResults: [],
    };
    
    set(state => {
      state.tasks[id] = task;
      state.taskOrder.unshift(id); // Add to beginning of taskOrder
      
      // Initialize attempts array for this task
      state.attempts[id] = [];
    });
    
    // Automatically queue the task
    get().enqueueTask(id);
    
    return id;
  },
  
  enqueueTask: (id) => {
    const state = get();
    const task = state.tasks[id];
    
    if (!task) {
      console.error(`Cannot enqueue task with ID ${id}: task not found`);
      return;
    }
    
    // Check if the transition is valid
    if (!get().isValidStateTransition(task.status, 'QUEUE')) {
      console.error(`Invalid state transition: Cannot transition from ${task.status} with QUEUE event`);
      return;
    }
    
    set(state => {
      state.tasks[id].status = 'queued';
      
      // Only add to queue if not already in queue
      if (!state.queue.includes(id)) {
        state.queue.push(id);
      }
      
      // Record this attempt
      const attempt: GenerationAttempt = {
        id: uuidv4(),
        taskId: id,
        timestamp: new Date().toISOString(),
        status: 'queued',
      };
      
      if (!state.attempts[id]) {
        state.attempts[id] = [];
      }
      
      state.attempts[id].push(attempt);
    });
  },
  
  startTask: (id) => {
    const state = get();
    const task = state.tasks[id];
    
    if (!task) {
      console.error(`Cannot start task with ID ${id}: task not found`);
      return;
    }
    
    // Check if the transition is valid
    if (!get().isValidStateTransition(task.status, 'START')) {
      console.error(`Invalid state transition: Cannot transition from ${task.status} with START event`);
      return;
    }
    
    // Create a cancelation token
    const cancelToken = new AbortController();
    
    set(state => {
      state.tasks[id].status = 'in_progress';
      state.tasks[id].startTime = new Date().toISOString();
      state.tasks[id].cancelToken = cancelToken;
      state.currentTaskId = id;
      state.isGenerating = true;
      
      // Remove from queue if it's there
      state.queue = state.queue.filter(queuedId => queuedId !== id);
      
      // Update the attempt
      if (state.attempts[id] && state.attempts[id].length > 0) {
        const currentAttempt = state.attempts[id][state.attempts[id].length - 1];
        currentAttempt.status = 'in_progress';
      }
    });
  },
  
  updateTaskProgress: (id, progress, partialData = null) => {
    const state = get();
    const task = state.tasks[id];
    
    if (!task) {
      console.error(`Cannot update progress for task with ID ${id}: task not found`);
      return;
    }
    
    // Check if the transition is valid
    if (task.status !== 'in_progress') {
      console.error(`Cannot update progress for task with status: ${task.status}`);
      return;
    }
    
    set(state => {
      state.tasks[id].progress = Math.min(Math.max(0, progress), 100);
      
      // If we have partial data, store it
      if (partialData) {
        const partialResult: GenerationPartialResult = {
          progress,
          partialData,
        };
        
        if (!state.tasks[id].partialResults) {
          state.tasks[id].partialResults = [];
        }
        
        state.tasks[id].partialResults.push(partialResult);
      }
    });
  },
  
  completeTask: (id, result) => {
    const state = get();
    const task = state.tasks[id];
    
    if (!task) {
      console.error(`Cannot complete task with ID ${id}: task not found`);
      return;
    }
    
    // Check if the transition is valid
    if (!get().isValidStateTransition(task.status, 'COMPLETE')) {
      console.error(`Invalid state transition: Cannot transition from ${task.status} with COMPLETE event`);
      return;
    }
    
    set(state => {
      state.tasks[id].status = 'completed';
      state.tasks[id].endTime = new Date().toISOString();
      state.tasks[id].result = result;
      state.tasks[id].progress = 100;
      
      // Add to history
      if (!state.history.includes(id)) {
        state.history.unshift(id);
      }
      
      // If this was the current task, clear it
      if (state.currentTaskId === id) {
        state.currentTaskId = null;
        state.isGenerating = false;
      }
      
      // Update the attempt
      if (state.attempts[id] && state.attempts[id].length > 0) {
        const currentAttempt = state.attempts[id][state.attempts[id].length - 1];
        currentAttempt.status = 'completed';
        currentAttempt.result = result;
      }
    });
  },
  
  failTask: (id, error) => {
    const state = get();
    const task = state.tasks[id];
    
    if (!task) {
      console.error(`Cannot fail task with ID ${id}: task not found`);
      return;
    }
    
    // Check if the transition is valid
    if (!get().isValidStateTransition(task.status, 'FAIL')) {
      console.error(`Invalid state transition: Cannot transition from ${task.status} with FAIL event`);
      return;
    }
    
    set(state => {
      state.tasks[id].status = 'failed';
      state.tasks[id].endTime = new Date().toISOString();
      state.tasks[id].error = error;
      
      // Add to history
      if (!state.history.includes(id)) {
        state.history.unshift(id);
      }
      
      // If this was the current task, clear it and set error
      if (state.currentTaskId === id) {
        state.currentTaskId = null;
        state.isGenerating = false;
        state.error = error;
      }
      
      // Update the attempt
      if (state.attempts[id] && state.attempts[id].length > 0) {
        const currentAttempt = state.attempts[id][state.attempts[id].length - 1];
        currentAttempt.status = 'failed';
        currentAttempt.error = error;
      }
    });
  },
  
  cancelTask: (id) => {
    const state = get();
    const task = state.tasks[id];
    
    if (!task) {
      console.error(`Cannot cancel task with ID ${id}: task not found`);
      return;
    }
    
    // Check if the transition is valid
    if (!get().isValidStateTransition(task.status, 'CANCEL')) {
      console.error(`Invalid state transition: Cannot transition from ${task.status} with CANCEL event`);
      return;
    }
    
    // Abort any pending operations
    if (task.cancelToken) {
      task.cancelToken.abort();
    }
    
    set(state => {
      state.tasks[id].status = 'cancelled';
      state.tasks[id].endTime = new Date().toISOString();
      
      // Remove from queue if it's there
      state.queue = state.queue.filter(queuedId => queuedId !== id);
      
      // If this was the current task, clear it
      if (state.currentTaskId === id) {
        state.currentTaskId = null;
        state.isGenerating = false;
      }
      
      // Update the attempt
      if (state.attempts[id] && state.attempts[id].length > 0) {
        const currentAttempt = state.attempts[id][state.attempts[id].length - 1];
        currentAttempt.status = 'cancelled';
      }
    });
  },
  
  pauseTask: (id) => {
    const state = get();
    const task = state.tasks[id];
    
    if (!task) {
      console.error(`Cannot pause task with ID ${id}: task not found`);
      return;
    }
    
    // Check if the transition is valid
    if (!get().isValidStateTransition(task.status, 'PAUSE')) {
      console.error(`Invalid state transition: Cannot transition from ${task.status} with PAUSE event`);
      return;
    }
    
    set(state => {
      state.tasks[id].status = 'paused';
      
      // Update the attempt
      if (state.attempts[id] && state.attempts[id].length > 0) {
        const currentAttempt = state.attempts[id][state.attempts[id].length - 1];
        currentAttempt.status = 'paused';
      }
    });
  },
  
  resumeTask: (id) => {
    const state = get();
    const task = state.tasks[id];
    
    if (!task) {
      console.error(`Cannot resume task with ID ${id}: task not found`);
      return;
    }
    
    // Check if the transition is valid
    if (!get().isValidStateTransition(task.status, 'RESUME')) {
      console.error(`Invalid state transition: Cannot transition from ${task.status} with RESUME event`);
      return;
    }
    
    set(state => {
      state.tasks[id].status = 'in_progress';
      
      // Update the attempt
      if (state.attempts[id] && state.attempts[id].length > 0) {
        const currentAttempt = state.attempts[id][state.attempts[id].length - 1];
        currentAttempt.status = 'in_progress';
      }
    });
  },
  
  retryTask: async (id, usePartial = true) => {
    const state = get();
    const task = state.tasks[id];
    
    if (!task) {
      console.error(`Cannot retry task with ID ${id}: task not found`);
      throw new Error(`Task with ID ${id} not found`);
    }
    
    // Check if the transition is valid
    if (!get().isValidStateTransition(task.status, 'RETRY')) {
      console.error(`Invalid state transition: Cannot transition from ${task.status} with RETRY event`);
      throw new Error(`Cannot retry task with status ${task.status}`);
    }
    
    // Check if we've exceeded retry limits
    if (task.retryCount >= state.globalSettings.maxRetries) {
      throw new Error(`Exceeded maximum retry count (${state.globalSettings.maxRetries}) for task ${id}`);
    }
    
    set(state => {
      // Increment retry count
      state.tasks[id].retryCount += 1;
      
      // Reset progress
      state.tasks[id].progress = 0;
      
      // Clear error
      state.tasks[id].error = undefined;
    });
    
    // Create a new attempt
    const attempt: GenerationAttempt = {
      id: uuidv4(),
      taskId: id,
      timestamp: new Date().toISOString(),
      status: 'queued',
    };
    
    set(state => {
      if (!state.attempts[id]) {
        state.attempts[id] = [];
      }
      
      state.attempts[id].push(attempt);
    });
    
    // Queue the task again
    get().enqueueTask(id);
    
    // Return the task ID for chaining
    return id;
  },
  
  dequeueTask: () => {
    const state = get();
    
    if (state.queue.length === 0) {
      return null;
    }
    
    const nextTaskId = state.queue[0];
    
    // Start the task
    get().startTask(nextTaskId);
    
    return nextTaskId;
  },
  
  clearQueue: () => {
    set(state => {
      // Cancel all queued tasks
      state.queue.forEach(id => {
        if (state.tasks[id] && state.tasks[id].status === 'queued') {
          state.tasks[id].status = 'cancelled';
          state.tasks[id].endTime = new Date().toISOString();
          
          // Update the attempt
          if (state.attempts[id] && state.attempts[id].length > 0) {
            const currentAttempt = state.attempts[id][state.attempts[id].length - 1];
            currentAttempt.status = 'cancelled';
          }
        }
      });
      
      // Clear the queue
      state.queue = [];
    });
  },
  
  setCurrentTask: (id) => {
    set(state => {
      state.currentTaskId = id;
      state.isGenerating = id !== null;
    });
  },
  
  setIsGenerating: (isGenerating) => {
    set(state => {
      state.isGenerating = isGenerating;
    });
  },
  
  setError: (error) => {
    set(state => {
      state.error = error;
    });
  },
  
  updateGlobalSettings: (settings) => {
    set(state => {
      state.globalSettings = {
        ...state.globalSettings,
        ...settings,
      };
    });
  },
  
  setPreferredModel: (model) => {
    set(state => {
      state.preferredModel = model;
    });
  },
  
  clearHistory: () => {
    set(state => {
      state.history = [];
      
      // Only remove completed, failed, or cancelled tasks
      const tasksToKeep: Record<string, GenerationTask> = {};
      Object.keys(state.tasks).forEach(id => {
        const task = state.tasks[id];
        if (
          task.status === 'idle' || 
          task.status === 'queued' || 
          task.status === 'in_progress' || 
          task.status === 'paused'
        ) {
          tasksToKeep[id] = task;
        }
      });
      
      state.tasks = tasksToKeep;
    });
  },
  
  getTaskHistory: (taskId) => {
    const state = get();
    return state.attempts[taskId] || [];
  },
  
  // High-level generation actions that combine multiple actions
  generateOutline: async (topic, numSlides, settings = {}) => {
    const state = get();
    const prompt = `Create an outline for a presentation about "${topic}" with ${numSlides} slides.`;
    const taskId = get().createTask('outline', prompt, { topic, numSlides });
    
    try {
      get().startTask(taskId);
      
      // Create an abort controller for cancellation
      const abortController = new AbortController();
      const { signal } = abortController;
      
      // Set up a timeout for the operation
      const timeoutId = setTimeout(() => {
        abortController.abort();
      }, state.globalSettings.abortTimeoutMs);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        const currentProgress = get().tasks[taskId]?.progress || 0;
        if (currentProgress < 90) {
          get().updateTaskProgress(taskId, currentProgress + 10);
        } else {
          clearInterval(progressInterval);
        }
      }, 300);
      
      // Call the AI service with appropriate settings
      const mergedSettings = {
        ...state.globalSettings,
        ...settings,
      };
      
      // Prepare the API request parameters
      const apiParams = {
        topic,
        n_slides: numSlides,
        instructional_level: mergedSettings.style === 'academic' ? 'advanced' : 
                          mergedSettings.style === 'simple' ? 'beginner' : 'intermediate',
        lang: mergedSettings.language,
      };
      
      // Call the actual API service instead of simulation
      const result = await generateOutline(apiParams);
      
      // Clean up timers
      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      
      // Format the result for the store
      const formattedResult = {
        slides: result.map((title, index) => ({
          id: index + 1,
          title,
          bullets: ['Point 1', 'Point 2', 'Point 3']
        }))
      };
      
      get().completeTask(taskId, formattedResult);
      
      return taskId;
    } catch (error) {
      // Handle cancellation vs other errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isCancelled = errorMessage.includes('aborted') || errorMessage.includes('cancelled');
      
      if (isCancelled) {
        get().cancelTask(taskId);
      } else {
        get().failTask(taskId, errorMessage);
      }
      
      throw error;
    }
  },
  
  generateContent: async (outlineId, settings = {}) => {
    const state = get();
    const outlineTask = state.tasks[outlineId];
    
    if (!outlineTask || !outlineTask.result || !outlineTask.result.slides) {
      throw new Error('Invalid outline task ID or missing outline data');
    }
    
    const outline = outlineTask.result.slides;
    const slideTitles = outline.map(slide => slide.title);
    const topic = outlineTask.metadata?.topic || '';
    
    const prompt = `Generate content for a presentation with this outline: ${JSON.stringify(slideTitles)}`;
    const taskId = get().createTask('content', prompt, { outlineId, slideTitles });
    
    try {
      get().startTask(taskId);
      
      // Create an abort controller for cancellation
      const abortController = new AbortController();
      const { signal } = abortController;
      
      // Set up a timeout for the operation
      const timeoutId = setTimeout(() => {
        abortController.abort();
      }, state.globalSettings.abortTimeoutMs);
      
      // Progress updates for each slide
      let completedSlides = 0;
      const totalSlides = slideTitles.length;
      const updateSlideProgress = () => {
        const progress = Math.round((completedSlides / totalSlides) * 100);
        get().updateTaskProgress(taskId, progress, { 
          completedSlides, 
          slideIndex: completedSlides,
          completedSteps: [`Generated content for ${completedSlides} of ${totalSlides} slides`] 
        });
      };
      
      // Start progress at 0
      updateSlideProgress();
      
      // Call the AI service with appropriate settings
      const mergedSettings = {
        ...state.globalSettings,
        ...settings,
      };
      
      // Prepare the API request parameters
      const apiParams = {
        slides_titles: slideTitles,
        topic,
        instructional_level: mergedSettings.style === 'academic' ? 'advanced' : 
                          mergedSettings.style === 'simple' ? 'beginner' : 'intermediate',
        lang: mergedSettings.language,
      };
      
      // Call the actual API service
      const result = await generateSlides(apiParams);
      
      // Clean up timers
      clearTimeout(timeoutId);
      
      // Format the result for our store
      const formattedResult = {
        slideContents: result.map((slide, index) => ({
          id: index + 1,
          title: slide.title || slideTitles[index],
          content: slide.content,
          notes: slide.notes || '',
        }))
      };
      
      get().completeTask(taskId, formattedResult);
      
      return taskId;
    } catch (error) {
      // Handle cancellation vs other errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isCancelled = errorMessage.includes('aborted') || errorMessage.includes('cancelled');
      
      if (isCancelled) {
        get().cancelTask(taskId);
      } else {
        get().failTask(taskId, errorMessage);
      }
      
      throw error;
    }
  },
  
  generateImage: async (prompt, settings = {}) => {
    const state = get();
    const taskId = get().createTask('image', prompt);
    
    try {
      get().startTask(taskId);
      
      // Create an abort controller for cancellation
      const abortController = new AbortController();
      const { signal } = abortController;
      
      // Set up a timeout for the operation
      const timeoutId = setTimeout(() => {
        abortController.abort();
      }, state.globalSettings.abortTimeoutMs);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        const currentProgress = get().tasks[taskId]?.progress || 0;
        if (currentProgress < 90) {
          get().updateTaskProgress(taskId, currentProgress + 10);
        } else {
          clearInterval(progressInterval);
        }
      }, 200);
      
      // Call the AI service with appropriate settings
      const mergedSettings = {
        ...state.globalSettings,
        ...settings,
      };
      
      // Mock image generation - would call the real service
      // In a real implementation, this would call generateImages from aiService
      const result = {
        url: 'https://example.com/generated-image.jpg',
      };
      
      // Clean up timers
      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      
      get().completeTask(taskId, result);
      
      return taskId;
    } catch (error) {
      // Handle cancellation vs other errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isCancelled = errorMessage.includes('aborted') || errorMessage.includes('cancelled');
      
      if (isCancelled) {
        get().cancelTask(taskId);
      } else {
        get().failTask(taskId, errorMessage);
      }
      
      throw error;
    }
  },
  
  generateFullPresentation: async (topic, numSlides, settings = {}) => {
    try {
      // 1. Generate the outline
      const outlineTaskId = await get().generateOutline(topic, numSlides, settings);
      
      // Wait for the outline to complete
      if (get().tasks[outlineTaskId].status !== 'completed') {
        throw new Error('Outline generation failed');
      }
      
      // 2. Generate the content based on the outline
      const contentTaskId = await get().generateContent(outlineTaskId, settings);
      
      // Wait for the content to complete
      if (get().tasks[contentTaskId].status !== 'completed') {
        throw new Error('Content generation failed');
      }
      
      // 3. Generate images for each slide if enabled
      const imageTaskIds: string[] = [];
      
      if (settings.autoGenerateImages !== false && get().globalSettings.autoEnhance) {
        const contentTask = get().tasks[contentTaskId];
        const slides = contentTask.result?.slideContents || [];
        
        // Prepare data for image generation
        const slidesForImages = slides.map(slide => ({
          title: slide.title,
          content: slide.content,
        }));
        
        // Call the image generation API
        try {
          const imageResult = await generateImages({ slides: slidesForImages });
          
          // Create a task for each image
          for (let i = 0; i < imageResult.slides.length; i++) {
            const slide = imageResult.slides[i];
            const imagePrompt = `Image for slide: ${slide.title}`;
            
            const imageTaskId = get().createTask('image', imagePrompt, { 
              slideIndex: i,
              slideTitle: slide.title
            });
            
            // Mark as completed right away since we already have the result
            get().startTask(imageTaskId);
            get().completeTask(imageTaskId, { url: slide.image_url });
            
            imageTaskIds.push(imageTaskId);
          }
        } catch (imageError) {
          console.error('Image generation failed:', imageError);
          // Continue with the presentation even if images fail
        }
      }
      
      return {
        outlineTaskId,
        contentTaskId,
        imageTaskIds
      };
    } catch (error) {
      console.error('Full presentation generation failed:', error);
      throw error;
    }
  },
  
  // UI generation request handling
  startGeneration: (type, prompt, target) => {
    const id = uuidv4();
    
    set(state => {
      state.activeRequests[id] = {
        id,
        type,
        prompt,
        target,
        timestamp: Date.now(),
        status: 'generating',
        progress: 0,
      };
    });
    
    return id;
  },
  
  // Request management
  cancelGeneration: (id) => {
    const { activeRequests } = get();
    
    if (activeRequests[id]) {
      set(state => {
        // Remove from active requests
        delete state.activeRequests[id];
        
        // Add to history with canceled status
        const request = { ...activeRequests[id], status: 'error', error: 'Canceled by user' };
        state.history.unshift(request);
        
        // Limit history size
        if (state.history.length > 50) {
          state.history.pop();
        }
      });
    }
  },
  
  updateGenerationStatus: (id, status, result, error) => {
    const { activeRequests } = get();
    
    if (activeRequests[id]) {
      set(state => {
        // Update the request status
        state.activeRequests[id].status = status;
        
        if (result !== undefined) {
          state.activeRequests[id].result = result;
        }
        
        if (error !== undefined) {
          state.activeRequests[id].error = error;
        }
        
        // If completed (success or error), move to history
        if (status === 'success' || status === 'error') {
          // Add to history
          state.history.unshift({ ...state.activeRequests[id] });
          
          // Remove from active requests
          delete state.activeRequests[id];
          
          // Limit history size
          if (state.history.length > 50) {
            state.history.pop();
          }
          
          // Deduct credits for successful generations if not subscribed
          if (status === 'success' && !state.isSubscribed) {
            const creditCost = state.activeRequests[id].type === 'image' ? 5 : 1;
            state.remainingCredits = Math.max(0, state.remainingCredits - creditCost);
          }
        }
      });
    }
  },
  
  updateGenerationProgress: (id, progress) => {
    set(state => {
      if (state.activeRequests[id]) {
        state.activeRequests[id].progress = progress;
      }
    });
  },
  
  clearGenerationHistory: () => {
    set(state => {
      state.history = [];
    });
  },
  
  // Prompt handling
  setCurrentPrompt: (prompt) => {
    set(state => {
      state.currentPrompt = prompt;
    });
  },
  
  // Settings management
  updateSettings: (settings) => {
    set(state => {
      state.settings = {
        ...state.settings,
        ...settings,
      };
    });
  },
  
  // Subscription and credits
  setRemainingCredits: (credits) => {
    set(state => {
      state.remainingCredits = credits;
    });
  },
  
  setSubscriptionStatus: (isSubscribed) => {
    set(state => {
      state.isSubscribed = isSubscribed;
    });
  },
  
  // Helpers
  canGenerate: (type) => {
    const { isSubscribed, remainingCredits } = get();
    
    // Subscribed users can always generate
    if (isSubscribed) return true;
    
    // Non-subscribed users need credits
    const requiredCredits = type === 'image' ? 5 : 1;
    return remainingCredits >= requiredCredits;
  },
})); 