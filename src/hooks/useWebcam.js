import { useRef, useCallback } from 'react';

export default function useWebcam() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));

  const startWebcam = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, []);

  const stopWebcam = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || !streamRef.current) return Promise.resolve(null);
    // stream이 video에 연결 안 된 경우 재연결 (렌더링 타이밍 이슈 방어)
    if (!video.srcObject) {
      video.srcObject = streamRef.current;
    }
    if (video.videoWidth === 0) return Promise.resolve(null); // 아직 로딩 중
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.8));
  }, []);

  return { videoRef, startWebcam, stopWebcam, captureFrame };
}
