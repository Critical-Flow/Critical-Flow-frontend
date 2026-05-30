import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Editor, rootCtx, defaultValueCtx, commandsCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import './MilkdownEditor.css';

const MilkdownEditor = forwardRef(function MilkdownEditor({ value, onChange }, ref) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const initialValue = useRef(value);
  // listener 콜백이 최초 onChange를 캡처해 stale 되지 않도록 ref로 최신값을 참조한다.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

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
        // 에디터 내용이 바뀔 때마다 최신 마크다운을 부모로 전달한다.
        ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
          onChangeRef.current?.(markdown);
        });
      })
      .use(commonmark)
      .use(listener)
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
