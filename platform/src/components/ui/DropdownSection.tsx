import React from 'react';

interface DropdownSectionProps {
  title?: string;
  children: React.ReactNode;
  showDivider?: boolean;
  className?: string;
}

/**
 * Custom DropdownSection component to be used within DropdownMenu
 */
export function DropdownSection({
  title,
  children,
  showDivider = false,
  className = '',
}: DropdownSectionProps) {
  return (
    <div className={`dropdown-section ${className}`}>
      {title && (
        <div className="py-1.5 px-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
          {title}
        </div>
      )}
      <div className="dropdown-items">{children}</div>
      {showDivider && <div className="my-1 h-px w-full bg-gray-200 dark:bg-gray-800" />}
    </div>
  );
}

export default DropdownSection; 