// 사용법: 배경을 깔 영역에 position: relative를 주고 그 안에 <ForestBackground /> 를 넣음
//   <section style={{ position: 'relative' }}>
//     <ForestBackground height={160} />
//     ...내용...
//   </section>

const COLOR = {
  back: 'var(--color-teal-100, #D6F5EA)', 
  front: 'var(--color-teal-200, #A8E0CD)', 
};

// 나무 2종
function Pine({ x, s, fill }) {
  const trunkH = 14 * s;
  return (
    <g fill={fill}>
      <rect x={x - 4 * s} y={200 - trunkH} width={8 * s} height={trunkH} />
      <polygon points={`${x},${200 - trunkH - 70 * s} ${x - 26 * s},${200 - trunkH} ${x + 26 * s},${200 - trunkH}`} />
    </g>
  );
}

function RoundTree({ x, s, fill }) {
  const trunkH = 30 * s;
  return (
    <g fill={fill}>
      <rect x={x - 4 * s} y={200 - trunkH} width={8 * s} height={trunkH} />
      <circle cx={x} cy={200 - trunkH - 22 * s} r={26 * s} />
    </g>
  );
}

const BACK_ROW = [
  ['pine', 40, 0.8], ['round', 130, 0.75], ['pine', 230, 0.9], ['round', 340, 0.6],
  ['pine', 470, 0.55], ['round', 600, 0.5], ['pine', 730, 0.55], ['round', 860, 0.6],
  ['pine', 970, 0.9], ['round', 1070, 0.75], ['pine', 1160, 0.8],
];
const FRONT_ROW = [
  ['round', 70, 1.15], ['pine', 175, 1.25], ['pine', 1030, 1.2], ['round', 1135, 1.1],
];

function Tree({ type, ...props }) {
  return type === 'pine' ? <Pine {...props} /> : <RoundTree {...props} />;
}

export default function ForestBackground({ height = 160, className }) {
  return (
    <svg
      viewBox="0 0 1200 200"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true" 
      className={className}
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height,
        pointerEvents: 'none', 
        zIndex: 0,
      }}
    >
      {BACK_ROW.map(([type, x, s]) => (
        <Tree key={`b${x}`} type={type} x={x} s={s} fill={COLOR.back} />
      ))}
      {FRONT_ROW.map(([type, x, s]) => (
        <Tree key={`f${x}`} type={type} x={x} s={s} fill={COLOR.front} />
      ))}
      <rect x="0" y="194" width="1200" height="6" fill={COLOR.front} />
    </svg>
  );
}
