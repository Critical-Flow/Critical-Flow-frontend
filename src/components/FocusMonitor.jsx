import './FocusMonitor.css';

const STATE_LABEL = {
  GOOD: '집중 중',
  DROWSY: '졸음 감지',
  ABSENT: '자리 이탈',
};

export default function FocusMonitor({ videoRef, currentState }) {
  return (
    <div className="focus-monitor">
      <video ref={videoRef} autoPlay muted playsInline className="focus-video" />
      <span className={`focus-badge ${(currentState ?? 'GOOD').toLowerCase()}`}>
        {STATE_LABEL[currentState] ?? '집중 중'}
      </span>
    </div>
  );
}
