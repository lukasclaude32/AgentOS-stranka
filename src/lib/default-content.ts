import { SiteContent } from "./types";

export const defaultContent: SiteContent = {
  hero: {
    headline: "Dostaňte AI agenty z prototypu do produkce.",
    subtitle: "AgentOS je runtime, který vaše agenty nasadí, orchestruje a hlídá. Jeden příkaz — a běží v produkci s monitoringem, guardrails a škálováním. S libovolným modelem.",
    primaryCta: "Začít zdarma",
    secondaryCta: "Prohlédnout funkce",
    terminalLines: [
      "$ agentos deploy",
      "✓ Detekován agent support-bot · model claude-sonnet",
      "✓ Build dokončen za 4.2s",
      "✓ Guardrails aktivní: rate-limit, PII-filtr, retry",
      "→ Nasazuji do produkce…",
      "✓ Live: https://support-bot.agentos.app",
      "  3 repliky · eu-central · p50 142ms · 0 chyb",
    ],
  },
  marquee: {
    items: [
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
    ],
  },
  features: {
    headline: "Tři věci, které agent v produkci potřebuje.",
    subtitle: "Vy řešíte logiku agenta. AgentOS řeší zbytek.",
    items: [
      { tag: "Orchestrace", title: "Workflow, které drží", description: "Řetězte agenty, nástroje a kroky do workflow. Větvení, retry a fallback na jiný model bez psaní vlastní infrastruktury.", color: "var(--violet)" },
      { tag: "Monitoring", title: "Vidíte každý běh", description: "Traces, náklady na token, latence a chybovost v reálném čase. Alerty, když agent začne halucinovat nebo přepalovat rozpočet.", color: "var(--sky)" },
      { tag: "Škálování", title: "Z nuly na tisíce", description: "Automatické škálování replik podle zátěže. Rate-limity, fronty a izolace, aby jeden agent nepoložil ostatní.", color: "var(--green)" },
    ],
  },
  dashboard: {
    headline: "Jeden přehled o všech vašich agentech.",
    subtitle: "Stav, latence, náklady a logy běhů — bez přepínání mezi pěti nástroji.",
    agents: [
      { name: "support-bot", status: "ok", runs: "184 320", latency: "142 ms", uptime: "99,98 %" },
      { name: "data-sync", status: "run", runs: "41 208", latency: "880 ms", uptime: "99,95 %" },
      { name: "invoice-parser", status: "ok", runs: "12 640", latency: "1,2 s", uptime: "99,99 %" },
      { name: "lead-router", status: "warn", runs: "8 412", latency: "312 ms", uptime: "98,70 %" },
      { name: "qa-reviewer", status: "ok", runs: "5 100", latency: "2,1 s", uptime: "99,97 %" },
      { name: "doc-indexer", status: "ok", runs: "3 280", latency: "640 ms", uptime: "100 %" },
    ],
  },
  howItWorks: {
    headline: "Od commitu do produkce ve třech krocích.",
    subtitle: "Žádné Dockerfily, žádné Kubernetes manifesty. Popíšete agenta a zbytek je na nás.",
    steps: [
      { num: "01", title: "Připojte agenta", description: "Ukažte na svůj repozitář nebo endpoint. AgentOS rozpozná model, nástroje a závislosti automaticky." },
      { num: "02", title: "Definujte workflow", description: "Popište kroky, guardrails a limity v jednom konfiguračním souboru. Verzované, review-ovatelné, opakovatelné." },
      { num: "03", title: "Nasaďte a sledujte", description: "agentos deploy — a máte živý endpoint, traces a alerty. Bez DevOps tiketů." },
    ],
  },
  socialProof: {
    headline: "Používá 2 000+ týmů, které nechtějí stavět infrastrukturu znovu.",
    metrics: [
      { value: "50", label: "agentů v produkci", prefix: "", suffix: "k+" },
      { value: "99.9", label: "dostupnost", prefix: "", suffix: " %" },
      { value: "200", label: "p50 latence runtime", prefix: "<", suffix: " ms" },
      { value: "500", label: "integrací a nástrojů", prefix: "", suffix: "+" },
    ],
    quote: "Měli jsme agenta, co fungoval na laptopu. AgentOS ho dostal do produkce za odpoledne — a poprvé jsme viděli, kolik nás reálně stojí.",
    quoteName: "Karolína Němcová",
    quoteRole: "Head of Platform, Datovka",
    quoteInitials: "KN",
  },
  cta: {
    headline: "Nasaďte prvního agenta dnes.",
    subtitle: "Starter plán je zdarma, bez karty. Za pět minut máte živý endpoint.",
    primaryCta: "Začít zdarma",
    secondaryCta: "Promluvit s týmem",
  },
  nav: {
    logo: "AgentOS",
    links: [
      { label: "Funkce", href: "/funkce" },
      { label: "Ceník", href: "/cenik" },
      { label: "Blog", href: "/blog" },
      { label: "Kontakt", href: "/kontakt" },
    ],
  },
  footer: {
    description: "Runtime pro nasazení, orchestraci a monitoring AI agentů. Funguje s libovolným modelem.",
    columns: [
      { title: "Produkt", links: [{ label: "Funkce", href: "/funkce" }, { label: "Ceník", href: "/cenik" }, { label: "Blog", href: "/blog" }, { label: "Integrace", href: "/funkce" }] },
      { title: "Firma", links: [{ label: "Kontakt", href: "/kontakt" }, { label: "Novinky", href: "/blog" }, { label: "Kariéra", href: "/kontakt" }] },
      { title: "Právní", links: [{ label: "Podmínky", href: "#" }, { label: "Soukromí", href: "#" }, { label: "Zpracování dat", href: "#" }] },
    ],
    copyright: "© 2026 AgentOS s.r.o. Všechna práva vyhrazena.",
    tagline: "Postaveno v Praze.",
  },
  funkcePage: {
    headline: "Všechno co vaši agenti potřebují",
    subtitle: "Od nasazení po monitoring. Infrastrukturu necháte na nás.",
    items: [
      { tag: "Orchestrace", title: "Vizuální orchestrace", description: "Drag & drop canvas pro multi-agentové workflow. Handoff, podmínky, fallbacky. 50+ šablon.", color: "var(--violet)" },
      { tag: "Bezpečnost", title: "Guardrails a bezpečnost", description: "Bezpečnostní politiky per agent. Rate limiting, obsahové filtry, schvalovací brány. SOC 2 Type II.", color: "var(--red)" },
      { tag: "Monitoring", title: "Real-time monitoring", description: "Trace každého rozhodnutí a tool callu. Debug za sekundy. Alerting na anomálie.", color: "var(--sky)" },
      { tag: "Integrace", title: "Univerzální tool layer", description: "Napojte jakékoliv API, databázi nebo službu. Sdílený registr nástrojů. 500+ konektorů.", color: "var(--violet)" },
      { tag: "Verzování", title: "Verzování agentů", description: "Verzujte jako kód. A/B testujte, rollbackujte, promujte mezi prostředími. Git-native.", color: "var(--green)" },
      { tag: "Škálování", title: "Auto-škálování", description: "Od nuly po tisíce souběžných exekucí. Serverless i dedicated. Platíte za to co běží.", color: "var(--red)" },
    ],
  },
  cenikPage: {
    headline: "Jednoduché ceny",
    subtitle: "Začněte zdarma. Škálujte když potřebujete.",
    plans: [
      { name: "Starter", price: "Zdarma", period: "", description: "Pro individuální vývojáře.", features: ["3 agenti", "1 000 exekucí/měs", "Komunitní podpora", "Základní monitoring"], highlighted: false, cta: "Začít zdarma" },
      { name: "Pro", price: "€49", period: "/měsíc", description: "Pro týmy, které to myslí vážně.", features: ["Neomezení agenti", "50 000 exekucí/měs", "Prioritní podpora", "Pokročilý monitoring", "Neomezená prostředí", "Verzování agentů", "Vlastní guardrails"], highlighted: true, cta: "14 dní zdarma" },
      { name: "Enterprise", price: "Na míru", period: "", description: "Pro organizace s vlastními požadavky.", features: ["Vše z Pro", "Dedicated infra", "SSO + SAML", "SLA 99,99 %", "Account manager", "On-premise", "Custom integrace"], highlighted: false, cta: "Kontaktujte nás" },
    ],
    faqs: [
      { question: "Můžu zrušit kdykoli?", answer: "Ano. Žádné smlouvy. Zrušíte jedním klikem." },
      { question: "Co když překročím limit exekucí?", answer: "Dostanete notifikaci a nabídku upgradovat. Nic se nezastaví." },
      { question: "Podporujete vlastní modely?", answer: "Ano. Jakýkoli model s HTTP endpointem — fine-tuny, open-source, cokoliv." },
      { question: "Kde běží infrastruktura?", answer: "EU (Frankfurt) a US (Virginia). Enterprise si volí region nebo on-premise." },
    ],
  },
  blogPage: {
    headline: "Blog",
    subtitle: "Novinky, návody, postřehy z ekosystému AI agentů.",
    posts: [
      { title: "Jak jsme škálovali na 10 000 souběžných agentů", excerpt: "Migrace z monolitu na event-driven architekturu a snížení latence o 60 %.", category: "Engineering", date: "28. 5. 2026", featured: true },
      { title: "5 chyb při nasazení AI agentů", excerpt: "Chybějící guardrails, absence monitoringu — a jak se tomu vyhnout.", category: "Best practices", date: "21. 5. 2026", featured: false },
      { title: "AgentOS 2.0: co je nového", excerpt: "Vizuální canvas, A/B testování agentů, 200 nových konektorů.", category: "Produkt", date: "14. 5. 2026", featured: false },
      { title: "Guardrails pro AI agenty", excerpt: "Bezpečnostní politiky, rate limiting a obsahové filtry pro produkci.", category: "Security", date: "7. 5. 2026", featured: false },
      { title: "Multi-agent orchestrace: vzory a anti-vzory", excerpt: "Fan-out, pipeline, hierarchický model — kdy co použít.", category: "Engineering", date: "30. 4. 2026", featured: false },
    ],
  },
  kontaktPage: {
    headline: "Ozvěte se",
    subtitle: "Chcete demo, máte technický dotaz, nebo vás zajímá enterprise spolupráce? Napište nám.",
    contacts: [
      { label: "Email", value: "hello@agentos.dev" },
      { label: "Podpora", value: "support@agentos.dev" },
      { label: "Sídlo", value: "Praha, Česká republika" },
    ],
    successTitle: "Odesláno",
    successMessage: "Ozveme se do 24 hodin.",
  },
};
