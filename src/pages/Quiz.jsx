import { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import useFetch from '../hooks/useFetch';
import { generateQuiz, submitAnswer } from '../services/quiz';
import './Quiz.css';

export default function Quiz() {
  const { noteId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [result, setResult] = useState(null);

  const { data: quiz, loading, error, refetch } = useFetch(
    () => generateQuiz(noteId),
    [noteId],
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="quiz-container"><Loading message="퀴즈를 생성하는 중..." /></div>
      </AppLayout>
    );
  }

  if (error || !quiz?.questions?.length) {
    return (
      <AppLayout>
        <div className="quiz-container">
          <ErrorMessage message="퀴즈를 불러오지 못했어요." onRetry={refetch} />
        </div>
      </AppLayout>
    );
  }

  const totalCount = quiz.questions.length;
  const question = quiz.questions[currentIndex];

  const handleChoice = async (idx) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    try {
      const res = await submitAnswer(quiz.id, question.id, idx);
      setResult(res);
    } catch {
      setResult({ correct: false, explanation: '정답 확인에 실패했어요.' });
    }
  };

  const handleNext = () => {
    if (currentIndex >= totalCount - 1) return;
    setCurrentIndex((i) => i + 1);
    setSelectedIdx(null);
    setResult(null);
  };

  const handlePrev = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((i) => i - 1);
    setSelectedIdx(null);
    setResult(null);
  };

  const progressPct = ((currentIndex + 1) / totalCount) * 100;

  return (
    <AppLayout>
      <div className="quiz-container">
        <div className="page-title">AI 퀴즈</div>
        <div className="page-sub">노트 기반 자동 생성 문제</div>

        <div className="progress">
          <div style={{ width: `${progressPct}%` }} />
        </div>
        <div className="progress-meta">
          <span>{currentIndex + 1} / {totalCount} 문제</span>
          <span>⏱ 02:34</span>
        </div>

        <div className="q-card">
          <span className="q-tag">{question.tag}</span>
          <div className="q-text">{question.question}</div>
          {question.choices.map((choice, idx) => {
            const isSelected = selectedIdx === idx;
            const isCorrect = result && idx === question.answerIndex;
            const isWrong = result && isSelected && !result.correct;
            const classes = ['choice'];
            if (isSelected) classes.push('selected');
            if (isCorrect) classes.push('correct');
            if (isWrong) classes.push('wrong');
            return (
              <div
                key={idx}
                className={classes.join(' ')}
                onClick={() => handleChoice(idx)}
                style={{ cursor: selectedIdx === null ? 'pointer' : 'default' }}
              >
                <div className="idx">{idx + 1}</div>
                <div>{choice}</div>
              </div>
            );
          })}
        </div>

        {result && (
          <div className="feedback">
            <h4>{result.correct ? '✅ 정답입니다!' : '❌ 오답입니다.'}</h4>
            <p>{result.explanation}</p>
          </div>
        )}

        <div className="q-actions">
          <button
            className="btn btn-ghost"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >← 이전 문제</button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={currentIndex >= totalCount - 1}
          >다음 문제 →</button>
        </div>
      </div>
    </AppLayout>
  );
}
