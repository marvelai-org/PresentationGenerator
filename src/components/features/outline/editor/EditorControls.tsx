'use client';

import React from 'react';
import { Button, ButtonGroup, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Editor } from '@tiptap/react';

export interface EditorControlsProps {
  /**
   * The TipTap editor instance
   */
  editor: Editor | null;
}

/**
 * Toolbar control component for the TipTap editor
 */
export function EditorControls({ editor }: EditorControlsProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-[#1C1C1E] border border-[#38383A] rounded-md">
      <ButtonGroup size="sm" variant="flat">
        <Tooltip content="Bold">
          <Button
            isIconOnly
            className={editor.isActive('bold') ? 'bg-primary/20 text-primary' : 'text-gray-400'}
            onPress={() => editor.chain().focus().toggleBold().run()}
          >
            <Icon icon="material-symbols:format-bold" width={18} />
          </Button>
        </Tooltip>

        <Tooltip content="Italic">
          <Button
            isIconOnly
            className={editor.isActive('italic') ? 'bg-primary/20 text-primary' : 'text-gray-400'}
            onPress={() => editor.chain().focus().toggleItalic().run()}
          >
            <Icon icon="material-symbols:format-italic" width={18} />
          </Button>
        </Tooltip>

        <Tooltip content="Strike">
          <Button
            isIconOnly
            className={editor.isActive('strike') ? 'bg-primary/20 text-primary' : 'text-gray-400'}
            onPress={() => editor.chain().focus().toggleStrike().run()}
          >
            <Icon icon="material-symbols:format-strikethrough" width={18} />
          </Button>
        </Tooltip>
      </ButtonGroup>

      <div className="h-5 border-r border-[#38383A] mx-1" />

      <ButtonGroup size="sm" variant="flat">
        <Tooltip content="Bullet List">
          <Button
            isIconOnly
            className={
              editor.isActive('bulletList') ? 'bg-primary/20 text-primary' : 'text-gray-400'
            }
            onPress={() => editor.chain().focus().toggleBulletList().run()}
          >
            <Icon icon="material-symbols:format-list-bulleted" width={18} />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </div>
  );
}
