// App shell — sidebar + topbar + screen routing

const NAV = [
  { id: 'dashboard', label: '대시보드', icon: Icon.home },
  { id: 'editor',    label: 'TIL 작성',  icon: Icon.edit },
  { id: 'garden',    label: '정원',      icon: Icon.garden },
  { id: 'collection',label: '식물도감',  icon: Icon.book },
  { id: 'ai',        label: 'AI 학습',   icon: Icon.sparkles },
  { id: 'profile',   label: '프로필',    icon: Icon.user },
];

function Sidebar({ current, onNav }) {
  return (
    <aside style={{
      width: 232,
      background: '#fff',
      borderRight: '0.5px solid var(--line-1)',
      padding: '22px 16px',
      display: 'flex', flexDirection: 'column',
      gap: 4,
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 22px' }}>
        <RootinLogo size={36} />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--navy-700)', letterSpacing: '-0.02em', lineHeight: 1 }}>Rootin</div>
          <div style={{ fontSize: 10, color: 'var(--green-500)', fontFamily: 'var(--font-display)', letterSpacing: '0.08em', marginTop: 3 }}>루틴처럼, 뿌리처럼</div>
        </div>
      </div>

      <button onClick={() => onNav('editor')} style={{
        margin: '0 4px 18px',
        padding: '10px 14px',
        background: 'var(--navy-700)', color: '#fff',
        border: 'none', borderRadius: 10,
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 13, fontWeight: 500,
      }}>
        {Icon.plus}<span>새 TIL 작성</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.6 }}>⌘ N</span>
      </button>

      <div className="eyebrow" style={{ padding: '6px 12px', marginTop: 4 }}>menu</div>
      {NAV.map(item => {
        const active = current === item.id;
        return (
          <button key={item.id} onClick={() => onNav(item.id)} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderRadius: 9,
            background: active ? 'var(--green-50)' : 'transparent',
            color: active ? 'var(--green-700)' : 'var(--ink-2)',
            fontWeight: active ? 600 : 400,
            fontSize: 13.5,
            position: 'relative',
            transition: 'background 120ms ease',
          }}>
            <span style={{ color: active ? 'var(--green-500)' : 'var(--ink-3)', display: 'inline-flex', flexShrink: 0 }}>{item.icon}</span>
            <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
            {active && <span style={{ position: 'absolute', left: -16, top: 8, bottom: 8, width: 3, background: 'var(--green-500)', borderRadius: 2 }} />}
          </button>
        );
      })}

      <div style={{ flex: 1 }} />

      {/* My streak mini card */}
      <div style={{
        margin: '12px 4px 6px',
        padding: '14px 14px',
        background: 'linear-gradient(180deg, #ebf5ef 0%, #f5f7f5 100%)',
        border: '0.5px solid var(--line-1)',
        borderRadius: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Plant stage="leaf" size={40} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--navy-700)', fontSize: 14 }}>연속 {USER.streak}일</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 1 }}>최고 {USER.bestStreak}일</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ title, subtitle, onLogout }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '18px 32px',
      borderBottom: '0.5px solid var(--line-1)',
      background: '#fff',
    }}>
      <div style={{ flex: 1 }}>
        {subtitle && <div className="eyebrow" style={{ marginBottom: 4 }}>{subtitle}</div>}
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink-1)', letterSpacing: '-0.015em', fontFamily: 'var(--font-body)' }}>{title}</h1>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px', borderRadius: 10,
        background: 'var(--paper)',
        border: '0.5px solid var(--line-1)',
        minWidth: 240, color: 'var(--ink-3)', fontSize: 12.5,
      }}>
        {Icon.search}<span style={{ flex: 1 }}>TIL · 화분 · 태그 검색</span>
        <span className="kbd">⌘ K</span>
      </div>

      <button style={{ width: 38, height: 38, borderRadius: 10, border: '0.5px solid var(--line-1)', background: '#fff', color: 'var(--ink-2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {Icon.bell}
        <span style={{ position: 'absolute', top: 8, right: 9, width: 6, height: 6, borderRadius: 3, background: 'var(--green-500)' }} />
      </button>

      <button onClick={onLogout} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '5px 14px 5px 5px', borderRadius: 999,
        background: '#fff', border: '0.5px solid var(--line-1)',
      }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #a8d5b5, #3d8b5e)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12 }}>소</div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink-1)' }}>{USER.name}</div>
          <div style={{ fontSize: 10, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>@{USER.handle}</div>
        </div>
      </button>
    </header>
  );
}

function App() {
  const [screen, setScreen] = React.useState('dashboard');
  const [authed, setAuthed] = React.useState(true);
  const [potFocus, setPotFocus] = React.useState(null); // pot id when entering detail

  const titles = {
    dashboard:  { title: '안녕, 소연 🌱', subtitle: 'Dashboard · 2026.05.22 금요일' },
    editor:     { title: '오늘의 TIL 작성', subtitle: 'New entry' },
    garden:     { title: '나의 정원', subtitle: 'Garden · 4개의 화분' },
    'pot-detail': { title: potFocus ? `${POTS.find(p => p.id === potFocus)?.emoji} ${POTS.find(p => p.id === potFocus)?.name}` : '화분', subtitle: 'Garden / Detail' },
    collection: { title: '식물 도감', subtitle: 'Collection · ' + DEX.filter(d => d.state !== 'locked').length + ' / ' + DEX.length + ' 종 해금' },
    ai:         { title: 'AI 학습 도구', subtitle: 'AI · 내 TIL로 만든 학습지' },
    profile:    { title: '내 계정', subtitle: 'Account' },
  };

  if (!authed) return <AuthScreen onAuth={() => setAuthed(true)} />;

  const meta = titles[screen] || { title: '', subtitle: '' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--paper)', minWidth: 1180 }} data-screen-label={screen}>
      <Sidebar current={screen.startsWith('pot') ? 'garden' : screen} onNav={s => setScreen(s)} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar title={meta.title} subtitle={meta.subtitle} onLogout={() => setAuthed(false)} />
        <div className="scrollbar" style={{ flex: 1, overflow: 'auto' }}>
          {screen === 'dashboard'  && <DashboardScreen onNav={setScreen} />}
          {screen === 'editor'     && <EditorScreen onNav={setScreen} />}
          {screen === 'garden'     && <GardenScreen onOpenPot={(id) => { setPotFocus(id); setScreen('pot-detail'); }} />}
          {screen === 'pot-detail' && <PotDetailScreen potId={potFocus} onBack={() => setScreen('garden')} />}
          {screen === 'collection' && <CollectionScreen />}
          {screen === 'ai'         && <AIScreen />}
          {screen === 'profile'    && <ProfileScreen />}
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { App, NAV });
