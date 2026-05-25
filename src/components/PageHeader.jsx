export default function PageHeader({ title, sub }) {
  return (
    <>
      <div className="page-title">{title}</div>
      {sub && <div className="page-sub">{sub}</div>}
    </>
  );
}
