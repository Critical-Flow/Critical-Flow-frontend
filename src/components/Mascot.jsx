// 사용법: <Mascot expression="drowsy" size={96} />
// expression: 'default' | 'focus' | 'drowsy' | 'question' | 'absent'
// 애니메이션은 Mascot.css 가 .mascot--{expression} 클래스를 보고 적용
import './Mascot.css';

const COLOR = {
  body: 'var(--color-teal-600, #3EA990)',
  belly: 'var(--color-teal-100, #D6F5EA)',
  dark: '#1F6F5F',
  eye: '#1a3d32',
  beak: '#F2B84B',
};

// 표정. tilt 는 CSS 커스텀 속성 --tilt 로 전달되어 .m-tilt 에서 
const EXPRESSIONS = {
  default: { label: '기본', tilt: 0 },
  focus: { label: '집중 중', tilt: 0 },
  drowsy: { label: '졸음 감지', tilt: 10 },
  question: { label: '튜터 질문', tilt: -14 },
  absent: { label: '자리 이탈', tilt: 0 },
};

function Eye({ expression }) {
  const stroke = { fill: 'none', stroke: COLOR.eye, strokeWidth: 2.5, strokeLinecap: 'round' };
  switch (expression) {
    case 'focus':
      return <path className="m-eye" d="M88 70 Q94 63 100 70" {...stroke} />; // 반달 눈
    case 'drowsy':
    case 'absent':
      return <path className="m-eye" d="M88 68 L100 68" {...stroke} />; // 일자 눈
    default:
      return <circle className="m-eye" cx="94" cy="68" r="4.5" fill={COLOR.eye} />; // 점 눈
  }
}

export default function Mascot({ expression = 'default', size = 96, className = '' }) {
  const key = EXPRESSIONS[expression] ? expression : 'default';
  const { label, tilt } = EXPRESSIONS[key];

  return (
    <svg
      viewBox="0 0 160 160"
      width={size}
      height={size}
      role="img"
      aria-label={`AICE 마스코트: ${label}`}
      className={`mascot mascot--${key} ${className}`.trim()}
    >
      {/* 기울기 */}
      <g className="m-tilt" style={{ '--tilt': `${tilt}deg` }}>
        {/* 숨쉬기 / 끄덕임 */}
        <g className="m-bob">
          {/* 딱따구리 */}
          <polygon points="38,90 18,104 40,104" fill={COLOR.dark} />
          <polygon points="70,38 54,22 56,42" fill={COLOR.dark} />

          {/* 몸통 */}
          <circle cx="80" cy="80" r="44" fill={COLOR.body} />
          <ellipse cx="74" cy="94" rx="22" ry="18" fill={COLOR.belly} />

          {/* 부리 */}
          <polygon className="m-beak" points="118,70 142,78 118,86" fill={COLOR.beak} />

          <Eye expression={key} />

          {/* 졸음: 부리로 톡톡 두드리는 효과선 */}
          {key === 'drowsy' && (
            <path
              className="m-zzz"
              d="M147 73 L153 68 M148 84 L155 86"
              fill="none"
              stroke={COLOR.body}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}
        </g>
      </g>

      {/* 질문: 물음표 */}
      {key === 'question' && (
        <text className="m-mark" x="128" y="34" fontSize="22" fontWeight="700" fill={COLOR.dark}>
          ?
        </text>
      )}
    </svg>
  );
}

