import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AIScreen } from '../screens-rest.jsx';
import { POTS } from '../data.jsx';

// AIScreen과 같은 파일에서 import되는 복잡한 컴포넌트 mock
vi.mock('../plants.jsx', () => ({
  Plant: () => null,
  STAGE_META: {
    seed: { label: '씨앗' }, sprout: { label: '새싹' },
    leaf: { label: '잎' }, bloom: { label: '개화' }, full: { label: '만개' },
  },
}));

vi.mock('../pixel-plants.jsx', () => ({
  PixelPlant: () => null,
  PIXEL_SPECIES: {},
}));

// API 모듈 전체 mock
vi.mock('../api/ai.js', () => ({
  generateSummary: vi.fn(),
  generateQuiz: vi.fn(),
  saveResult: vi.fn(),
  fetchResults: vi.fn(),
  deleteResult: vi.fn(),
}));

import {
  generateSummary,
  generateQuiz,
  saveResult,
  fetchResults,
  deleteResult,
} from '../api/ai.js';

// 기본 mock 응답값 상수
const MOCK_QUIZ_RESPONSE = {
  quizzes: [
    { question: 'CSS Container Queries에서 필수 속성은?', answer: 'container-type', hint: '컨테이너 선언 관련' },
    { question: 'React에서 클라이언트 컴포넌트를 선언하는 지시어는?', answer: '"use client"', hint: null },
  ],
  usedPoint: 50,
  remainPoint: 1190,
};

const MOCK_SUMMARY_RESPONSE = {
  summary: '이번 주의 핵심은 Container Queries와 RSC입니다.',
  keyPoints: ['Container Queries로 컴포넌트 단위 반응형 가능', 'use client 지시어로 클라이언트 경계 명확화'],
  usedPoint: 50,
  remainPoint: 1190,
};

const MOCK_SAVE_RESPONSE = {
  resultId: 'result-001',
  createdAt: '2026-05-28T10:00:00Z',
};

const MOCK_FETCH_RESULTS_RESPONSE = {
  results: [
    {
      resultId: 'result-existing-1',
      type: 'QUIZ',
      potId: 'coding',
      content: MOCK_QUIZ_RESPONSE,
      createdAt: '2026-05-25T10:00:00Z',
    },
    {
      resultId: 'result-existing-2',
      type: 'SUMMARY',
      potId: 'english',
      content: MOCK_SUMMARY_RESPONSE,
      createdAt: '2026-05-24T10:00:00Z',
    },
  ],
};

beforeEach(() => {
  fetchResults.mockResolvedValue(MOCK_FETCH_RESULTS_RESPONSE);
  generateQuiz.mockResolvedValue(MOCK_QUIZ_RESPONSE);
  generateSummary.mockResolvedValue(MOCK_SUMMARY_RESPONSE);
  saveResult.mockResolvedValue(MOCK_SAVE_RESPONSE);
  deleteResult.mockResolvedValue({});
});

afterEach(() => {
  vi.clearAllMocks();
});

// ──────────────────────────────────────────────
// 화분 선택
// ──────────────────────────────────────────────
describe('화분 선택', () => {
  it('기본으로 첫 번째 화분이 선택되어 있다', async () => {
    render(<AIScreen />);
    const defaultPot = POTS[0];
    await waitFor(() => {
      expect(screen.getAllByText(defaultPot.name).length).toBeGreaterThan(0);
    });
  });

  it('다른 화분을 클릭하면 해당 화분이 선택된다', async () => {
    render(<AIScreen />);
    const englishPot = screen.getByRole('button', { name: /영어/i });
    fireEvent.click(englishPot);
    expect(screen.getByText('영어')).toBeInTheDocument();
  });

  it('화분을 변경해도 AI생성 버튼을 다시 누르기 전까지 생성 결과가 유지된다', async () => {
    render(<AIScreen />);

    const generateBtn = screen.getByRole('button', { name: /만들기/i });
    fireEvent.click(generateBtn);
    await waitFor(() => expect(screen.getByRole('button', { name: '결과 저장' })).toBeInTheDocument());

    const readingPot = screen.getByRole('button', { name: /독서/i });
    fireEvent.click(readingPot);

    expect(screen.getByRole('button', { name: '결과 저장' })).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────
// 복습 문제 수량 스텝퍼
// ──────────────────────────────────────────────
describe('복습 문제 수량 스텝퍼', () => {
  it('기본 수량은 5개다', () => {
    render(<AIScreen />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('+ 버튼을 누르면 수량이 증가한다', () => {
    render(<AIScreen />);
    const plusBtn = screen.getByRole('button', { name: '+' });
    fireEvent.click(plusBtn);
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('- 버튼을 누르면 수량이 감소한다', () => {
    render(<AIScreen />);
    const minusBtn = screen.getByRole('button', { name: '−' });
    fireEvent.click(minusBtn);
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('최솟값은 1이다', () => {
    render(<AIScreen />);
    const minusBtn = screen.getByRole('button', { name: '−' });
    for (let i = 0; i < 10; i++) fireEvent.click(minusBtn);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('최댓값은 10이다', () => {
    render(<AIScreen />);
    const plusBtn = screen.getByRole('button', { name: '+' });
    for (let i = 0; i < 10; i++) fireEvent.click(plusBtn);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('summary 모드에서는 수량 스텝퍼가 표시되지 않는다', () => {
    render(<AIScreen />);
    const summaryBtn = screen.getByRole('button', { name: /TIL 요약/i });
    fireEvent.click(summaryBtn);
    expect(screen.queryByText('문제 수량')).not.toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────
// 생성 전/후 화면
// ──────────────────────────────────────────────
describe('생성 전/후 화면', () => {
  it('생성 전에는 빈 화면 안내 문구가 표시된다', () => {
    render(<AIScreen />);
    expect(screen.getByText('화분을 선택하고 생성 버튼을 눌러주세요')).toBeInTheDocument();
  });

  it('생성 버튼 클릭 후 로딩 메시지가 표시된다', async () => {
    generateQuiz.mockReturnValue(new Promise(() => {})); // 영원히 pending
    render(<AIScreen />);
    const generateBtn = screen.getByRole('button', { name: /만들기/i });
    fireEvent.click(generateBtn);
    expect(screen.getByText('AI가 TIL을 분석하고 있어요...')).toBeInTheDocument();
  });

  it('생성 완료 후 퀴즈 결과가 표시된다', async () => {
    render(<AIScreen />);
    const generateBtn = screen.getByRole('button', { name: /만들기/i });
    fireEvent.click(generateBtn);
    await waitFor(() => expect(screen.getByRole('button', { name: '결과 저장' })).toBeInTheDocument());

    expect(screen.getByText('CSS Container Queries에서 필수 속성은?')).toBeInTheDocument();
  });

  it('summary 모드 생성 완료 후 요약 결과가 표시된다', async () => {
    render(<AIScreen />);
    const summaryBtn = screen.getByRole('button', { name: /TIL 요약/i });
    fireEvent.click(summaryBtn);

    const generateBtn = screen.getByRole('button', { name: /요약 생성하기/i });
    fireEvent.click(generateBtn);

    await waitFor(() =>
      expect(screen.getByText('이번 주의 핵심은 Container Queries와 RSC입니다.')).toBeInTheDocument()
    );
  });

  it('모드를 변경해도 AI생성 버튼을 다시 누르기 전까지 생성 결과가 유지된다', async () => {
    render(<AIScreen />);
    const generateBtn = screen.getByRole('button', { name: /만들기/i });
    fireEvent.click(generateBtn);
    await waitFor(() => expect(screen.getByRole('button', { name: '결과 저장' })).toBeInTheDocument());

    const summaryBtn = screen.getByRole('button', { name: /TIL 요약/i });
    fireEvent.click(summaryBtn);

    expect(screen.getByRole('button', { name: '결과 저장' })).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────
// API 호출 검증
// ──────────────────────────────────────────────
describe('API 호출', () => {
  it('퀴즈 생성 시 generateQuiz에 potId와 count가 전달된다', async () => {
    render(<AIScreen />);
    const generateBtn = screen.getByRole('button', { name: /만들기/i });
    fireEvent.click(generateBtn);

    await waitFor(() => expect(generateQuiz).toHaveBeenCalledWith('coding', 5));
  });

  it('요약 생성 시 generateSummary에 potId가 전달된다', async () => {
    render(<AIScreen />);
    const summaryBtn = screen.getByRole('button', { name: /TIL 요약/i });
    fireEvent.click(summaryBtn);

    const generateBtn = screen.getByRole('button', { name: /요약 생성하기/i });
    fireEvent.click(generateBtn);

    await waitFor(() => expect(generateSummary).toHaveBeenCalledWith('coding'));
  });

  it('생성 완료 후 포인트가 remainPoint로 갱신된다', async () => {
    render(<AIScreen />);
    const generateBtn = screen.getByRole('button', { name: /만들기/i });
    fireEvent.click(generateBtn);

    await waitFor(() => expect(screen.getByText(/1190P/)).toBeInTheDocument());
  });

  it('다시 생성 버튼 클릭 시 동일한 potId와 count로 재호출된다', async () => {
    render(<AIScreen />);
    const generateBtn = screen.getByRole('button', { name: /만들기/i });
    fireEvent.click(generateBtn);
    await waitFor(() => expect(screen.getByRole('button', { name: '다시 생성' })).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: '다시 생성' }));

    await waitFor(() => expect(generateQuiz).toHaveBeenCalledTimes(2));
    expect(generateQuiz).toHaveBeenNthCalledWith(2, 'coding', 5);
  });
});

// ──────────────────────────────────────────────
// 에러 처리
// ──────────────────────────────────────────────
describe('에러 처리', () => {
  it('402 응답 시 포인트 부족 메시지가 표시된다', async () => {
    const err = new Error('HTTP 402');
    err.status = 402;
    generateQuiz.mockRejectedValue(err);

    render(<AIScreen />);
    const generateBtn = screen.getByRole('button', { name: /만들기/i });
    fireEvent.click(generateBtn);

    await waitFor(() =>
      expect(screen.getByText('포인트가 부족해요. 활동으로 포인트를 적립해 보세요.')).toBeInTheDocument()
    );
  });

  it('일반 네트워크 에러 시 실패 메시지가 표시된다', async () => {
    generateQuiz.mockRejectedValue(new Error('Network Error'));

    render(<AIScreen />);
    const generateBtn = screen.getByRole('button', { name: /만들기/i });
    fireEvent.click(generateBtn);

    await waitFor(() =>
      expect(screen.getByText('생성에 실패했어요. 잠시 후 다시 시도해 주세요.')).toBeInTheDocument()
    );
  });

  it('에러 발생 시 로딩 상태가 해제된다', async () => {
    generateQuiz.mockRejectedValue(new Error('fail'));

    render(<AIScreen />);
    const generateBtn = screen.getByRole('button', { name: /만들기/i });
    fireEvent.click(generateBtn);

    await waitFor(() =>
      expect(screen.queryByText('AI가 TIL을 분석하고 있어요...')).not.toBeInTheDocument()
    );
  });
});

// ──────────────────────────────────────────────
// 결과 저장 및 보관함
// ──────────────────────────────────────────────
describe('결과 저장 및 보관함', () => {
  it('페이지 진입 시 fetchResults API를 호출해 보관함을 로딩한다', async () => {
    render(<AIScreen />);
    await waitFor(() => expect(fetchResults).toHaveBeenCalledTimes(1));
  });

  it('보관함에 기존 저장 결과 목록이 표시된다', async () => {
    render(<AIScreen />);
    await waitFor(() => expect(screen.getByText(/코딩 화분 복습 문제/)).toBeInTheDocument());
  });

  it('결과 저장 버튼을 누르면 saveResult API가 호출된다', async () => {
    render(<AIScreen />);
    const generateBtn = screen.getByRole('button', { name: /만들기/i });
    fireEvent.click(generateBtn);
    await waitFor(() => expect(screen.getByRole('button', { name: '결과 저장' })).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: '결과 저장' }));

    await waitFor(() =>
      expect(saveResult).toHaveBeenCalledWith('QUIZ', 'coding', MOCK_QUIZ_RESPONSE)
    );
  });

  it('결과 저장 후 저장됨 피드백이 표시된다', async () => {
    render(<AIScreen />);
    const generateBtn = screen.getByRole('button', { name: /만들기/i });
    fireEvent.click(generateBtn);
    await waitFor(() => expect(screen.getByRole('button', { name: '결과 저장' })).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: '결과 저장' }));

    await waitFor(() => expect(screen.getByRole('button', { name: /저장됨/ })).toBeInTheDocument());
  });

  it('보관함 항목을 클릭하면 해당 결과가 우측에 표시된다', async () => {
    render(<AIScreen />);
    await waitFor(() => expect(screen.getByText(/코딩 화분 복습 문제/)).toBeInTheDocument());

    fireEvent.click(screen.getByText(/코딩 화분 복습 문제/));

    expect(screen.getByRole('button', { name: '결과 저장' })).toBeInTheDocument();
  });

  it('보관함 항목 삭제 버튼을 누르면 deleteResult API가 호출된다', async () => {
    render(<AIScreen />);
    await waitFor(() => expect(screen.getAllByRole('button', { name: '삭제' }).length).toBeGreaterThan(0));

    const deleteBtn = screen.getAllByRole('button', { name: '삭제' })[0];
    fireEvent.click(deleteBtn);

    await waitFor(() =>
      expect(deleteResult).toHaveBeenCalledWith('result-existing-1')
    );
  });

  it('삭제 후 보관함 목록에서 해당 항목이 제거된다', async () => {
    render(<AIScreen />);
    await waitFor(() => expect(screen.getByText(/코딩 화분 복습 문제/)).toBeInTheDocument());

    const deleteBtn = screen.getAllByRole('button', { name: '삭제' })[0];
    fireEvent.click(deleteBtn);

    await waitFor(() =>
      expect(screen.queryByText(/코딩 화분 복습 문제/)).not.toBeInTheDocument()
    );
  });

  it('결과 저장 실패 시 에러 메시지가 표시된다', async () => {
    saveResult.mockRejectedValue(new Error('Network Error'));

    render(<AIScreen />);
    const generateBtn = screen.getByRole('button', { name: /만들기/i });
    fireEvent.click(generateBtn);
    await waitFor(() => expect(screen.getByRole('button', { name: '결과 저장' })).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: '결과 저장' }));

    await waitFor(() =>
      expect(screen.getByText('저장에 실패했어요. 잠시 후 다시 시도해 주세요.')).toBeInTheDocument()
    );
  });

  it('보관함 항목 삭제 실패 시 에러 메시지가 표시된다', async () => {
    deleteResult.mockRejectedValue(new Error('Network Error'));

    render(<AIScreen />);
    await waitFor(() => expect(screen.getAllByRole('button', { name: '삭제' }).length).toBeGreaterThan(0));

    const deleteBtn = screen.getAllByRole('button', { name: '삭제' })[0];
    fireEvent.click(deleteBtn);

    await waitFor(() =>
      expect(screen.getByText('삭제에 실패했어요. 잠시 후 다시 시도해 주세요.')).toBeInTheDocument()
    );
  });

  it('fetchResults 실패 시 보관함은 빈 상태로 유지된다', async () => {
    fetchResults.mockRejectedValue(new Error('Network Error'));

    render(<AIScreen />);

    await waitFor(() =>
      expect(screen.getByText('저장된 결과지가 없습니다.')).toBeInTheDocument()
    );
  });
});
