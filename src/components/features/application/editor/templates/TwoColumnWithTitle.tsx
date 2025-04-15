import React from 'react';
import { Card } from '@heroui/react';

const TwoColumnWithTitle = () => {
  return (
    <div className="flex flex-col w-full h-full p-12 font-sans">
      {/* Title Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Section Heading</h1>
      </div>

      {/* Content Columns */}
      <div className="flex flex-1 gap-8">
        {/* Left Column */}
        <Card className="flex-1 bg-content1/20 backdrop-blur-sm shadow-sm">
          <div className="p-6">
            <p className="text-foreground/90 text-lg leading-relaxed">
              Column 1 content goes here. Add your text in this area. This column can contain key
              points, explanations, or important information that you want to highlight.
            </p>
          </div>
        </Card>

        {/* Right Column */}
        <Card className="flex-1 bg-content1/20 backdrop-blur-sm shadow-sm">
          <div className="p-6">
            <p className="text-foreground/90 text-lg leading-relaxed">
              Column 2 content goes here. Add your text in this area. Use this column to provide
              additional context, examples, or supporting details related to the content in column
              1.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TwoColumnWithTitle;
