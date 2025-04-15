import { NextRequest, NextResponse } from 'next/server';

// AI service URL
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slides } = body;

    console.log('📝 Images API Request:', { 
      slidesCount: slides?.length || 0
    });

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return NextResponse.json(
        { error: 'Missing required parameters. Need slides array.' }, 
        { status: 400 }
      );
    }

    // Ensure each slide has the required template property
    const validatedSlides = slides.map(slide => {
      // If no template is provided, add a default one
      if (!slide.template) {
        return {
          ...slide,
          template: 'standard'
        };
      }
      return slide;
    });
    
    console.log(`Calling AI service to generate images for ${validatedSlides.length} slides`);
    
    // Call the AI service
    const aiResponse = await fetch(`${AI_SERVICE_URL}/generate/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slides: validatedSlides
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

    // Parse the AI service response
    const aiData = await aiResponse.json();
    console.log('✅ AI Service Response received with', aiData.slides?.length || 0, 'slides with images');
    
    // The AI service returns { status: string, slides: Array<{title, content, image_url, etc}> }
    // Pass this directly to the frontend
    return NextResponse.json(aiData);
  } catch (error) {
    console.error('Error generating images:', error);
    return NextResponse.json({ 
      error: 'Failed to generate images',
      status: 'error',
      slides: body?.slides?.map(slide => ({
        ...slide,
        image_url: null,
        image_status: 'error'
      })) || []
    }, { status: 500 });
  }
} 