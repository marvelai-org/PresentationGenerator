import React from 'react';
import { Card, Image } from '@heroui/react';

const TitleWithBulletsAndImage = () => {
  return (
    <div className="flex flex-col w-full h-full p-12 font-sans">
      {/* Title Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
          Title with bullets and image
        </h1>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 gap-10">
        {/* Bullet Points */}
        <div className="flex-1">
          <ul className="space-y-5 text-foreground/90 text-xl">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2.5 mr-3 rounded-full bg-primary" />
              <span>First key point that you want to emphasize</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2.5 mr-3 rounded-full bg-secondary" />
              <span>Second key point with important information</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2.5 mr-3 rounded-full bg-success" />
              <span>Third key point that adds value to your presentation</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2.5 mr-3 rounded-full bg-warning" />
              <span>Fourth key point with supporting details</span>
            </li>
          </ul>
        </div>

        {/* Image Container */}
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md shadow-md border-1 border-default-200">
            <Image
              alt="Presentation image"
              className="object-cover w-full aspect-video"
              fallbackSrc="/api/placeholder/400/320"
              src="/api/placeholder/400/320"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TitleWithBulletsAndImage;
