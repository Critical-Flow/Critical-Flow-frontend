import { useEffect, useRef } from 'react';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import './MilkdownEditor.css';

export default function MilkdownEditor({ value, onChange }) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const initialValue = useRef(value);

  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;

    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, containerRef.current);
        ctx.set(defaultValueCtx, initialValue.current);
      })
      .use(commonmark)
      .create()
      .then((editor) => {
        if (destroyed) {
          editor.destroy();
          return;
        }
        editorRef.current = editor;
      });

    return () => {
      destroyed = true;
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, []);

  return <div className="milkdown-wrapper" ref={containerRef} />;
}
