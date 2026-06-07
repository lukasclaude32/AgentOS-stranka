"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/funkce", label: "Funkce" },
  { href: "/cenik", label: "Ceník" },
  { href: "/blog", label: "Blog" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Nav({ onViolet = false }: { onViolet?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={`nav${onViolet ? " nav-on-violet" : ""}${scrolled ? " scrolled" : ""}${open ? " open" : ""}`}>
      <div className="nav-inner">
        <Link className="brand" href="/" aria-label="AgentOS — domů">
          <svg className="mark" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <rect x="1.25" y="1.25" width="23.5" height="23.5" rx="7" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="13" cy="13" r="4" fill="currentColor" />
            <circle cx="21" cy="5" r="2.4" fill="currentColor" />
          </svg>
          AgentOS
        </Link>
        <nav className="nav-links" aria-label="Hlavní">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </nav>
        <div className="nav-cta">
          <Link className="btn btn-outline" href="/kontakt">Přihlásit se</Link>
          <Link className="btn btn-primary" href="/cenik">Začít zdarma</Link>
        </div>
        <button
          className="nav-burger"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
        </button>
      </div>
      <div className="nav-mobile">
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <Link className="btn btn-primary" href="/cenik" onClick={() => setOpen(false)}>Začít zdarma</Link>
      </div>
    </header>
  );
}
