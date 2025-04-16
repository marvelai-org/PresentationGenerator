'use client';

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';

import { getExtensionsWithPlaceholder } from './EditorExtensions';
import './EditorStyles.css';

export interface SlideEditorProps {
  /**
   * HTML content for the editor
   */
  content: string;

  /**
   * Callback for when content changes
   */
  onChange: (value: string) => void;

  /**
   * Optional placeholder text for empty editor
   */
  placeholder?: string;
}

/**
 * Rich text editor component for slides with title and bullet structure
 */
export function SlideEditor({ content, onChange, placeholder }: SlideEditorProps) {
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: getExtensionsWithPlaceholder(placeholder),
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'outline-none w-full prose-sm prose-neutral dark:prose-invert focus:outline-none',
      },
      handleDOMEvents: {
        focus: () => {
          setIsFocused(true);

          return false;
        },
        blur: () => {
          setIsFocused(false);

          return false;
        },
      },
    },
    // Ensure empty content starts with a heading
    onCreate: ({ editor }) => {
      if (editor.isEmpty) {
        editor.commands.setContent('<h2></h2><ul><li></li></ul>');
      }
    },
  });

  // Handle initial content structure
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // If content is empty or doesn't contain a heading, restructure it
      if (!content || !content.includes('<h2>')) {
        const plainText = content.replace(/<[^>]*>/g, '').trim();

        if (plainText) {
          // If there's text content but no structure, convert it
          // Split by lines
          const lines = plainText.split('\n');
          const title = lines[0] || 'New slide';
          const bullets = lines.slice(1).filter(line => line.trim());

          let structuredContent = `<h2>${title}</h2>`;

          if (bullets.length > 0) {
            structuredContent += '<ul>' + bullets.map(b => `<li>${b}</li>`).join('') + '</ul>';
          } else {
            structuredContent += '<ul><li></li></ul>';
          }

          editor.commands.setContent(structuredContent);
        } else {
          // If completely empty, set up with default structure
          editor.commands.setContent('<h2>New slide</h2><ul><li>New bullet point</li></ul>');
        }
      } else {
        // If it already has structure, just set it normally
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  // Add change handler to ensure structure after changes
  useEffect(() => {
    if (editor) {
      const handleChange = () => {
        // Check if structure is maintained
        const isStructured = editor.getHTML().includes('<h2>') && editor.getHTML().includes('<ul>');

        if (!isStructured && !editor.isEmpty) {
          // If structure lost but has content, attempt to restore it
          const plainText = editor.getText();

          if (plainText.trim()) {
            const lines = plainText.split('\n');
            const title = lines[0] || 'New slide';
            const bullets = lines.slice(1).filter(line => line.trim());

            let structuredContent = `<h2>${title}</h2>`;

            if (bullets.length > 0) {
              structuredContent += '<ul>' + bullets.map(b => `<li>${b}</li>`).join('') + '</ul>';
            } else {
              structuredContent += '<ul><li></li></ul>';
            }

            // Only reset if significantly changed to avoid cursor jumping
            if (structuredContent.trim() !== editor.getHTML().trim()) {
              editor.commands.setContent(structuredContent);
            }
          }
        }
      };

      // Set up a debounced version to not interfere with typing
      const timeoutId = setTimeout(handleChange, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [editor]);

  return (
    <div className={`w-full slide-editor ${isFocused ? 'editor-focused' : ''}`}>
      <EditorContent editor={editor} />
    </div>
  );
}
