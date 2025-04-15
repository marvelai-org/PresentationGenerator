import { Extension } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Link from '@tiptap/extension-link';
import HardBreak from '@tiptap/extension-hard-break';
import History from '@tiptap/extension-history';
import Placeholder from '@tiptap/extension-placeholder';

/**
 * Create a custom Document extension to enforce slide structure
 * Forces slides to have a heading followed by blocks (like lists)
 */
export const CustomDocument = Document.extend({
  content: 'heading block+',
});

/**
 * Custom keyboard shortcuts extension for enhanced editor behavior
 * Adds specific keyboard behaviors like auto-creating bullet lists
 */
export const KeyboardShortcuts = Extension.create({
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

/**
 * Default placeholder configuration for the editor
 */
export const defaultPlaceholder = 'Title...\n\n• Bullet point...';

/**
 * Array of all extensions used in the slide editor
 */
export const editorExtensions = [
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
  Link,
  HardBreak,
  History,
  KeyboardShortcuts,
];

/**
 * Get all extensions including placeholder with custom text
 *
 * @param placeholderText Optional custom placeholder text
 */
export const getExtensionsWithPlaceholder = (placeholderText?: string) => [
  ...editorExtensions,
  Placeholder.configure({
    placeholder: placeholderText || defaultPlaceholder,
    showOnlyWhenEditable: true,
  }),
];
