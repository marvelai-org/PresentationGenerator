import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import { Extension } from '@tiptap/core';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import TipTapLink from '@tiptap/extension-link';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import HardBreak from '@tiptap/extension-hard-break';
import History from '@tiptap/extension-history';

// Create a custom Document extension to enforce structure
const CustomDocument = Document.extend({
  content: 'heading block+',
});

// Create a custom keyboard extension for handling Enter and Backspace
const KeyboardShortcuts = Extension.create({
  name: 'keyboardShortcuts',

  addKeyboardShortcuts() {
    return {
      // When user presses Enter at end of title (h2), create a new bullet
      Enter: ({ editor }) => {
        // Check if cursor is at the end of a heading
        const { selection } = editor.state;
        const isAtEndOfHeading =
          selection.$head.parent.type.name === 'heading' &&
          selection.$head.parentOffset === selection.$head.parent.textContent.length;

        if (isAtEndOfHeading) {
          // If in heading and at the end, create or enter bullet list
          if (editor.can().chain().focus().toggleBulletList().run()) {
            editor.chain().focus().toggleBulletList().run();

            return true;
          }
        }

        return false;
      },
    };
  },
});

interface UnifiedSlideEditorProps {
  content: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function UnifiedSlideEditor({
  content,
  onChange,
  placeholder,
}: UnifiedSlideEditorProps) {
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [
      CustomDocument,
      Paragraph,
      Text,
      Heading.configure({
        levels: [2],
      }),
      BulletList,
      ListItem,
      Bold,
      Italic,
      Strike,
      TipTapLink,
      HardBreak,
      History,
      KeyboardShortcuts,
      Placeholder.configure({
        placeholder: placeholder || 'Title...\n\n• Bullet point...',
        showOnlyWhenEditable: true,
      }),
    ],
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
      <style global jsx>{`
        .slide-editor h2 {
          color: #ffffff;
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 0;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .slide-editor ul {
          color: #ecedee;
          padding-left: 1rem;
          list-style-type: disc;
          margin-top: 0.25rem;
          margin-bottom: 0;
        }

        .slide-editor li {
          margin-bottom: 0.25rem;
          display: list-item;
        }

        .slide-editor li:last-child {
          margin-bottom: 0;
        }

        .editor-focused {
          /* Very subtle indication that the editor is focused */
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: 4px;
        }
      `}</style>
      <EditorContent editor={editor} />
    </div>
  );
}
