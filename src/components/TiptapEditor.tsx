'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Undo,
  Redo,
  Sparkles
} from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[160px] max-h-[300px] overflow-y-auto px-4 py-3 text-slate-800 dark:text-slate-200 prose prose-slate dark:prose-invert max-w-none text-xs leading-relaxed'
      }
    }
  });

  // Keep content synced if loaded after mount
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden text-xs">
      {/* Tool bar */}
      <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between flex-wrap gap-1 select-none">
        <div className="flex items-center gap-1">
          {/* Bold */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
              editor.isActive('bold') ? 'text-brand-blue bg-slate-100 dark:bg-slate-800' : 'text-slate-500'
            }`}
            title="Bold"
          >
            <Bold size={14} />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
              editor.isActive('italic') ? 'text-brand-blue bg-slate-100 dark:bg-slate-800' : 'text-slate-500'
            }`}
            title="Italic"
          >
            <Italic size={14} />
          </button>

          {/* H2 */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
              editor.isActive('heading', { level: 2 }) ? 'text-brand-blue bg-slate-100 dark:bg-slate-800' : 'text-slate-500'
            }`}
            title="Heading 2 (H2)"
          >
            <Heading2 size={14} />
          </button>

          {/* H3 */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
              editor.isActive('heading', { level: 3 }) ? 'text-brand-blue bg-slate-100 dark:bg-slate-800' : 'text-slate-500'
            }`}
            title="Heading 3 (H3)"
          >
            <Heading3 size={14} />
          </button>

          {/* Bullet List */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
              editor.isActive('bulletList') ? 'text-brand-blue bg-slate-100 dark:bg-slate-800' : 'text-slate-500'
            }`}
            title="Bullet List"
          >
            <List size={14} />
          </button>

          {/* Ordered List */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
              editor.isActive('orderedList') ? 'text-brand-blue bg-slate-100 dark:bg-slate-800' : 'text-slate-500'
            }`}
            title="Ordered List"
          >
            <ListOrdered size={14} />
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
            title="Undo"
          >
            <Undo size={14} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
            title="Redo"
          >
            <Redo size={14} />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
