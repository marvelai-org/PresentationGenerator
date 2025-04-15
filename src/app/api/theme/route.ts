import { NextResponse } from 'next/server';

// Theme interface
interface Theme {
  id: string;
  name: string;
  backgroundColor: string;
  titleColor: string;
  bodyColor: string;
  linkColor: string;
  isDark: boolean;
}

// GET handler to retrieve theme by ID
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const themeId = searchParams.get('id');

  if (!themeId) {
    return NextResponse.json({ error: 'Theme ID is required' }, { status: 400 });
  }

  // In a real implementation, we would fetch from database
  // For now, we can return a mock theme or use a simple storage mechanism

  try {
    // Simulate API call or database query
    // In production, this would fetch from your database
    const theme = getThemeById(themeId);

    if (!theme) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
    }

    return NextResponse.json({ theme });
  } catch (error) {
    console.error('Error retrieving theme:', error);

    return NextResponse.json({ error: 'Failed to retrieve theme' }, { status: 500 });
  }
}

// POST handler to save theme data
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { theme } = body;

    if (!theme) {
      return NextResponse.json({ error: 'Theme data is required' }, { status: 400 });
    }

    // In a real implementation, we would save to database
    // For now, we can return success without actually saving

    // Simulate saving to database
    // In production, this would save to your database

    return NextResponse.json({
      success: true,
      message: 'Theme saved successfully',
      themeId: theme.id,
    });
  } catch (error) {
    console.error('Error saving theme:', error);

    return NextResponse.json({ error: 'Failed to save theme' }, { status: 500 });
  }
}

// Helper function to get theme by ID
function getThemeById(id: string): Theme | null {
  // Mock implementation - in production, fetch from database
  const themes: Theme[] = [
    {
      id: 'vanilla',
      name: 'Vanilla',
      backgroundColor: '#FFF9C4',
      titleColor: '#000000',
      bodyColor: '#333333',
      linkColor: '#2563EB',
      isDark: false,
    },
    {
      id: 'daydream',
      name: 'Daydream',
      backgroundColor: '#E3F2FD',
      titleColor: '#1A365D',
      bodyColor: '#2D3748',
      linkColor: '#3182CE',
      isDark: false,
    },
    {
      id: 'chisel',
      name: 'Chisel',
      backgroundColor: '#F5F5F5',
      titleColor: '#1A202C',
      bodyColor: '#4A5568',
      linkColor: '#3182CE',
      isDark: false,
    },
    {
      id: 'wireframe',
      name: 'Wireframe',
      backgroundColor: '#ECEFF1',
      titleColor: '#263238',
      bodyColor: '#455A64',
      linkColor: '#2196F3',
      isDark: false,
    },
    {
      id: 'bee-happy',
      name: 'Bee Happy',
      backgroundColor: '#212121',
      titleColor: '#FFC107',
      bodyColor: '#E0E0E0',
      linkColor: '#FFC107',
      isDark: true,
    },
    {
      id: 'icebreaker',
      name: 'Icebreaker',
      backgroundColor: '#E1F5FE',
      titleColor: '#0288D1',
      bodyColor: '#0D47A1',
      linkColor: '#01579B',
      isDark: false,
    },
    {
      id: 'aurora',
      name: 'Aurora',
      backgroundColor: '#0F172A',
      titleColor: '#F5B0FF',
      bodyColor: '#E0E7FF',
      linkColor: '#A78BFA',
      isDark: true,
    },
    {
      id: 'velvet-tides',
      name: 'Velvet Tides',
      backgroundColor: '#1E1B4B',
      titleColor: '#FFFFFF',
      bodyColor: '#E0E7FF',
      linkColor: '#C7D2FE',
      isDark: true,
    },
    {
      id: 'alien',
      name: 'Alien',
      backgroundColor: '#022C22',
      titleColor: '#ECFDF5',
      bodyColor: '#D1FAE5',
      linkColor: '#34D399',
      isDark: true,
    },
    {
      id: 'cornflower',
      name: 'Cornflower',
      backgroundColor: '#EEF2FF',
      titleColor: '#4338CA',
      bodyColor: '#3730A3',
      linkColor: '#4F46E5',
      isDark: false,
    },
    {
      id: 'aurum',
      name: 'Aurum',
      backgroundColor: '#1A1A1A',
      titleColor: '#FFD700',
      bodyColor: '#E5E5E5',
      linkColor: '#FFD700',
      isDark: true,
    },
    {
      id: 'consultant',
      name: 'Consultant',
      backgroundColor: '#FFFFFF',
      titleColor: '#111827',
      bodyColor: '#374151',
      linkColor: '#2563EB',
      isDark: false,
    },
  ];

  return themes.find(theme => theme.id === id) || null;
}
