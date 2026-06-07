import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brandcol">
            <Link className="brand" href="/">
              <svg className="mark" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                <rect x="1.25" y="1.25" width="23.5" height="23.5" rx="7" stroke="#a78bfa" strokeWidth="2.5" />
                <circle cx="13" cy="13" r="4" fill="#a78bfa" />
                <circle cx="21" cy="5" r="2.4" fill="#a78bfa" />
              </svg>
              AgentOS
            </Link>
            <p className="footer-about">Runtime pro nasazení, orchestraci a monitoring AI agentů. Funguje s libovolným modelem.</p>
          </div>
          <div className="footer-col">
            <h4>Produkt</h4>
            <ul>
              <li><Link href="/funkce">Funkce</Link></li>
              <li><Link href="/cenik">Ceník</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/funkce">Integrace</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Firma</h4>
            <ul>
              <li><Link href="/kontakt">Kontakt</Link></li>
              <li><Link href="/blog">Novinky</Link></li>
              <li><Link href="/kontakt">Kariéra</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Právní</h4>
            <ul>
              <li><Link href="#">Podmínky</Link></li>
              <li><Link href="#">Soukromí</Link></li>
              <li><Link href="#">Zpracování dat</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} AgentOS s.r.o. Všechna práva vyhrazena.</span>
          <span>Postaveno v Praze.</span>
        </div>
      </div>
    </footer>
  );
}
