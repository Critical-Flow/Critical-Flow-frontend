export default function FolderItem({ icon, name, count, active = false, onClick }) {
  return (
    <div
      className={`folder-item${active ? ' active' : ''}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      <span>{icon ? `${icon} ${name}` : name}</span>
      {count != null && <span className="folder-count">{count}</span>}
    </div>
  );
}
