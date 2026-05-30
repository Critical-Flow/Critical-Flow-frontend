const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

export function formatRelativeTime(value) {
  const target = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(target.getTime())) return '';

  const diff = Date.now() - target.getTime();

  if (diff < MINUTE) return '방금 전';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}분 전`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}시간 전`;
  if (diff < 2 * DAY) return '어제';
  if (diff < WEEK) return `${Math.floor(diff / DAY)}일 전`;
  if (diff < 4 * WEEK) return `${Math.floor(diff / WEEK)}주 전`;

  return target.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(value) {
  const target = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(target.getTime())) return '';
  const hh = String(target.getHours()).padStart(2, '0');
  const mm = String(target.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function formatDuration(minutes) {
  if (!Number.isFinite(minutes) || minutes < 0) return '';
  if (minutes < 60) return `${minutes}분`;

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}시간` : `${h}시간 ${m}분`;
}
