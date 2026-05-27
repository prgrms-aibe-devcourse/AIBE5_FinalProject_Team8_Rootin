// 테스트 환경 동작 확인용 샘플 테스트
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('테스트 환경', () => {
  it('vitest + testing-library 정상 동작', () => {
    render(<div>Rootin 테스트 환경</div>);
    expect(screen.getByText('Rootin 테스트 환경')).toBeInTheDocument();
  });
});
