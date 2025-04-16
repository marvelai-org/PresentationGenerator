'use client';

import { useState, useEffect } from 'react';
import { usePresentations } from '../hooks';

/**
 * Example component that demonstrates using the new Zustand store
 * This component shows a list of presentations with basic CRUD operations
 */
export default function PresentationList() {
  // Use the custom hook to access presentations data and actions
  const {
    presentationList,
    currentPresentationId,
    isLoading,
    error,
    createPresentation,
    updatePresentation,
    deletePresentation,
    setCurrentPresentation,
    loadFromSupabase,
  } = usePresentations();

  const [newTitle, setNewTitle] = useState('');
  
  // Load presentations from Supabase on initial mount
  useEffect(() => {
    loadFromSupabase();
  }, [loadFromSupabase]);

  // Handle creating a new presentation
  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    
    try {
      const id = await createPresentation(newTitle);
      setNewTitle('');
      console.log(`Created presentation with ID: ${id}`);
    } catch (error) {
      console.error('Failed to create presentation:', error);
    }
  };

  // Handle updating a presentation title
  const handleUpdate = async (id: string, newTitle: string) => {
    try {
      await updatePresentation(id, { title: newTitle });
    } catch (error) {
      console.error(`Failed to update presentation ${id}:`, error);
    }
  };

  // Handle deleting a presentation
  const handleDelete = async (id: string) => {
    try {
      await deletePresentation(id);
    } catch (error) {
      console.error(`Failed to delete presentation ${id}:`, error);
    }
  };

  // Handle selecting a presentation
  const handleSelect = (id: string) => {
    setCurrentPresentation(id);
  };

  // Show loading state
  if (isLoading) {
    return <div className="p-4">Loading presentations...</div>;
  }

  // Show error state
  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Presentations</h1>
      
      {/* Create new presentation form */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New presentation title"
          className="px-3 py-2 border rounded flex-1"
        />
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Create
        </button>
      </div>
      
      {/* Presentations list */}
      {presentationList.length === 0 ? (
        <div className="text-gray-500">No presentations yet. Create one to get started!</div>
      ) : (
        <ul className="space-y-3">
          {presentationList.map((presentation) => (
            <li
              key={presentation.id}
              className={`p-3 border rounded-lg ${
                presentation.id === currentPresentationId
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">{presentation.title}</h3>
                  <p className="text-sm text-gray-500">
                    Last updated: {new Date(presentation.updatedAt).toLocaleString()}
                  </p>
                  <div className="text-xs text-gray-400">
                    Sync status: {presentation.syncStatus || 'unknown'}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelect(presentation.id)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                  >
                    Select
                  </button>
                  <button
                    onClick={() => {
                      const newTitle = prompt('Enter new title', presentation.title);
                      if (newTitle) handleUpdate(presentation.id, newTitle);
                    }}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this presentation?')) {
                        handleDelete(presentation.id);
                      }
                    }}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {/* Current presentation info */}
      {currentPresentationId && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Current Presentation</h2>
          <div>
            <p><strong>ID:</strong> {currentPresentationId}</p>
            <p><strong>Title:</strong> {presentationList.find(p => p.id === currentPresentationId)?.title}</p>
            <p><strong>AI Model:</strong> {presentationList.find(p => p.id === currentPresentationId)?.settings.aiModel}</p>
            <p><strong>Image Source:</strong> {presentationList.find(p => p.id === currentPresentationId)?.settings.imageSource}</p>
          </div>
        </div>
      )}
    </div>
  );
} 