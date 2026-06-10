import { useState, useRef, useCallback, useEffect } from 'react';
import useWebcam from './useWebcam';
import { sendFrame } from '../services/vision';
// startVision, stopVision 제거 — Spring이 세션 생성/종료 시 Python 서버를 직접 호출함

export default function useFocusMonitor() {
  const [currentState, setCurrentState] = useState('GOOD');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const intervalRef = useRef(null);
  const { videoRef, startWebcam, stopWebcam, captureFrame } = useWebcam();

  const start = useCallback(async (sessionId, userId) => {
    // FocusMonitor(<video> 태그)를 먼저 DOM에 렌더링한 뒤 웹캠 시작
    setIsMonitoring(true);
    setCurrentState('GOOD');
    // React 렌더링 완료까지 대기 (videoRef.current 가 null 이면 stream 연결 불가)
    await new Promise((resolve) => setTimeout(resolve, 100));
    await startWebcam();
    // startVision 제거 — Spring /api/v1/sessions 에서 Python /vision/start 자동 호출
    intervalRef.current = setInterval(async () => {
      const frameBlob = await captureFrame();
      if (!frameBlob) return;
      try {
        const result = await sendFrame(frameBlob);
        setCurrentState(result.focusState);
      } catch {
        // 개별 프레임 전송 실패는 무시하고 다음 인터벌에서 재시도
      }
    }, 1000);
  }, [startWebcam, captureFrame]);

  const stop = useCallback(async (sessionId) => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    // stopVision 제거 — Spring /api/v1/sessions/{id}/end 에서 Python /vision/stop 자동 호출
    stopWebcam();
    setIsMonitoring(false);
    setCurrentState('GOOD');
  }, [stopWebcam]);

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      stopWebcam();
    };
  }, [stopWebcam]);

  return { videoRef, start, stop, currentState, isMonitoring };
}
