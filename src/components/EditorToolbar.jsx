import {
  toggleStrongCommand,
  toggleEmphasisCommand,
  wrapInHeadingCommand,
  wrapInBlockquoteCommand,
  wrapInBulletListCommand,
  wrapInOrderedListCommand,
  toggleLinkCommand,
  insertImageCommand,
  toggleInlineCodeCommand,
  createCodeBlockCommand,
} from '@milkdown/preset-commonmark';
import { Quote, ListChecks, Link, Image } from 'lucide-react';

export default function EditorToolbar({ onCommand }) {
  const cmd = (command, payload) => onCommand?.(command, payload);

  return (
    <div className="toolbar">
      <button title="굵게" onClick={() => cmd(toggleStrongCommand)}><b>B</b></button>
      <button title="기울임" onClick={() => cmd(toggleEmphasisCommand)}><i>I</i></button>
      <button title="취소선" disabled><s>S</s></button>
      <span className="div" />
      <button title="제목 1" onClick={() => cmd(wrapInHeadingCommand, 1)}>H1</button>
      <button title="제목 2" onClick={() => cmd(wrapInHeadingCommand, 2)}>H2</button>
      <button title="인용" onClick={() => cmd(wrapInBlockquoteCommand)}><Quote size={16} aria-hidden="true" /></button>
      <span className="div" />
      <button title="목록" onClick={() => cmd(wrapInBulletListCommand)}>• 목록</button>
      <button title="번호 목록" onClick={() => cmd(wrapInOrderedListCommand)}>1.</button>
      <button title="체크박스" disabled><ListChecks size={16} aria-hidden="true" /></button>
      <span className="div" />
      <button title="링크" onClick={() => cmd(toggleLinkCommand)}><Link size={16} aria-hidden="true" /></button>
      <button title="이미지" onClick={() => cmd(insertImageCommand)}><Image size={16} aria-hidden="true" /></button>
      <button title="인라인 코드" onClick={() => cmd(toggleInlineCodeCommand)}>{'< >'}</button>
      <button title="코드 블록" onClick={() => cmd(createCodeBlockCommand)}>{'{ }'}</button>
    </div>
  );
}
