import { Link } from 'react-router-dom';
import { X, FileText, Clock } from 'lucide-react';
import { formatRelativeTime, formatDuration } from '../utils/date';

export default function NoteCard({ id, title, tag, updatedAt, readMinutes, onDelete }) {
  return (
    <div className="note-card-wrap">
      {onDelete && (
        <button
          className="note-card-delete"
          onClick={(e) => { e.preventDefault(); onDelete(); }}
          title="삭제"
          aria-label="삭제"
        ><X size={14} aria-hidden="true" /></button>
      )}
      <Link to={`/editor/${id}`} className="note-card">
        <div className="note-icon"><FileText size={20} aria-hidden="true" /></div>
        <span className="tag">{tag}</span>
        <h3>{title}</h3>
        <div className="meta">
          <span>{formatRelativeTime(updatedAt)}</span>
          {readMinutes && (
            <span className="meta-read"><Clock size={12} aria-hidden="true" />{formatDuration(readMinutes)}</span>
          )}
        </div>
      </Link>
    </div>
  );
}
