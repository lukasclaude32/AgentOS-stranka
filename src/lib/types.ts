export interface SiteContent {
  /* === HOMEPAGE === */
  hero: {
    headline: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    terminalLines: string[];
  };
  marquee: {
    items: { name: string; color: string }[];
  };
  features: {
    headline: string;
    subtitle: string;
    items: {
      tag: string;
      title: string;
      description: string;
      color: string;
    }[];
  };
  dashboard: {
    headline: string;
    subtitle: string;
    agents: {
      name: string;
      status: string;
      runs: string;
      latency: string;
      uptime: string;
    }[];
  };
  howItWorks: {
    headline: string;
    subtitle: string;
    steps: {
      num: string;
      title: string;
      description: string;
    }[];
  };
  socialProof: {
    headline: string;
    metrics: {
      value: string;
      label: string;
      prefix: string;
      suffix: string;
    }[];
    quote: string;
    quoteName: string;
    quoteRole: string;
    quoteInitials: string;
  };
  cta: {
    headline: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  };

  /* === NAV & FOOTER === */
  nav: {
    logo: string;
    links: { label: string; href: string }[];
  };
  footer: {
    description: string;
    columns: {
      title: string;
      links: { label: string; href: string }[];
    }[];
    copyright: string;
    tagline: string;
  };

  /* === FUNKCE PAGE === */
  funkcePage: {
    headline: string;
    subtitle: string;
    items: {
      tag: string;
      title: string;
      description: string;
      color: string;
    }[];
  };

  /* === CENÍK PAGE === */
  cenikPage: {
    headline: string;
    subtitle: string;
    plans: {
      name: string;
      price: string;
      period: string;
      description: string;
      features: string[];
      highlighted: boolean;
      cta: string;
    }[];
    faqs: {
      question: string;
      answer: string;
    }[];
  };

  /* === BLOG PAGE === */
  blogPage: {
    headline: string;
    subtitle: string;
    posts: {
      title: string;
      excerpt: string;
      category: string;
      date: string;
      featured: boolean;
    }[];
  };

  /* === KONTAKT PAGE === */
  kontaktPage: {
    headline: string;
    subtitle: string;
    contacts: { label: string; value: string }[];
    successTitle: string;
    successMessage: string;
  };
}
