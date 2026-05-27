import { USER, POTS, GRASS, WEEKLY, TODAY_GOALS } from './data.jsx';
import { Card, Pill, Btn, StatTile, SectionHeader, ProgressBar, Icon } from './ui.jsx';
import { Plant } from './plants.jsx';

// Dashboard — 잔디그래프, 통계, 오늘의 목표

function GrassGraph({ data }) {
  const colors = ['#eef2ee', '#cfe8d6', '#9dd0b0', '#5fb088', '#2e6b48'];
  const months = ['2월', '3월', '4월', '5월'];
  const weekDays = ['', '월', '', '수', '', '금', ''];
  const cellSize = 12;
  const gap = 3;
  return (
    <div>
      {/* month labels */}
      <div style={{ display: 'flex', paddingLeft: 22, gap: gap, fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--ink-3)', marginBottom: 6 }}>
        {months.map((m, i) => (
          <div key={m} style={{ width: cellSize * 3.25 + gap * 3, textAlign: 'left' }}>{m}</div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {/* weekday labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: gap, fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--ink-3)', marginTop: 1 }}>
          {weekDays.map((d, i) => (
            <div key={i} style={{ width: 14, height: cellSize, lineHeight: `${cellSize}px` }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'flex', gap }}>
          {data.map((week, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap }}>
              {week.map((v, di) => (
                <div key={di} title={`${wi}주 ${di}일 — ${v}글`} style={{
                  width: cellSize, height: cellSize, borderRadius: 3,
                  background: colors[v],
                  border: v === 0 ? '0.5px solid var(--rule)' : 'none',
                }} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, fontFamily: 'var(--font-display)', fontSize: 10.5, color: 'var(--ink-3)' }}>
        <span>적음</span>
        {colors.map((c, i) => (
          <div key={i} style={{ width: 11, height: 11, borderRadius: 2.5, background: c, border: i === 0 ? '0.5px solid var(--rule)' : 'none' }} />
        ))}
        <span>많음</span>
        <span style={{ marginLeft: 'auto', color: 'var(--ink-2)' }}>글자수로 농도 표현 · 총 91일 중 <b style={{ color: 'var(--ink)' }}>47일 기록</b></span>
      </div>
    </div>
  );
}

function StreakChart() {
  // last 21 days streak shape
  const days = [];
  for (let i = 0; i < 21; i++) {
    const active = i >= 9;
    days.push({ active, h: active ? 18 + Math.sin(i * 0.8) * 6 + Math.random() * 8 : 0 });
  }
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60 }}>
      {days.map((d, i) => (
        <div key={i} style={{
          flex: 1, height: d.active ? `${d.h + 18}px` : '4px',
          background: d.active ? 'linear-gradient(180deg, #3d8b5e, #2e6b48)' : 'var(--rule)',
          borderRadius: 3,
          opacity: d.active ? 1 : 0.6,
        }} />
      ))}
    </div>
  );
}

function WeeklyBar() {
  const max = Math.max(...WEEKLY.map(w => w.count));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, height: 130 }}>
      {WEEKLY.map((w, i) => (
        <div key={w.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' }}>
          <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
            <div style={{
              width: '100%',
              height: `${(w.count / max) * 100}%`,
              minHeight: 4,
              background: w.count > 0 ? 'var(--moss)' : 'var(--rule)',
              borderRadius: '6px 6px 2px 2px',
              position: 'relative',
            }}>
              {w.count > 0 && <div style={{ position: 'absolute', top: -18, left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600, color: 'var(--ink)' }}>{w.count}</div>}
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-body)' }}>{w.day}</div>
        </div>
      ))}
    </div>
  );
}

function PotDistribution() {
  const total = POTS.reduce((s, p) => s + p.tilCount, 0);
  let acc = 0;
  const segs = POTS.map(p => {
    const pct = p.tilCount / total;
    const start = acc;
    acc += pct;
    return { ...p, pct, start, end: acc };
  });
  const R = 56;
  const circumference = 2 * Math.PI * R;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={R} fill="none" stroke="var(--rule)" strokeWidth="14" />
        {segs.map((s, i) => {
          const colors = ['var(--ink)', 'var(--moss)', 'var(--amber)', 'var(--leaf)'];
          const len = s.pct * circumference;
          const dash = `${len} ${circumference - len}`;
          const offset = -s.start * circumference;
          return (
            <circle key={s.id} cx="70" cy="70" r={R} fill="none"
              stroke={colors[i % 4]} strokeWidth="14"
              strokeDasharray={dash}
              strokeDashoffset={offset}
              transform="rotate(-90 70 70)"
              strokeLinecap="butt"
            />
          );
        })}
        <text x="70" y="68" textAnchor="middle" style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, fill: 'var(--ink)' }}>{total}</text>
        <text x="70" y="84" textAnchor="middle" style={{ fontFamily: 'var(--font-body)', fontSize: 10, fill: 'var(--ink-3)' }}>총 TIL</text>
      </svg>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {segs.map((s, i) => {
          const colors = ['var(--ink)', 'var(--moss)', 'var(--amber)', 'var(--leaf)'];
          return (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: colors[i % 4] }} />
              <span style={{ color: 'var(--ink)' }}>{s.emoji} {s.name}</span>
              <span style={{ marginLeft: 'auto', color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{s.tilCount}개 · {Math.round(s.pct * 100)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InterestFlow() {
  // months × topics stacked area-ish bars
  const months = ['2월', '3월', '4월', '5월'];
  const data = [
    { coding: 12, english: 0, reading: 0, workout: 0 },
    { coding: 9,  english: 4, reading: 0, workout: 0 },
    { coding: 5,  english: 5, reading: 3, workout: 0 },
    { coding: 2,  english: 3, reading: 3, workout: 1 },
  ];
  const colors = { coding: 'var(--ink)', english: 'var(--moss)', reading: 'var(--amber)', workout: 'var(--leaf)' };
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 140, paddingTop: 12 }}>
        {data.map((m, i) => {
          const total = m.coding + m.english + m.reading + m.workout;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' }}>
              <div style={{ flex: 1, width: '70%', display: 'flex', flexDirection: 'column-reverse', borderRadius: '6px 6px 2px 2px', overflow: 'hidden' }}>
                {['coding','english','reading','workout'].map(k => (
                  m[k] > 0 && <div key={k} style={{ height: `${(m[k] / total) * 100}%`, background: colors[k] }} />
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{months[i]}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
        {POTS.map((p, i) => {
          const keys = ['coding','english','reading','workout'];
          return (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-2)' }}>
              <div style={{ width: 9, height: 9, borderRadius: 2, background: colors[keys[i]] }} />
              {p.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GoalRow({ goal }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px',
      borderRadius: 10,
      background: goal.done ? 'var(--paper-2)' : 'var(--paper)',
      border: '0.5px solid var(--rule)',
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 7,
        background: goal.done ? 'var(--moss)' : '#fff',
        border: goal.done ? 'none' : '1px solid var(--rule-2)',
        color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {goal.done && Icon.check}
      </div>
      <div style={{ flex: 1, fontSize: 13.5, color: 'var(--ink)', textDecoration: goal.done ? 'line-through' : 'none', opacity: goal.done ? 0.6 : 1 }}>{goal.label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 11.5, fontWeight: 600, color: goal.done ? 'var(--moss-2)' : 'var(--ink-3)' }}>+{goal.point}P</div>
    </div>
  );
}

function DashboardScreen({ onNav }) {
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1280, margin: '0 auto' }}>

      {/* Greeting card */}
      <Card padding={24} style={{
        background: 'linear-gradient(120deg, #ebf5ef 0%, #f5f7f5 50%, #f9f6ed 100%)',
        border: '0.5px solid var(--leaf)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <Plant stage="bloom" size={86} />
          <div style={{ flex: 1 }}>
            <div className="eyebrow" style={{ color: 'var(--moss-2)' }}>오늘의 한 줄</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--ink)', marginTop: 6, letterSpacing: '-0.01em' }}>
              "매일의 기록이 뿌리가 되어 꽃을 피웁니다"
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginTop: 6 }}>
              연속 <b style={{ color: 'var(--moss-2)' }}>{USER.streak}일</b> 기록 중 — 어제까지 6,420자, 오늘은 아직 비어있어요.
            </div>
          </div>
          <Btn variant="green" size="lg" icon={Icon.edit} onClick={() => onNav('editor')}>
            오늘 기록하기
          </Btn>
        </div>
      </Card>

      {/* Stat tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatTile label="누적 TIL" value={USER.totalTil} suffix="개" sub="2026.02.14 ~ 오늘" />
        <StatTile label="연속 기록" value={USER.streak} suffix="일" sub={`최고 ${USER.bestStreak}일`} tone="green" />
        <StatTile label="누적 글자수" value="38,420" suffix="자" sub="평균 817자 / 글" />
        <StatTile label="포인트" value={USER.points} suffix="P" sub="AI 토큰으로 사용 가능" tone="brown" />
      </div>

      {/* Grass + Today goals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
        <Card padding={22}>
          <SectionHeader eyebrow="활동" title="잔디 그래프" action={
            <div style={{ display: 'flex', gap: 4 }}>
              {['3개월', '6개월', '1년'].map((t, i) => (
                <button key={t} style={{
                  padding: '5px 10px', fontSize: 11.5, borderRadius: 7,
                  background: i === 0 ? 'var(--ink)' : 'transparent',
                  color: i === 0 ? '#fff' : 'var(--ink-2)',
                  border: i === 0 ? 'none' : '0.5px solid var(--rule-2)',
                  fontFamily: 'var(--font-display)', fontWeight: 500,
                }}>{t}</button>
              ))}
            </div>
          } />
          <GrassGraph data={GRASS} />
        </Card>

        <Card padding={22}>
          <SectionHeader eyebrow="오늘 · 2026.05.22" title="오늘의 목표" action={
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 11.5, color: 'var(--moss-2)', fontWeight: 600 }}>
              80 / 110P
            </span>
          } />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TODAY_GOALS.map(g => <GoalRow key={g.id} goal={g} />)}
          </div>
        </Card>
      </div>

      {/* 3 column stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <Card padding={22}>
          <SectionHeader eyebrow="연속 기록" title="Streak" action={<Pill tone="green">최고 {USER.bestStreak}일</Pill>} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, color: 'var(--moss-2)', letterSpacing: '-0.03em' }}>{USER.streak}</span>
            <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>일째</span>
          </div>
          <StreakChart />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>
            <span>−21d</span><span>오늘</span>
          </div>
        </Card>

        <Card padding={22}>
          <SectionHeader eyebrow="화분별 분포" title="주제 비율" />
          <PotDistribution />
        </Card>

        <Card padding={22}>
          <SectionHeader eyebrow="이번 주" title="요일별 작성" />
          <WeeklyBar />
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--ink-3)' }}>총 13개 · 평균 1.86개/일</div>
        </Card>
      </div>

      {/* Interest flow */}
      <Card padding={22}>
        <SectionHeader eyebrow="관심사 변화" title="시기별 학습 주제 흐름" action={
          <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>지난 4개월 · 화분별 비중</span>
        } />
        <InterestFlow />
        <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: 10, background: 'var(--paper-2)', fontSize: 12.5, color: 'var(--ink-2)', borderLeft: '2px solid var(--moss)' }}>
          🌱 2월의 코딩 중심에서, 최근에는 영어와 독서로 뿌리가 넓어지고 있어요.
        </div>
      </Card>

    </div>
  );
}

export { DashboardScreen, GrassGraph };
