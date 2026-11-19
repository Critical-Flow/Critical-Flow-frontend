// AICE 마스코트 — 기본 도형(원·타원·삼각형·선)만으로 조합한 미니멀 딱따구리
// 사용법: <Mascot expression="drowsy" size={96} />
// expression: 'default' | 'focus' | 'drowsy' | 'question'

const COLOR = {
  body: 'var(--color-teal-600, #3EA990)',
  belly: 'var(--color-teal-100, #D6F5EA)',
  dark: '#1F6F5F', 
  eye: '#1a3d32',
  beak: '#F2B84B', 
};

//표정
const EXPRESSIONS = {
  default: { label: '기본', tilt: 0 },
  focus: { label: '집중 중', tilt: 0 },
  drowsy: { label: '졸음 감지', tilt: 10 },
  question: { label: '튜터 질문', tilt: -14 },
};

function Eye({ expression }) {
  const stroke = { fill: 'none', stroke: COLOR.eye, strokeWidth: 2.5, strokeLinecap: 'round' };
  switch (expression) {
    case 'focus':
      return <path d="M88 70 Q94 63 100 70" {...stroke} />; // 반달 눈
    case 'drowsy':
      return <path d="M88 68 L100 68" {...stroke} />; // 일자 눈
    default:
      return <circle cx="94" cy="68" r="4.5" fill={COLOR.eye} />; // 점 눈
  }
}

export default function Mascot({ expression = 'default', size = 96, className }) {
  const { label, tilt } = EXPRESSIONS[expression] ?? EXPRESSIONS.default;

  return (
    <svg
      viewBox="0 0 160 160"
      width={size}
      height={size}
      role="img"
      aria-label={`AICE 마스코트: ${label}`}
      className={className}
    >
      <g transform={`rotate(${tilt} 80 80)`}>
        {/* 딱따구리 */}
        <polygon points="38,90 18,104 40,104" fill={COLOR.dark} />
        <polygon points="70,38 54,22 56,42" fill={COLOR.dark} />

        {/* 몸통 */}
        <circle cx="80" cy="80" r="44" fill={COLOR.body} />
        <ellipse cx="74" cy="94" rx="22" ry="18" fill={COLOR.belly} />

        {/* 부리: 코드 꺾쇠 '>' 모양 */}
        <polygon points="118,70 142,78 118,86" fill={COLOR.beak} />

        <Eye expression={expression} />

        {/* 졸음: 부리로 톡톡 두드리는 효과선 */}
        {expression === 'drowsy' && (
          <path
            d="M147 73 L153 68 M148 84 L155 86"
            fill="none"
            stroke={COLOR.body}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}
      </g>

      {/* 질문: 물음표 */}
      {expression === 'question' && (
        <text x="128" y="34" fontSize="22" fontWeight="700" fill={COLOR.dark}>
          ?
        </text>
      )}
    </svg>
  );
}

// 미리보기
export function MascotPreview() {
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
      {Object.entries(EXPRESSIONS).map(([key, { label }]) => (
        <figure key={key} style={{ margin: 0, textAlign: 'center' }}>
          <Mascot expression={key} size={120} />
          <figcaption>{label}</figcaption>
        </figure>
      ))}
    </div>
  );
}
