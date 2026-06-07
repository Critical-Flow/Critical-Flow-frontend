import { useState, useRef, useCallback, useEffect } from 'react';
import useWebcam from './useWebcam';
import { startVision, sendFrame, stopVision } from '../services/vision';

export default function useFocusMonitor() {
  const [currentState, setCurrentState] = useState('GOOD');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const intervalRef = useRef(null);
  const { videoRef, startWebcam, stopWebcam, captureFrame } = useWebcam();

  const start = useCallback(async (sessionId, userId) => {
    await startWebcam();
    await startVision(sessionId, userId);
    setIsMonitoring(true);
    setCurrentState('GOOD');
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
    try {
      await stopVision(sessionId);
    } catch {
      // vision 종료 실패해도 로컬 상태는 정리
    }
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
