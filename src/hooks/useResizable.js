import { useEffect, useRef } from 'react';

// 마우스 드래그로 우측 패널 너비를 조절해 CSS 변수에 반영한다.
// 화면 오른쪽 끝과 커서의 거리(window.innerWidth - clientX)를 너비로 사용한다.
// 반환한 startResize를 리사이저 요소의 onMouseDown에 연결한다.
export default function useResizable({ cssVar, min, max, cursor = 'ew-resize' }) {
  const resizingRef = useRef(false);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!resizingRef.current) return;
      const next = Math.min(max, Math.max(min, window.innerWidth - e.clientX));
      document.documentElement.style.setProperty(cssVar, `${next}px`);
    };
    const onMouseUp = () => {
      if (!resizingRef.current) return;
      resizingRef.current = false;
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [cssVar, min, max]);

  const startResize = (e) => {
    e.preventDefault();
    resizingRef.current = true;
    document.body.style.cursor = cursor;
  };

  return { startResize };
}
