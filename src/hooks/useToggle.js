import { useMemo, useState } from 'react';

// boolean 상태와 토글/on/off 조작을 묶어 제공한다.
// 반환: [현재값, { toggle, on, off, set }]
export default function useToggle(initial = false) {
  const [value, setValue] = useState(initial);

  // 조작 함수들이 매 렌더마다 새로 생성되지 않도록 메모이즈한다.
  const controls = useMemo(
    () => ({
      toggle: () => setValue((v) => !v),
      on: () => setValue(true),
      off: () => setValue(false),
      set: setValue,
    }),
    [],
  );

  return [value, controls];
}
