"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const marqueeItems = [
  { name: "Claude", color: "var(--violet)" },
  { name: "GPT-4", color: "var(--green)" },
  { name: "Gemini", color: "var(--sky)" },
  { name: "Mistral", color: "var(--ink-3)" },
  { name: "Slack", color: "var(--violet)" },
  { name: "GitHub", color: "var(--green)" },
  { name: "Jira", color: "var(--sky)" },
  { name: "PostgreSQL", color: "var(--ink-3)" },
  { name: "Webhooks", color: "var(--violet)" },
  { name: "Kafka", color: "var(--green)" },
];

const barHeights = [48, 62, 40, 70, 55, 82, 50, 66, 44, 74, 58, 90, 52, 68];

const agents = [
  { name: "support-bot", status: "ok", runs: "184 320", latency: "142 ms", uptime: "99,98 %" },
  { name: "data-sync", status: "run", runs: "41 208", latency: "880 ms", uptime: "99,95 %" },
  { name: "invoice-parser", status: "ok", runs: "12 640", latency: "1,2 s", uptime: "99,99 %" },
  { name: "lead-router", status: "warn", runs: "8 412", latency: "312 ms", uptime: "98,70 %" },
  { name: "qa-reviewer", status: "ok", runs: "5 100", latency: "2,1 s", uptime: "99,97 %" },
  { name: "doc-indexer", status: "ok", runs: "3 280", latency: "640 ms", uptime: "100 %" },
];

export function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeAgent, setActiveAgent] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---- Hero entrance ---- */
    const enters = Array.from(root.querySelectorAll<HTMLElement>(".enter"));
    if (enters.length) {
      const canAnimate = !reduced && document.visibilityState === "visible";
      if (!canAnimate) {
        enters.forEach((el) => el.classList.add("lit"));
      } else {
        enters.forEach((el) => el.classList.add("prep"));
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            enters.forEach((el) => {
              const delay = el.classList.contains("enter-term") ? 300 : (parseInt(el.dataset.delay || "0", 10));
              setTimeout(() => { el.classList.remove("prep"); el.classList.add("lit"); }, delay);
            });
          });
        });
        setTimeout(() => {
          enters.forEach((el) => {
            if (el.classList.contains("lit") && getComputedStyle(el).opacity === "1") return;
            el.style.transition = "none";
            el.classList.remove("prep");
            el.classList.add("lit");
          });
        }, 1400);
      }
    }

    /* ---- Terminal: reveal deploy log line by line ---- */
    const term = root.querySelector<HTMLElement>("[data-term]");
    if (term) {
      const tlines = Array.from(term.querySelectorAll<HTMLElement>(".term-line"));
      const canT = !reduced && document.visibilityState === "visible";
      if (!canT) {
        tlines.forEach((l) => l.classList.add("shown"));
      } else {
        tlines.forEach((l) => l.classList.add("prep"));
        requestAnimationFrame(() => {
          tlines.forEach((l, i) => {
            setTimeout(() => { l.classList.remove("prep"); l.classList.add("shown"); }, 720 + i * 260);
          });
        });
        setTimeout(() => {
          tlines.forEach((l) => {
            if (l.classList.contains("shown") && getComputedStyle(l).opacity === "1") return;
            l.style.transition = "none";
            l.classList.remove("prep");
            l.classList.add("shown");
          });
        }, 720 + tlines.length * 260 + 500);

        /* live request tail */
        const body = term.querySelector(".terminal-body");
        const cursorLine = term.querySelector(".term-cursor")?.closest(".term-line") || null;
        const reqEl = root.querySelector<HTMLElement>("[data-reqmin]");
        let reqVal = 1240;
        const paths = ["POST /chat", "GET /status", "POST /chat", "POST /tool/search", "POST /chat", "GET /health"];
        function pad(n: number) { return n < 10 ? "0" + n : "" + n; }
        let liveInterval: ReturnType<typeof setInterval>;

        function addLiveLine() {
          if (document.hidden || !body) return;
          const now = new Date();
          const t = pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
          const lat = 92 + Math.floor(Math.random() * 96);
          const path = paths[Math.floor(Math.random() * paths.length)];
          const line = document.createElement("span");
          line.className = "ln term-line live-line shown";
          line.innerHTML = `<span class="t-ok">✓</span> <span class="t-dim">${t}</span>  ${path} · <span class="t-dim">200</span> · ${lat} ms`;
          line.style.opacity = "0";
          line.style.transform = "translateY(4px)";
          if (cursorLine) body.insertBefore(line, cursorLine);
          else body.appendChild(line);
          requestAnimationFrame(() => {
            line.style.transition = "opacity .3s var(--ease-out-quart), transform .3s var(--ease-out-quart)";
            line.style.opacity = "1";
            line.style.transform = "none";
          });
          const lives = body.querySelectorAll(".live-line");
          if (lives.length > 3) lives[0].remove();
          body.scrollTop = body.scrollHeight;
          if (reqEl) {
            reqVal += Math.floor(Math.random() * 9) - 3;
            if (reqVal < 1180) reqVal = 1180;
            reqEl.textContent = reqVal.toLocaleString("cs-CZ");
          }
        }

        const liveStartDelay = 720 + tlines.length * 260 + 400;
        const liveTimeout = setTimeout(() => {
          if (body && cursorLine) {
            const divider = document.createElement("span");
            divider.className = "ln term-line shown";
            divider.innerHTML = '<span class="t-dim">── živý provoz ──────────────</span>';
            body.insertBefore(divider, cursorLine);
          }
          addLiveLine();
          liveInterval = setInterval(addLiveLine, 2100);
        }, liveStartDelay);

        /* subtle parallax */
        let pTicking = false;
        const handleScroll = () => {
          if (pTicking) return;
          pTicking = true;
          requestAnimationFrame(() => {
            const y = window.scrollY;
            if (y < 1000) term.style.transform = `translateY(${(y * 0.06).toFixed(1)}px)`;
            pTicking = false;
          });
        };
        if (!reduced) window.addEventListener("scroll", handleScroll, { passive: true });

        // Cleanup for live tail
        return () => {
          clearTimeout(liveTimeout);
          clearInterval(liveInterval);
          window.removeEventListener("scroll", handleScroll);
        };
      }
    }

    /* ---- Scroll reveal system ---- */
    if (!reduced && "IntersectionObserver" in window) {
      const revealEls = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
      revealEls.forEach((el) => el.classList.add("r-hidden"));

      const fire = (el: HTMLElement, instant: boolean) => {
        if (el.classList.contains("r-in")) return;
        const go = () => {
          if (instant) el.style.transition = "none";
          el.classList.remove("r-hidden");
          el.classList.add("r-in");
        };
        const delay = parseFloat(el.getAttribute("data-reveal-delay") || "0");
        if (instant || !delay) go(); else setTimeout(go, delay);
      };

      const rio = new IntersectionObserver((entries, obs) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          fire(en.target as HTMLElement, false);
          obs.unobserve(en.target);
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
      revealEls.forEach((el) => rio.observe(el));
      const safetyTimeout = setTimeout(() => { revealEls.forEach((el) => fire(el, true)); }, 6500);

      /* ---- Metric count-up ---- */
      function fmtNum(n: number, decimals: number) {
        if (decimals) return n.toFixed(decimals).replace(".", ",");
        const s = String(Math.round(n));
        return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      }
      function runCount(el: HTMLElement) {
        const target = parseFloat(el.getAttribute("data-count") || "0");
        const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
        const prefix = el.getAttribute("data-prefix") || "";
        const suffix = el.getAttribute("data-suffix") || "";
        const dur = 1300;
        let start: number | null = null;
        const final = prefix + fmtNum(target, decimals) + suffix;
        function frame(ts: number) {
          if (start === null) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + fmtNum(target * eased, decimals) + suffix;
          if (p < 1) requestAnimationFrame(frame);
          else el.textContent = final;
        }
        el.textContent = prefix + fmtNum(0, decimals) + suffix;
        requestAnimationFrame(frame);
        setTimeout(() => { el.textContent = final; }, dur + 500);
      }
      const counters = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"));
      if (counters.length) {
        const cio = new IntersectionObserver((entries, obs) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            runCount(en.target as HTMLElement);
            obs.unobserve(en.target);
          });
        }, { threshold: 0.5 });
        counters.forEach((el) => cio.observe(el));
      }

      return () => {
        rio.disconnect();
        clearTimeout(safetyTimeout);
      };
    }
  }, []);

  return (
    <div ref={rootRef}>
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div className="hero-copy">
              <h1 className="enter" data-delay="0">Dostaňte AI agenty z prototypu do produkce.</h1>
              <p className="hero-sub enter" data-delay="90">AgentOS je runtime, který vaše agenty nasadí, orchestruje a hlídá. Jeden příkaz — a běží v produkci s monitoringem, guardrails a škálováním. S libovolným modelem.</p>
              <div className="hero-actions enter" data-delay="160">
                <Link className="btn btn-white btn-lg" href="/cenik">Začít zdarma</Link>
                <Link className="btn btn-ghost-light btn-lg" href="/funkce">Prohlédnout funkce</Link>
              </div>
            </div>
            <div className="hero-term enter enter-term">
              <div className="terminal" data-term>
                <div className="terminal-bar">
                  <span className="tdot" style={{ background: "#ff5f57" }} />
                  <span className="tdot" style={{ background: "#febc2e" }} />
                  <span className="tdot" style={{ background: "#28c840" }} />
                  <span className="ttitle">~/support-bot — agentos</span>
                </div>
                <div className="terminal-body">
                  <span className="ln term-line"><span className="t-prompt">$</span> <span className="t-cmd">agentos deploy</span></span>
                  <span className="ln term-line"><span className="t-ok">✓</span> Detekován agent <span className="t-dim">support-bot</span> · model <span className="t-dim">claude-sonnet</span></span>
                  <span className="ln term-line"><span className="t-ok">✓</span> Build dokončen za 4.2s</span>
                  <span className="ln term-line"><span className="t-ok">✓</span> Guardrails aktivní: rate-limit, PII-filtr, retry</span>
                  <span className="ln term-line"><span className="t-arrow">→</span> Nasazuji do produkce…</span>
                  <span className="ln term-line"><span className="t-ok">✓</span> Live: <span className="t-url">https://support-bot.agentos.app</span></span>
                  <span className="ln term-line"><span className="t-dim">  3 repliky · eu-central · p50 142ms · 0 chyb</span></span>
                  <span className="ln term-line"><span className="t-prompt">$</span> <span className="term-cursor blink" /></span>
                </div>
                <div className="terminal-foot">
                  <span className="live-dot" /> běží · <span data-reqmin>1 240</span> req/min · 99,98 % úspěšnost
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="marquee" aria-label="Podporované integrace a modely">
        <div className="marquee-track">
          {[0, 1].map((r) =>
            marqueeItems.map((item, i) => (
              <span key={`${r}-${i}`} className="marquee-item">
                <span className="dot" style={{ background: item.color }} />
                {item.name}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ============ 3 KLÍČOVÉ FUNKCE ============ */}
      <section className="section">
        <div className="wrap">
          <div className="shead center" data-reveal="up">
            <h2>Tři věci, které agent v produkci potřebuje.</h2>
            <p>Vy řešíte logiku agenta. AgentOS řeší zbytek.</p>
          </div>
          <div className="feat-grid">
            {/* Orchestrace */}
            <article className="feat" data-reveal="up" data-reveal-delay="0">
              <div className="viz viz-orch">
                <div className="flow">
                  <span className="node">Vstup</span>
                  <span className="wire" />
                  <span className="node accent">Agent</span>
                  <span className="wire" />
                  <span className="node">Nástroj</span>
                  <span className="wire" />
                  <span className="node">Výstup</span>
                </div>
                <span className="pulse" />
              </div>
              <span className="tick" style={{ background: "var(--violet)" }} />
              <span className="tag">Orchestrace</span>
              <h3>Workflow, které drží</h3>
              <p>Řetězte agenty, nástroje a kroky do workflow. Větvení, retry a fallback na jiný model bez psaní vlastní infrastruktury.</p>
            </article>

            {/* Monitoring */}
            <article className="feat" data-reveal="up" data-reveal-delay="90">
              <div className="viz viz-mon">
                <span className="live"><i />{" "}live</span>
                <div className="bars">
                  {[42, 64, 38, 78, 54, 88, 60].map((h, i) => (
                    <span key={i} className="bar" style={{ "--h": `${h}%`, "--i": i, height: `${h}%` } as React.CSSProperties} />
                  ))}
                </div>
              </div>
              <span className="tick" style={{ background: "var(--sky)" }} />
              <span className="tag">Monitoring</span>
              <h3>Vidíte každý běh</h3>
              <p>Traces, náklady na token, latence a chybovost v reálném čase. Alerty, když agent začne halucinovat nebo přepalovat rozpočet.</p>
            </article>

            {/* Škálování */}
            <article className="feat" data-reveal="up" data-reveal-delay="180">
              <div className="viz viz-scale">
                <span className="tag-n">×8</span>
                <div className="reps">
                  {[true, true, false, false, true, false, true, false].map((on, i) => (
                    <span key={i} className={`rep${on ? " on" : ""}`} style={{ "--i": i } as React.CSSProperties} />
                  ))}
                </div>
              </div>
              <span className="tick" style={{ background: "var(--green)" }} />
              <span className="tag">Škálování</span>
              <h3>Z nuly na tisíce</h3>
              <p>Automatické škálování replik podle zátěže. Rate-limity, fronty a izolace, aby jeden agent nepoložil ostatní.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ============ PRODUCT PREVIEW (dashboard) ============ */}
      <section className="section showcase-sec">
        <div className="wrap">
          <div className="shead center" data-reveal="up">
            <h2>Jeden přehled o všech vašich agentech.</h2>
            <p>Stav, latence, náklady a logy běhů — bez přepínání mezi pěti nástroji.</p>
          </div>
          <div className="showcase" data-reveal="scale">
            <div className="browser">
              <div className="browser-bar">
                <span className="dots"><i style={{ background: "#ff5f57" }} /><i style={{ background: "#febc2e" }} /><i style={{ background: "#28c840" }} /></span>
                <span className="browser-url">app.agentos.app/prehled</span>
              </div>
              <div className="dash">
                <aside className="dash-side">
                  <div className="side-h">Agenti</div>
                  {agents.map((a, i) => (
                    <div key={a.name} className={`agent-row${i === activeAgent ? " active" : ""}`} onClick={() => setActiveAgent(i)}>
                      <span className={`st ${a.status}`} /> {a.name}
                    </div>
                  ))}
                </aside>
                <div className="dash-main">
                  <div className="dash-tiles">
                    <div className="tile"><div className="tk">Běhů / 24 h</div><div className="tv">{agents[activeAgent].runs}</div><div className="td up">▲ 12 %</div></div>
                    <div className="tile"><div className="tk">p50 latence</div><div className="tv">{agents[activeAgent].latency}</div><div className="td up">▼ 8 ms</div></div>
                    <div className="tile"><div className="tk">Úspěšnost</div><div className="tv">{agents[activeAgent].uptime}</div><div className="td up">stabilní</div></div>
                  </div>
                  <div className="dash-chart">
                    <div className="ch-h"><b>Latence runtime</b><span>posledních 24 h · ms</span></div>
                    <div className="ch-bars">
                      {barHeights.map((h, i) => (
                        <span key={i} className="b" style={{ "--h": `${h}%`, "--i": i, height: `${h}%` } as React.CSSProperties} />
                      ))}
                    </div>
                  </div>
                  <div className="dash-log">
                    <div className="lg"><span className="ok">✓</span><span className="tm">14:02:11</span> {agents[activeAgent].name} · POST /chat · 200 · 128 ms</div>
                    <div className="lg"><span className="ok">✓</span><span className="tm">14:02:10</span> {agents[activeAgent].name} · job#4821 · hotovo · 1,2 s</div>
                    <div className="lg"><span className="ok">✓</span><span className="tm">14:02:09</span> {agents[activeAgent].name} · 3 200 záznamů · 880 ms</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS (dark) ============ */}
      <section className="section dark-sec">
        <div className="wrap">
          <div className="shead center" data-reveal="up">
            <h2>Od commitu do produkce ve třech krocích.</h2>
            <p>Žádné Dockerfily, žádné Kubernetes manifesty. Popíšete agenta a zbytek je na nás.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 48 }}>
            {/* Step 01 — Connect */}
            <div style={{ background: "#1e1b25", border: "1px solid #2d2838", borderRadius: 16, padding: 24 }} data-reveal="up" data-reveal-delay="0">
              <div style={{ height: 140, borderRadius: 12, background: "linear-gradient(135deg, #1a1320, #221a2e)", border: "1px solid #2d2838", padding: 18, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: "#2d2838", border: "1px solid #3f3f46", fontSize: "0.78rem", fontWeight: 600, color: "#d4d4d8" }}>
                    &#9776; repo
                  </span>
                  <span style={{ width: 60, height: 2, background: "#3f3f46", position: "relative" }}>
                    <span className="hiw-spark" />
                  </span>
                  <span style={{ display: "flex", alignItems: "center", padding: "8px 12px", borderRadius: 10, background: "#2d2838", border: "1px solid #3f3f46" }}>
                    <svg width="24" height="24" viewBox="0 0 26 26" fill="none"><rect x="1.25" y="1.25" width="23.5" height="23.5" rx="7" stroke="#a78bfa" strokeWidth="2.5"/><circle cx="13" cy="13" r="4" fill="#a78bfa"/></svg>
                  </span>
                </div>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem", fontWeight: 700, color: "#71717a", marginTop: 12, justifyContent: "center" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399" }} />
                  Připojeno
                </span>
              </div>
              <span style={{ display: "inline-block", fontWeight: 800, fontSize: "0.875rem", color: "#a78bfa", marginBottom: 8, marginTop: 16 }}>01</span>
              <h3 style={{ color: "#fff", fontSize: "1.25rem", marginBottom: 8 }}>Připojte agenta</h3>
              <p style={{ color: "#a1a1aa", fontSize: "0.9375rem", lineHeight: 1.55 }}>Ukažte na svůj repozitář nebo endpoint. AgentOS rozpozná model, nástroje a závislosti automaticky.</p>
            </div>

            {/* Step 02 — Config */}
            <div style={{ background: "#1e1b25", border: "1px solid #2d2838", borderRadius: 16, padding: 24 }} data-reveal="up" data-reveal-delay="120">
              <div style={{ height: 140, borderRadius: 12, background: "linear-gradient(135deg, #1a1320, #221a2e)", border: "1px solid #2d2838", padding: 18, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 3, fontFamily: "ui-monospace, monospace", fontSize: "0.74rem", lineHeight: 1.7 }}>
                  <span style={{ color: "#b9a8d4" }}><span style={{ color: "#a78bfa" }}>name:</span> support-bot</span>
                  <span style={{ color: "#b9a8d4" }}><span style={{ color: "#a78bfa" }}>model:</span> <span style={{ color: "#34d399" }}>claude-sonnet</span></span>
                  <span style={{ color: "#b9a8d4" }}><span style={{ color: "#a78bfa" }}>tools:</span> <span style={{ color: "#8b7da3" }}>[3 aktivní]</span></span>
                  <span style={{ color: "#b9a8d4" }}><span style={{ color: "#a78bfa" }}>guardrails:</span> <span style={{ color: "#34d399" }}>true</span></span>
                  <span style={{ color: "#b9a8d4" }}><span style={{ color: "#a78bfa" }}>scaling:</span> auto<span className="term-cursor blink" style={{ width: 7, height: 14 }} /></span>
                </div>
              </div>
              <span style={{ display: "inline-block", fontWeight: 800, fontSize: "0.875rem", color: "#a78bfa", marginBottom: 8, marginTop: 16 }}>02</span>
              <h3 style={{ color: "#fff", fontSize: "1.25rem", marginBottom: 8 }}>Definujte workflow</h3>
              <p style={{ color: "#a1a1aa", fontSize: "0.9375rem", lineHeight: 1.55 }}>Popište kroky, guardrails a limity v jednom konfiguračním souboru. Verzované, review-ovatelné, opakovatelné.</p>
            </div>

            {/* Step 03 — Deploy */}
            <div style={{ background: "#1e1b25", border: "1px solid #2d2838", borderRadius: 16, padding: 24 }} data-reveal="up" data-reveal-delay="240">
              <div style={{ height: 140, borderRadius: 12, background: "linear-gradient(135deg, #1a1320, #221a2e)", border: "1px solid #2d2838", padding: 18, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>✓ Build</span>
                  <span style={{ fontSize: "0.72rem", fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>✓ Tests</span>
                  <span style={{ fontSize: "0.72rem", fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>✓ Deploy</span>
                  <span className="hiw-live-badge" style={{ fontSize: "0.72rem", fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: "rgba(167,139,250,0.12)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)" }}>● Live</span>
                </div>
                <div style={{ height: 6, borderRadius: 4, background: "#2d2838", overflow: "hidden" }}>
                  <span className="hiw-deploy-bar" />
                </div>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem", fontWeight: 700, color: "#71717a" }}>
                  <span className="live-dot" style={{ width: 7, height: 7 }} />
                  Produkce
                </span>
              </div>
              <span style={{ display: "inline-block", fontWeight: 800, fontSize: "0.875rem", color: "#a78bfa", marginBottom: 8, marginTop: 16 }}>03</span>
              <h3 style={{ color: "#fff", fontSize: "1.25rem", marginBottom: 8 }}>Nasaďte a sledujte</h3>
              <p style={{ color: "#a1a1aa", fontSize: "0.9375rem", lineHeight: 1.55 }}><code style={{ color: "#c4b5fd", fontFamily: "ui-monospace, monospace" }}>agentos deploy</code> — a máte živý endpoint, traces a alerty. Bez DevOps tiketů.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SOCIAL PROOF ============ */}
      <section className="section">
        <div className="wrap">
          <div className="proof">
            <div data-reveal="left">
              <h2>Používá 2&nbsp;000+ týmů, které nechtějí stavět infrastrukturu znovu.</h2>
              <div className="metrics">
                <div className="metric">
                  <div className="v" data-count="50" data-suffix="k+">50k+</div>
                  <div className="k">agentů v produkci</div>
                  <div className="spark">{[40, 62, 52, 80, 70, 96].map((h, i) => <i key={i} style={{ "--h": `${h}%`, "--i": i, height: `${h}%` } as React.CSSProperties} />)}</div>
                </div>
                <div className="metric">
                  <div className="v" data-count="99.9" data-decimals="1" data-suffix=" %">99,9 %</div>
                  <div className="k">dostupnost</div>
                  <div className="spark">{[88, 92, 85, 96, 90, 98].map((h, i) => <i key={i} style={{ "--h": `${h}%`, "--i": i, height: `${h}%` } as React.CSSProperties} />)}</div>
                </div>
                <div className="metric">
                  <div className="v" data-count="200" data-prefix="<" data-suffix=" ms">&lt;200 ms</div>
                  <div className="k">p50 latence runtime</div>
                  <div className="spark">{[70, 54, 60, 46, 52, 40].map((h, i) => <i key={i} style={{ "--h": `${h}%`, "--i": i, height: `${h}%` } as React.CSSProperties} />)}</div>
                </div>
                <div className="metric">
                  <div className="v" data-count="500" data-suffix="+">500+</div>
                  <div className="k">integrací a nástrojů</div>
                  <div className="spark">{[34, 48, 58, 72, 84, 100].map((h, i) => <i key={i} style={{ "--h": `${h}%`, "--i": i, height: `${h}%` } as React.CSSProperties} />)}</div>
                </div>
              </div>
            </div>
            <figure className="quote-card" data-reveal="right">
              <blockquote>„Měli jsme agenta, co fungoval na laptopu. AgentOS ho dostal do produkce za odpoledne — a poprvé jsme viděli, kolik nás reálně stojí."</blockquote>
              <figcaption className="quote-by">
                <span className="av">KN</span>
                <span className="who"><b>Karolína Němcová</b><span>Head of Platform, Datovka</span></span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cta-band" data-reveal="up">
            <div>
              <h2>Nasaďte prvního agenta dnes.</h2>
              <p>Starter plán je zdarma, bez karty. Za pět minut máte živý endpoint.</p>
            </div>
            <div className="actions">
              <Link className="btn btn-white btn-lg" href="/cenik">Začít zdarma</Link>
              <Link className="btn btn-ghost-light btn-lg" href="/kontakt">Promluvit s týmem</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
