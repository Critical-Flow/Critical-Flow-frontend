export default function EditorDock({
  lsideOpen,
  rsideOpen,
  rsideDisabled,
  saveDisabled,
  viewMode,
  isLearning,
  onToggleLside,
  onToggleRside,
  onCycleView,
  onSave,
  onToggleLearning,
}) {
  return (
    <div className="dock">
      <button
        className={lsideOpen ? 'on' : ''}
        onClick={onToggleLside}
        title="L 사이드바"
      >
        <span className="dock-icon">☰</span>
        <span className="tip">L 사이드바</span>
      </button>
      <button
        className={rsideOpen ? 'on' : ''}
        onClick={onToggleRside}
        title="R 사이드바"
        disabled={rsideDisabled}
      >
        <span className="dock-icon">🤖</span>
        <span className="tip">R 사이드바</span>
      </button>
      <button
        className={viewMode === 'raw' ? 'on' : ''}
        onClick={onCycleView}
        title="원본 마크다운 보기"
      >
        <span className="dock-icon dock-icon--code">&lt;/&gt;</span>
        <span className="tip">원본 마크다운 보기</span>
      </button>
      <button onClick={onSave} title="저장" disabled={saveDisabled}>
        <span className="dock-icon">💾</span>
        <span className="tip">저장 / 전송</span>
      </button>
      <button
        className={`iot-btn${isLearning ? ' learning' : ''}`}
        onClick={onToggleLearning}
        title="학습 시작"
      >
        <span className="iot-dot" />
        <span className="tip">{isLearning ? '학습 중지' : '학습 시작'}</span>
      </button>
    </div>
  );
}
