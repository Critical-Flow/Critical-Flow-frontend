export default function KpiCard({ label, value, delta, trend = 'up' }) {
  return (
    <div className="kpi">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      <div className={`delta ${trend}`}>{delta}</div>
    </div>
  );
}
