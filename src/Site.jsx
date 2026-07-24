// Lumacon Onepage – aufgebaut auf Astryx (Theme + Komponenten)
import { useEffect, useRef, useState } from 'react';
import { Theme } from '@astryxdesign/core/theme';
import { Button } from '@astryxdesign/core/Button';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';
import { NetworkBg } from './NetworkBg.jsx';

const RED = 'var(--color-accent)';
const MAXW = { maxWidth: 1240, margin: '0 auto', padding: '0 24px' };
const SECTION_PAD = 'clamp(72px, 8vw, 110px) 24px';
const kickerStyle = { fontSize: 13, fontWeight: 800, letterSpacing: '0.14em', color: RED, marginBottom: 16 };
const h2Style = { fontSize: 'clamp(28px, 3.4vw, 42px)', fontWeight: 800, lineHeight: 1.15, margin: '0 0 20px', textWrap: 'balance' };

const GA_MEASUREMENT_ID = ''; // TODO: Google Analytics Mess-ID (G-XXXXXXXXXX) eintragen

function loadAnalytics() {
  if (!GA_MEASUREMENT_ID || window.gtag) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.lc-reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-visible')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add('is-visible');
      else io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}

function Header({ c }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1120px)');
    const onMq = () => { setIsMobile(mq.matches); setMenuOpen(false); };
    onMq();
    mq.addEventListener('change', onMq);
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      let act = '';
      for (const n of c.nav) {
        const el = document.getElementById(n.href.slice(1));
        if (el && el.getBoundingClientRect().top < 170) act = n.href.slice(1);
      }
      setActive(act);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { mq.removeEventListener('change', onMq); window.removeEventListener('scroll', onScroll); };
  }, [c.nav]);

  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E8E8E8', boxShadow: scrolled ? '0 6px 24px rgba(17,17,17,0.09)' : 'none', transition: 'box-shadow 0.25s' }}>
      <div style={{ overflow: 'hidden', transition: 'max-height 0.3s ease', maxHeight: scrolled ? 0 : 40 }}>
        <div style={{ background: '#111', color: '#fff', fontSize: 12, letterSpacing: '0.08em', textAlign: 'center', padding: '6px 24px' }}>{c.badge}</div>
      </div>
      <div style={{ ...MAXW, height: 68, display: 'flex', alignItems: 'center', gap: 32 }}>
        <a href="#top" style={{ fontWeight: 800, fontSize: 21, letterSpacing: '0.14em', color: '#111' }}>LUMACON<span style={{ color: RED }}>.</span></a>
        {!isMobile && (
          <nav style={{ display: 'flex', gap: 22, marginLeft: 'auto', alignItems: 'center' }}>
            {c.nav.map((n) => (
              <a key={n.href} href={n.href} style={{ fontSize: 15, fontWeight: 600, paddingBottom: 3, color: active === n.href.slice(1) ? RED : '#444', borderBottom: active === n.href.slice(1) ? '2px solid ' + RED : '2px solid transparent', transition: 'color 0.2s, border-color 0.2s' }}>{n.label}</a>
            ))}
          </nav>
        )}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', gap: 2, fontSize: 13, fontWeight: 700 }}>
              <span style={{ padding: '4px 8px', background: '#111', color: '#fff', borderRadius: 3 }}>{c.otherLang.current}</span>
              <a href={c.otherLang.href} style={{ padding: '4px 8px', color: '#999' }}>{c.otherLang.label}</a>
            </div>
            <Button label={c.cta} variant="primary" href="#kontakt" />
          </div>
        )}
        {isMobile && (
          <button onClick={() => setMenuOpen((v) => !v)} aria-label="Menu" aria-expanded={menuOpen} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 4px', display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ width: 22, height: 2, background: '#111' }} />
            <span style={{ width: 22, height: 2, background: '#111' }} />
            <span style={{ width: 22, height: 2, background: RED }} />
          </button>
        )}
      </div>
      {menuOpen && (
        <div style={{ borderTop: '1px solid #E8E8E8', background: '#fff', padding: '8px 24px 24px', display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 120px)', overflow: 'auto' }}>
          {c.nav.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)} style={{ padding: '14px 0', fontSize: 17, fontWeight: 700, color: '#222', borderBottom: '1px solid #F0F0F0' }}>{n.label}</a>
          ))}
          <div style={{ marginTop: 18 }}>
            <Button label={c.cta} variant="primary" width="100%" href="#kontakt" onClick={() => setMenuOpen(false)} />
          </div>
          <div style={{ display: 'flex', gap: 2, fontSize: 13, fontWeight: 700, marginTop: 16 }}>
            <span style={{ padding: '4px 8px', background: '#111', color: '#fff', borderRadius: 3 }}>{c.otherLang.current}</span>
            <a href={c.otherLang.href} style={{ padding: '4px 8px', color: '#999' }}>{c.otherLang.label}</a>
          </div>
        </div>
      )}
    </header>
  );
}

function Kicker({ children, style }) { return <div style={{ ...kickerStyle, ...style }}>{children}</div>; }

function CookieBanner({ c }) {
  const [choice, setChoice] = useState(() => { try { return localStorage.getItem('lc-cookie-consent'); } catch { return 'necessary'; } });
  useEffect(() => { if (choice === 'all') loadAnalytics(); }, [choice]);
  if (choice) return null;
  const set = (v) => { try { localStorage.setItem('lc-cookie-consent', v); } catch {} setChoice(v); };
  return (
    <div role="dialog" aria-label={c.cookie.title} style={{ position: 'fixed', bottom: 20, left: 20, right: 20, zIndex: 200, maxWidth: 560, margin: '0 auto', background: '#fff', border: '1px solid #E0E0E0', borderTop: '3px solid ' + RED, borderRadius: 6, boxShadow: '0 12px 40px rgba(0,0,0,0.18)', padding: 24, animation: 'lc-fadeup 0.4s ease' }}>
      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>{c.cookie.title}</div>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: '#555', margin: '0 0 16px' }}>{c.cookie.text}</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Button label={c.cookie.acceptAll} variant="primary" onClick={() => set('all')} />
        <Button label={c.cookie.acceptNecessary} variant="secondary" onClick={() => set('necessary')} />
      </div>
    </div>
  );
}

export function Site({ c, lang }) {
  useReveal();
  const year = new Date().getFullYear();
  return (
    <Theme theme={neutralTheme}>
      <div data-astryx-theme="neutral" id="top">
        <Header c={c} />
        <main style={{ paddingTop: 98 }}>

          {/* Hero */}
          <section style={{ overflow: 'hidden', position: 'relative', background: '#111', color: '#fff', backgroundImage: 'linear-gradient(135deg, rgba(215,25,32,0.10), transparent 55%)' }}>
            <NetworkBg />
            <div style={{ ...MAXW, position: 'relative', padding: 'clamp(64px, 8vw, 110px) 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 48, alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600, letterSpacing: '0.06em', color: '#BBB', marginBottom: 28 }}>
                  <span style={{ display: 'inline-block', width: 28, height: 2, background: RED }} />
                  {c.hero.kicker}
                </div>
                <h1 style={{ color: '#fff', fontSize: 'clamp(38px, 5.5vw, 72px)', lineHeight: 1.05, fontWeight: 800, margin: '0 0 24px', maxWidth: '15ch', textWrap: 'balance' }}>{c.hero.title}</h1>
                <p style={{ fontSize: 'clamp(19px, 2vw, 24px)', fontWeight: 600, lineHeight: 1.4, margin: '0 0 16px', maxWidth: '58ch', color: '#EDEDED' }}>{c.hero.sub}</p>
                <p style={{ fontSize: 17, lineHeight: 1.6, margin: '0 0 40px', maxWidth: '62ch', color: '#AAA' }}>{c.hero.text}</p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <Button label={c.cta} variant="primary" size="lg" href="#kontakt" />
                  <Button label={c.hero.cta2} variant="ghost" size="lg" href="#leistungen" style={{ color: '#fff', border: '1px solid #555' }} />
                </div>
                <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', marginTop: 48, paddingTop: 28, borderTop: '1px solid #333' }}>
                  {c.hero.stats.map((s) => (
                    <div key={s.l}><div style={{ color: '#fff', fontSize: 26, fontWeight: 800 }}>{s.n}</div><div style={{ fontSize: 13, color: '#999', marginTop: 2 }}>{s.l}</div></div>
                  ))}
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '-48px -36px', background: 'radial-gradient(closest-side, rgba(215,25,32,0.16), transparent 72%)', filter: 'blur(14px)', pointerEvents: 'none' }} />
                <img src={c.hero.image} alt="IMOS Software" style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: 8, display: 'block' }} />
                <div style={{ position: 'relative', fontSize: 11, color: '#777', marginTop: 6, textAlign: 'right' }}>{c.hero.imageCredit}</div>
              </div>
            </div>
          </section>

          {/* Trust marquee */}
          <section style={{ background: '#F4F4F4', borderBottom: '1px solid #E8E8E8', overflow: 'hidden', padding: '22px 0' }}>
            <div style={{ display: 'flex', width: 'max-content', animation: 'lc-marquee 28s linear infinite' }}>
              {[...c.trust, ...c.trust].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14.5, fontWeight: 700, color: '#333', whiteSpace: 'nowrap', marginRight: 64 }}>
                  <span style={{ width: 7, height: 7, background: RED, transform: 'rotate(45deg)', flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* IMOS */}
          <section id="imos" style={{ background: '#fff' }}>
            <div style={{ ...MAXW, padding: SECTION_PAD, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 56, alignItems: 'center' }}>
              <div>
                <Kicker>{c.imos.kicker}</Kicker>
                <h2 style={h2Style}>{c.imos.title}</h2>
                <p style={{ fontSize: 17, lineHeight: 1.7, color: '#444', margin: '0 0 16px' }}>{c.imos.p1}</p>
                <p style={{ fontSize: 17, lineHeight: 1.7, color: '#444', margin: '0 0 32px' }}>{c.imos.p2}</p>
                <Button label={c.imos.button} variant="secondary" href={c.imos.url} target="_blank" rel="noopener" endContent={<span>→</span>} />
              </div>
              <div className="lc-reveal" style={{ background: '#F4F4F4', border: '1px solid #E8E8E8', borderRadius: 6, padding: 36 }}>
                <img src={c.imos.image} alt="IMOS Screenshot" style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: 6, display: 'block', marginBottom: 28 }} />
                <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.12em', color: '#888', marginBottom: 24 }}>{c.imos.chainTitle}</div>
                {c.imos.chain.map((label, i) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ width: 10, height: 10, border: '2.5px solid ' + RED, borderRadius: '50%', background: '#fff' }} />
                      {i < c.imos.chain.length - 1 && <span style={{ width: 2, height: 30, background: '#D8D8D8' }} />}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#222', paddingBottom: 6 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Leistungen */}
          <section id="leistungen" style={{ background: '#F4F4F4', borderTop: '1px solid #E8E8E8' }}>
            <div style={{ ...MAXW, padding: SECTION_PAD }}>
              <div style={{ maxWidth: 760, marginBottom: 56 }}>
                <Kicker>{c.services.kicker}</Kicker>
                <h2 style={h2Style}>{c.services.title}</h2>
                <p style={{ fontSize: 17, lineHeight: 1.7, color: '#444', margin: 0 }}>{c.services.text}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 20 }}>
                {c.services.items.map((s, i) => (
                  <div key={s.title} className="lc-reveal" style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 6, padding: 30, display: 'flex', flexDirection: 'column', gap: 12, transitionDelay: (i % 3) * 0.08 + 's' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#CCC', letterSpacing: '0.08em' }}>{String(i + 1).padStart(2, '0')}</div>
                    <h3 style={{ fontSize: 19, fontWeight: 800, margin: 0, lineHeight: 1.3 }}>{s.title}</h3>
                    <p style={{ fontSize: 15.5, lineHeight: 1.65, color: '#555', margin: 0 }}>{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Prozess */}
          <section style={{ background: '#fff' }}>
            <div style={{ ...MAXW, padding: SECTION_PAD }}>
              <Kicker>{c.process.kicker}</Kicker>
              <h2 style={{ ...h2Style, margin: '0 0 56px', maxWidth: 640 }}>{c.process.title}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: '32px 24px' }}>
                {c.process.steps.map((p, i) => (
                  <div key={p.title} className="lc-reveal" style={{ transitionDelay: (i % 3) * 0.08 + 's' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', background: RED, width: 34, height: 34, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                      <span style={{ flex: 1, height: 2, background: '#EBEBEB', overflow: 'hidden' }}><span className="lc-fill" /></span>
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.3 }}>{p.title}</h3>
                    <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#666', margin: 0 }}>{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Lösungen */}
          <section id="loesungen" style={{ background: '#F4F4F4', borderTop: '1px solid #E8E8E8' }}>
            <div style={{ ...MAXW, padding: SECTION_PAD }}>
              <Kicker>{c.solutions.kicker}</Kicker>
              <h2 style={{ ...h2Style, maxWidth: 640 }}>{c.solutions.title}</h2>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: '#444', margin: '0 0 48px', maxWidth: '62ch' }}>{c.solutions.text}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 12 }}>
                {c.solutions.areas.map((a, i) => (
                  <div key={a} className="lc-reveal" style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 5, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 12, fontSize: 15.5, fontWeight: 700, color: '#222', transitionDelay: (i % 4) * 0.06 + 's' }}>
                    <span style={{ width: 8, height: 8, background: RED, flexShrink: 0 }} />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Technologie */}
          <section style={{ overflow: 'hidden', position: 'relative', background: '#111', color: '#fff', backgroundImage: 'linear-gradient(315deg, rgba(215,25,32,0.09), transparent 55%)' }}>
            <NetworkBg flip speed={0.08} />
            <div style={{ ...MAXW, position: 'relative', padding: SECTION_PAD }}>
              <Kicker>{c.tech.kicker}</Kicker>
              <h2 style={{ ...h2Style, maxWidth: 700, color: '#fff' }}>{c.tech.title}</h2>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: '#AAA', margin: '0 0 48px', maxWidth: '62ch' }}>{c.tech.text}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 18 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <img src={c.tech.image} alt="IMOS Technologie" style={{ width: '100%', aspectRatio: '21 / 9', objectFit: 'cover', borderRadius: 8, display: 'block' }} />
                </div>
                {c.tech.items.map((t, i) => (
                  <div key={t.title} className="lc-reveal" style={{ border: '1px solid #333', borderRadius: 6, padding: 24, background: 'rgba(255,255,255,0.02)', transitionDelay: (i % 4) * 0.06 + 's' }}>
                    <div style={{ width: 24, height: 2, background: RED, marginBottom: 16 }} />
                    <h3 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 8px', color: '#fff' }}>{t.title}</h3>
                    <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#999', margin: 0 }}>{t.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Über Lumacon */}
          <section id="ueber" style={{ background: '#fff' }}>
            <div style={{ ...MAXW, padding: SECTION_PAD, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 56, alignItems: 'start' }}>
              <div>
                <Kicker>{c.about.kicker}</Kicker>
                <h2 style={h2Style}>{c.about.title}</h2>
                <p style={{ fontSize: 17, lineHeight: 1.7, color: '#444', margin: '0 0 16px' }}>{c.about.p1}</p>
                <p style={{ fontSize: 17, lineHeight: 1.7, color: '#444', margin: '0 0 16px' }}>{c.about.p2}</p>
                <p style={{ fontSize: 17, lineHeight: 1.7, color: '#444', margin: 0 }}>{c.about.p3}</p>
              </div>
              <div className="lc-reveal" style={{ background: '#F4F4F4', border: '1px solid #E8E8E8', borderRadius: 6, padding: 36, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <img src="/portrait-harald.png" alt={c.about.name} style={{ width: 140, height: 140, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: 21, fontWeight: 800 }}>{c.about.name}</div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: RED, marginTop: 4 }}>{c.about.role}</div>
                </div>
                <p style={{ fontSize: 15.5, lineHeight: 1.65, color: '#555', margin: 0 }}>{c.about.bio}</p>
                <a href="mailto:office@lumacon.at" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700 }}><span style={{ color: RED }}>✉</span> office@lumacon.at</a>
              </div>
            </div>
          </section>

          {/* Fallstudie */}
          <section style={{ background: '#F4F4F4', borderTop: '1px solid #E8E8E8' }}>
            <div style={{ ...MAXW, padding: SECTION_PAD }}>
              <Kicker>{c.caseStudy.kicker}</Kicker>
              <h2 style={{ ...h2Style, margin: '0 0 48px', maxWidth: 700 }}>{c.caseStudy.title}</h2>
              <div className="lc-reveal" style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ padding: 40, borderBottom: '1px solid #EEE' }}>
                  <h3 style={{ color: '#111', fontSize: 'clamp(21px, 2.4vw, 28px)', fontWeight: 800, margin: '0 0 8px', textWrap: 'balance' }}>{c.caseStudy.headline}</h3>
                  <p style={{ fontSize: 15, color: '#888', margin: 0 }}>{c.caseStudy.customer}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))' }}>
                  {c.caseStudy.blocks.map((b) => (
                    <div key={b.label} style={{ padding: '28px 40px', borderBottom: '1px solid #EEE', borderRight: '1px solid #EEE' }}>
                      <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '0.12em', color: RED, marginBottom: 10 }}>{b.label}</div>
                      <p style={{ fontSize: 15, lineHeight: 1.65, color: '#555', margin: 0 }}>{b.text}</p>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '36px 40px', background: '#111', color: '#fff' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '0.12em', color: RED, marginBottom: 12 }}>{c.caseStudy.quoteLabel}</div>
                  <p style={{ fontSize: 'clamp(17px, 1.8vw, 21px)', fontWeight: 600, lineHeight: 1.55, margin: 0, maxWidth: '60ch' }}>{c.caseStudy.quote}</p>
                  <p style={{ fontSize: 14, color: '#999', margin: '14px 0 0' }}>{c.caseStudy.quoteAuthor}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Support */}
          <section id="support" style={{ background: '#fff' }}>
            <div style={{ ...MAXW, padding: SECTION_PAD }}>
              <div className="lc-reveal" style={{ border: '1px solid #E8E8E8', borderLeft: '4px solid ' + RED, borderRadius: '0 6px 6px 0', padding: 'clamp(32px, 4vw, 56px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 40, alignItems: 'center', background: '#FAFAFA' }}>
                <div>
                  <Kicker>{c.support.kicker}</Kicker>
                  <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 800, lineHeight: 1.15, margin: '0 0 16px', textWrap: 'balance' }}>{c.support.title}</h2>
                  <p style={{ fontSize: 16.5, lineHeight: 1.7, color: '#444', margin: 0 }}>{c.support.text} <strong style={{ color: '#111' }}>{c.support.shortUrl}</strong>.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {c.support.buttons.map((b) => (
                    <Button key={b.label} label={b.label} variant={b.variant} size="lg" width="100%" href={b.href} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Impressum / Datenschutz */}
          <section id="impressum" style={{ background: '#fff', borderTop: '1px solid #E8E8E8' }}>
            <div style={{ ...MAXW, padding: '56px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 40 }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '0.12em', color: RED, marginBottom: 12 }}>{c.legal.imprintLabel}</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#666', margin: 0 }}>{c.legal.imprint}</p>
              </div>
              <div id="datenschutz">
                <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '0.12em', color: RED, marginBottom: 12 }}>{c.legal.privacyLabel}</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#666', margin: 0 }}>{c.legal.privacy}</p>
              </div>
            </div>
          </section>

          {/* Kontakt */}
          <section id="kontakt" style={{ background: '#F4F4F4', borderTop: '1px solid #E8E8E8' }}>
            <div style={{ ...MAXW, padding: SECTION_PAD, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 56, alignItems: 'start' }}>
              <div>
                <Kicker>{c.contact.kicker}</Kicker>
                <h2 style={h2Style}>{c.contact.title}</h2>
                <p style={{ fontSize: 17, lineHeight: 1.7, color: '#444', margin: '0 0 36px', maxWidth: '56ch' }}>{c.contact.text}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {c.contact.rows.map((r) => (
                    <div key={r.label} style={{ display: 'flex', gap: '6px 14px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', color: '#999', minWidth: 96, flexShrink: 0 }}>{r.label}</span>
                      {r.href ? <a href={r.href} style={{ fontSize: 16, fontWeight: 700 }}>{r.value}</a> : <span style={{ fontSize: 16, fontWeight: 700, color: '#222' }}>{r.value}</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="lc-reveal" style={{ background: '#fff', border: '1px solid #E8E8E8', borderTop: '4px solid ' + RED, borderRadius: 6, padding: 'clamp(32px, 3.5vw, 48px)', display: 'flex', flexDirection: 'column', gap: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <img src="/portrait-harald.png" alt={c.about.name} style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800 }}>{c.about.name}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: RED, marginTop: 3 }}>{c.contact.cardRole}</div>
                  </div>
                </div>
                <p style={{ fontSize: 16.5, lineHeight: 1.65, color: '#444', margin: 0 }}>{c.contact.cardText}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Button label={c.contact.callLabel} variant="primary" size="lg" width="100%" href={c.contact.callHref} />
                  <Button label={c.contact.mailLabel} variant="secondary" size="lg" width="100%" href={c.contact.mailHref} />
                </div>
                <div style={{ fontSize: 13.5, color: '#888', textAlign: 'center' }}>{c.contact.hours}</div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer style={{ background: '#111', color: '#fff' }}>
          <div style={{ ...MAXW, padding: '64px 24px 32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, paddingBottom: 48, borderBottom: '1px solid #2E2E2E' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: '0.14em', marginBottom: 14 }}>LUMACON<span style={{ color: RED }}>.</span></div>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#999', margin: 0, maxWidth: '34ch' }}>{c.footer.positioning}</p>
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '0.12em', color: '#777', marginBottom: 16 }}>{c.footer.navLabel}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {c.nav.map((n) => <a key={n.href} href={n.href} style={{ fontSize: 14.5, color: '#CCC' }}>{n.label}</a>)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '0.12em', color: '#777', marginBottom: 16 }}>{c.footer.contactLabel}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14.5, color: '#CCC' }}>
                  <a href="mailto:office@lumacon.at" style={{ color: '#CCC' }}>office@lumacon.at</a>
                  <a href={c.footer.phoneHref} style={{ color: '#CCC' }}>{c.footer.phone}</a>
                  <span>{c.footer.address}</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '0.12em', color: '#777', marginBottom: 16 }}>{c.footer.partnerLabel}</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#CCC', margin: '0 0 12px' }}>{c.footer.partnerText}</p>
                <a href={c.footer.partnerUrl} target="_blank" rel="noopener" style={{ fontSize: 14.5, fontWeight: 700, color: '#fff' }}>imos3d.com →</a>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 28px', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, fontSize: 13.5, color: '#888' }}>
              <span>© {year} {c.footer.copyright}</span>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {c.footer.links.map((l) => <a key={l.href} href={l.href} style={{ color: '#AAA' }}>{l.label}</a>)}
                <button onClick={() => { try { localStorage.removeItem('lc-cookie-consent'); } catch {} location.reload(); }} style={{ background: 'none', border: 'none', color: '#AAA', fontSize: 13.5, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>{c.footer.cookieLabel}</button>
              </div>
            </div>
          </div>
        </footer>

        <CookieBanner c={c} />
      </div>
    </Theme>
  );
}
