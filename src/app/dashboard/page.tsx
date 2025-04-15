"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from "@heroui/skeleton";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Tooltip,
  useDisclosure,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { useAuth } from '@/providers/AuthProvider';
import { createClientSupabaseClient } from '@/lib/auth/supabase-client';
import EmptyDashboard from '@/components/empty-states/EmptyDashboard';

// Define the Presentation type
interface Presentation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  is_private: boolean;
  user_id: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [presentations, setPresentations] = React.useState<Presentation[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFirstTimeUser, setIsFirstTimeUser] = React.useState(false);

  // Function to format relative time (e.g., "2 days ago")
  const getRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'today';
    } else if (diffDays === 1) {
      return '1 day ago';
    } else {
      return `${diffDays} days ago`;
    }
  };

  // Fetch presentations from Supabase
  React.useEffect(() => {
    const fetchPresentations = async () => {
      if (!user) return;
      
      try {
        const supabase = createClientSupabaseClient();
        
        const { data, error } = await supabase
          .from('presentations')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching presentations:', error);
          return;
        }
        
        setPresentations(data || []);
        
        // Check if this is a first-time user (no presentations)
        if (data && data.length === 0) {
          setIsFirstTimeUser(true);
          
          // Check if we should redirect to create page
          const hasSeenDashboard = localStorage.getItem('hasSeenDashboard');
          if (!hasSeenDashboard) {
            localStorage.setItem('hasSeenDashboard', 'true');
            // Enable automatic redirect for first-time users
            router.push('/dashboard/create');
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresentations();
  }, [user, router]);

  // Handle direct navigation to create page
  const handleCreateNew = () => {
    router.push('/dashboard/create');
  };

  return (
    <div className="flex flex-col bg-black min-h-screen">
      {/* Custom Header */}
      <div className="w-full text-white px-8 py-6">
        <div className="max-w-[1100px] mx-auto w-full">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-medium">AI Presentation Generator</h1>
            <Button 
              size="lg" 
              color="primary" 
              className="rounded-full px-6"
              startContent={<Icon icon="material-symbols:add" width={24} />}
              onClick={handleCreateNew}
            >
              Create New
            </Button>
          </div>
        </div>
      </div>

      {/* Presentations Grid */}
      <div className="max-w-[1100px] mx-auto w-full px-8 mb-20">
        {isLoading ? (
          // Loading skeleton state
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={`skeleton-${i}`} className="bg-gray-800 h-full rounded-lg">
                  <CardBody className="p-0 overflow-hidden">
                    <Skeleton className="rounded-lg">
                      <div className="aspect-video w-full" />
                    </Skeleton>
                  </CardBody>
                  <CardFooter className="flex flex-col items-start gap-1 p-4">
                    <Skeleton className="w-3/4 h-5 rounded-lg" />
                    <Skeleton className="w-2/4 h-4 rounded-lg" />
                  </CardFooter>
                </Card>
              ))}
          </div>
        ) : presentations.length === 0 ? (
          // Empty state for users with no presentations
          <EmptyDashboard onCreateNew={handleCreateNew} />
        ) : (
          // Display user's presentations
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {presentations.map((presentation: Presentation) => (
              <Card
                key={presentation.id}
                className="bg-gray-800 group relative h-full rounded-lg overflow-hidden"
              >
                <button
                  aria-label={`View presentation: ${presentation.title}`}
                  className="cursor-pointer absolute inset-0 z-10 border-0 bg-transparent appearance-none"
                  onClick={() => router.push(`/dashboard/presentation/${presentation.id}`)}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      router.push(`/dashboard/presentation/${presentation.id}`);
                    }
                  }}
                />
                <CardBody className="p-0 overflow-hidden">
                  <div className="relative">
                    <div className="aspect-video bg-gray-700 w-full flex items-center justify-center">
                      {/* Presentation preview with play icon */}
                      <div className="text-gray-400 flex flex-col items-center">
                        <Icon className="w-12 h-12" icon="material-symbols:play-arrow-outline" />
                        <span className="mt-2">{presentation.title}</span>
                      </div>

                      {/* Overlay with quick actions on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex gap-2 mt-auto mb-4 relative z-20">
                          <Tooltip content="Edit">
                            <Button
                              isIconOnly
                              className="bg-gray-800/50 backdrop-blur-md"
                              radius="full"
                              size="sm"
                              variant="flat"
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                router.push(`/dashboard/edit/${presentation.id}`);
                              }}
                            >
                              <Icon icon="material-symbols:edit" width={18} />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Present">
                            <Button
                              isIconOnly
                              className="backdrop-blur-md"
                              color="primary"
                              radius="full"
                              size="sm"
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                router.push(`/dashboard/present/${presentation.id}`);
                              }}
                            >
                              <Icon icon="material-symbols:play-arrow" width={18} />
                            </Button>
                          </Tooltip>
                          <Tooltip content="More options">
                            <Button
                              isIconOnly
                              className="bg-gray-800/50 backdrop-blur-md"
                              radius="full"
                              size="sm"
                              variant="flat"
                              onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            >
                              <Icon icon="material-symbols:more-vert" width={18} />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
                <CardFooter className="flex flex-col items-start gap-1 p-4">
                  <div className="flex justify-between w-full">
                    <h3 className="font-medium text-white">{presentation.title}</h3>
                    <Chip color="default" size="sm" variant="flat">
                      {presentation.is_private ? 'Private' : 'Public'}
                    </Chip>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Last edited {getRelativeTime(presentation.updated_at)}
                  </p>
                </CardFooter>
              </Card>
            ))}

            {/* Create New Card */}
            <Card className="border-2 border-dashed border-gray-700 bg-transparent flex items-center justify-center hover:border-blue-500 hover:bg-blue-500/5 transition-all h-full aspect-auto rounded-lg">
              <button
                aria-label="Create new presentation"
                className="cursor-pointer absolute inset-0 z-10 border-0 bg-transparent appearance-none"
                onClick={handleCreateNew}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCreateNew();
                  }
                }}
              />
              <CardBody className="flex flex-col items-center justify-center gap-2 p-6">
                <div className="rounded-full bg-blue-500/10 p-3">
                  <Icon className="text-blue-500 w-6 h-6" icon="material-symbols:add" />
                </div>
                <p className="text-medium font-medium text-white">Create New Presentation</p>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
