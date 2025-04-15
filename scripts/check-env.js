/**
 * Environment Variable Check Script
 * 
 * This script checks for the presence of required environment variables
 * and provides guidance on how to set them up correctly.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Define required variables
const REQUIRED_VARS = [
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    description: 'Your Supabase project URL',
    example: 'https://your-project.supabase.co',
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    description: 'Your Supabase anon/public key',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  },
];

// Load .env file if it exists
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  console.log('🔍 Found .env file, loading variables...');
  dotenv.config({ path: envPath });
} else {
  console.log('⚠️ No .env file found in project root');
}

// Check for each required variable
console.log('\n📋 Environment Variable Check\n');

let missingVars = 0;

REQUIRED_VARS.forEach(variable => {
  const value = process.env[variable.name];
  if (!value) {
    console.log(`❌ ${variable.name}: Missing`);
    missingVars++;
  } else {
    // Show redacted version of sensitive values
    const displayValue = variable.name.includes('KEY') 
      ? `${value.substring(0, 5)}...${value.substring(value.length - 5)}`
      : value;
    console.log(`✅ ${variable.name}: ${displayValue}`);
  }
});

console.log('\n');

// Provide guidance if variables are missing
if (missingVars > 0) {
  console.log('⚠️ Missing environment variables detected');
  console.log('To use the real Supabase client instead of the mock implementation:');
  console.log('\n1. Create a .env.local file in your project root');
  console.log('2. Add the following variables:');
  REQUIRED_VARS.forEach(variable => {
    console.log(`   ${variable.name}="${variable.example}"`);
  });
  console.log('\n3. Replace the example values with your actual Supabase credentials');
  console.log('4. Restart your Next.js development server');
  console.log('\nNote: The application will continue to use the mock database until these variables are set.');
} else {
  console.log('🎉 All required environment variables are set!');
  console.log('The application should use the real Supabase client.');
  console.log('\nIf you are still seeing mock client warnings:');
  console.log('1. Make sure you have restarted your Next.js development server after setting the variables');
  console.log('2. Check for any other environment configuration that might override these settings');
  console.log('3. Visit /debug/supabase in your application to see detailed client information');
}

console.log('\n'); 