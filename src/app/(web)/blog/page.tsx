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

const topics = ["Engineering", "Best practices", "Produkt", "Security", "Tutoriály", "Novinky"];

const posts = [
  {
    title: "Jak jsme škálovali na 10 000 souběžných agentů",
    excerpt: "Migrace z monolitu na event-driven architekturu a snížení latence o 60 %. Detailní pohled do naší infrastruktury.",
    cat: "Engineering", date: "28. 5. 2026", featured: true,
  },
  {
    title: "5 chyb při nasazení AI agentů",
    excerpt: "Chybějící guardrails, absence monitoringu — a jak se tomu vyhnout v produkci.",
    cat: "Best practices", date: "21. 5. 2026",
  },
  {
    title: "AgentOS 2.0: co je nového",
    excerpt: "Vizuální canvas, A/B testování agentů, 200 nových konektorů a vylepšený monitoring.",
    cat: "Produkt", date: "14. 5. 2026",
  },
  {
    title: "Guardrails pro AI agenty",
    excerpt: "Bezpečnostní politiky, rate limiting a obsahové filtry pro produkci. Praktický průvodce.",
    cat: "Security", date: "7. 5. 2026",
  },
  {
    title: "Multi-agent orchestrace: vzory a anti-vzory",
    excerpt: "Fan-out, pipeline, hierarchický model — kdy co použít a čeho se vyvarovat.",
    cat: "Engineering", date: "30. 4. 2026",
  },
];

export default function BlogPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div ref={rootRef}>
      {/* ===== HERO ===== */}
      <section className="phero">
        <div className="wrap">
          <div className="phero-grid">
            <div>
              <h1 data-reveal="left">Blog a novinky</h1>
              <p data-reveal="left" data-reveal-delay="80">Návody, postřehy a novinky z ekosystému AI agentů. Všechno co potřebujete vědět pro úspěšné nasazení.</p>
            </div>
            <div data-reveal="right" data-reveal-delay="120">
              <div className="topics-card">
                {topics.map((t, i) => (
                  <span key={i} className={`chip${i === 0 ? " active" : ""}`}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED POST ===== */}
      <section className="section">
        <div className="wrap">
          <Link href="#" className="post-featured" data-reveal="up">
            <div className="post-media">&#9654;</div>
            <div className="post-body">
              <span className="post-meta">{featured.cat} &middot; {featured.date}</span>
              <h2 style={{ fontSize: "clamp(1.3rem, 2.4vw, 1.75rem)", marginTop: "var(--s2)" }}>{featured.title}</h2>
              <p style={{ marginTop: "var(--s3)", color: "var(--ink-2)", lineHeight: 1.6 }}>{featured.excerpt}</p>
              <span style={{ marginTop: "var(--s4)", color: "var(--violet)", fontWeight: 700, fontSize: "0.9375rem" }}>Číst článek &rarr;</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ===== POST GRID ===== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="shead" data-reveal="up">
            <h2>Další články</h2>
          </div>
          <div className="post-grid">
            {rest.map((post, i) => (
              <Link href="#" key={i} className="post-card" data-reveal="up" data-reveal-delay={i * 80}>
                <span className="post-meta">{post.cat} &middot; {post.date}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cta-band" data-reveal="up">
            <div>
              <h2>Chcete zkoušet, ne jen číst?</h2>
              <p>Založte si účet zdarma a nasaďte prvního agenta během minut.</p>
            </div>
            <div className="actions">
              <Link className="btn btn-white btn-lg" href="/cenik">Začít zdarma</Link>
              <Link className="btn btn-ghost-light btn-lg" href="/funkce">Prohlédnout funkce</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
