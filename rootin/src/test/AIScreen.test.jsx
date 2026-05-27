import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AIScreen } from '../screens-rest.jsx';
import { POTS } from '../data.jsx';

// AIScreen에서 사용하지 않지만 같은 파일에서 import되는 복잡한 컴포넌트 mock
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

describe('AIScreen', () => {

  describe('화분 선택', () => {
    it('기본으로 첫 번째 화분이 선택되어 있다', () => {
      render(<AIScreen />);
      const defaultPot = POTS[0];
      expect(screen.getAllByText(defaultPot.name).length).toBeGreaterThan(0);
    });

    it('다른 화분을 클릭하면 해당 화분이 선택된다', () => {
      render(<AIScreen />);
      const englishPot = screen.getByRole('button', { name: /영어/i });
      fireEvent.click(englishPot);
      // 영어 화분 이름이 화면에 표시되는지 확인
      expect(screen.getByText('영어')).toBeInTheDocument();
    });

    it('화분을 변경해도 AI생성 버튼을 다시 누르기 전까지 생성 결과가 유지된다', async () => {
      vi.useFakeTimers();
      render(<AIScreen />);

      // 생성 버튼 클릭으로 결과 표시
      const generateBtn = screen.getByRole('button', { name: /만들기/i });
      fireEvent.click(generateBtn);
      await act(() => vi.runAllTimersAsync());

      // 결과 저장 버튼이 표시된 상태에서 다른 화분 선택
      const readingPot = screen.getByRole('button', { name: /독서/i });
      fireEvent.click(readingPot);

      // 결과가 초기화되지 않고 유지되어야 함 (저장 버튼이 여전히 표시됨)
      expect(screen.getByRole('button', { name: '결과 저장' })).toBeInTheDocument();
      vi.useRealTimers();
    });
  });

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

  describe('생성 전/후 화면', () => {
    it('생성 전에는 빈 화면 안내 문구가 표시된다', () => {
      render(<AIScreen />);
      expect(screen.getByText('화분을 선택하고 생성 버튼을 눌러주세요')).toBeInTheDocument();
    });

    it('생성 버튼 클릭 후 로딩 메시지가 표시된다', async () => {
      vi.useFakeTimers();
      render(<AIScreen />);
      const generateBtn = screen.getByRole('button', { name: /만들기/i });
      fireEvent.click(generateBtn);
      expect(screen.getByText('AI가 TIL을 분석하고 있어요...')).toBeInTheDocument();
      vi.useRealTimers();
    });

    it('생성 완료 후 결과가 표시된다', async () => {
      vi.useFakeTimers();
      render(<AIScreen />);
      const generateBtn = screen.getByRole('button', { name: /만들기/i });
      fireEvent.click(generateBtn);
      await act(() => vi.runAllTimersAsync());
      // 결과 저장 버튼이 나타나면 생성 완료 상태
      expect(screen.getByRole('button', { name: '결과 저장' })).toBeInTheDocument();
      vi.useRealTimers();
    });

    it('모드를 변경해도 AI생성 버튼을 다시 누르기 전까지 생성 결과가 유지된다', async () => {
      vi.useFakeTimers();
      render(<AIScreen />);
      const generateBtn = screen.getByRole('button', { name: /만들기/i });
      fireEvent.click(generateBtn);
      await act(() => vi.runAllTimersAsync());

      const summaryBtn = screen.getByRole('button', { name: /TIL 요약/i });
      fireEvent.click(summaryBtn);

      // 결과가 초기화되지 않고 유지되어야 함 (저장 버튼이 여전히 표시됨)
      expect(screen.getByRole('button', { name: '결과 저장' })).toBeInTheDocument();
      vi.useRealTimers();
    });
  });

  describe('결과 저장 및 보관함', () => {
    it('보관함 섹션이 표시된다', () => {
      render(<AIScreen />);
      expect(screen.getByText('저장된 AI 결과')).toBeInTheDocument();
    });

    it('결과 저장 버튼을 누르면 보관함에 항목이 추가된다', async () => {
      vi.useFakeTimers();
      render(<AIScreen />);

      const generateBtn = screen.getByRole('button', { name: /만들기/i });
      fireEvent.click(generateBtn);
      await act(() => vi.runAllTimersAsync());

      const saveBtn = screen.getByRole('button', { name: '결과 저장' });
      fireEvent.click(saveBtn);

      // 저장 완료 피드백 확인
      expect(screen.getByRole('button', { name: /저장됨/ })).toBeInTheDocument();
      vi.useRealTimers();
    });

    it('보관함 항목을 클릭하면 해당 결과가 우측에 표시된다', async () => {
      vi.useFakeTimers();
      render(<AIScreen />);

      // 1. 생성 → 저장
      const generateBtn = screen.getByRole('button', { name: /만들기/i });
      fireEvent.click(generateBtn);
      await act(() => vi.runAllTimersAsync());

      const saveBtn = screen.getByRole('button', { name: '결과 저장' });
      fireEvent.click(saveBtn);

      // 2. 저장 완료 피드백 대기 후 다시 생성해 결과 지우기
      //    → 화분 변경으로는 지워지지 않으니 다시 생성 버튼 클릭
      const generateBtn2 = screen.getByRole('button', { name: /만들기/i });
      fireEvent.click(generateBtn2);
      await act(() => vi.runAllTimersAsync());

      // 3. 보관함에 추가된 항목 클릭
      const savedPot = POTS[0];
      const savedItem = screen.getByText(new RegExp(`${savedPot.name} 화분 복습 문제`, 'i'));
      fireEvent.click(savedItem);

      // 결과 저장 버튼이 표시되면 결과가 로드된 것
      expect(screen.getByRole('button', { name: '결과 저장' })).toBeInTheDocument();
      vi.useRealTimers();
    });
  });
});
