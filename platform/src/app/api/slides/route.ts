import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/validation';
import { generateSlidesRequestSchema, generateSlidesResponseSchema } from './schema';

// AI service URL
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    // Validate the request against our schema
    const validation = validateRequest(generateSlidesRequestSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message, details: validation.error.errors }, 
        { status: 400 }
      );
    }

    // Destructure validated data with correct types
    const { 
      slides_titles, 
      topic, 
      instructional_level,
      lang
    } = validation.data;

    console.log('📝 Slides API Request:', { 
      slides_titles, 
      topic, 
      instructional_level,
      lang
    });
    
    // Map language code if needed
    let languageCode = lang;
    if (lang && lang !== 'en' && lang.length > 2) {
      // Extract the first two characters of the language string
      languageCode = lang.substring(0, 2).toLowerCase();
    }
    
    console.log(`Calling AI service to generate slides for "${topic}"`);
    
    // Call the AI service
    const aiResponse = await fetch(`${AI_SERVICE_URL}/generate/slides`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slides_titles,
        topic,
        instructional_level,
        lang: languageCode,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      let errorMessage = 'Failed to generate slides content from AI service';
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        // If not valid JSON, use text as is
        errorMessage = errorText || errorMessage;
      }
      
      console.error('AI service error:', errorMessage);
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    // Parse and validate the AI service response
    const aiData = await aiResponse.json();
    
    // Validate response against our schema
    const responseValidation = validateRequest(generateSlidesResponseSchema, aiData);
    if (!responseValidation.success) {
      console.error('AI service returned invalid data:', responseValidation.error);
      return NextResponse.json(
        { error: 'AI service returned invalid data structure' }, 
        { status: 500 }
      );
    }
    
    console.log('✅ AI Service Response received with', responseValidation.data.slides?.length || 0, 'slides');
    
    // Return the validated response
    return NextResponse.json(responseValidation.data);
  } catch (error) {
    console.error('Error generating slides:', error);
    return NextResponse.json({ error: 'Failed to generate slides' }, { status: 500 });
  }
} 