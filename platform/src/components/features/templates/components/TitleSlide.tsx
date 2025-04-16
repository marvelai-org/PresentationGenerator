import React from 'react';
import { TemplateProps } from '../TemplateRegistry';
import ContentSlot from '../slots/ContentSlot';

const TitleSlide: React.FC<TemplateProps> = ({ 
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
        content={data.title || 'Presentation Title'}
        position={{ x: 120, y: 180, width: 600, height: 120 }}
        style={{ 
          fontSize: '56px', 
          fontWeight: 'bold', 
          textAlign: 'center',
          color: data.titleColor || 'inherit'
        }}
        type="text"
        editable={editable}
        onChange={content => onContentChange?.('title', content)}
        adaptiveRules={{
          minFontSize: 32,
          maxFontSize: 64,
          autoScale: true,
          overflowBehavior: 'shrink',
        }}
      />
      
      <ContentSlot
        id="subtitle"
        content={data.subtitle || 'Subtitle or Author'}
        position={{ x: 160, y: 320, width: 520, height: 60 }}
        style={{ 
          fontSize: '24px', 
          textAlign: 'center',
          color: data.subtitleColor || 'inherit'
        }}
        type="text"
        editable={editable}
        onChange={content => onContentChange?.('subtitle', content)}
        adaptiveRules={{
          minFontSize: 18,
          maxFontSize: 32,
          overflowBehavior: 'truncate',
        }}
      />
    </div>
  );
};

export default TitleSlide; 