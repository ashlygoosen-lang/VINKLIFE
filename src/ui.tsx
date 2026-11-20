import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type React from "react";
import { companies, companyFilters, images, type Company } from "./data";
import { navigate, useRoute } from "./router";
import { api, ApiError, fmtDate, useAsync } from "./api";
import { fallbackArticles } from "./fallback";

export function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M14 7l5 5-5 5" />
      </>
    ),
    building: (
      <>
        <path d="M4 21V5l8-3 8 3v16M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1M2 21h20" />
      </>
    ),
    bank: (
      <>
        <path d="m3 10 9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 18h18M2 21h20" />
      </>
    ),
    card: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20M6 15h4" />
      </>
    ),
    bag: (
      <>
        <path d="M6 8h12l1 13H5L6 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    heart: (
      <>
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3-1.5 4.5L6 9l4.5 1.5L12 15l1.5-4.5L18 9l-4.5-1.5L12 3ZM5 16l-.8 2.2L2 19l2.2.8L5 22l.8-2.2L8 19l-2.2-.8L5 16ZM19 14l-.6 1.4L17 16l1.4.6L19 18l.6-1.4L21 16l-1.4-.6L19 14Z" />
      </>
    ),
    access: (
      <>
        <circle cx="12" cy="4" r="2" />
        <path d="M5 8h14M12 6v15M8 21l4-7 4 7" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    map: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-4-4 4 4 4-4M4 21h16" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V4h6v3M3 12h18M10 12v2h4v-2" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </>
    ),
    construction: (
      <>
        <path d="M4 20h16M6 20V9l6-5 6 5v11M9 20v-5h6v5M3 10h18" />
      </>
    ),
    energy: (
      <>
        <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z" />
      </>
    ),
    linkedin: (
      <>
        <path d="M4 9h4v11H4zM6 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM10 9h3.8v1.6c.6-1.1 1.9-1.9 3.6-1.9 3 0 3.6 2 3.6 4.6V20h-4v-5.8c0-1.4-.1-2.5-1.6-2.5s-1.8 1.2-1.8 2.4V20h-4V9Z" />
      </>
    ),
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
    facebook: (
      <>
        <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z" />
      </>
    ),
    x: (
      <>
        <path d="M4 4l16 16M20 4 4 20" />
      </>
    ),
    up: (
      <>
        <path d="M12 19V5M6 11l6-6 6 6" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    check: (
      <>
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </>
    ),
    phone: (
      <>
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
      </>
    ),
    chevronDown: (
      <>
        <path d="m6 9 6 6 6-6" />
      </>
    ),
    chevron: (
      <>
        <path d="m9 18 6-6-6-6" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] || paths.spark}
    </svg>
  );
}

/* ───────── Brand ───────── */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      className={`brand-logo ${className}`}
      src="/brand/vink-group-logo.png"
      alt="VINK Group — Innovation, Excellence, Global Impact"
      width={1525}
      height={1050}
    />
  );
}

export function Emblem({ className = "" }: { className?: string }) {
  return (
    <img
      className={`emblem ${className}`}
      src="/brand/vink-emblem.png"
      alt=""
      aria-hidden="true"
      width={1084}
      height={593}
    />
  );
}

/* ───────── Routing helpers ───────── */
export function Link({
  to,
  children,
  className = "",
  onClick,
  ...rest
}: {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">) {
  const href = to === "home" ? "/" : `/${to}`;
  return (
    <a
      {...rest}
      href={href}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}

/* ───────── Media ───────── */
export function Photo({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return <div role="img" aria-label={alt} className={`photo photo-fallback ${className}`} />;
  return (
    <img
      className={`photo ${className}`}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

export const photoVars = (url: string, overlay?: string) =>
  ({ "--photo": `url(${url})`, ...(overlay ? { "--overlay": overlay } : {}) }) as CSSProperties;

/* ───────── Motion helpers ───────── */
export function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

export function Count({
  value,
  suffix = "",
  start = true,
}: {
  value: number;
  suffix?: string;
  start?: boolean;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(value);
      return;
    }
    let frame = 0;
    const duration = 1400;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - p, 4))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, start]);
  return (
    <>
      {count.toLocaleString("en-ZA").replace(/\s/g, ",")}
      {suffix}
    </>
  );
}

/* ───────── Small building blocks ───────── */
const tones = ["ox", "crimson", "gold", "ink"] as const;
export function toneFor(slug: string) {
  const i = companies.findIndex((c) => c.slug === slug);
  return tones[(i < 0 ? 0 : i) % tones.length];
}

export function CompanyLogo({ company, small = false }: { company: Company; small?: boolean }) {
  return (
    <div className={`crest tone-${toneFor(company.slug)} ${small ? "small" : ""}`} aria-hidden="true">
      <span>{company.mark}</span>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  light = false,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  text?: string;
  light?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`section-heading ${light ? "light" : ""} ${align === "center" ? "center" : ""}`}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

/* ───────── Hero orbit: the group as a living system ───────── */
const ringPlan = [
  { size: 52, count: 5, duration: 90, offset: 0.1 },
  { size: 74, count: 6, duration: 130, offset: 0.55 },
  { size: 96, count: 7, duration: 180, offset: 0.2 },
];

export function Orbit() {
  const list = companies.slice(1);
  let cursor = 0;
  return (
    <div className="orbit" aria-label="The VINK ecosystem of companies">
      <div className="orbit-glow" aria-hidden="true" />
      {ringPlan.map((ring, ri) => {
        const members = list.slice(cursor, cursor + ring.count);
        cursor += ring.count;
        return (
          <div
            key={ri}
            className="orbit-ring"
            style={
              {
                "--size": `${ring.size}%`,
                "--duration": `${ring.duration}s`,
                "--dir": ri % 2 ? "reverse" : "normal",
              } as CSSProperties
            }
          >
            {members.map((c, i) => {
              const a = (i / members.length + ring.offset) * Math.PI * 2;
              return (
                <Link
                  key={c.slug}
                  to={`company/${c.slug}`}
                  className={`orbit-node tone-${toneFor(c.slug)}`}
                  style={
                    {
                      left: `${50 + 50 * Math.cos(a)}%`,
                      top: `${50 + 50 * Math.sin(a)}%`,
                    } as CSSProperties
                  }
                  aria-label={`${c.name} — ${c.division}`}
                >
                  <span className="orbit-node-inner">
                    <b>{c.mark}</b>
                    <em>
                      {c.name}
                      <small>{c.division}</small>
                    </em>
                  </span>
                </Link>
              );
            })}
          </div>
        );
      })}
      <div className="orbit-core">
        <Emblem />
      </div>
    </div>
  );
}

/* ───────── Header ───────── */
const nav: [string, string][] = [
  ["about", "About"],
  ["companies", "Our Companies"],
  ["divisions", "Divisions"],
  ["impact", "Impact"],
  ["news", "News"],
  ["careers", "Careers"],
  ["contact", "Contact"],
];

export function Header() {
  const route = useRoute();
  const [mobile, setMobile] = useState(false);
  const [mega, setMega] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    setMega(false);
    setMobile(false);
  }, [route]);

  useEffect(() => {
    if (!mega && !mobile) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMega(false);
        setMobile(false);
      }
    };
    const click = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMega(false);
    };
    window.addEventListener("keydown", key);
    window.addEventListener("mousedown", click);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("mousedown", click);
    };
  }, [mega, mobile]);

  const isActive = (to: string) =>
    route === to ||
    (to === "companies" && route.startsWith("company/")) ||
    (to === "divisions" && route.startsWith("division/"));

  return (
    <header ref={headerRef} className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-shell">
        <Link to="home" className="brand-link" aria-label="VINK Group home">
          <Logo />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map(([to, label]) =>
            to === "companies" ? (
              <button
                key={to}
                className={`nav-link mega-trigger ${isActive(to) || mega ? "active" : ""}`}
                onClick={() => setMega(!mega)}
                aria-expanded={mega}
                aria-controls="mega-menu"
              >
                {label}
                <Icon name="chevronDown" size={15} />
              </button>
            ) : (
              <Link
                key={to}
                to={to}
                className={`nav-link ${isActive(to) ? "active" : ""}`}
                aria-current={isActive(to) ? "page" : undefined}
              >
                {label}
              </Link>
            ),
          )}
        </nav>
        <Link to="contact" className="button button-small header-cta">
          Partner with us <Icon name="arrow" size={16} />
        </Link>
        <button
          className="menu-button"
          onClick={() => setMobile(!mobile)}
          aria-label={mobile ? "Close navigation" : "Open navigation"}
          aria-expanded={mobile}
        >
          <Icon name={mobile ? "close" : "menu"} />
        </button>
      </div>

      <div id="mega-menu" className={`mega-menu ${mega ? "open" : ""}`} aria-hidden={!mega}>
        <div className="mega-inner">
          <div className="mega-intro">
            <span className="eyebrow">The VINK ecosystem</span>
            <h3>One group. Many possibilities.</h3>
            <p>{companies.length - 1} companies across {companyFilters.length - 1} essential sectors, working as one.</p>
            <Link to="companies" className="text-link" tabIndex={mega ? 0 : -1}>
              View company directory <Icon name="arrow" size={16} />
            </Link>
          </div>
          <div className="mega-grid">
            {companies.slice(1).map((c) => (
              <Link key={c.slug} to={`company/${c.slug}`} tabIndex={mega ? 0 : -1}>
                <CompanyLogo company={c} small />
                <span>
                  <b>{c.name}</b>
                  <small>{c.division}</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <nav className={`mobile-nav ${mobile ? "open" : ""}`} aria-label="Mobile navigation">
        {nav.map(([to, label]) => (
          <Link key={to} to={to} className={isActive(to) ? "active" : ""}>
            {label}
            <Icon name="chevron" size={18} />
          </Link>
        ))}
        <Link to="contact" className="button">
          Partner with us <Icon name="arrow" size={16} />
        </Link>
      </nav>
    </header>
  );
}

/* ───────── Footer ───────── */
const socials = [
  ["linkedin", "LinkedIn"],
  ["instagram", "Instagram"],
  ["facebook", "Facebook"],
  ["x", "X"],
];

export function Footer() {
  const list = companies.slice(1);
  const half = Math.ceil(list.length / 2);
  return (
    <footer className="site-footer">
      {/* Texture stack — every layer is decorative */}
      <div className="footer-texture" aria-hidden="true">
        <i className="ft-glow ft-glow-a" />
        <i className="ft-glow ft-glow-b" />
        <i className="ft-dots" />
        <i className="ft-grain" />
        <Emblem className="ft-emblem" />
      </div>

      <div className="footer-frame">
        {/* 12-column ledger lines, aligned to the page shell */}
        <div className="footer-lines" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>

        <div className="footer-cta">
          <div className="footer-cta-copy">
            <span className="eyebrow gold">One group · More possibility</span>
            <h2>Let’s move a meaningful idea forward.</h2>
          </div>
          <div className="footer-cta-action">
            <p>Partnerships, investment, media or careers — one conversation starts it.</p>
            <Link to="contact" className="button button-gold">
              Start a conversation <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>

        <div className="footer-main">
          <div className="footer-col footer-brand">
            <div className="footer-lockup">
              <Emblem />
              <div>
                <strong>
                  VINK <span>Group</span>
                </strong>
                <small>Innovation · Excellence · Global Impact</small>
              </div>
            </div>
            <p>Building an ecosystem of essential businesses that make everyday life work better.</p>
            <address>
              <span>
                <Icon name="map" size={17} /> Sandton, Johannesburg, South Africa
              </span>
              <a href="mailto:hello@vinkgroup.com">
                <Icon name="mail" size={17} /> hello@vinkgroup.com
              </a>
            </address>
            <div className="socials">
              {socials.map(([icon, label]) => (
                <a key={icon} href="#" aria-label={label}>
                  <Icon name={icon} size={18} />
                </a>
              ))}
            </div>
          </div>

          <nav className="footer-col footer-links" aria-label="Explore VINK">
            <h4>Explore</h4>
            {[
              ["about", "About us"],
              ["divisions", "Divisions"],
              ["impact", "Our impact"],
              ["news", "Insights"],
              ["careers", "Careers"],
              ["contact", "Contact"],
              ["design-system", "Design system"],
            ].map(([to, label]) => (
              <Link key={to} to={to}>
                {label}
              </Link>
            ))}
          </nav>

          <nav className="footer-col footer-portfolio" aria-label="VINK companies">
            <h4>Our companies</h4>
            <div className="footer-company-list">
              <div>
                {list.slice(0, half).map((c) => (
                  <Link key={c.slug} to={`company/${c.slug}`}>
                    {c.name}
                  </Link>
                ))}
              </div>
              <div>
                {list.slice(half).map((c) => (
                  <Link key={c.slug} to={`company/${c.slug}`}>
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="companies" className="footer-directory-link">
              View company directory <Icon name="arrow" size={15} />
            </Link>
          </nav>

          <div className="footer-col footer-news">
            <h4>Stay informed</h4>
            <p>Group news, useful ideas and impact — delivered thoughtfully.</p>
            <Newsletter compact />
            <small>No spam. Unsubscribe any time.</small>
          </div>
        </div>

        <div className="footer-mark" aria-hidden="true">
          <span>VINK</span>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} VINK Group of Companies. All rights reserved.</span>
          <span className="footer-legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </span>
          <button
            className="to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Back to top <Icon name="up" size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}

/* ───────── Shared blocks ───────── */
export function CompanyCard({ company }: { company: Company }) {
  return (
    <article className="company-card">
      <div className="company-top">
        <CompanyLogo company={company} />
        <span className="tag">{company.division}</span>
      </div>
      <h3>{company.name}</h3>
      <h4>{company.tagline}</h4>
      <p>{company.description}</p>
      <Link to={`company/${company.slug}`} className="text-link">
        View company <Icon name="arrow" size={17} />
      </Link>
    </article>
  );
}

export function NewsPreview() {
  const { data } = useAsync(() => api.articles(3), []);
  const items = (data && data.length ? data : fallbackArticles).slice(0, 3);
  return (
    <section className="section page-shell news-preview">
      <div className="heading-row">
        <SectionHeading eyebrow="Latest news & insights" title="Ideas for what comes next." />
        <Link to="news" className="text-link">
          View all insights <Icon name="arrow" size={18} />
        </Link>
      </div>
      <div className="article-grid">
        {items.map((a) => (
          <article key={a.title}>
            <div className="article-image has-photo" style={photoVars(a.imageUrl)}>
              <span>{a.category}</span>
            </div>
            <small>{fmtDate(a.publishedAt)}</small>
            <h3>{a.title}</h3>
            <Link to={a.slug ? `news/${a.slug}` : "news"} className="text-link">
              Read article <Icon name="arrow" size={17} />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="cta-section">
      <div className="cta-bg" aria-hidden="true">
        <Emblem />
      </div>
      <div className="page-shell cta-inner">
        <span className="eyebrow gold">Start a conversation</span>
        <h2>
          Let’s build something
          <br />
          <em>meaningful together.</em>
        </h2>
        <p>
          Whether you are looking to partner, invest or learn more, our team is ready to listen.
        </p>
        <Link to="contact" className="button button-gold">
          Contact our team <Icon name="arrow" size={18} />
        </Link>
      </div>
    </section>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
  image = images.city,
}: {
  eyebrow: string;
  title: ReactNode;
  text: string;
  image?: string;
}) {
  return (
    <section className="page-hero">
      <div className="page-hero-image has-photo" style={photoVars(image)} aria-hidden="true" />
      <div className="hero-columns" aria-hidden="true" />
      <Emblem className="page-hero-emblem" />
      <div className="page-shell page-hero-inner">
        <span className="eyebrow gold">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  );
}

export function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  return (
    <form
      className={`newsletter ${compact ? "compact" : ""}`}
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        if (!email.includes("@")) return setError("Enter a valid email address.");
        setState("sending");
        try {
          await api.subscribe(email.trim(), trap);
          setState("done");
        } catch (err) {
          setState("idle");
          setError(err instanceof ApiError ? (err.fields?.email ?? err.message) : "Something went wrong.");
        }
      }}
    >
      {state === "done" ? (
        <p className="success" role="status">
          <Icon name="check" size={18} /> Thank you — you’re on the list.
        </p>
      ) : (
        <>
          <input
            type="email"
            placeholder="Your email address"
            aria-label="Email address"
            aria-invalid={!!error}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={trap} onChange={(e) => setTrap(e.target.value)} />
          <button className="button" type="submit" aria-label="Subscribe" disabled={state === "sending"}>
            {compact ? <Icon name="arrow" size={18} /> : state === "sending" ? "Subscribing…" : "Subscribe"}
          </button>
          {error && <small className="newsletter-error" role="alert">{error}</small>}
        </>
      )}
    </form>
  );
}

export function NewsletterSection() {
  return (
    <section className="newsletter-section">
      <div className="page-shell">
        <div>
          <span className="eyebrow gold">The VINK Brief</span>
          <h2>Useful ideas, thoughtfully delivered.</h2>
        </div>
        <Newsletter />
      </div>
    </section>
  );
}
