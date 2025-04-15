/**
 * Mock Database Demo Usage
 *
 * This is not an actual test file, but a reference example of how to use the mock database.
 * To run this as a test, you would need to set up a testing framework like Jest or Vitest.
 */

import { createClientSupabaseClient } from "../../src/lib/auth/supabase-client";

/**
 * Example function demonstrating how to use the mock Supabase client
 * This shows various database operations to help developers understand the API
 */
async function mockDatabaseDemo() {
  console.log("🧪 Starting Mock Database Demo");

  // Get a reference to the Supabase client
  // This will use the mock implementation when in CI or without credentials
  const supabase = createClientSupabaseClient();

  // Access the reset function (mock client specific)
  // You need to cast to any because this method only exists on the mock client
  try {
    (supabase as any).resetMockData();
    console.log("✅ Reset mock database to initial state");
  } catch (e) {
    console.log("⚠️ Not using mock client, resetMockData not available");
  }

  // 1. Basic QUERY operations
  console.log("\n📊 QUERY OPERATIONS:");

  // Get all presentations
  const { data: allPresentations } = await supabase
    .from("presentations")
    .select();

  console.log(`- Found ${allPresentations?.length || 0} presentations`);

  // Get a specific presentation
  const { data: presentation } = await supabase
    .from("presentations")
    .select()
    .eq("id", "1")
    .single();

  console.log(`- Retrieved presentation: "${presentation?.title}"`);

  // Get presentations with filter and order
  const { data: userPresentations } = await supabase
    .from("presentations")
    .select()
    .eq("user_id", "mock-user-1")
    .order("created_at", { ascending: false })
    .limit(5);

  console.log(
    `- Retrieved ${userPresentations?.length || 0} presentations for user`,
  );

  // 2. INSERT operations
  console.log("\n➕ INSERT OPERATIONS:");

  // Insert a single record
  const { data: newPresentation, error: insertError } = await supabase
    .from("presentations")
    .insert({
      title: "New Test Presentation",
      description: "Created via mock client demo",
      user_id: "mock-user-1",
      is_public: true,
    });

  if (insertError) {
    console.log(`- Error inserting presentation: ${insertError.message}`);
  } else {
    // Type assertion to handle the potentially undefined id
    const presentationData = newPresentation as any;
    const presentationId = Array.isArray(presentationData) 
      ? presentationData[0]?.id 
      : presentationData?.id;
    console.log(`- Inserted presentation with id: ${presentationId}`);

    // Insert a slide for this presentation
    const { data: newSlide } = await supabase.from("slides").insert({
      presentation_id: presentationId,
      content: "This is a test slide created via the mock client",
      order: 1,
    });

    // Type assertion for slide id
    const slideData = newSlide as any;
    const slideId = Array.isArray(slideData) 
      ? slideData[0]?.id 
      : slideData?.id;
    console.log(`- Added slide with id: ${slideId}`);
  }

  // 3. UPDATE operations
  console.log("\n✏️ UPDATE OPERATIONS:");

  // Update a record
  const { data: updatedPresentation, error: updateError } = await supabase
    .from("presentations")
    .update({
      title: "Updated Presentation Title",
      updated_at: new Date().toISOString(),
    })
    .eq("id", "1");

  if (updateError) {
    console.log(`- Error updating presentation: ${updateError.message}`);
  } else {
    // Handle array or single object response
    const presentationData = updatedPresentation as any;
    const title = Array.isArray(presentationData) 
      ? presentationData[0]?.title 
      : presentationData?.title;
    console.log(`- Updated presentation: ${title}`);
  }

  // 4. DELETE operations
  console.log("\n❌ DELETE OPERATIONS:");

  // Create a record to delete
  const { data: tempPresentation } = await supabase
    .from("presentations")
    .insert({
      title: "Temporary Presentation",
      description: "This will be deleted",
      user_id: "mock-user-1",
    });

  // Get ID safely
  const tempData = tempPresentation as any;
  const tempId = Array.isArray(tempData) 
    ? tempData[0]?.id 
    : tempData?.id;
  console.log(
    `- Created temporary presentation with id: ${tempId}`,
  );

  // Delete the record
  const { error: deleteError, data: deleteResult } = await supabase
    .from("presentations")
    .delete()
    .eq("id", tempId);

  if (deleteError) {
    console.log(`- Error deleting presentation: ${deleteError.message}`);
  } else {
    // Handle count property which might be on the result or in a different format
    const deleteData = deleteResult as any;
    const count = typeof deleteData === 'object'
      ? deleteData?.count || (Array.isArray(deleteData) ? deleteData.length : 1)
      : 0;
    console.log(`- Deleted ${count} presentation(s)`);
  }

  // 5. Verify final state
  console.log("\n🔍 FINAL DATABASE STATE:");

  const { data: finalPresentations } = await supabase
    .from("presentations")
    .select();

  console.log(`- Final presentation count: ${finalPresentations?.length || 0}`);

  console.log("\n🏁 Mock Database Demo Complete");
}

// This function is useful for manual testing
// In a real test file, you would export the function
// export { mockDatabaseDemo };

// For demonstration, if this file is executed directly, run the demo
if (typeof window !== "undefined") {
  // Browser environment - wait for DOM
  window.addEventListener("DOMContentLoaded", () => {
    mockDatabaseDemo().catch(console.error);
  });
} else if (typeof process !== "undefined") {
  // Node.js environment
  mockDatabaseDemo().catch(console.error);
}
