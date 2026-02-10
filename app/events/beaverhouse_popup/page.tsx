'use client';

import { useState, useEffect, useRef } from 'react';

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const REWARDS = [
  { label: '두쫀쿠', sub: '쫀쫀한 두쫀쿠 기프티콘', accent: '#E8C547' },
  { label: '신세계 상품권', sub: '신세계백화점 상품권', accent: '#C94040' },
  { label: '스타벅스 기프티콘', sub: '아메리카노 한 잔', accent: '#4A7C5F' },
];

const TOONS = [
  { id: 1, bg: '#EDD9A3', title: '월요일 아침' },
  { id: 2, bg: '#C9D8E8', title: '퇴근 5분 전' },
  { id: 3, bg: '#E8C9C9', title: '점심메뉴 고민' },
  { id: 4, bg: '#C9E8D4', title: '야근 3일차' },
  { id: 5, bg: '#E8D4C9', title: '주말 계획' },
  { id: 6, bg: '#D4C9E8', title: '통장 잔고 확인' },
  { id: 7, bg: '#EDD9A3', title: '회식 전날 밤' },
  { id: 8, bg: '#C9E8E4', title: '연차 쓰는 날' },
];

export default function BeaverHousePopupPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', worksheetCode: '', reward: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const sec1 = useInView();
  const sec2 = useInView(0.05);
  const sec3 = useInView();
  const sec4 = useInView();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const GOOGLE_SCRIPT_URL =
        process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
        'https://script.google.com/macros/s/AKfycbxUcjD8m_y0MdVTNv3eAuKjnM9a0b7R2LD1_0wNPRy1lbaDa88BKFbHOY17sMUxR08hxA/exec';
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, event: 'beaverhouse_popup', timestamp: new Date().toISOString() })
      });
      setIsSubmitted(true);
    } catch (err) {
      alert('제출 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main style={{ minHeight: '100svh', background: '#F5EFE0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'var(--font-body)' }}>
        <style>{GLOBAL_CSS}</style>
        <div className="panel" style={{ background: '#fff', maxWidth: 340, width: '100%', padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, color: 'var(--ink)', marginBottom: 4, lineHeight: 1 }}>NICE.</div>
          <div style={{ width: 40, height: 3, background: 'var(--ink)', margin: '12px auto 20px' }} />
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8 }}>
            공감썰 잘 받았어요.<br />비버툰으로 꼭 기록할게요.
          </p>
          <div style={{ marginTop: 24, padding: '12px 16px', background: '#F5EFE0', border: '2px solid var(--ink)', fontSize: 12, color: '#888' }}>
            당첨자에게 추첨 후 개별 연락드려요
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {/* ━━━ 히어로 ━━━ */}
      <section style={{ minHeight: '100svh', background: '#F5EFE0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px 48px', position: 'relative', overflow: 'hidden' }}>

        {/* 배경 — 흐릿한 격자 */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--ink-10) 1px, transparent 1px), linear-gradient(90deg, var(--ink-10) 1px, transparent 1px)', backgroundSize: '48px 48px', zIndex: 0 }} />

        {/* 배경 장식 패널들 */}
        <div className={`hero-deco-1${heroVisible ? ' visible' : ''}`} style={{ position: 'absolute', top: '8%', right: '-4%', width: 180, height: 180, background: '#E8C547', zIndex: 0 }} />
        <div className={`hero-deco-2${heroVisible ? ' visible' : ''}`} style={{ position: 'absolute', bottom: '12%', left: '-3%', width: 120, height: 120, background: '#C9D8E8', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480 }}>
          {/* 날짜 태그 */}
          <div className={`hero-tag${heroVisible ? ' visible' : ''}`}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink)' }}>FEB 13–14, 2026 · POP-UP EVENT</span>
          </div>

          {/* 메인 타이틀 */}
          <h1 className={`hero-title${heroVisible ? ' visible' : ''}`} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(64px, 18vw, 108px)', color: 'var(--ink)', lineHeight: 0.95, letterSpacing: '-0.03em', marginTop: 20 }}>
            BEAVER<br />
            <span style={{ color: '#C94040', WebkitTextStroke: '0px' }}>HOUSE</span>
          </h1>

          {/* 서브 — 만화 말풍선 스타일 */}
          <div className={`hero-bubble${heroVisible ? ' visible' : ''}`}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
              지친 현대인을 위한 공감툰 브랜드
            </p>
            {/* 말풍선 꼬리 */}
            <div style={{ position: 'absolute', bottom: -14, left: 28, width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '14px solid var(--ink)' }} />
            <div style={{ position: 'absolute', bottom: -11, left: 30, width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '12px solid #fff' }} />
          </div>

          {/* 스크롤 힌트 */}
          <div className={`hero-scroll${heroVisible ? ' visible' : ''}`} style={{ marginTop: 52, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 2, background: 'var(--ink)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.14em', color: 'var(--ink)' }}>SCROLL</span>
            <div className="scroll-arrow">↓</div>
          </div>
        </div>
      </section>

      {/* ━━━ 브랜드 소개 — 4컷 패널 구조 ━━━ */}
      <section ref={sec1.ref} style={{ background: 'var(--ink)', padding: '64px 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>

          <div className={`reveal${sec1.inView ? ' in' : ''}`} style={{ marginBottom: 32 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.18em', color: '#888' }}>ABOUT</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 9vw, 52px)', color: '#fff', lineHeight: 1.1, marginTop: 8 }}>
              당신의 썰을<br />
              <span style={{ color: '#E8C547' }}>툰으로 만들어요</span>
            </h2>
          </div>

          {/* 4컷 패널 그리드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            {[
              { num: '01', title: '공감 수집', desc: '일상의 찌질하고 웃긴 순간들을 독자 썰로 모아요' },
              { num: '02', title: '비버툰 제작', desc: '비버 캐릭터로 공감 웹툰을 직접 그려 올려요' },
              { num: '03', title: '굿즈 제작', desc: '인기 툰을 굿즈로 만들어 팝업에서 판매해요' },
              { num: '04', title: '현장 체험', desc: '캐리커쳐, 비즈 키링 만들기 체험도 있어요' },
            ].map((item, i) => (
              <div
                key={i}
                className={`reveal reveal-delay-${i}${sec1.inView ? ' in' : ''}`}
                style={{ background: i === 0 ? '#E8C547' : i === 1 ? '#fff' : i === 2 ? '#fff' : '#C94040', padding: '20px 18px', border: '2px solid transparent' }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.15em', color: i === 0 ? 'var(--ink)' : i === 3 ? 'rgba(255,255,255,0.5)' : '#bbb', marginBottom: 8 }}>{item.num}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: i === 3 ? '#fff' : 'var(--ink)', marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: i === 0 ? '#555' : i === 3 ? 'rgba(255,255,255,0.75)' : '#777', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 마퀴 갤러리 ━━━ */}
      <section ref={sec2.ref} style={{ background: '#F5EFE0', borderTop: '3px solid var(--ink)', borderBottom: '3px solid var(--ink)', padding: '28px 0', overflow: 'hidden' }}>
        <div style={{ overflow: 'hidden' }}>
          <div className="marquee-track">
            {[...TOONS, ...TOONS].map((toon, i) => (
              <div
                key={i}
                className="toon-card"
                style={{ flex: '0 0 auto', width: 148, height: 148, background: toon.bg, border: '2px solid var(--ink)', margin: '0 8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 12, position: 'relative' }}
              >
                {/* 패널 번호 */}
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--ink)', opacity: 0.4 }}>#{toon.id}</div>
                {/* 비버 실루엣 플레이스홀더 */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.35 }}>
                    {/* 단순화된 비버 실루엣 */}
                    <ellipse cx="26" cy="22" rx="14" ry="13" fill="var(--ink)" />
                    <ellipse cx="19" cy="13" rx="5" ry="7" fill="var(--ink)" />
                    <ellipse cx="33" cy="13" rx="5" ry="7" fill="var(--ink)" />
                    <ellipse cx="26" cy="38" rx="18" ry="9" fill="var(--ink)" />
                    <rect x="18" y="44" width="5" height="8" rx="2" fill="var(--ink)" />
                    <rect x="29" y="44" width="5" height="8" rx="2" fill="var(--ink)" />
                  </svg>
                </div>
                {/* 제목 */}
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.3 }}>{toon.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 이벤트 안내 + 보상 ━━━ */}
      <section ref={sec3.ref} style={{ background: '#F5EFE0', padding: '64px 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>

          {/* 이벤트 안내 — 만화 말풍선 패널 */}
          <div className={`reveal${sec3.inView ? ' in' : ''}`} style={{ position: 'relative', marginBottom: 48 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.18em', color: '#aaa', marginBottom: 12 }}>HOW TO</div>
            <div className="panel" style={{ background: '#fff', padding: '24px 24px 28px' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink)', lineHeight: 1.9, margin: 0 }}>
                현장에서 <strong>워크지를 받아</strong> 공감썰을 적고,<br />
                아래에서 <strong>희망 보상을 고른 뒤</strong> 제출하세요.<br />
                추첨을 통해 선물을 드립니다.
              </p>
            </div>
          </div>

          {/* 보상 선택 */}
          <div className={`reveal reveal-delay-1${sec3.inView ? ' in' : ''}`}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.18em', color: '#aaa', marginBottom: 16 }}>PICK YOUR REWARD</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {REWARDS.map((r) => {
                const selected = formData.reward === r.label;
                return (
                  <label
                    key={r.label}
                    className={`reward-card${selected ? ' selected' : ''}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 0,
                      background: selected ? r.accent : '#fff',
                      border: '2.5px solid var(--ink)',
                      cursor: 'pointer',
                      overflow: 'hidden',
                    }}
                  >
                    <input type="radio" name="reward" value={r.label} checked={selected} onChange={handleChange} style={{ display: 'none' }} />
                    {/* 번호 탭 */}
                    <div style={{ width: 44, alignSelf: 'stretch', background: selected ? 'rgba(0,0,0,0.12)' : '#F5EFE0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '2px solid var(--ink)', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--ink)' }}>
                        {selected ? 'OK' : REWARDS.indexOf(r) + 1 < 10 ? `0${REWARDS.indexOf(r) + 1}` : REWARDS.indexOf(r) + 1}
                      </span>
                    </div>
                    {/* 텍스트 */}
                    <div style={{ padding: '16px 18px' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)' }}>{r.label}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: selected ? 'var(--ink)' : '#888', marginTop: 2 }}>{r.sub}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 폼 ━━━ */}
      <section ref={sec4.ref} style={{ background: 'var(--ink)', padding: '64px 24px 80px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>

          <div className={`reveal${sec4.inView ? ' in' : ''}`} style={{ marginBottom: 36 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.18em', color: '#666' }}>SUBMIT</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 8vw, 44px)', color: '#fff', lineHeight: 1.1, marginTop: 8 }}>
              정보 입력 후<br />
              <span style={{ color: '#E8C547' }}>제출 완료</span>
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`reveal reveal-delay-1${sec4.inView ? ' in' : ''}`}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {[
              { name: 'name', label: '이름', placeholder: '홍길동', type: 'text' },
              { name: 'phone', label: '전화번호', placeholder: '010-0000-0000', type: 'tel' },
              { name: 'worksheetCode', label: '워크지 번호', placeholder: '워크지 상단의 번호', type: 'text' },
            ].map((field) => (
              <div key={field.name}>
                <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.15em', color: '#666', marginBottom: 8 }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  required
                  placeholder={field.placeholder}
                  className="form-input"
                />
              </div>
            ))}

            {/* 선택된 보상 표시 */}
            <div style={{ border: formData.reward ? '2px solid #E8C547' : '2px dashed #444', padding: '14px 16px', marginTop: 4 }}>
              {formData.reward
                ? <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#E8C547', letterSpacing: '0.05em' }}>선택한 보상 · {formData.reward}</span>
                : <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#555' }}>위에서 원하는 보상을 먼저 선택해 주세요</span>
              }
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !formData.reward}
              className="submit-btn"
              style={{ marginTop: 8 }}
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
            </button>
          </form>

          <div className={`reveal reveal-delay-2${sec4.inView ? ' in' : ''}`} style={{ marginTop: 40, padding: '20px', border: '1px solid #2a2a2a', fontFamily: 'var(--font-body)', fontSize: 12, color: '#555', lineHeight: 1.9 }}>
            본 이벤트는 비버하우스 팝업 현장 참여자만 응모 가능합니다.<br />
            수집된 개인정보는 당첨자 연락 목적으로만 사용되며 이벤트 종료 후 즉시 파기됩니다.
          </div>
        </div>
      </section>
    </>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 글로벌 CSS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Nanum+Gothic:wght@400;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #1E1C18;
    --ink-10: rgba(30,28,24,0.08);
    --cream: #F5EFE0;
    --yellow: #E8C547;
    --red: #C94040;
    --font-display: 'Black Han Sans', sans-serif;
    --font-body: 'Nanum Gothic', sans-serif;
  }

  body { background: var(--cream); }

  /* 패널 공통 */
  .panel {
    border: 2.5px solid var(--ink);
    box-shadow: 4px 4px 0 var(--ink);
  }

  /* 히어로 날짜 태그 */
  .hero-tag {
    display: inline-block;
    background: #fff;
    border: 2px solid var(--ink);
    padding: 5px 14px;
    opacity: 0;
    transform: translateY(-10px);
    transition: none;
  }
  .hero-tag.visible {
    animation: fadeDown 0.4s ease forwards;
    animation-delay: 0.1s;
  }

  /* 히어로 타이틀 */
  .hero-title {
    opacity: 0;
    transform: scale(0.85) skewX(-3deg);
  }
  .hero-title.visible {
    animation: popIn 0.55s cubic-bezier(.2,.8,.3,1.2) forwards;
    animation-delay: 0.25s;
  }

  /* 히어로 말풍선 */
  .hero-bubble {
    position: relative;
    display: inline-block;
    background: #fff;
    border: 2.5px solid var(--ink);
    padding: 12px 20px;
    margin-top: 32px;
    opacity: 0;
    transform: translateY(16px);
  }
  .hero-bubble.visible {
    animation: slideUp 0.45s ease forwards;
    animation-delay: 0.55s;
  }

  /* 히어로 데코 패널들 */
  .hero-deco-1 {
    opacity: 0;
    border: 2.5px solid var(--ink);
    transform: rotate(6deg);
  }
  .hero-deco-1.visible {
    animation: fadeIn 0.6s ease forwards;
    animation-delay: 0.0s;
  }
  .hero-deco-2 {
    opacity: 0;
    border: 2.5px solid var(--ink);
    transform: rotate(-5deg);
  }
  .hero-deco-2.visible {
    animation: fadeIn 0.6s ease forwards;
    animation-delay: 0.15s;
  }

  /* 히어로 스크롤 */
  .hero-scroll {
    opacity: 0;
  }
  .hero-scroll.visible {
    animation: fadeIn 0.5s ease forwards;
    animation-delay: 0.85s;
  }
  .scroll-arrow {
    font-family: var(--font-display);
    font-size: 18px;
    color: var(--ink);
    animation: bounce 1.6s ease-in-out infinite;
  }

  /* 스크롤 reveal */
  .reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .reveal.in { opacity: 1; transform: translateY(0); }
  .reveal-delay-0 { transition-delay: 0.05s; }
  .reveal-delay-1 { transition-delay: 0.15s; }
  .reveal-delay-2 { transition-delay: 0.25s; }
  .reveal-delay-3 { transition-delay: 0.35s; }

  /* 마퀴 */
  @keyframes marqueeLeft {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .marquee-track {
    display: flex;
    width: max-content;
    animation: marqueeLeft 30s linear infinite;
  }
  .marquee-track:hover { animation-play-state: paused; }

  /* 툰 카드 */
  .toon-card {
    transition: transform 0.2s ease;
  }
  .toon-card:hover {
    transform: translateY(-4px) rotate(-1.5deg);
    z-index: 2;
  }

  /* 보상 카드 */
  .reward-card {
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .reward-card:hover {
    transform: translateX(4px);
  }
  .reward-card.selected {
    box-shadow: 5px 5px 0 var(--ink);
    transform: translateX(2px) translateY(-2px);
  }

  /* 폼 인풋 */
  .form-input {
    width: 100%;
    background: #fff;
    border: 2.5px solid #333;
    padding: 14px 16px;
    font-size: 15px;
    font-family: var(--font-body);
    color: var(--ink);
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .form-input:focus {
    outline: none;
    border-color: var(--yellow);
    box-shadow: 3px 3px 0 var(--yellow);
  }
  .form-input::placeholder { color: #aaa; }

  /* 제출 버튼 */
  .submit-btn {
    width: 100%;
    background: var(--yellow);
    border: 2.5px solid var(--ink);
    box-shadow: 5px 5px 0 var(--ink);
    padding: 18px;
    font-family: var(--font-display);
    font-size: 24px;
    letter-spacing: 0.08em;
    color: var(--ink);
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }
  .submit-btn:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 5px 8px 0 var(--ink);
  }
  .submit-btn:active:not(:disabled) {
    transform: translateY(2px);
    box-shadow: 2px 2px 0 var(--ink);
  }
  .submit-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
  }

  /* 키프레임 */
  @keyframes popIn {
    0%   { opacity: 0; transform: scale(0.85) skewX(-3deg); }
    65%  { transform: scale(1.04) skewX(0.5deg); opacity: 1; }
    100% { opacity: 1; transform: scale(1) skewX(0deg); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(7px); }
  }
`;