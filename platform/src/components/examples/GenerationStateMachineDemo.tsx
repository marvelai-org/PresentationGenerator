import React, { useState } from 'react';
import { useGenerationStateMachine } from '@/hooks/useGenerationStateMachine';
import { GenerationSettings, GenerationTaskStatus } from '@/store/slices/generation';

/**
 * Demo component to showcase the functionality of the generation state machine
 */
export function GenerationStateMachineDemo() {
  const {
    tasks,
    queuedTasks,
    activeTasks,
    currentTask,
    isGenerating,
    getTasksByStatus,
    createTask,
    startTask,
    updateProgress,
    completeTask,
    failTask,
    cancelTask,
    pauseTask,
    resumeTask,
    retryTask,
    generateOutline,
    generateContent,
    generateFullPresentation,
    isTaskActive,
    isTaskCompleted,
    isTaskFailed,
    isValidTransition
  } = useGenerationStateMachine();
  
  const [topic, setTopic] = useState('Artificial Intelligence');
  const [numSlides, setNumSlides] = useState(5);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  
  // Custom settings
  const [settings, setSettings] = useState<Partial<GenerationSettings>>({
    temperature: 0.7,
    model: 'gpt-4',
    style: 'professional',
    language: 'en',
  });
  
  // Handle outline generation
  const handleGenerateOutline = async () => {
    try {
      const id = await generateOutline(topic, numSlides, settings);
      setTaskId(id);
    } catch (error) {
      console.error('Outline generation failed:', error);
    }
  };
  
  // Handle content generation
  const handleGenerateContent = async () => {
    if (!taskId) {
      alert('Please generate an outline first');
      return;
    }
    
    try {
      const id = await generateContent(taskId, settings);
      setTaskId(id);
    } catch (error) {
      console.error('Content generation failed:', error);
    }
  };
  
  // Handle full presentation generation
  const handleGenerateFullPresentation = async () => {
    try {
      const result = await generateFullPresentation(topic, numSlides, settings);
      setTaskId(result.contentTaskId);
    } catch (error) {
      console.error('Full presentation generation failed:', error);
    }
  };
  
  // Handle manual task creation
  const handleCreateTask = () => {
    const id = createTask('outline', `Create an outline for ${topic}`, { manualCreation: true });
    setTaskId(id);
  };
  
  // Handle task cancellation
  const handleCancelTask = () => {
    if (selectedTask) {
      cancelTask(selectedTask);
    } else if (taskId) {
      cancelTask(taskId);
    }
  };
  
  // Handle task retry
  const handleRetryTask = async () => {
    try {
      if (selectedTask) {
        await retryTask(selectedTask);
      } else if (taskId) {
        await retryTask(taskId);
      }
    } catch (error) {
      console.error('Task retry failed:', error);
    }
  };
  
  // Get the selected task
  const selectedTaskObject = selectedTask 
    ? tasks[selectedTask] 
    : (taskId ? tasks[taskId] : null);
  
  // Get status colors
  const getStatusColor = (status: GenerationTaskStatus): string => {
    switch (status) {
      case 'idle': return 'bg-gray-200';
      case 'queued': return 'bg-yellow-200';
      case 'preparing': return 'bg-blue-200';
      case 'in_progress': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-200';
    }
  };
  
  // Check available transitions
  const getAvailableTransitions = (status: GenerationTaskStatus) => {
    const transitions = [
      { event: 'QUEUE', label: 'Queue' },
      { event: 'START', label: 'Start' },
      { event: 'PROGRESS', label: 'Progress' },
      { event: 'PAUSE', label: 'Pause' },
      { event: 'RESUME', label: 'Resume' },
      { event: 'COMPLETE', label: 'Complete' },
      { event: 'FAIL', label: 'Fail' },
      { event: 'CANCEL', label: 'Cancel' },
      { event: 'RETRY', label: 'Retry' },
    ] as const;
    
    return transitions.filter(t => isValidTransition(status, t.event));
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Generation State Machine Demo</h2>
      
      {/* Generation Settings */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Generation Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium">Number of Slides</label>
            <input
              type="number"
              value={numSlides}
              onChange={(e) => setNumSlides(parseInt(e.target.value, 10))}
              min={1}
              max={20}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
      
      {/* Generation Actions */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Generation Actions</h3>
        <div className="flex space-x-3 mb-3">
          <button
            onClick={handleGenerateOutline}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Generate Outline
          </button>
          
          <button
            onClick={handleGenerateContent}
            disabled={isGenerating || !taskId || !isTaskCompleted(taskId)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Generate Content
          </button>
          
          <button
            onClick={handleGenerateFullPresentation}
            disabled={isGenerating}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Generate Full Presentation
          </button>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleCreateTask}
            disabled={isGenerating}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Create Task
          </button>
          
          <button
            onClick={handleCancelTask}
            disabled={!taskId && !selectedTask}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Cancel Task
          </button>
          
          <button
            onClick={handleRetryTask}
            disabled={!taskId && !selectedTask}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Retry Task
          </button>
        </div>
      </div>
      
      {/* Current Task Status */}
      {selectedTaskObject && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Task Details</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium">ID:</p>
              <p className="font-mono text-xs">{selectedTaskObject.id}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium">Type:</p>
              <p>{selectedTaskObject.type}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium">Status:</p>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedTaskObject.status)}`}></div>
                <p>{selectedTaskObject.status}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium">Progress:</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${selectedTaskObject.progress}%` }}
                />
              </div>
              <p className="text-xs text-right mt-1">{selectedTaskObject.progress}%</p>
            </div>
          </div>
          
          {/* Allowed transitions */}
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Available Transitions:</p>
            <div className="flex flex-wrap gap-2">
              {getAvailableTransitions(selectedTaskObject.status).map(transition => (
                <span 
                  key={transition.event}
                  className="px-2 py-1 bg-gray-100 text-xs rounded"
                >
                  {transition.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Tasks List */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Tasks</h3>
        
        {Object.keys(tasks).length === 0 ? (
          <p className="text-gray-500">No tasks created yet</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {Object.values(tasks).map(task => (
              <div 
                key={task.id}
                onClick={() => setSelectedTask(task.id)}
                className={`p-3 border rounded-md cursor-pointer flex items-center justify-between ${
                  (selectedTask === task.id || (!selectedTask && taskId === task.id)) 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div>
                  <p className="font-medium">{task.type}</p>
                  <p className="text-xs text-gray-500 truncate max-w-md">{task.prompt}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}></div>
                  <span className="text-sm">{task.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 