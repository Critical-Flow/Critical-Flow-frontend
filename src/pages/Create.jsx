import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { startSession } from '../services/session';
import './Create.css';

const CHIPS = [
  'React', 'Spring', 'Python', 'JavaScript', 'Java',
  'TypeScript', 'Vue', 'Node.js', '알고리즘', '자료구조', '데이터베이스', '운영체제',
];

export default function Create() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [activeChips, setActiveChips] = useState([]);
  const [time, setTime] = useState(60);
  const [titleError, setTitleError] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const toggleChip = (val) => {
    const next = activeChips.includes(val)
      ? activeChips.filter((c) => c !== val)
      : [...activeChips, val];
    setActiveChips(next);
    setTopicInput(next.join(', '));
  };

  const sliderPct = ((time - 5) / (300 - 5)) * 100;

  const handleCreate = async () => {
    if (!title.trim()) { setTitleError(true); return; }
    setIsCreating(true);
    try {
      const { sessionId } = await startSession({
        title,
        topics: topicInput,
        targetMinutes: time,
      });
      navigate(`/editor/${sessionId}`);
    } catch (e) {
      alert('학습 세션 생성에 실패했어요. 잠시 후 다시 시도해주세요.');
      setIsCreating(false);
    }
  };

  return (
    <AppLayout>
      <div className="create-container">
        <div className="page-title">학습 생성</div>
        <div className="page-sub">새로운 학습 세션을 설정하세요</div>

        <div className="create-wrap">
          <div className="form-card">
            <div className="form-section">
              <label className="form-label">제목</label>
              <input
                type="text"
                className={`form-input${titleError ? ' error' : ''}`}
                placeholder="학습 제목을 입력하세요"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setTitleError(false); }}
              />
            </div>

            <div className="form-section">
              <label className="form-label">학습 주제</label>
              <input
                type="text"
                className="form-input"
                placeholder="ex. 언어, 기술 스택 등등"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
              />
              <span className="chips-label">기본 예시에서 선택하기</span>
              <div className="chips">
                {CHIPS.map((val) => (
                  <div
                    key={val}
                    className={`chip${activeChips.includes(val) ? ' active' : ''}`}
                    onClick={() => toggleChip(val)}
                  >{val}</div>
                ))}
              </div>
            </div>

            <div className="form-divider" />

            <div className="form-section">
              <label className="form-label">목표 학습 시간</label>
              <div className="time-row">
                <input
                  type="number"
                  className="time-input"
                  value={time}
                  min="5"
                  max="300"
                  step="5"
                  onChange={(e) => {
                    const v = Math.max(5, Math.min(300, Number(e.target.value) || 5));
                    setTime(v);
                  }}
                  onBlur={(e) => {
                    const v = Math.max(5, Math.min(300, Number(e.target.value) || 5));
                    setTime(Math.round(v / 5) * 5);
                  }}
                />
                <span className="time-unit">분</span>
                <span className="time-hint">5 ~ 300분</span>
              </div>
              <div className="slider-wrap">
                <input
                  type="range"
                  className="slider"
                  min="5"
                  max="300"
                  step="5"
                  value={time}
                  style={{
                    background: `linear-gradient(90deg, var(--color-teal-500) ${sliderPct}%, var(--line) ${sliderPct}%)`
                  }}
                  onChange={(e) => setTime(Number(e.target.value))}
                />
                <div className="slider-marks">
                  <span>5분</span><span>1시간</span><span>2시간</span><span>3시간</span><span>5시간</span>
                </div>
              </div>
            </div>

            <div className="form-divider" />
            <button className="btn-create" onClick={handleCreate} disabled={isCreating}>
              {isCreating ? '생성 중...' : '생성'}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
