"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

function useReveal(rootRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return;

    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    els.forEach((el) => el.classList.add("r-hidden"));

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
    els.forEach((el) => rio.observe(el));

    const safety = setTimeout(() => els.forEach((el) => fire(el, true)), 6500);
    return () => { rio.disconnect(); clearTimeout(safety); };
  }, [rootRef]);
}

const features = [
  {
    tag: "Orchestrace", color: "var(--violet)", title: "Vizuální workflow engine",
    desc: "Drag-and-drop canvas pro multi-agentové workflow. Handoff, podmínky, fallbacky a 50+ šablon na start.",
    vizType: "orch" as const,
  },
  {
    tag: "Monitoring", color: "var(--sky)", title: "Real-time přehled",
    desc: "Trace každého rozhodnutí a tool callu. Debug za sekundy. Alerting na anomálie, halucinace a náklady.",
    vizType: "mon" as const,
  },
  {
    tag: "Pravidla", color: "var(--green)", title: "Guardrails a bezpečnost",
    desc: "Bezpečnostní politiky per agent. Rate limiting, obsahové filtry, schvalovací brány. SOC 2 Type II.",
    vizType: "rules" as const,
  },
  {
    tag: "Integrace", color: "var(--violet)", title: "500+ konektorů",
    desc: "Napojte jakékoliv API, databázi nebo službu. Sdílený registr nástrojů. Vlastní konektory během minut.",
    vizType: "int" as const,
  },
  {
    tag: "Verzování", color: "var(--sky)", title: "Git-native verzování",
    desc: "Verzujte agenty jako kód. A/B testujte, rollbackujte, promujte mezi prostředími. Plná historie změn.",
    vizType: "ver" as const,
  },
  {
    tag: "Nasazení", color: "var(--green)", title: "Zero-config deploy",
    desc: "Jeden příkaz a agent běží v produkci. Automatické škálování, health checky a rolling updaty.",
    vizType: "deploy" as const,
  },
];

function Viz({ type }: { type: string }) {
  switch (type) {
    case "orch":
      return (
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
      );
    case "mon":
      return (
        <div className="viz viz-mon">
          <span className="live"><i /> live</span>
          <div className="bars">
            {[42, 64, 38, 78, 54, 88, 60].map((h, i) => (
              <span key={i} className="bar" style={{ "--h": `${h}%`, "--i": i, height: `${h}%` } as React.CSSProperties} />
            ))}
          </div>
        </div>
      );
    case "rules":
      return (
        <div className="viz viz-rules">
          <div className="checklist">
            <span className="chk"><i className="ok">&#10003;</i> PII filtr aktivní</span>
            <span className="chk"><i className="ok">&#10003;</i> Rate limit 100 req/s</span>
            <span className="chk"><i className="fail">&#10007;</i> Toxický obsah</span>
            <span className="chk"><i className="ok">&#10003;</i> Schvalovací brána</span>
          </div>
        </div>
      );
    case "int":
      return (
        <div className="viz viz-int">
          <div className="logos">
            <span className="lbox accent">Slack</span>
            <span className="lbox">Jira</span>
            <span className="lbox">PG</span>
            <span className="lbox">GitHub</span>
            <span className="lbox accent">API</span>
            <span className="lbox">S3</span>
          </div>
        </div>
      );
    case "ver":
      return (
        <div className="viz viz-ver">
          <div className="branches">
            <span className="br"><span className="br-dot" style={{ background: "var(--violet)" }} /><span className="br-line" /> main v2.4</span>
            <span className="br"><span className="br-dot" style={{ background: "var(--green)" }} /><span className="br-line" /> staging v2.5-rc</span>
            <span className="br"><span className="br-dot" style={{ background: "var(--sky)" }} /><span className="br-line" /> experiment/ab-test</span>
          </div>
        </div>
      );
    case "deploy":
      return (
        <div className="viz viz-deploy">
          <div className="prog-wrap">
            <div className="prog-label"><span>Nasazení</span><span>78 %</span></div>
            <div className="prog-track"><div className="prog-fill" style={{ width: "78%" }} /></div>
            <div className="prog-steps">
              <span className="prog-dot done" />
              <span className="prog-dot done" />
              <span className="prog-dot done" />
              <span className="prog-dot" />
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function FunkcePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div ref={rootRef}>
      {/* ===== HERO ===== */}
      <section className="phero">
        <div className="wrap">
          <div className="phero-grid">
            <div>
              <h1 data-reveal="left">Všechno co vaši agenti potřebují</h1>
              <p data-reveal="left" data-reveal-delay="80">Od nasazení po monitoring. Jediná platforma, která pokryje celý životní cyklus AI agenta v produkci.</p>
              <div style={{ marginTop: "var(--s8)", display: "flex", gap: "var(--s3)", flexWrap: "wrap" }} data-reveal="left" data-reveal-delay="160">
                <Link className="btn btn-white btn-lg" href="/cenik">Začít zdarma</Link>
                <Link className="btn btn-ghost-light btn-lg" href="/kontakt">Domluvit demo</Link>
              </div>
            </div>
            <div data-reveal="right" data-reveal-delay="120">
              <div className="codecard">
                <div className="codecard-bar">
                  <span className="tdot" style={{ background: "#ff5f57" }} />
                  <span className="tdot" style={{ background: "#febc2e" }} />
                  <span className="tdot" style={{ background: "#28c840" }} />
                  <span className="fname">agent.yaml</span>
                </div>
                <div className="codecard-body">
                  <span className="ln"><span className="ck">name:</span> support-bot</span>
                  <span className="ln"><span className="ck">model:</span> <span className="cv">claude-sonnet</span></span>
                  <span className="ln"><span className="ck">tools:</span></span>
                  <span className="ln">  - <span className="cv">knowledge-base</span></span>
                  <span className="ln">  - <span className="cv">ticket-system</span></span>
                  <span className="ln">  - <span className="cv">slack-notify</span></span>
                  <span className="ln"><span className="ck">guardrails:</span></span>
                  <span className="ln">  <span className="ck">rate_limit:</span> <span className="cn">100</span><span className="cd">/min</span></span>
                  <span className="ln">  <span className="ck">pii_filter:</span> <span className="cv">true</span></span>
                  <span className="ln">  <span className="ck">max_tokens:</span> <span className="cn">4096</span></span>
                  <span className="ln"><span className="ck">scaling:</span> <span className="cv">auto</span> <span className="cd"># 1-50 replik</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES 2-COL ===== */}
      <section className="section">
        <div className="wrap">
          <div className="shead center" data-reveal="up">
            <h2>Šest pilířů produkční AI platformy.</h2>
            <p>Každý agent potřebuje orchestraci, bezpečnost, monitoring, integrace, verzování a nasazení. Všechno na jednom místě.</p>
          </div>
          <div className="feat-grid-2">
            {features.map((f, i) => (
              <article className="feat" key={i} data-reveal="up" data-reveal-delay={i * 80}>
                <Viz type={f.vizType} />
                <span className="tick" style={{ background: f.color }} />
                <span className="tag">{f.tag}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS (dark) ===== */}
      <section className="section dark-sec">
        <div className="wrap">
          <div className="shead shead-2col" data-reveal="up">
            <h2>Od commitu do produkce ve třech krocích.</h2>
            <p>Žádné Dockerfily, žádné Kubernetes manifesty. Popíšete agenta a zbytek je na nás.</p>
          </div>
          <div className="steps" data-reveal="up">
            <span className="connector" />
            <div className="step">
              <span className="num">01</span>
              <h3>Připojte agenta</h3>
              <p>Ukažte na svůj repozitář nebo endpoint. AgentOS rozpozná model, nástroje a závislosti automaticky.</p>
            </div>
            <div className="step">
              <span className="num">02</span>
              <h3>Definujte workflow</h3>
              <p>Popište kroky, guardrails a limity v jednom konfiguračním souboru. Verzované, review-ovatelné, opakovatelné.</p>
            </div>
            <div className="step">
              <span className="num">03</span>
              <h3>Nasaďte a sledujte</h3>
              <p><code style={{ color: "#c4b5fd", fontFamily: "ui-monospace, monospace" }}>agentos deploy</code> — a máte živý endpoint, traces a alerty. Bez DevOps tiketů.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cta-band" data-reveal="up">
            <div>
              <h2>Chcete to vidět naživo?</h2>
              <p>Starter plán je zdarma, bez karty. Za pět minut máte živý endpoint.</p>
            </div>
            <div className="actions">
              <Link className="btn btn-white btn-lg" href="/cenik">Vybrat plán</Link>
              <Link className="btn btn-ghost-light btn-lg" href="/kontakt">Promluvit s týmem</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
