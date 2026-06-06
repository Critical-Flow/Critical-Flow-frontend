import { useState, useEffect } from 'react';
import './EditFolderModal.css';

export default function EditFolderModal({ folder, onSave, onClose }) {
  const [title, setTitle] = useState(folder?.title ?? '');
  const [description, setDescription] = useState(folder?.description ?? '');
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    setTitle(folder?.title ?? '');
    setDescription(folder?.description ?? '');
    setTitleError('');
  }, [folder]);

  const handleSave = () => {
    if (!title.trim()) return;
    if (title.trim() === '전체') { setTitleError('"전체"는 사용할 수 없는 이름이에요.'); return; }
    onSave({ title, description });
  };

  return (
    <div className="mpm-overlay" onClick={onClose}>
      <div className="efm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mpm-header">
          <span>폴더 수정</span>
          <button className="mpm-close" onClick={onClose}>✕</button>
        </div>
        <div className="efm-body">
          <div className="efm-field">
            <label className="efm-label">제목</label>
            <input
              type="text"
              className={`efm-input${titleError ? ' error' : ''}`}
              value={title}
              onChange={(e) => { setTitle(e.target.value); setTitleError(''); }}
              placeholder="폴더 제목을 입력하세요"
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
              autoFocus
            />
            {titleError && <p className="form-error">{titleError}</p>}
          </div>
          <div className="efm-field">
            <label className="efm-label">학습 주제</label>
            <input
              type="text"
              className="efm-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="학습 주제를 입력하세요"
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
            />
          </div>
          <div className="efm-actions">
            <button className="efm-btn-cancel" onClick={onClose}>취소</button>
            <button className="efm-btn-save" onClick={handleSave}>저장</button>
          </div>
        </div>
      </div>
    </div>
  );
}
