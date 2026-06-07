import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Editor, rootCtx, defaultValueCtx, commandsCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { clipboard } from '@milkdown/plugin-clipboard';
import { history } from '@milkdown/plugin-history';
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
      .use(gfm)
      // Ctrl+Z(실행취소)/Ctrl+Y·Ctrl+Shift+Z(다시실행) 키맵 제공.
      .use(history)
      // 클립보드의 마크다운 텍스트를 붙여넣을 때 노드로 파싱한다.
      // commonmark/gfm 뒤에 두어 두 프리셋의 노드 스키마를 모두 인식하게 한다.
      .use(clipboard)
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
