'use client';

import { useEffect, useState } from 'react';
import { createClientSupabaseClient } from '@/lib/auth/supabase-client';

export default function TestDbPage() {
  const [testStatus, setTestStatus] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function runTests() {
      setIsLoading(true);
      setTestStatus([]);
      
      try {
        // Get the client
        const supabase = createClientSupabaseClient();
        addStatus('✅ Successfully created Supabase client');
        
        // Reset data (mock client specific)
        try {
          (supabase as any).resetMockData?.();
          addStatus('✅ Reset mock database to initial state');
        } catch (e) {
          addStatus('⚠️ Not using mock client, resetMockData not available');
        }
        
        // Test basic query functionality
        const { data: presentations, error: queryError } = await supabase
          .from('presentations')
          .select();
          
        if (queryError) {
          throw new Error(`Query failed: ${queryError.message}`);
        }
        
        addStatus(`✅ Found ${presentations?.length || 0} presentations`);
        
        // Test insert functionality
        const { data: newPresentation, error: insertError } = await supabase
          .from('presentations')
          .insert({
            title: 'Test Presentation',
            description: 'Created in test page',
            user_id: 'test-user',
            is_public: true
          });
          
        if (insertError) {
          throw new Error(`Insert failed: ${insertError.message}`);
        }
        
        addStatus(`✅ Inserted presentation with ID: ${newPresentation?.id}`);
        
        // Test query after insert
        const { data: updatedPresentations } = await supabase
          .from('presentations')
          .select();
          
        addStatus(`✅ Now have ${updatedPresentations?.length || 0} presentations`);
        
        // Test update functionality
        const { data: updatedPresentation, error: updateError } = await supabase
          .from('presentations')
          .update({ title: 'Updated Title' })
          .eq('id', newPresentation?.id);
          
        if (updateError) {
          throw new Error(`Update failed: ${updateError.message}`);
        }
        
        addStatus('✅ Updated presentation successfully');
        
        // Test delete functionality
        const { error: deleteError } = await supabase
          .from('presentations')
          .delete()
          .eq('id', newPresentation?.id);
          
        if (deleteError) {
          throw new Error(`Delete failed: ${deleteError.message}`);
        }
        
        addStatus('✅ Deleted presentation successfully');
        
        // Final status
        const { data: finalPresentations } = await supabase
          .from('presentations')
          .select();
          
        addStatus(`✅ Final count: ${finalPresentations?.length || 0} presentations`);
        addStatus('🎉 All tests completed successfully!');
        
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
        addStatus(`❌ Test failed: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
    
    runTests();
  }, []);
  
  function addStatus(message: string) {
    setTestStatus(prev => [...prev, message]);
  }
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Mock Database Test</h1>
      
      {isLoading && <p className="text-blue-500">Running tests...</p>}
      
      {error && (
        <div className="p-4 mb-4 bg-red-100 border border-red-300 rounded-md">
          <h2 className="text-lg font-bold text-red-700">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="p-4 bg-gray-100 rounded-md">
        <h2 className="text-lg font-bold mb-2">Test Results</h2>
        <pre className="font-mono text-sm whitespace-pre-wrap">
          {testStatus.map((status, index) => (
            <div key={index} className="mb-1">{status}</div>
          ))}
        </pre>
      </div>
    </div>
  );
} 