import { NextRequest, NextResponse } from 'next/server';

// AI service URL
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      slides_titles, 
      topic, 
      instructional_level = 'intermediate',
      lang = 'en'
    } = body;

    console.log('📝 Slides API Request:', { 
      slides_titles, 
      topic, 
      instructional_level,
      lang
    });

    if (!slides_titles || !Array.isArray(slides_titles) || slides_titles.length === 0 || !topic) {
      return NextResponse.json(
        { error: 'Missing required parameters. Need slide titles and topic.' }, 
        { status: 400 }
      );
    }

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

    // Parse the AI service response
    const aiData = await aiResponse.json();
    console.log('✅ AI Service Response received with', aiData.slides?.length || 0, 'slides');
    
    // The AI service returns { slides: Array<{title, template, content}> }
    // Pass this directly to the frontend
    return NextResponse.json(aiData);
  } catch (error) {
    console.error('Error generating slides:', error);
    return NextResponse.json({ error: 'Failed to generate slides' }, { status: 500 });
  }
} 