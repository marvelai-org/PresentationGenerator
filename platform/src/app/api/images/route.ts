import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/validation';
import { generateImagesRequestSchema, generateImagesResponseSchema } from './schema';

// AI service URL
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    // Validate the request against our schema
    const validation = validateRequest(generateImagesRequestSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message, details: validation.error.errors }, 
        { status: 400 }
      );
    }

    // Extract validated data
    const { slides } = validation.data;

    console.log('📝 Images API Request:', { 
      slidesCount: slides.length
    });
    
    console.log(`Calling AI service to generate images for ${slides.length} slides`);
    
    // Call the AI service
    const aiResponse = await fetch(`${AI_SERVICE_URL}/generate/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slides
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      let errorMessage = 'Failed to generate images from AI service';
      
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
    const responseValidation = validateRequest(generateImagesResponseSchema, aiData);
    if (!responseValidation.success) {
      console.error('AI service returned invalid data:', responseValidation.error);
      return NextResponse.json(
        { error: 'AI service returned invalid data structure' }, 
        { status: 500 }
      );
    }
    
    console.log('✅ AI Service Response received with', responseValidation.data.images?.length || 0, 'images');
    
    // Return the validated response
    return NextResponse.json(responseValidation.data);
  } catch (error) {
    console.error('Error generating images:', error);
    return NextResponse.json({ error: 'Failed to generate images' }, { status: 500 });
  }
} 