import React from 'react';
import { TemplateProps } from '../TemplateRegistry';
import ContentSlot from '../slots/ContentSlot';

const ContentSlide: React.FC<TemplateProps> = ({
  data = {},
  onContentChange,
  editable = false,
  className = ''
}) => {
  return (
    <div className={`relative w-full h-full ${className}`}
      style={{
        background: data.background?.value || '#ffffff',
        color: data.textColor || '#000000'
      }}>
      <ContentSlot
        id="title"
        content={data.title || 'Slide Title'}
        position={{ x: 60, y: 40, width: 680, height: 80 }}
        style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: data.titleColor || 'inherit'
        }}
        type="text"
        editable={editable}
        onChange={content => onContentChange?.('title', content)}
        adaptiveRules={{
          minFontSize: 24,
          maxFontSize: 42,
          autoScale: true,
          overflowBehavior: 'shrink',
        }}
      />
      
      <ContentSlot
        id="content"
        content={data.content || 'Content goes here...'}
        position={{ x: 60, y: 140, width: 680, height: 340 }}
        style={{
          fontSize: '24px',
          color: data.contentColor || 'inherit'
        }}
        type="text"
        editable={editable}
        onChange={content => onContentChange?.('content', content)}
        adaptiveRules={{
          minFontSize: 16,
          maxFontSize: 28,
          overflowBehavior: 'scroll',
        }}
      />
    </div>
  );
};

export default ContentSlide; 