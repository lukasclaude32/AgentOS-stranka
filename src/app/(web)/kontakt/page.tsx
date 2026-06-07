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

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function KontaktPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  useReveal(rootRef);

  function validate(form: HTMLFormElement): FormErrors {
    const errs: FormErrors = {};
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim();
    if (!name) errs.name = "Jméno je povinné";
    if (!email) errs.email = "Email je povinný";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Neplatný formát emailu";
    if (!message) errs.message = "Zpráva je povinná";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const errs = validate(form);
    setTouched({ name: true, email: true, message: true });
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
          email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
          company: (form.elements.namedItem("company") as HTMLInputElement).value.trim(),
          subject: (form.elements.namedItem("subject") as HTMLSelectElement).value,
          message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
        }),
      });
    } catch { /* silent — show success anyway */ }
    setSent(true);
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  return (
    <div ref={rootRef}>
      <section className="section">
        <div className="wrap">
          <div className="contact-grid">
            {/* LEFT: Info */}
            <div className="contact-info" data-reveal="left">
              <h1>Ozvěte se</h1>
              <p>Chcete demo, máte technický dotaz, nebo vás zajímá enterprise spolupráce? Napište nám — ozveme se do 24 hodin.</p>

              <dl className="contact-dl">
                <div>
                  <dt>Email</dt>
                  <dd>hello@agentos.dev</dd>
                </div>
                <div>
                  <dt>Podpora</dt>
                  <dd>support@agentos.dev</dd>
                </div>
                <div>
                  <dt>Sídlo</dt>
                  <dd>Praha, Česká republika</dd>
                </div>
                <div>
                  <dt>Dostupnost</dt>
                  <dd>Po-Pá, 9:00 - 18:00 CET</dd>
                </div>
              </dl>

              <div style={{ marginTop: "var(--s12)" }}>
                <Link className="btn btn-outline" href="/cenik">Zobrazit cenový přehled &rarr;</Link>
              </div>
            </div>

            {/* RIGHT: Form */}
            <div data-reveal="right" data-reveal-delay="100">
              {sent ? (
                <div className="form-card">
                  <div className="form-success">
                    <div className="checkmark">&#10003;</div>
                    <h3>Odesláno</h3>
                    <p>Děkujeme za zprávu. Ozveme se do 24 hodin.</p>
                  </div>
                </div>
              ) : (
                <form className="form-card" onSubmit={handleSubmit} noValidate>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--s4)" }}>
                    <div className="form-row">
                      <div className="field">
                        <label htmlFor="c-name">Jméno</label>
                        <input
                          id="c-name"
                          name="name"
                          type="text"
                          placeholder="Jan Novák"
                          className={touched.name && errors.name ? "invalid" : ""}
                          onBlur={() => handleBlur("name")}
                        />
                        {touched.name && errors.name && <span className="field-err">{errors.name}</span>}
                      </div>
                      <div className="field">
                        <label htmlFor="c-email">Email</label>
                        <input
                          id="c-email"
                          name="email"
                          type="email"
                          placeholder="jan@firma.cz"
                          className={touched.email && errors.email ? "invalid" : ""}
                          onBlur={() => handleBlur("email")}
                        />
                        {touched.email && errors.email && <span className="field-err">{errors.email}</span>}
                      </div>
                    </div>

                    <div className="field">
                      <label htmlFor="c-company">Firma</label>
                      <input id="c-company" name="company" type="text" placeholder="Volitelné" />
                    </div>

                    <div className="field">
                      <label htmlFor="c-subject">Téma</label>
                      <select id="c-subject" name="subject">
                        <option value="demo">Demo / prezentace</option>
                        <option value="tech">Technický dotaz</option>
                        <option value="enterprise">Enterprise spolupráce</option>
                        <option value="other">Jiné</option>
                      </select>
                    </div>

                    <div className="field">
                      <label htmlFor="c-message">Zpráva</label>
                      <textarea
                        id="c-message"
                        name="message"
                        placeholder="Popište svůj projekt nebo otázku..."
                        rows={5}
                        className={touched.message && errors.message ? "invalid" : ""}
                        onBlur={() => handleBlur("message")}
                      />
                      {touched.message && errors.message && <span className="field-err">{errors.message}</span>}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                      Odeslat zprávu
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cta-band" data-reveal="up">
            <div>
              <h2>Nechcete čekat? Začněte hned.</h2>
              <p>Starter plán je zdarma, bez karty. Nasaďte prvního agenta za pár minut.</p>
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
