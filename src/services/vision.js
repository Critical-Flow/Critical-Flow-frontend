import axios from 'axios';

const pythonApi = axios.create({
  baseURL: import.meta.env.VITE_PYTHON_AI_URL,
});

// 비전 세션 시작/종료는 Spring이 /api/v1/sessions 생성·종료 시 Python 서버를 직접 호출한다.
export async function sendFrame(frameBlob) {
  const formData = new FormData();
  formData.append('file', frameBlob, 'frame.jpg');
  const { data } = await pythonApi.post('/vision/frame', formData);
  return data; // { focusState: "GOOD" | "DROWSY" | "ABSENT", elapsed: number, isTimerActive: boolean }
}
