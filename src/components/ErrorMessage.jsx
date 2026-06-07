import './ErrorMessage.css';

export default function ErrorMessage({ message = '오류가 발생했습니다.', onRetry, onAction, actionLabel }) {
  return (
    <div className="error-msg" role="alert">
      <div className="error-msg__icon" aria-hidden="true">⚠️</div>
      <p className="error-msg__text">{message}</p>
      {onRetry && (
        <button type="button" className="error-msg__retry" onClick={onRetry}>
          다시 시도
        </button>
      )}
      {onAction && actionLabel && (
        <button type="button" className="error-msg__retry" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
