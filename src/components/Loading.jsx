import './Loading.css';

export default function Loading({ message = '불러오는 중...', fullPage = false }) {
  return (
    <div className={`loading${fullPage ? ' loading--full' : ''}`} role="status" aria-live="polite">
      <div className="loading__spinner" aria-hidden="true" />
      {message && <p className="loading__message">{message}</p>}
    </div>
  );
}
