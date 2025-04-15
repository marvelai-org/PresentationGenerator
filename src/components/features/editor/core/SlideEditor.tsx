'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Button, Tooltip, Popover, PopoverTrigger, PopoverContent, Input } from '@heroui/react';
import { Icon } from '@iconify/react';

interface SlideEditorProps {
  content: string;
  placeholder?: string;
  onUpdate?: (html: string) => void;
  isTitle?: boolean;
}

export default function SlideEditor({
  content,
  placeholder = 'Start typing...',
  onUpdate,
  isTitle = false,
}: SlideEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: isTitle ? [1, 2] : [2, 3, 4, 5, 6],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
      Underline,
      TextStyle,
      Color,
      Image,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-indigo-500 underline cursor-pointer',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: isTitle
          ? 'prose prose-invert max-w-none focus:outline-none text-4xl font-bold'
          : 'prose prose-invert max-w-none focus:outline-none min-h-[100px]',
      },
    },
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getHTML());
      }
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const setLink = () => {
    if (!linkUrl) return;

    editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    setLinkUrl('');
    setShowLinkInput(false);
  };

  const unsetLink = () => {
    editor?.chain().focus().extendMarkRange('link').unsetLink().run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="slide-editor relative">
      {editor && (
        <BubbleMenu
          className="bg-gray-800 shadow-lg rounded-lg p-1 flex space-x-1 border border-gray-700"
          editor={editor}
          tippyOptions={{
            duration: 100,
            placement: 'top',
            arrow: false,
            theme: 'dark',
          }}
        >
          <Tooltip content="Bold" placement="top">
            <Button
              isIconOnly
              className="text-gray-200"
              color={editor.isActive('bold') ? 'primary' : 'default'}
              size="sm"
              variant={editor.isActive('bold') ? 'solid' : 'flat'}
              onPress={() => editor.chain().focus().toggleBold().run()}
            >
              <Icon icon="material-symbols:format-bold" width={20} />
            </Button>
          </Tooltip>

          <Tooltip content="Italic" placement="top">
            <Button
              isIconOnly
              className="text-gray-200"
              color={editor.isActive('italic') ? 'primary' : 'default'}
              size="sm"
              variant={editor.isActive('italic') ? 'solid' : 'flat'}
              onPress={() => editor.chain().focus().toggleItalic().run()}
            >
              <Icon icon="material-symbols:format-italic" width={20} />
            </Button>
          </Tooltip>

          <Tooltip content="Underline" placement="top">
            <Button
              isIconOnly
              className="text-gray-200"
              color={editor.isActive('underline') ? 'primary' : 'default'}
              size="sm"
              variant={editor.isActive('underline') ? 'solid' : 'flat'}
              onPress={() => editor.chain().focus().toggleUnderline().run()}
            >
              <Icon icon="material-symbols:format-underlined" width={20} />
            </Button>
          </Tooltip>

          <div className="h-6 border-l border-gray-600 mx-1" />

          <Tooltip content="Align Left" placement="top">
            <Button
              isIconOnly
              className="text-gray-200"
              color={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'}
              size="sm"
              variant={editor.isActive({ textAlign: 'left' }) ? 'solid' : 'flat'}
              onPress={() => editor.chain().focus().setTextAlign('left').run()}
            >
              <Icon icon="material-symbols:format-align-left" width={20} />
            </Button>
          </Tooltip>

          <Tooltip content="Align Center" placement="top">
            <Button
              isIconOnly
              className="text-gray-200"
              color={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}
              size="sm"
              variant={editor.isActive({ textAlign: 'center' }) ? 'solid' : 'flat'}
              onPress={() => editor.chain().focus().setTextAlign('center').run()}
            >
              <Icon icon="material-symbols:format-align-center" width={20} />
            </Button>
          </Tooltip>

          <Tooltip content="Align Right" placement="top">
            <Button
              isIconOnly
              className="text-gray-200"
              color={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'}
              size="sm"
              variant={editor.isActive({ textAlign: 'right' }) ? 'solid' : 'flat'}
              onPress={() => editor.chain().focus().setTextAlign('right').run()}
            >
              <Icon icon="material-symbols:format-align-right" width={20} />
            </Button>
          </Tooltip>

          <div className="h-6 border-l border-gray-600 mx-1" />

          <Popover isOpen={showLinkInput} placement="top" onOpenChange={setShowLinkInput}>
            <PopoverTrigger>
              <Button
                isIconOnly
                className="text-gray-200"
                color={editor.isActive('link') ? 'primary' : 'default'}
                size="sm"
                variant={editor.isActive('link') ? 'solid' : 'flat'}
              >
                <Icon icon="material-symbols:link" width={20} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-2 bg-gray-800 border border-gray-700">
              <div className="flex flex-col gap-2">
                <Input
                  classNames={{
                    input: 'bg-gray-700 text-white',
                    inputWrapper: 'bg-gray-700 border-gray-600',
                  }}
                  placeholder="https://example.com"
                  startContent={
                    <Icon className="text-gray-400" icon="material-symbols:link" width={16} />
                  }
                  value={linkUrl}
                  onChange={e => setLinkUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && setLink()}
                />
                <div className="flex justify-between">
                  {editor.isActive('link') && (
                    <Button color="danger" size="sm" variant="flat" onPress={unsetLink}>
                      Remove Link
                    </Button>
                  )}
                  <Button className="ml-auto" color="primary" size="sm" onPress={setLink}>
                    Save
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {!isTitle && (
            <>
              <div className="h-6 border-l border-gray-600 mx-1" />

              <Tooltip content="Bullet List" placement="top">
                <Button
                  isIconOnly
                  className="text-gray-200"
                  color={editor.isActive('bulletList') ? 'primary' : 'default'}
                  size="sm"
                  variant={editor.isActive('bulletList') ? 'solid' : 'flat'}
                  onPress={() => editor.chain().focus().toggleBulletList().run()}
                >
                  <Icon icon="material-symbols:format-list-bulleted" width={20} />
                </Button>
              </Tooltip>

              <Tooltip content="Numbered List" placement="top">
                <Button
                  isIconOnly
                  className="text-gray-200"
                  color={editor.isActive('orderedList') ? 'primary' : 'default'}
                  size="sm"
                  variant={editor.isActive('orderedList') ? 'solid' : 'flat'}
                  onPress={() => editor.chain().focus().toggleOrderedList().run()}
                >
                  <Icon icon="material-symbols:format-list-numbered" width={20} />
                </Button>
              </Tooltip>
            </>
          )}
        </BubbleMenu>
      )}

      <EditorContent className="text-white" editor={editor} />
    </div>
  );
}
