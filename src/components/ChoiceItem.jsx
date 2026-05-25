export default function ChoiceItem({ index, text, isSelected, isCorrect, isWrong, onClick }) {
  const classes = ['choice'];
  if (isSelected) classes.push('selected');
  if (isCorrect) classes.push('correct');
  if (isWrong) classes.push('wrong');

  return (
    <div
      className={classes.join(' ')}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="idx">{index + 1}</div>
      <div>{text}</div>
    </div>
  );
}
