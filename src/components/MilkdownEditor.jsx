import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Editor, rootCtx, defaultValueCtx, commandsCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import './MilkdownEditor.css';

const MilkdownEditor = forwardRef(function MilkdownEditor({ value, onChange }, ref) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const initialValue = useRef(value);

  useImperativeHandle(ref, () => ({
    callCommand(command, payload) {
      editorRef.current?.action((ctx) => {
        ctx.get(commandsCtx).call(command.key, payload);
      });
    },
  }));

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
});

export default MilkdownEditor;
