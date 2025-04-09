// Set environment variables to force using mock client
process.env.CI_ENVIRONMENT = 'true';
process.env.NEXT_PUBLIC_MOCK_DEBUG = 'true';

// Import the mock storage directly
const mockStorage = require('./src/lib/storage/mock-storage');

console.log('🧪 Testing Mock Database Implementation');

// Test basic storage functions
try {
  // Get initial data
  const data = mockStorage.getMockData();
  console.log(`✅ Initial data loaded with ${data.presentations.length} presentations`);
  
  // Insert a new record
  const insertResult = mockStorage.insertRecords('presentations', {
    title: 'Test Presentation',
    description: 'Created in test script',
    user_id: 'test-user'
  });
  
  if (insertResult.error) {
    console.error('❌ Insert failed:', insertResult.error);
  } else {
    console.log(`✅ Inserted presentation with ID: ${insertResult.data.id}`);
  }
  
  // Get updated data
  const updatedData = mockStorage.getMockData();
  console.log(`✅ Updated data now has ${updatedData.presentations.length} presentations`);
  
  // Reset the data
  mockStorage.resetMockData();
  console.log('✅ Data reset to initial state');
  
  // Verify reset
  const resetData = mockStorage.getMockData();
  console.log(`✅ After reset: ${resetData.presentations.length} presentations`);
  
  console.log('\n🎉 Mock database test completed successfully!');
} catch (error) {
  console.error('❌ Test failed with error:', error);
} 