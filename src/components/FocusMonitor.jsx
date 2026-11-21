import Mascot from './Mascot';
import './FocusMonitor.css';

const STATE_META = {
  GOOD: { label: '집중 중', expression: 'focus' },
  DROWSY: { label: '졸음 감지', expression: 'drowsy' },
  ABSENT: { label: '자리 이탈', expression: 'absent' },
};

export default function FocusMonitor({ videoRef, currentState }) {
  const state = STATE_META[currentState] ? currentState : 'GOOD';
  const { label, expression } = STATE_META[state];

  return (
    <div className="focus-monitor">
      <video ref={videoRef} autoPlay muted playsInline className="focus-video" />
      <div className="focus-status">
        <span className="focus-mascot" aria-hidden="true">
          <Mascot expression={expression} size={32} />
        </span>
        <span className={`focus-badge ${state.toLowerCase()}`}>{label}</span>
      </div>
    </div>
  );
}
