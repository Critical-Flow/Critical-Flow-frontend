import AppLayout from '../components/AppLayout';
import './Quiz.css';

export default function Quiz() {
  return (
    <AppLayout>
      <div className="quiz-container">
        <div className="page-title">AI 퀴즈</div>
        <div className="page-sub">노트 「DFS와 BFS 정리」 기반 자동 생성 문제</div>

        <div className="progress">
          <div />
        </div>
        <div className="progress-meta">
          <span>4 / 10 문제</span>
          <span>⏱ 02:34</span>
        </div>

        <div className="q-card">
          <span className="q-tag">개념 이해</span>
          <div className="q-text">Q4. 다음 중 BFS(너비 우선 탐색)에 대한 설명으로 <u>옳은 것</u>은?</div>
          <div className="choice">
            <div className="idx">1</div>
            <div>스택을 이용해 구현하며, 가장 최근 방문한 노드부터 탐색한다.</div>
          </div>
          <div className="choice selected correct">
            <div className="idx">2</div>
            <div>큐를 이용해 구현하며, 간선 가중치가 동일할 때 최단 경로를 보장한다.</div>
          </div>
          <div className="choice">
            <div className="idx">3</div>
            <div>음수 가중치 그래프에서도 항상 최단 경로를 찾을 수 있다.</div>
          </div>
          <div className="choice">
            <div className="idx">4</div>
            <div>시간복잡도는 항상 O(V²)이다.</div>
          </div>
        </div>

        <div className="feedback">
          <h4>✅ 정답입니다!</h4>
          <p>BFS는 큐(FIFO)를 사용하여 시작 노드로부터 가까운 노드부터 차례로 탐색합니다.
            모든 간선의 가중치가 동일한 경우 최단 경로를 보장하지만, 음수 가중치가 포함된 그래프에서는
            다익스트라나 벨만-포드 알고리즘을 사용해야 합니다.</p>
        </div>

        <div className="q-actions">
          <button className="btn btn-ghost">← 이전 문제</button>
          <button className="btn btn-primary">다음 문제 →</button>
        </div>
      </div>
    </AppLayout>
  );
}
