import { NextRequest, NextResponse } from 'next/server';

// AI service URL - use numeric IP address to avoid potential DNS issues
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL ?
  process.env.NEXT_PUBLIC_AI_SERVICE_URL.replace('localhost', '127.0.0.1') : 
  'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing connection to AI service at:', AI_SERVICE_URL);
    
    // Just test the health endpoint
    try {
      // Test the connection to the root endpoint
      const healthCheck = await fetch(`${AI_SERVICE_URL}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!healthCheck.ok) {
        const errorText = await healthCheck.text();
        console.error('Health check failed:', errorText);
        return NextResponse.json({ 
          status: 'error', 
          message: 'Failed to connect to AI service',
          aiServiceUrl: AI_SERVICE_URL,
          statusCode: healthCheck.status,
          error: errorText
        }, { status: 500 });
      }

      const healthData = await healthCheck.json();
      console.log('Health check response:', healthData);
      
      return NextResponse.json({ 
        status: 'success', 
        message: 'Connection to AI service successful',
        aiServiceUrl: AI_SERVICE_URL,
        health: healthData
      });
    } catch (healthError) {
      console.error('Health check error:', healthError);
      return NextResponse.json({ 
        status: 'error', 
        message: 'Failed to connect to AI service health endpoint', 
        aiServiceUrl: AI_SERVICE_URL,
        error: healthError instanceof Error ? healthError.message : String(healthError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error testing AI service connection:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Exception while testing AI service connection', 
      aiServiceUrl: AI_SERVICE_URL,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 