import { NextRequest, NextResponse } from 'next/server';

// AI service URL
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, numSlides, style, language, themeId, textDensity, imageSource, aiModel } = body;

    console.log('📝 Outline API Request:', { 
      topic, numSlides, style, language, themeId, textDensity, imageSource, aiModel 
    });

    if (!topic || !numSlides) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Map language to language code if needed
    let languageCode = 'en';
    if (language && language !== 'English (US)') {
      // Extract the first two characters of the language string
      languageCode = language.substring(0, 2).toLowerCase();
    }

    // Map text density to instructional level (simple mapping as example)
    let instructionalLevel = 'intermediate';
    if (textDensity === 'Brief') {
      instructionalLevel = 'beginner';
    } else if (textDensity === 'Detailed') {
      instructionalLevel = 'advanced';
    }

    console.log(`Calling AI service for "${topic}" with ${numSlides} slides`);
    console.log('🚀 AI Service Request:', {
      topic,
      n_slides: numSlides,
      instructional_level: instructionalLevel,
      lang: languageCode,
    });
    
    // Call the AI service
    const aiResponse = await fetch(`${AI_SERVICE_URL}/generate/outline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        n_slides: numSlides,
        instructional_level: instructionalLevel,
        lang: languageCode,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      let errorMessage = 'Failed to generate outline from AI service';
      
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
    console.log('✅ AI Service Response:', aiData);
    
    // The AI service returns { outlines: string[] }
    // Need to transform to format expected by frontend: { slides: { title, bullets }[] }
    const outlines = aiData.outlines || [];
    
    // Transform outlines to the expected format
    const slides = outlines.map((title, index) => {
      // Generate some placeholder bullets for each slide
      // In a real implementation, you might want to call another endpoint to generate bullets
      const bullets = [
        'Key point to explore', 
        'Important consideration', 
        'Relevant example'
      ];
      
      return {
        id: index + 1,
        title,
        bullets,
      };
    });

    console.log('🔄 Transformed Response:', { slides: slides.length });
    return NextResponse.json({ slides });
  } catch (error) {
    console.error('Error generating outline:', error);
    return NextResponse.json({ error: 'Failed to generate outline' }, { status: 500 });
  }
}
