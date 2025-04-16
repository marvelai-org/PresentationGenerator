'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';

import CommandMenuModal from '../CommandMenuModal';

import styles from './ShapeSelector.module.css';

interface ShapeSelectorProps {
  onSelect: (shape: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function ShapeSelector({ onSelect, onClose, isOpen }: ShapeSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Shape categories and types based on the screenshots
  const essentialShapes = [
    { id: 'square', name: 'Square', icon: 'mdi:square' },
    {
      id: 'rounded-square',
      name: 'Rounded Square',
      icon: 'mdi:square-rounded',
    },
    { id: 'circle', name: 'Circle', icon: 'mdi:circle' },
    { id: 'triangle', name: 'Triangle', icon: 'mdi:triangle' },
    { id: 'diamond', name: 'Diamond', icon: 'mdi:diamond' },
    { id: 'star', name: 'Star', icon: 'mdi:star' },
  ].filter(shape => !searchTerm || shape.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const lineTypes = [
    { id: 'solid-line', name: 'Solid Line', type: 'solid' },
    {
      id: 'arrow-right',
      name: 'Arrow Right',
      type: 'solid',
      icon: 'mdi:arrow-right',
    },
    {
      id: 'arrow-bidirectional',
      name: 'Bidirectional Arrow',
      type: 'solid',
      icon: 'mdi:arrow-left-right',
    },
    {
      id: 'arrow-expand',
      name: 'Expand Arrow',
      type: 'solid',
      icon: 'mdi:arrow-expand-horizontal',
    },
    {
      id: 'circle-line',
      name: 'Circle Line',
      type: 'solid',
      icon: 'mdi:arrow-right-circle',
    },
    {
      id: 'bar-line',
      name: 'Bar Line',
      type: 'solid',
      icon: 'mdi:arrow-expand-horizontal',
    },

    { id: 'dashed-line', name: 'Dashed Line', type: 'dashed' },
    {
      id: 'dashed-arrow-right',
      name: 'Dashed Arrow Right',
      type: 'dashed',
      icon: 'mdi:arrow-right',
    },
    {
      id: 'dashed-arrow-bidirectional',
      name: 'Dashed Bidirectional Arrow',
      type: 'dashed',
      icon: 'mdi:arrow-left-right',
    },
    {
      id: 'dashed-arrow-expand',
      name: 'Dashed Expand Arrow',
      type: 'dashed',
      icon: 'mdi:arrow-expand-horizontal',
    },
    {
      id: 'dashed-circle-line',
      name: 'Dashed Circle Line',
      type: 'dashed',
      icon: 'mdi:arrow-right-circle',
    },
    {
      id: 'dashed-bar-line',
      name: 'Dashed Bar Line',
      type: 'dashed',
      icon: 'mdi:arrow-expand-horizontal',
    },

    { id: 'dotted-line', name: 'Dotted Line', type: 'dotted' },
    {
      id: 'dotted-arrow-right',
      name: 'Dotted Arrow Right',
      type: 'dotted',
      icon: 'mdi:arrow-right',
    },
    {
      id: 'dotted-arrow-bidirectional',
      name: 'Dotted Bidirectional Arrow',
      type: 'dotted',
      icon: 'mdi:arrow-left-right',
    },
    {
      id: 'dotted-arrow-expand',
      name: 'Dotted Expand Arrow',
      type: 'dotted',
      icon: 'mdi:arrow-expand-horizontal',
    },
    {
      id: 'dotted-circle-line',
      name: 'Dotted Circle Line',
      type: 'dotted',
      icon: 'mdi:arrow-right-circle',
    },
    {
      id: 'dotted-bar-line',
      name: 'Dotted Bar Line',
      type: 'dotted',
      icon: 'mdi:arrow-expand-horizontal',
    },
  ].filter(line => !searchTerm || line.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const buttonShapes = [
    {
      id: 'rectangular-label',
      name: 'Rectangular Label',
      icon: 'mdi:rectangle',
    },
    {
      id: 'rounded-label',
      name: 'Rounded Label',
      icon: 'mdi:rectangle-rounded',
    },
    { id: 'ribbon', name: 'Ribbon', icon: 'mdi:ribbon' },
  ].filter(shape => !searchTerm || shape.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const processShapes = [
    {
      id: 'process-start',
      name: 'Process Start',
      icon: 'mdi:rectangle-outline',
    },
    {
      id: 'process-arrow',
      name: 'Process Arrow',
      icon: 'mdi:arrow-right-thin',
    },
    {
      id: 'process-hexagon',
      name: 'Process Hexagon',
      icon: 'mdi:hexagon-outline',
    },
    {
      id: 'process-diamond',
      name: 'Process Diamond',
      icon: 'mdi:rhombus-outline',
    },
  ].filter(shape => !searchTerm || shape.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Render shape items based on type
  const renderShapeItem = (shape: any, filled: boolean = true) => {
    const bgColor = filled ? 'bg-content3' : 'border-2 border-default-400';
    const fillClass = filled ? 'text-default-700' : 'text-default-400';

    return (
      <div
        key={shape.id}
        aria-label={`Select ${shape.name || 'shape'}`}
        className={`p-4 flex justify-center items-center cursor-pointer hover:bg-content2 rounded-md transition-all ${styles.shapeItem}`}
        role="button"
        tabIndex={0}
        onClick={() => onSelect(shape.id)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            onSelect(shape.id);
          }
        }}
      >
        {shape.icon ? (
          <Icon className={`${fillClass} shape-preview`} height={40} icon={shape.icon} width={40} />
        ) : (
          <div
            className={`w-10 h-10 ${bgColor} ${shape.name.toLowerCase().includes('circle') ? 'rounded-full' : shape.name.toLowerCase().includes('rounded') ? 'rounded-lg' : ''} shape-preview`}
          />
        )}
      </div>
    );
  };

  // Render line items
  const renderLineItem = (line: any) => {
    return (
      <div
        key={line.id}
        aria-label={`Select ${line.id.replace(/-/g, ' ')} line`}
        className={`p-4 flex justify-center items-center cursor-pointer hover:bg-content2 rounded-md transition-all h-16 ${styles.shapeItem}`}
        role="button"
        tabIndex={0}
        onClick={() => onSelect(line.id)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            onSelect(line.id);
          }
        }}
      >
        <div className="w-full flex items-center justify-center relative">
          {line.type === 'solid' && !line.icon && <div className={styles.lineSolid} />}
          {line.type === 'dashed' && !line.icon && <div className={styles.lineDashed} />}
          {line.type === 'dotted' && !line.icon && <div className={styles.lineDotted} />}
          {line.icon && line.id.includes('arrow-right') && (
            <div
              className={`${line.type === 'solid' ? styles.lineSolid : line.type === 'dashed' ? styles.lineDashed : styles.lineDotted} arrow-right relative`}
            />
          )}
          {line.icon && line.id.includes('arrow-bidirectional') && (
            <div
              className={`${line.type === 'solid' ? styles.lineSolid : line.type === 'dashed' ? styles.lineDashed : styles.lineDotted} arrow-bidirectional relative`}
            />
          )}
          {line.icon && line.id.includes('arrow-expand') && (
            <div
              className={`${line.type === 'solid' ? styles.lineSolid : line.type === 'dashed' ? styles.lineDashed : styles.lineDotted} arrow-bar-start arrow-bar-end relative`}
            />
          )}
          {line.icon && line.id.includes('circle-line') && (
            <div
              className={`${line.type === 'solid' ? styles.lineSolid : line.type === 'dashed' ? styles.lineDashed : styles.lineDotted} circle-line-start arrow-right relative`}
            />
          )}
          {line.icon && line.id.includes('bar-line') && (
            <div
              className={`${line.type === 'solid' ? styles.lineSolid : line.type === 'dashed' ? styles.lineDashed : styles.lineDotted} arrow-bar-start arrow-bar-end relative`}
            />
          )}
        </div>
      </div>
    );
  };

  const renderEssentialTab = () => (
    <div>
      <h3 className="text-default-700 font-medium mb-4">Essential</h3>
      <div className="grid grid-cols-6 gap-3 mb-8">
        {essentialShapes.map(shape => renderShapeItem(shape))}
      </div>
      <div className="grid grid-cols-6 gap-3">
        {essentialShapes.map(shape => renderShapeItem(shape, false))}
      </div>
    </div>
  );

  const renderLinesTab = () => (
    <div>
      <h3 className="text-default-700 font-medium mb-4">Lines</h3>
      <div className="grid grid-cols-6 gap-3 mb-8">
        {lineTypes.filter(line => line.type === 'solid').map(line => renderLineItem(line))}
      </div>
      <div className="grid grid-cols-6 gap-3 mb-8">
        {lineTypes.filter(line => line.type === 'dashed').map(line => renderLineItem(line))}
      </div>
      <div className="grid grid-cols-6 gap-3">
        {lineTypes.filter(line => line.type === 'dotted').map(line => renderLineItem(line))}
      </div>
    </div>
  );

  const renderButtonsTab = () => (
    <div>
      <h3 className="text-default-700 font-medium mb-4">Buttons and labels</h3>
      <div className="grid grid-cols-3 gap-3 mb-8">
        {buttonShapes.map(shape => (
          <div
            key={shape.id}
            aria-label={`Select ${shape.id.replace(/-/g, ' ')}`}
            className="p-4 flex justify-center items-center cursor-pointer hover:bg-content2 rounded-md transition-all h-24"
            role="button"
            tabIndex={0}
            onClick={() => onSelect(shape.id)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelect(shape.id);
              }
            }}
          >
            {shape.id === 'rectangular-label' && (
              <div className="bg-content3 px-6 py-3 flex items-center justify-center">
                <span className="text-default-700">Label</span>
              </div>
            )}
            {shape.id === 'rounded-label' && (
              <div className="bg-content3 px-6 py-3 rounded-full flex items-center justify-center">
                <span className="text-default-700">Label</span>
              </div>
            )}
            {shape.id === 'ribbon' && <div className="w-12 h-12 transform rotate-45 bg-content3" />}
          </div>
        ))}
      </div>
    </div>
  );

  const renderProcessTab = () => (
    <div>
      <h3 className="text-default-700 font-medium mb-4">Process</h3>
      <div className="grid grid-cols-4 gap-3 mb-8">
        {processShapes.map(shape => (
          <div
            key={shape.id}
            aria-label={`Select ${shape.id.replace(/-/g, ' ')}`}
            className="p-4 flex justify-center items-center cursor-pointer hover:bg-content2 rounded-md transition-all h-24"
            role="button"
            tabIndex={0}
            onClick={() => onSelect(shape.id)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelect(shape.id);
              }
            }}
          >
            {shape.id === 'process-start' && (
              <div className={`bg-content3 w-20 h-16 ${styles.clipArrowRight}`} />
            )}
            {shape.id === 'process-arrow' && (
              <div className={`bg-content3 w-20 h-16 ${styles.clipArrowRight}`} />
            )}
            {shape.id === 'process-hexagon' && (
              <div className={`bg-content3 w-20 h-16 ${styles.clipHexagon}`} />
            )}
            {shape.id === 'process-diamond' && (
              <div className={`bg-content3 w-20 h-16 ${styles.clipDiamond}`} />
            )}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {processShapes.map(shape => (
          <div
            key={`outline-${shape.id}`}
            aria-label={`Select outline ${shape.id.replace(/-/g, ' ')}`}
            className="p-4 flex justify-center items-center cursor-pointer hover:bg-content2 rounded-md transition-all h-24"
            role="button"
            tabIndex={0}
            onClick={() => onSelect(`outline-${shape.id}`)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelect(`outline-${shape.id}`);
              }
            }}
          >
            {shape.id === 'process-start' && (
              <div className={`border-2 border-default-400 w-20 h-16 ${styles.clipArrowRight}`} />
            )}
            {shape.id === 'process-arrow' && (
              <div className={`border-2 border-default-400 w-20 h-16 ${styles.clipArrowRight}`} />
            )}
            {shape.id === 'process-hexagon' && (
              <div className={`border-2 border-default-400 w-20 h-16 ${styles.clipHexagon}`} />
            )}
            {shape.id === 'process-diamond' && (
              <div className={`border-2 border-default-400 w-20 h-16 ${styles.clipDiamond}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Define tabs for the CommandMenuModal
  const tabs = [
    {
      key: 'essential',
      title: 'Essential',
      icon: 'material-symbols:shapes',
      content: renderEssentialTab(),
    },
    {
      key: 'lines',
      title: 'Lines',
      icon: 'material-symbols:line-end-arrow',
      content: renderLinesTab(),
    },
    {
      key: 'buttons',
      title: 'Buttons and labels',
      icon: 'material-symbols:label',
      content: renderButtonsTab(),
    },
    {
      key: 'process',
      title: 'Process',
      icon: 'material-symbols:flowchart',
      content: renderProcessTab(),
    },
  ];

  return (
    <CommandMenuModal
      _title="Shapes"
      isOpen={isOpen}
      modalSize="3xl"
      searchPlaceholder="Search for shapes..."
      tabs={tabs}
      onClose={onClose}
      onSearch={setSearchTerm}
    />
  );
}
