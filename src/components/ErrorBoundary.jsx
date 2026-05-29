import { Component } from 'react';
import ErrorMessage from './ErrorMessage';
import './ErrorBoundary.css';

// 하위 트리에서 발생한 렌더링 에러를 포착해 앱 전체가 흰 화면이 되는 것을 막는다.
// 에러 바운더리는 React에서 클래스 컴포넌트로만 구현할 수 있다.
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 실제 서비스에서는 외부 로깅 서비스(예: Sentry)로 전송한다.
    console.error('ErrorBoundary가 렌더링 에러를 포착했습니다:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <ErrorMessage
            message="페이지를 표시하는 중 문제가 발생했습니다."
            onRetry={this.handleReset}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
