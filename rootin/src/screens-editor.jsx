import { useState, useEffect } from 'react';
import { POTS, TEMPLATES } from './data.jsx';
import { Icon, Btn, SectionHeader, ProgressBar } from './ui.jsx';
import { Plant } from './plants.jsx';

// TIL 작성 에디터

function EditorScreen({ onNav }) {
  const [potId, setPotId] = useState('coding');
  const [title, setTitle] = useState('CSS Container Queries 처음 써본 날');
  const [body, setBody] = useState(
`오늘 알게 된 것
- @container 선언만 있으면 컴포넌트 단위로 반응형이 가능하다
- 컨테이너 박스에 \`container-type: inline-size\` 를 줘야 동작함
- 컴포넌트가 페이지가 아니라 "부모의 폭"에 반응하므로, 디자인 시스템과 잘 맞음

\`\`\`css
.card { container-type: inline-size; }
@container (min-width: 400px) {
  .card-content { display: grid; grid-template-columns: 1fr 1fr; }
}
\`\`\`

왜 중요한지
미디어쿼리만으로는 같은 컴포넌트가 다른 위치에 놓였을 때 동일하게 반응하지 못했다. 화면 너비가 아니라 "내가 놓인 컨테이너"에 반응하는 게 더 자연스럽다.

다음 액션
- Rootin의 카드 컴포넌트에 적용해보기
- 디자인 시스템 문서에 한 단락 추가`);
  const [tags, setTags] = useState(['css', 'frontend', 'container-queries']);
  const [tagInput, setTagInput] = useState('');
  const [savedAt, setSavedAt] = useState('방금 전');

  useEffect(() => {
    const t = setInterval(() => setSavedAt('방금 전'), 30000);
    return () => clearInterval(t);
  }, []);

  const chars = body.length;
  const xpGain = Math.min(120, 30 + Math.floor(chars / 50));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 0, minHeight: '100%', maxWidth: 1280, margin: '0 auto', width: '100%' }}>

      {/* Main editor */}
      <div style={{ padding: '32px 40px 40px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Pot selector + status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div className="eyebrow" style={{ marginRight: 6 }}>화분</div>
          {POTS.map(p => {
            const active = p.id === potId;
            return (
              <button key={p.id} onClick={() => setPotId(p.id)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px 6px 8px', borderRadius: 999,
                background: active ? 'var(--navy-700)' : '#fff',
                color: active ? '#fff' : 'var(--ink-2)',
                border: '0.5px solid ' + (active ? 'var(--navy-700)' : 'var(--line-2)'),
                fontSize: 12.5, fontWeight: 500,
              }}>
                <span style={{ fontSize: 14 }}>{p.emoji}</span>{p.name}
                {active && <span style={{ fontSize: 10, opacity: 0.65 }}>· TIL {p.tilCount}</span>}
              </button>
            );
          })}
          <button style={{ padding: '6px 12px', borderRadius: 999, border: '0.5px dashed var(--line-strong)', color: 'var(--ink-3)', fontSize: 12.5, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            {Icon.plus} 새 화분
          </button>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--ink-3)' }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--green-500)' }} />
            임시저장됨 · <span style={{ fontFamily: 'var(--font-mono)' }}>{savedAt}</span>
          </div>
        </div>

        {/* Title */}
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목을 입력하세요" style={{
          fontFamily: 'var(--font-body)', fontSize: 30, fontWeight: 700,
          color: 'var(--ink-1)', letterSpacing: '-0.02em',
          border: 'none', outline: 'none', background: 'transparent',
          padding: '6px 0',
          width: '100%',
        }} />

        {/* Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {tags.map(t => (
            <span key={t} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 999,
              background: 'var(--green-50)', color: 'var(--green-700)',
              fontSize: 11.5, fontFamily: 'var(--font-mono)',
              border: '0.5px solid var(--green-100)',
            }}>
              #{t}
              <button onClick={() => setTags(tags.filter(x => x !== t))} style={{ color: 'var(--ink-3)', display: 'inline-flex' }}>{Icon.close}</button>
            </span>
          ))}
          <input value={tagInput} onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && tagInput.trim()) { setTags([...tags, tagInput.trim()]); setTagInput(''); } }}
            placeholder="# 태그 입력 후 Enter" style={{
              border: 'none', outline: 'none', background: 'transparent',
              fontSize: 12, color: 'var(--ink-2)', padding: '4px 6px',
              fontFamily: 'var(--font-mono)',
              minWidth: 140,
          }} />
        </div>

        {/* Editor toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '6px 8px',
          background: 'var(--paper)',
          borderRadius: 10,
          border: '0.5px solid var(--line-1)',
          width: 'fit-content',
        }}>
          {[
            { key: 'B', style: { fontWeight: 700 } },
            { key: 'I', style: { fontStyle: 'italic' } },
            { key: 'U', style: { textDecoration: 'underline' } },
          ].map(b => (
            <button key={b.key} style={{ width: 30, height: 28, borderRadius: 6, fontSize: 12, color: 'var(--ink-2)', ...b.style }}>{b.key}</button>
          ))}
          <div style={{ width: 1, height: 18, background: 'var(--line-1)', margin: '0 4px' }} />
          {['H1','H2','¶'].map(h => (
            <button key={h} style={{ padding: '0 8px', height: 28, borderRadius: 6, fontSize: 11.5, fontFamily: 'var(--font-display)', color: 'var(--ink-2)' }}>{h}</button>
          ))}
          <div style={{ width: 1, height: 18, background: 'var(--line-1)', margin: '0 4px' }} />
          {['• 목록', '1. 번호', '" 인용', '< / >', '🔗 링크', '🖼 이미지'].map(t => (
            <button key={t} style={{ padding: '0 10px', height: 28, borderRadius: 6, fontSize: 11.5, color: 'var(--ink-2)' }}>{t}</button>
          ))}
        </div>

        {/* Body editor */}
        <textarea value={body} onChange={e => setBody(e.target.value)} style={{
          flex: 1, minHeight: 460,
          border: 'none', outline: 'none', resize: 'none',
          fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.75,
          color: 'var(--ink-1)',
          background: 'transparent',
          padding: '4px 0',
        }} />

        {/* Footer actions */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          paddingTop: 18, borderTop: '0.5px solid var(--line-1)',
        }}>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--ink-3)' }}>
            <span><b style={{ color: 'var(--ink-1)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{chars}</b> 자</span>
            <span>약 <b style={{ color: 'var(--ink-1)' }}>{Math.ceil(chars / 300)}</b>분 읽기</span>
          </div>
          <div style={{ flex: 1 }} />
          <Btn variant="ghost" size="md">취소</Btn>
          <Btn variant="secondary" size="md">미리보기</Btn>
          <Btn variant="green" size="md" icon={Icon.drop}>화분에 물주고 발행 · +{xpGain} XP</Btn>
        </div>
      </div>

      {/* Right rail */}
      <aside style={{
        borderLeft: '0.5px solid var(--line-1)',
        background: '#fff',
        padding: '32px 24px 40px',
        display: 'flex', flexDirection: 'column', gap: 22,
      }}>
        {/* Plant preview */}
        <div style={{
          padding: 18,
          background: 'linear-gradient(180deg, #ebf5ef 0%, #f5f7f5 100%)',
          borderRadius: 14,
          textAlign: 'center',
          border: '0.5px solid var(--green-100)',
        }}>
          <div className="eyebrow" style={{ color: 'var(--green-700)' }}>지금 키우는 식물</div>
          <div style={{ margin: '14px 0 10px', display: 'flex', justifyContent: 'center' }}>
            <Plant stage="bloom" size={92} showRoots />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--navy-700)' }}>
            💻 코딩 · Lv.7 · 개화 중
          </div>
          <div style={{ marginTop: 12 }}>
            <ProgressBar value={0.62} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10.5, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>
              <span>28 / 40 TIL</span>
              <span>다음 단계: 만개</span>
            </div>
          </div>
          <div style={{
            marginTop: 12, padding: '8px 12px',
            background: 'rgba(255,255,255,0.6)', border: '0.5px solid var(--green-100)',
            borderRadius: 8, fontSize: 11.5, color: 'var(--green-700)',
          }}>
            ✨ 이번 글로 약 <b>+{xpGain} XP</b>
          </div>
        </div>

        {/* Templates */}
        <div>
          <SectionHeader eyebrow="템플릿" title="빠른 시작" action={
            <button style={{ fontSize: 11, color: 'var(--green-700)', fontFamily: 'var(--font-display)', fontWeight: 500 }}>+ 새 템플릿</button>
          } />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TEMPLATES.map((t, i) => (
              <button key={t.id} style={{
                textAlign: 'left',
                padding: 12, borderRadius: 10,
                background: i === 0 ? 'var(--bg-soft)' : '#fff',
                border: '0.5px solid var(--line-1)',
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--navy-700)', fontFamily: 'var(--font-display)' }}>{t.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 3 }}>{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div style={{ padding: 14, background: 'var(--bg-soft)', borderRadius: 10, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--navy-700)', fontSize: 12, marginBottom: 6 }}>💡 경험치 가중치</div>
          글자수 · 연속 작성일에 따라 식물에게 가는 물의 양이 달라져요. 짧아도 매일 쓰는 게 가장 강해요.
        </div>
      </aside>
    </div>
  );
}

export { EditorScreen };
