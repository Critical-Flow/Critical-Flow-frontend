import axios from 'axios';

const pythonApi = axios.create({
  baseURL: import.meta.env.VITE_PYTHON_AI_URL,
});

export async function startVision(sessionId, userId) {
  const { data } = await pythonApi.post('/vision/start', { sessionId, userId });
  return data;
}

export async function sendFrame(frameBlob) {
  const formData = new FormData();
  formData.append('file', frameBlob, 'frame.jpg');
  const { data } = await pythonApi.post('/vision/frame', formData);
  return data; // { focusState: "GOOD" | "DROWSY" | "ABSENT", elapsed: number, isTimerActive: boolean }
}

export async function stopVision(sessionId) {
  const { data } = await pythonApi.post('/vision/stop', { sessionId });
  return data;
}
