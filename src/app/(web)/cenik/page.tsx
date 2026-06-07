"use client";

import { useEffect, useRef, useState } from "react";
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

const plans = [
  {
    name: "Starter", price: "Zdarma", period: null, hot: false,
    desc: "Pro individuální vývojáře a experimenty.",
    cta: "Začít zdarma", ctaHref: "/kontakt",
    features: ["3 agenti", "1 000 exekucí/měs", "Komunitní podpora", "Základní monitoring", "1 prostředí"],
  },
  {
    name: "Pro", price: "€49", period: "/měsíc", hot: true,
    desc: "Pro týmy, které to myslí vážně.",
    cta: "14 dní zdarma", ctaHref: "/kontakt", badge: "Nejoblíbenější",
    features: ["Neomezení agenti", "50 000 exekucí/měs", "Prioritní podpora", "Pokročilý monitoring", "Neomezená prostředí", "Verzování agentů", "Vlastní guardrails"],
  },
  {
    name: "Enterprise", price: "Na míru", period: null, hot: false,
    desc: "Pro organizace s vlastními požadavky.",
    cta: "Kontaktujte nás", ctaHref: "/kontakt",
    features: ["Vše z Pro", "Dedicated infra", "SSO + SAML", "SLA 99,99 %", "Account manager", "On-premise", "Custom integrace"],
  },
];

const faqs = [
  { q: "Můžu zrušit kdykoli?", a: "Ano. Žádné smlouvy. Zrušíte jedním klikem a data zůstanou dostupná ještě 30 dní." },
  { q: "Co když překročím limit exekucí?", a: "Dostanete notifikaci a nabídku upgradovat. Nic se nezastaví — agenti běží dál." },
  { q: "Podporujete vlastní modely?", a: "Ano. Jakýkoli model s HTTP endpointem — fine-tuny, open-source, cokoliv. Stačí zadat URL." },
  { q: "Kde běží infrastruktura?", a: "EU (Frankfurt) a US (Virginia). Enterprise si volí region nebo on-premise nasazení." },
  { q: "Jak funguje fakturace?", a: "Měsíční fakturace. Platíte za aktivní plán, ne za jednotlivé API cally modelu — ty jdou přímo k poskytovateli." },
  { q: "Nabízíte slevu pro startupy?", a: "Ano. Napište nám na hello@agentos.dev s popisem projektu a domluvíme se." },
];

export default function CenikPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  useReveal(rootRef);

  return (
    <div ref={rootRef}>
      {/* ===== HERO ===== */}
      <section className="phero center">
        <div className="wrap">
          <h1 data-reveal="up" style={{ maxWidth: "20ch" }}>Jednoduché a průhledné ceny</h1>
          <p data-reveal="up" data-reveal-delay="80">Začněte zdarma. Škálujte když potřebujete. Žádné skryté poplatky.</p>
        </div>
      </section>

      {/* ===== PLANS ===== */}
      <section className="section">
        <div className="wrap">
          <div className="plans" data-reveal="up">
            {plans.map((plan, i) => (
              <div key={i} className={`plan${plan.hot ? " hot" : ""}`} data-reveal="up" data-reveal-delay={i * 100}>
                {plan.badge && <span className="badge">{plan.badge}</span>}
                <span className="plan-name">{plan.name}</span>
                <div className="plan-price">
                  {plan.price}
                  {plan.period && <span> {plan.period}</span>}
                </div>
                <p className="plan-desc">{plan.desc}</p>
                <div className="plan-cta">
                  <Link
                    className={`btn ${plan.hot ? "btn-white" : "btn-primary"}`}
                    href={plan.ctaHref}
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    {plan.cta}
                  </Link>
                </div>
                <ul className="plan-feats">
                  {plan.features.map((f, j) => (
                    <li key={j}>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ (dark) ===== */}
      <section className="section dark-sec">
        <div className="wrap">
          <div className="faq-layout">
            <aside className="faq-aside" data-reveal="left">
              <h2>Časté otázky</h2>
              <p>Nenašli jste odpověď? Napište nám a ozveme se do 24 hodin.</p>
              <div style={{ marginTop: "var(--s8)" }}>
                <Link className="btn btn-ghost-light" href="/kontakt">Kontaktovat tým</Link>
              </div>
            </aside>
            <div data-faq data-reveal="right">
              {faqs.map((faq, i) => (
                <div className="faq-item" key={i}>
                  <button
                    className="faq-q"
                    aria-expanded={openFaq === i}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {faq.q}
                    <span className="pm">+</span>
                  </button>
                  {openFaq === i && <div className="faq-a">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cta-band" data-reveal="up">
            <div>
              <h2>Nasaďte prvního agenta dnes.</h2>
              <p>Starter plán je zdarma, bez karty. Za pět minut máte živý endpoint.</p>
            </div>
            <div className="actions">
              <Link className="btn btn-white btn-lg" href="/kontakt">Začít zdarma</Link>
              <Link className="btn btn-ghost-light btn-lg" href="/kontakt">Promluvit s týmem</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
