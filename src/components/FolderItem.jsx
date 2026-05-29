import { useState, useRef, useEffect } from 'react';

export default function FolderItem({ icon, name, active = false, onClick, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => { if (!menuRef.current?.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  return (
    <div
      className={`folder-item${active ? ' active' : ''}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      <span>{icon ? `${icon} ${name}` : name}</span>
      {(onEdit || onDelete) && (
        <div ref={menuRef} className="folder-menu" onClick={(e) => e.stopPropagation()}>
          <button className="folder-menu-btn" onClick={() => setMenuOpen((v) => !v)}>⋯</button>
          {menuOpen && (
            <div className="folder-dropdown">
              {onEdit && <button onClick={() => { onEdit(); setMenuOpen(false); }}>수정</button>}
              {onDelete && <button onClick={() => { onDelete(); setMenuOpen(false); }}>삭제</button>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
