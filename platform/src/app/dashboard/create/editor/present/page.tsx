'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Slide } from '@/components/features/editor/EditorContainer';
import { createClientSupabaseClient } from '@/lib/auth/supabase-client';

// Define the interface for embed data to fix TypeScript error
interface EmbedData {
  id: string;
  type: string;
  url: string;
  title: string;
  thumbnailUrl: string;
  embedHtml?: string;
  width: number;
  height: number;
  aspectRatio: string;
  src?: string; // Additional property needed for this component
}

// Helper function to render text with proper formatting
const renderFormattedText = (text: string) => {
  // Simple replacements for common formatting
  return (
    text
      // Bold text (using **text** syntax)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text (using *text* syntax)
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Underline (using __text__ syntax)
      .replace(/__(.*?)__/g, '<u>$1</u>')
      // Strikethrough (using ~~text~~ syntax)
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
  );
};

// Safe JSON parse function with error handling
const safeJsonParse = (jsonString: string | null, fallback: any = null) => {
  if (!jsonString) return fallback;

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);

    return fallback;
  }
};

export default function PresentationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presentationId = searchParams.get('id');

  // Try to get the slides data from Supabase or localStorage if available
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mouseIdle, setMouseIdle] = useState(false);

  // Load slides from Supabase first, then localStorage as fallback
  useEffect(() => {
    async function loadSlides() {
      setIsLoading(true);
      try {
        // Initialize Supabase client
        const supabase = createClientSupabaseClient();

        // If we have a presentation ID, try to load from Supabase first
        if (presentationId) {
          console.log(`Attempting to load presentation ${presentationId} from Supabase`);

          // Fetch presentation slides from Supabase
          const { data: dbSlides, error } = await supabase
            .from('slides')
            .select('*')
            .eq('presentation_id', presentationId)
            .order('order', { ascending: true });

          if (error) {
            console.error('Error loading slides from Supabase:', error);
            throw new Error(`Failed to load slides: ${error.message}`);
          }

          if (dbSlides && dbSlides.length > 0) {
            console.log(`Loaded ${dbSlides.length} slides from Supabase`);

            // Transform slides to match expected format if necessary
            const formattedSlides = dbSlides.map(slide => {
              // Ensure content is parsed if stored as JSON string
              let slideContent;

              try {
                slideContent =
                  typeof slide.content === 'string' ? safeJsonParse(slide.content) : slide.content;
              } catch (e) {
                // If parsing fails, use content as is
                slideContent = slide.content;
              }

              return {
                id: slide.id,
                title: slideContent.title || '',
                content: slideContent.content || [],
                order: slide.order,
                backgroundColor: slideContent.backgroundColor,
                textColor: slideContent.textColor,
                gradient: slideContent.gradient,
                image: slideContent.image,
                // Add any other properties needed
              };
            });

            setSlides(formattedSlides);
            setIsLoading(false);

            return; // Exit early since we found slides
          } else {
            console.error('No slides found for presentation ID:', presentationId);
            throw new Error('No slides found for this presentation');
          }
        }

        // Only use localStorage if no presentationId is provided
        const generatedSlides = localStorage.getItem('generatedSlides');
        const savedEditorSlides = localStorage.getItem('editor_slides');

        if (generatedSlides) {
          console.log('Loading generated slides from localStorage');
          setSlides(safeJsonParse(generatedSlides, []));
        } else if (savedEditorSlides) {
          console.log('Loading editor slides from localStorage');
          setSlides(safeJsonParse(savedEditorSlides, []));
        } else {
          // Only fall back to sample slides if explicitly developing/testing without an ID
          console.warn('No presentation ID provided and no saved slides found in localStorage');
          throw new Error('No presentation data available');
        }
      } catch (error) {
        console.error('Error loading slides:', error);
        // Show error state instead of falling back to sample slides
        setSlides([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadSlides();
  }, [presentationId]);

  const currentSlide = slides[currentSlideIndex] || { title: '', content: [] };

  // Hide controls after 3 seconds of mouse inactivity
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      setMouseIdle(false);
      setControlsVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setMouseIdle(true);
        setControlsVisible(false);
      }, 3000);
    };

    window.addEventListener('mousemove', resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      clearTimeout(timer);
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        navigateToSlide(Math.min(currentSlideIndex + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        navigateToSlide(Math.max(currentSlideIndex - 1, 0));
      } else if (e.key === 'Escape') {
        router.push('/dashboard/create/editor');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, slides.length, router]);

  const navigateToSlide = useCallback((index: number) => {
    setCurrentSlideIndex(index);
  }, []);

  const exitPresentation = () => {
    router.push('/dashboard/create/editor');
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div
            aria-label="loading"
            className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-primary rounded-full"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-4 text-white text-lg">Loading presentation...</p>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <Icon className="mx-auto mb-4" icon="material-symbols:error-outline" width={48} />
          <h2 className="text-2xl mb-2">No slides available</h2>
          <p className="mb-4">There are no slides to present.</p>
          <Button color="primary" onClick={exitPresentation}>
            Return to Editor
          </Button>
        </div>
      </div>
    );
  }

  // Determine if this is a title slide (typically the first slide with subtitle and author)
  const isTitleSlide = currentSlideIndex === 0 && currentSlide.subtitle;

  return (
    <div
      className="w-full h-screen bg-black overflow-hidden relative"
      role="button"
      tabIndex={0}
      onClick={() => {
        if (currentSlideIndex < slides.length - 1) {
          navigateToSlide(currentSlideIndex + 1);
        }
      }}
      onKeyDown={e => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          if (currentSlideIndex < slides.length - 1) {
            navigateToSlide(currentSlideIndex + 1);
          }
        } else if (e.key === 'ArrowLeft') {
          if (currentSlideIndex > 0) {
            navigateToSlide(currentSlideIndex - 1);
          }
        } else if (e.key === 'Escape') {
          exitPresentation();
        }
      }}
    >
      {/* Slide Content */}
      <div className="w-full h-full">
        <div
          className="w-full h-full relative"
          style={{
            backgroundColor: currentSlide.backgroundColor || '#000000',
            backgroundImage:
              currentSlide.image && !isTitleSlide
                ? undefined
                : currentSlide.image
                  ? `url(${currentSlide.image})`
                  : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            background: currentSlide.gradient || undefined,
          }}
        >
          {/* Title always visible */}
          <div className={`${isTitleSlide ? 'flex flex-col justify-center h-full p-16' : 'p-10'}`}>
            <h1
              className={`font-bold ${isTitleSlide ? 'text-5xl mb-6' : 'text-4xl mb-8 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent'}`}
              style={isTitleSlide ? { color: currentSlide.textColor || '#FFFFFF' } : {}}
            >
              {currentSlide.title}
            </h1>

            {/* Subtitle only on title slide */}
            {isTitleSlide && currentSlide.subtitle && (
              <p className="text-xl text-white mb-12">{currentSlide.subtitle}</p>
            )}

            {/* Author info only on title slide */}
            {isTitleSlide && currentSlide.author && (
              <div className="flex items-center mt-auto">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  {currentSlide.author.substring(0, 2).toUpperCase()}
                </div>
                <div className="ml-4">
                  <div className="text-white">by {currentSlide.author}</div>
                  {currentSlide.editedTime && (
                    <div className="text-gray-400 text-sm">
                      Last edited {currentSlide.editedTime}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content for non-title slides */}
            {!isTitleSlide && (
              <div className="text-white text-xl">
                {Array.isArray(currentSlide.content) &&
                  currentSlide.content.map((contentItem, i) => {
                    // Handle different types of content items
                    if (typeof contentItem === 'string') {
                      return (
                        <div key={i} className="list-disc ml-8 mb-4">
                          {contentItem}
                        </div>
                      );
                    }

                    // Handle content item objects
                    if (contentItem.type === 'text') {
                      return (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: renderFormattedText(contentItem.value),
                          }}
                          key={contentItem.id || i}
                          className={
                            contentItem.x !== undefined ? 'absolute' : 'list-disc ml-8 mb-4'
                          }
                          style={
                            contentItem.x !== undefined
                              ? {
                                  position: 'absolute',
                                  left: `${contentItem.x}px`,
                                  top: `${contentItem.y}px`,
                                  width: `${contentItem.width || 300}px`,
                                }
                              : {}
                          }
                        />
                      );
                    } else if (contentItem.type === 'shape') {
                      // Render shapes with their styles
                      return (
                        <div
                          key={contentItem.id || i}
                          style={{
                            position: 'absolute',
                            left: `${contentItem.x || 0}px`,
                            top: `${contentItem.y || 0}px`,
                            width: `${contentItem.width || 100}px`,
                            height: `${contentItem.height || 100}px`,
                            backgroundColor: contentItem.style?.backgroundColor || 'transparent',
                            borderColor: contentItem.style?.borderColor || 'transparent',
                            borderStyle: contentItem.style?.borderStyle || 'solid',
                            borderWidth: contentItem.style?.borderWidth || 0,
                            transform: contentItem.style?.rotation
                              ? `rotate(${contentItem.style.rotation}deg)`
                              : undefined,
                            opacity:
                              contentItem.style?.opacity !== undefined
                                ? contentItem.style.opacity
                                : 1,
                            zIndex: contentItem.style?.zIndex || 0,
                          }}
                        />
                      );
                    } else if (contentItem.type === 'image') {
                      // Render images
                      return (
                        <img
                          key={contentItem.id || i}
                          alt="Slide content"
                          src={contentItem.value}
                          style={{
                            position: 'absolute',
                            left: `${contentItem.x || 0}px`,
                            top: `${contentItem.y || 0}px`,
                            width: `${contentItem.width || 200}px`,
                            height: `${contentItem.height || 200}px`,
                            objectFit: 'cover',
                          }}
                        />
                      );
                    } else if (contentItem.type === 'table' && contentItem.tableData) {
                      // Render tables
                      return (
                        <div
                          key={contentItem.id || i}
                          className="border border-gray-600 rounded overflow-hidden"
                          style={{
                            position: contentItem.x !== undefined ? 'absolute' : 'relative',
                            left: contentItem.x !== undefined ? `${contentItem.x}px` : undefined,
                            top: contentItem.y !== undefined ? `${contentItem.y}px` : undefined,
                            width:
                              contentItem.width !== undefined ? `${contentItem.width}px` : '100%',
                          }}
                        >
                          <table className="w-full border-collapse">
                            <tbody>
                              {Array.isArray(contentItem.tableData.rows) &&
                                contentItem.tableData.rows.map((row, rowIndex) => (
                                  <tr
                                    key={rowIndex}
                                    className="border-b border-gray-600 last:border-b-0"
                                  >
                                    {Array.isArray(row) &&
                                      row.map((cell, cellIndex) => (
                                        <td
                                          key={cellIndex}
                                          className="border-r border-gray-600 last:border-r-0 p-2"
                                        >
                                          {cell}
                                        </td>
                                      ))}
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    } else if (contentItem.type === 'embed' && contentItem.embedData) {
                      // Render embeds (videos, etc)
                      return (
                        <div
                          key={contentItem.id || i}
                          className="overflow-hidden rounded"
                          style={{
                            position: contentItem.x !== undefined ? 'absolute' : 'relative',
                            left: contentItem.x !== undefined ? `${contentItem.x}px` : undefined,
                            top: contentItem.y !== undefined ? `${contentItem.y}px` : undefined,
                            width:
                              contentItem.width !== undefined ? `${contentItem.width}px` : '100%',
                            height:
                              contentItem.height !== undefined ? `${contentItem.height}px` : 'auto',
                          }}
                        >
                          {contentItem.embedData.url ? (
                            <iframe
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              frameBorder="0"
                              src={contentItem.embedData.url}
                              style={{ width: '100%', height: '100%' }}
                              title={contentItem.embedData.title || 'Embedded content'}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                              Missing embed source
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Default fallback
                    return (
                      <div key={i} className="list-disc ml-8 mb-4">
                        {contentItem.value || JSON.stringify(contentItem)}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls (only visible when mouse is active) */}
      {controlsVisible && (
        <>
          {/* Exit Button */}
          <Button
            isIconOnly
            className="text-white bg-black/50 absolute top-4 right-4 z-10"
            variant="flat"
            onPress={exitPresentation}
          >
            <Icon icon="material-symbols:close" width={24} />
          </Button>

          {/* Navigation Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/60 rounded-full px-4 py-2 z-10">
            <Button
              isIconOnly
              className="text-white"
              isDisabled={currentSlideIndex === 0}
              variant="flat"
              onPress={(e: any) => {
                e.stopPropagation();
                navigateToSlide(Math.max(0, currentSlideIndex - 1));
              }}
            >
              <Icon icon="material-symbols:arrow-back" width={24} />
            </Button>

            <span className="text-white">
              {currentSlideIndex + 1} / {slides.length}
            </span>

            <Button
              isIconOnly
              className="text-white"
              isDisabled={currentSlideIndex === slides.length - 1}
              variant="flat"
              onPress={(e: any) => {
                e.stopPropagation();
                navigateToSlide(Math.min(slides.length - 1, currentSlideIndex + 1));
              }}
            >
              <Icon icon="material-symbols:arrow-forward" width={24} />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
