import { Link } from 'react-router-dom';
import { formatRelativeTime, formatDuration } from '../utils/date';

export default function NoteCard({ id, title, tag, updatedAt, readMinutes, onDelete }) {
  return (
    <div className="note-card-wrap">
      {onDelete && (
        <button
          className="note-card-delete"
          onClick={(e) => { e.preventDefault(); onDelete(); }}
          title="삭제"
        >✕</button>
      )}
      <Link to={`/editor/${id}`} className="note-card">
        <div className="note-icon">📄</div>
        <span className="tag">{tag}</span>
        <h3>{title}</h3>
        <div className="meta">
          <span>{formatRelativeTime(updatedAt)}</span>
          {readMinutes && <span>📖 {formatDuration(readMinutes)}</span>}
        </div>
      </Link>
    </div>
  );
}
