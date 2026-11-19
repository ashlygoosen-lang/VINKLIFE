import { FormEvent, useEffect, useState, type ReactNode } from "react";
import { companies, companyFilters, divisions, images, type Company } from "./data";
import {
  Count,
  CTA,
  CompanyCard,
  CompanyLogo,
  Icon,
  Layout,
  Link,
  Logo,
  NewsPreview,
  NewsletterSection,
  Orbit,
  PageHero,
  Photo,
  SectionHeading,
  photoVars,
  useInView,
} from "./ui";
import { navigate } from "./router";

export function Home() {
  const [filter, setFilter] = useState("All");
  const [spotlight, setSpotlight] = useState(0);
  const [statsRef, statsSeen] = useInView<HTMLDivElement>(0.4);
  const visible =
    filter === "All" ? companies.slice(1) : companies.filter((c) => c.division === filter);
  const spots = [companies[4], companies[5], companies[1]];
  const spotImages = [images.architecture, images.people, images.office];
  const stats: [number, string, string][] = [
    [19, "", "Companies in one ecosystem"],
    [75, "k+", "Customers served"],
    [7, "+", "Years of operation"],
    [38, "+", "Community projects"],
  ];
  return (
    <Layout>
      <section className="home-hero">
        <div className="hero-photo has-photo" style={photoVars(images.city)} aria-hidden="true" />
        <div className="hero-columns" aria-hidden="true" />
        <div className="page-shell hero-inner">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="eyebrow gold">Diverse by design · United by purpose</span>
              <span className="hero-edition">Est. 2018 · South Africa</span>
            </div>
            <h1>
              One Group.
              <br />
              Many Solutions.
              <br />
              <em>Building everyday life.</em>
            </h1>
            <p>
              A diversified African group creating accessible solutions across property, finance,
              commerce and community impact.
            </p>
            <div className="button-row">
              <Link to="companies" className="button button-gold">
                Explore our companies <Icon name="arrow" size={18} />
              </Link>
              <Link to="contact" className="button button-ghost-light">
                Contact us
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <Orbit />
            <p className="orbit-caption">
              <span className="pulse-dot" /> 18 companies · 15 sectors · hover to explore
            </p>
          </div>
        </div>
      </section>

      <section className="stats-bar">
        <div className="page-shell stats-grid" ref={statsRef}>
          {stats.map(([value, suffix, label]) => (
            <div key={label}>
              <strong>
                <Count value={value} suffix={suffix} start={statsSeen} />
              </strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section page-shell">
        <div className="heading-row">
          <SectionHeading
            eyebrow="Our divisions"
            title="Built around the needs of everyday life."
            text="Our companies work independently and together—sharing expertise, reach and a commitment to enduring value."
          />
          <Link to="divisions" className="text-link">
            Explore all divisions <Icon name="arrow" size={18} />
          </Link>
        </div>
        <div className="division-grid">
          {divisions.map((d) => (
            <Link to={`division/${d.slug}`} className="division-card" key={d.slug}>
              <div className="icon-box">
                <Icon name={d.icon} />
              </div>
              <h3>{d.title}</h3>
              <p>{d.text}</p>
              <span className="card-arrow">
                <Icon name="arrow" size={20} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="growth-platforms">
        <div className="page-shell">
          <div className="growth-heading">
            <SectionHeading
              light
              eyebrow="Building the next economy"
              title="Infrastructure for enduring progress."
              text="Our construction and energy companies work at the foundations of growth—creating the places people need and the power that keeps them moving."
            />
          </div>
          <div className="growth-grid">
            {[
              ["company/vink-construction", images.construction, "Construction & infrastructure", "Building places that carry ambition forward.", "Discover VINK Construction"],
              ["company/vink-energy", images.energy, "Energy & renewables", "Powering a more resilient future.", "Discover VINK Energy"],
            ].map(([to, img, label, title, cta]) => (
              <Link key={to} to={to} className="growth-card has-photo" style={photoVars(img)}>
                <div>
                  <span>{label}</span>
                  <h3>{title}</h3>
                  <p>{cta}</p>
                </div>
                <i>
                  <Icon name="arrow" />
                </i>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section companies-section">
        <div className="page-shell">
          <SectionHeading
            eyebrow="The VINK ecosystem"
            title="Strong companies. Shared ambition."
            text="Explore a growing portfolio built to solve real needs and create compounding value."
          />
          <div className="filters" role="group" aria-label="Filter companies by division">
            {companyFilters.map((f) => (
              <button
                className={filter === f ? "active" : ""}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                key={f}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="company-grid">
            {visible.map((c) => (
              <CompanyCard company={c} key={c.slug} />
            ))}
          </div>
          <div className="center-action">
            <Link to="companies" className="button button-outline">
              View full company directory <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section page-shell why-section">
        <div className="why-intro">
          <SectionHeading
            eyebrow="Why VINK"
            title="How we build matters."
            text="Four principles guide every investment, partnership and decision we make."
          />
        </div>
        <div className="values-grid">
          {[
            ["shield", "Integrity", "We do the right thing—clearly, consistently and with accountability."],
            ["spark", "Innovation", "We challenge convention to make better solutions possible."],
            ["access", "Accessibility", "We design for wider participation and genuine everyday usefulness."],
            ["users", "Community", "We measure progress by the value we create with and for people."],
          ].map((v) => (
            <article key={v[1]}>
              <Icon name={v[0]} size={30} />
              <h3>{v[1]}</h3>
              <p>{v[2]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="spotlight section">
        <div className="page-shell">
          <div className="spotlight-card">
            <div
              className="spotlight-image has-photo"
              style={photoVars(spotImages[spotlight])}
              role="img"
              aria-label={`${spots[spotlight].name} spotlight`}
            >
              <span>Company spotlight</span>
              <div className="spot-nav">
                <button aria-label="Previous" onClick={() => setSpotlight((spotlight + 2) % 3)}>
                  <Icon name="chevron" size={20} />
                </button>
                <button aria-label="Next" onClick={() => setSpotlight((spotlight + 1) % 3)}>
                  <Icon name="chevron" size={20} />
                </button>
              </div>
            </div>
            <div className="spotlight-copy" aria-live="polite">
              <CompanyLogo company={spots[spotlight]} />
              <span className="eyebrow">{spots[spotlight].division}</span>
              <h2>{spots[spotlight].name}</h2>
              <h4>{spots[spotlight].tagline}</h4>
              <p>
                {spots[spotlight].description} Part of a connected group, the business combines
                local insight with modern systems to open more paths forward.
              </p>
              <Link to={`company/${spots[spotlight].slug}`} className="button button-dark">
                Discover {spots[spotlight].name} <Icon name="arrow" size={18} />
              </Link>
              <div className="carousel-dots">
                {spots.map((s, i) => (
                  <button
                    key={s.slug}
                    className={i === spotlight ? "active" : ""}
                    onClick={() => setSpotlight(i)}
                    aria-label={`Show ${s.name}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-band section">
        <div className="page-shell impact-grid">
          <div>
            <SectionHeading
              light
              eyebrow="Impact in action"
              title="Progress is only real when it reaches people."
              text="Through OpHelp and group-wide initiatives, we partner with communities to create practical, lasting change."
            />
            <blockquote>
              “VINK did more than fund a programme. They listened, collaborated and stayed to build
              the next chapter with us.”<cite>— Programme partner, Gauteng</cite>
            </blockquote>
            <Link to="impact" className="button button-gold">
              See our impact <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="impact-collage">
            <Photo src={images.community} alt="Community education programme" />
            <Photo src={images.children} alt="Children at a community learning programme" />
            <div>
              <strong>14,500+</strong>
              <span>lives positively reached</span>
            </div>
          </div>
        </div>
      </section>

      <NewsPreview />
      <CTA />
    </Layout>
  );
}

export function About() {
  const leaders = [
    [images.portrait1, "Thabo Mokoena", "Group Chief Executive"],
    [images.portrait2, "Amara Ndlovu", "Chief Operating Officer"],
    [images.portrait3, "Kabelo Adeyemi", "Chief Investment Officer"],
  ];
  return (
    <Layout>
      <PageHero
        eyebrow="About VINK"
        title={
          <>
            Built in Africa.
            <br />
            <em>Ready for the world.</em>
          </>
        }
        text="We bring businesses, people and ideas together to solve everyday challenges at meaningful scale."
      />
      <section className="section page-shell split-story">
        <div>
          <SectionHeading eyebrow="Our story" title="A group shaped by possibility." />
          <p>
            VINK began with a simple belief: the most valuable businesses are those that improve how
            people live, work and participate in the economy. What started as one focused venture
            has become an interconnected group spanning essential sectors.
          </p>
          <p>
            Today, we combine patient capital with practical operating expertise, enabling our
            companies to stay entrepreneurial while gaining the strength of a larger ecosystem.
          </p>
        </div>
        <Photo src={images.office} alt="Modern VINK workplace" />
      </section>
      <section className="section soft-section">
        <div className="page-shell mission-grid">
          <article>
            <span className="eyebrow">Our vision</span>
            <h2>A future where opportunity is more accessible to everyone.</h2>
          </article>
          <article>
            <span className="eyebrow">Our mission</span>
            <h2>Build and connect businesses that make everyday life work better.</h2>
          </article>
        </div>
      </section>
      <section className="section page-shell">
        <SectionHeading
          eyebrow="Our journey"
          title="Built with intention, one chapter at a time."
        />
        <div className="timeline">
          {[
            ["2018", "VINK is established with a vision for connected progress."],
            ["2020", "Expansion into property and financial systems."],
            ["2022", "Digital commerce and payment capabilities launch."],
            ["2023", "OpHelp formalises the group’s impact work."],
            ["Today", "Nineteen companies, one connected ambition."],
          ].map((x) => (
            <div key={x[0]}>
              <strong>{x[0]}</strong>
              <span>{x[1]}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="section navy-section">
        <div className="page-shell">
          <SectionHeading
            light
            eyebrow="Leadership"
            title="Steady hands. Bold thinking."
            text="A multidisciplinary team united by long-term thinking and responsible growth."
          />
          <div className="leader-grid">
            {leaders.map((l) => (
              <article key={l[1]}>
                <Photo src={l[0]} alt={l[1]} />
                <h3>{l[1]}</h3>
                <p>{l[2]}</p>
                <a href="#" aria-label={`${l[1]} on LinkedIn`}>
                  in
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section page-shell">
        <div className="heading-row">
          <SectionHeading
            eyebrow="Governance"
            title="Designed for responsible growth."
            text="Our governance model balances entrepreneurial autonomy with group-wide accountability, risk oversight and ethical leadership."
          />
          <div className="governance-points">
            <p>
              <Icon name="shield" /> Independent oversight
            </p>
            <p>
              <Icon name="chart" /> Disciplined capital allocation
            </p>
            <p>
              <Icon name="users" /> Stakeholder accountability
            </p>
          </div>
        </div>
        <Ownership />
      </section>
      <CTA />
    </Layout>
  );
}

export function Ownership() {
  return (
    <div className="ownership">
      <span className="eyebrow">Group structure</span>
      <div className="parent-node">
        <Logo />
      </div>
      <div className="branch-line" />
      <div className="child-nodes">
        {companies.slice(1).map((c) => (
          <div key={c.slug}>
            <CompanyLogo company={c} small />
            <span>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CompaniesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const result = companies.filter(
    (c) =>
      (filter === "All" || c.division === filter) &&
      `${c.name} ${c.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Layout>
      <PageHero
        eyebrow="Our companies"
        title={
          <>
            Independent strength.
            <br />
            <em>Collective advantage.</em>
          </>
        }
        text="Meet the companies solving real needs across our connected ecosystem."
        image={images.people}
      />
      <section className="directory-tools page-shell">
        <label className="search">
          <Icon name="search" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by company or keyword"
            aria-label="Search companies"
          />
        </label>
        <div className="filters">
          {companyFilters.map((f) => (
            <button className={filter === f ? "active" : ""} onClick={() => setFilter(f)} key={f}>
              {f}
            </button>
          ))}
        </div>
      </section>
      <section className="section page-shell directory">
        <div className="results-count">
          <strong>{result.length}</strong> companies found
        </div>
        <div className="company-grid">
          {result.map((c) => (
            <CompanyCard company={c} key={c.slug} />
          ))}
        </div>
        {!result.length && (
          <div className="empty">No companies match your search. Try a broader term.</div>
        )}
      </section>
      <CTA />
    </Layout>
  );
}

export function CompanyDetail({ slug }: { slug: string }) {
  const company = companies.find((c) => c.slug === slug) || companies[0];
  const detailImage =
    company.division === "Property"
      ? images.architecture
      : company.division === "Construction"
        ? images.construction
        : company.division === "Energy"
          ? images.energy
          : images.office;
  const services = [
    ["spark", "Digital-first solutions"],
    ["shield", "Reliable infrastructure"],
    ["users", "Customer-led support"],
    ["chart", "Insight and analytics"],
  ];
  return (
    <Layout>
      <section className="company-hero">
        <div className="page-shell">
          <div>
            <CompanyLogo company={company} />
            <span className="eyebrow gold">{company.division}</span>
            <h1>{company.name}</h1>
            <h2>{company.tagline}</h2>
            <p>
              {company.description} We combine practical insight, modern technology and the wider
              strength of VINK to help people and businesses move forward.
            </p>
            <a href="#contact-form" className="button">
              Talk to {company.name} <Icon name="arrow" size={18} />
            </a>
          </div>
          <Photo src={detailImage} alt={`${company.name} at work`} className="company-hero-photo" />
        </div>
      </section>
      <section className="section page-shell split-story">
        <div>
          <SectionHeading eyebrow="What we do" title="Making complex needs feel simple." />
          <p>
            Built around the realities of everyday life, {company.name} focuses on accessible,
            dependable experiences. Our team pairs specialist capability with a clear understanding
            of the people we serve.
          </p>
          <p>
            As part of VINK, we draw on complementary expertise from across a diverse, connected
            business ecosystem.
          </p>
        </div>
        <div className="key-quote">
          <span>OUR PROMISE</span>
          <strong>
            Useful by design.
            <br />
            Human at heart.
            <br />
            Built to last.
          </strong>
        </div>
      </section>
      <section className="section soft-section">
        <div className="page-shell">
          <SectionHeading eyebrow="Key services" title="How we help." />
          <div className="service-grid">
            {services.map((s) => (
              <article key={s[1]}>
                <Icon name={s[0]} size={28} />
                <h3>{s[1]}</h3>
                <p>Practical expertise delivered with clarity, care and measurable outcomes.</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="stats-bar detail-stats">
        <div className="page-shell stats-grid">
          <div>
            <strong>24/7</strong>
            <span>Digital access</span>
          </div>
          <div>
            <strong>98%</strong>
            <span>Service reliability</span>
          </div>
          <div>
            <strong>12k+</strong>
            <span>People served</span>
          </div>
          <div>
            <strong>4.8/5</strong>
            <span>Customer rating</span>
          </div>
        </div>
      </section>
      <section className="section page-shell">
        <SectionHeading
          eyebrow="Better together"
          title="Connected to a wider ecosystem."
          text={`${company.name} works with other VINK companies to build more complete solutions and create shared value.`}
        />
        <div className="connection-row">
          {companies
            .filter((c) => c.slug !== slug)
            .slice(0, 3)
            .map((c) => (
              <CompanyCard key={c.slug} company={c} />
            ))}
        </div>
      </section>
      <section className="gallery">
        <Photo src={images.office} alt="Collaborative office" />
        <Photo src={images.people} alt="People moving through a connected city" />
        <Photo src={images.architecture} alt="Modern property" />
      </section>
      <section className="section page-shell faq-section">
        <SectionHeading
          eyebrow="Frequently asked questions"
          title="Good questions, clearly answered."
        />
        <div>
          {[
            "Who does this company serve?",
            "How is the company connected to VINK?",
            "How can I become a partner?",
          ].map((q, i) => (
            <details key={q} open={i === 0}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>
                We work with individuals, growing businesses and strategic partners. Contact our
                team and we will connect you with the right specialist.
              </p>
            </details>
          ))}
        </div>
      </section>
      <ContactForm
        id="contact-form"
        compact
        company={company}
        title={`Start a conversation with ${company.name}.`}
      />
    </Layout>
  );
}

export function DivisionsPage({ slug }: { slug?: string }) {
  const selected = divisions.find((d) => d.slug === slug);
  if (!selected)
    return (
      <Layout>
        <PageHero
          eyebrow="Our divisions"
          title={
            <>
              Different expertise.
              <br />
              <em>One shared direction.</em>
            </>
          }
          text="Fifteen essential sectors, connected to unlock more complete solutions."
        />
        <section className="section page-shell">
          <div className="division-list">
            {divisions.map((d, i) => (
              <Link key={d.slug} to={`division/${d.slug}`}>
                <span>0{i + 1}</span>
                <div className="icon-box">
                  <Icon name={d.icon} />
                </div>
                <h2>{d.title}</h2>
                <p>{d.text}</p>
                <Icon name="arrow" />
              </Link>
            ))}
          </div>
        </section>
        <CTA />
      </Layout>
    );
  const related = companies.filter(
    (c) =>
      c.division === selected.label ||
      (selected.label === "E-commerce" && c.division === "Commerce"),
  );
  const divisionImage =
    selected.slug === "property"
      ? images.architecture
      : selected.slug === "construction"
        ? images.construction
        : selected.slug === "energy"
          ? images.energy
          : images.city;
  return (
    <Layout>
      <PageHero
        eyebrow="Our divisions"
        title={
          <>
            {selected.title.split(" & ")[0]}
            <br />
            <em>
              {selected.title.includes(" & ")
                ? `& ${selected.title.split(" & ")[1]}`
                : "for everyday progress."}
            </em>
          </>
        }
        text={selected.text}
        image={divisionImage}
      />
      <section className="section page-shell split-story">
        <div>
          <SectionHeading
            eyebrow="Division overview"
            title="Expertise focused on real-world needs."
          />
          <p>
            We bring together specialist businesses, modern systems and patient capital to improve
            access, experience and long-term outcomes in this essential sector.
          </p>
        </div>
        <div className="benefit-list">
          {[
            "Connected group capability",
            "Responsible, long-term investment",
            "Deep local understanding",
            "Technology-enabled delivery",
          ].map((x, i) => (
            <p key={x}>
              <span>0{i + 1}</span>
              {x}
            </p>
          ))}
        </div>
      </section>
      <section className="section soft-section">
        <div className="page-shell">
          <SectionHeading eyebrow="Companies in this division" title="Meet the specialists." />
          <div className="company-grid">
            {(related.length ? related : companies.slice(1, 4)).map((c) => (
              <CompanyCard company={c} key={c.slug} />
            ))}
          </div>
        </div>
      </section>
      <NewsPreview />
      <CTA />
    </Layout>
  );
}

export function Impact() {
  return (
    <Layout>
      <PageHero
        eyebrow="Impact & community"
        title={
          <>
            Progress shared
            <br />
            <em>is progress multiplied.</em>
          </>
        }
        text="We work alongside communities to create practical solutions with lasting momentum."
        image={images.community}
      />
      <section className="stats-bar impact-stats">
        <div className="page-shell stats-grid">
          <div>
            <strong>14,500+</strong>
            <span>Lives reached</span>
          </div>
          <div>
            <strong>38</strong>
            <span>Active projects</span>
          </div>
          <div>
            <strong>1,200</strong>
            <span>Volunteer hours</span>
          </div>
          <div>
            <strong>9</strong>
            <span>Community partners</span>
          </div>
        </div>
      </section>
      <section className="section page-shell split-story">
        <div>
          <SectionHeading
            eyebrow="Our approach"
            title="Listen first. Build together. Stay accountable."
          />
          <p>
            Our impact model starts with partnership. We support local organisations with funding,
            skills and connections, focusing on education, economic participation and dignified
            access to essentials.
          </p>
          <div className="button-row">
            <a href="#" className="button button-dark">
              <Icon name="download" size={18} /> Download impact report
            </a>
          </div>
        </div>
        <Photo src={images.children} alt="Community education initiative" />
      </section>
      <section className="section soft-section">
        <div className="page-shell">
          <SectionHeading eyebrow="Project stories" title="Change you can see and feel." />
          <div className="case-grid">
            <article>
              <Photo src={images.community} alt="Community learning centre" />
              <div>
                <span className="tag">EDUCATION</span>
                <h3>From an empty room to a thriving learning hub</h3>
                <p>
                  Working with local teachers, we equipped a neighbourhood centre that now serves
                  240 young learners each week.
                </p>
                <b>Before</b>
                <span>Limited space and no digital access</span>
                <b>After</b>
                <span>A connected, community-run learning hub</span>
              </div>
            </article>
            <article>
              <Photo src={images.architecture} alt="Affordable community homes" />
              <div>
                <span className="tag">HOUSING</span>
                <h3>Turning housing into a platform for opportunity</h3>
                <p>
                  A mixed-use pilot brought secure homes, services and small-business space within
                  reach.
                </p>
                <b>Outcome</b>
                <span>64 families in stable, connected homes</span>
              </div>
            </article>
          </div>
        </div>
      </section>
      <section className="volunteer">
        <div className="page-shell">
          <div>
            <span className="eyebrow gold">Take part</span>
            <h2>
              Give time. Share skill.
              <br />
              Create momentum.
            </h2>
          </div>
          <div className="button-row">
            <Link to="contact" className="button button-light">
              Volunteer with us
            </Link>
            <Link to="contact" className="button button-ghost-light">
              Support a project
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export function News() {
  const [cat, setCat] = useState("All");
  const all = [
    [
      "Group news",
      "Designing ecosystems, not empires: VINK’s model for shared growth",
      images.city,
    ],
    [
      "Impact",
      "Why accessible housing begins with understanding everyday life",
      images.architecture,
    ],
    [
      "Perspective",
      "Five principles shaping the next generation of African fintech",
      images.people,
    ],
    ["Group news", "VINK welcomes a new company to its connected portfolio", images.office],
    ["Impact", "Inside a community partnership built to last", images.community],
    ["Perspective", "The compounding value of patient capital", images.children],
  ];
  const shown = cat === "All" ? all : all.filter((a) => a[0] === cat);
  return (
    <Layout>
      <PageHero
        eyebrow="News & insights"
        title={
          <>
            Thinking forward.
            <br />
            <em>Acting with purpose.</em>
          </>
        }
        text="Perspectives, progress and stories from across the VINK ecosystem."
      />
      <section className="section page-shell featured-article">
        <Photo src={images.city} alt="Modern African city" />
        <div>
          <span className="eyebrow">Featured insight · 8 min read</span>
          <h2>Building businesses that strengthen the systems around them.</h2>
          <p>
            Why the future belongs to connected companies that create value beyond their own balance
            sheets.
          </p>
          <a href="#" className="button button-dark">
            Read the story <Icon name="arrow" size={18} />
          </a>
        </div>
      </section>
      <section className="section soft-section">
        <div className="page-shell">
          <div className="filters">
            {["All", "Group news", "Impact", "Perspective"].map((x) => (
              <button onClick={() => setCat(x)} className={cat === x ? "active" : ""} key={x}>
                {x}
              </button>
            ))}
          </div>
          <div className="article-grid large">
            {shown.map((a, i) => (
              <article key={a[1]}>
                <div className="article-image has-photo" style={photoVars(a[2])}>
                  <span>{a[0]}</span>
                </div>
                <small>{`0${i + 4} Mar 2025`}</small>
                <h3>{a[1]}</h3>
                <a href="#" className="text-link">
                  Read article <Icon name="arrow" size={17} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <NewsletterSection />
    </Layout>
  );
}

export function Careers() {
  const [dept, setDept] = useState("All");
  const jobs = [
    ["Investment Associate", "Strategy", "Johannesburg"],
    ["Product Designer", "Technology", "Hybrid"],
    ["Financial Analyst", "Finance", "Johannesburg"],
    ["Partnerships Manager", "Impact", "Cape Town"],
    ["Operations Lead", "Operations", "Johannesburg"],
  ];
  return (
    <Layout>
      <PageHero
        eyebrow="Careers at VINK"
        title={
          <>
            Do meaningful work.
            <br />
            <em>Build what comes next.</em>
          </>
        }
        text="Join curious, grounded people working across industries to make everyday life better."
        image={images.office}
      />
      <section className="section page-shell">
        <SectionHeading eyebrow="Why VINK" title="Room to do your best work." />
        <div className="service-grid">
          {[
            [
              "spark",
              "Build boldly",
              "Solve meaningful challenges with the backing to think long term.",
            ],
            [
              "users",
              "Grow together",
              "Learn across companies, disciplines and experienced teams.",
            ],
            [
              "heart",
              "Make it matter",
              "See your work translate into practical progress for people.",
            ],
          ].map((x) => (
            <article key={x[1]}>
              <Icon name={x[0]} size={28} />
              <h3>{x[1]}</h3>
              <p>{x[2]}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="culture-gallery">
        <Photo src={images.office} alt="Open VINK office" />
        <Photo src={images.people} alt="Connected city life" />
        <div>
          <span>OUR CULTURE</span>
          <strong>
            Serious about the work.
            <br />
            Human in how we do it.
          </strong>
        </div>
      </section>
      <section className="section soft-section">
        <div className="page-shell jobs">
          <div className="heading-row">
            <SectionHeading eyebrow="Open positions" title="Find your next chapter." />
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              aria-label="Filter department"
            >
              <option>All</option>
              {["Strategy", "Technology", "Finance", "Impact", "Operations"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
          {jobs
            .filter((j) => dept === "All" || j[1] === dept)
            .map((j) => (
              <article key={j[0]}>
                <div>
                  <h3>{j[0]}</h3>
                  <span>
                    {j[1]} · {j[2]}
                  </span>
                </div>
                <button className="button button-outline" onClick={() => navigate("contact")}>
                  View role <Icon name="arrow" size={17} />
                </button>
              </article>
            ))}
        </div>
      </section>
      <CTA />
    </Layout>
  );
}

export function Contact() {
  return (
    <Layout>
      <PageHero
        eyebrow="Contact VINK"
        title={
          <>
            Start with a<br />
            <em>conversation.</em>
          </>
        }
        text="Tell us what you’re working on. We’ll make sure it reaches the right person."
        image={images.people}
      />
      <section className="section page-shell contact-layout">
        <div>
          <SectionHeading
            eyebrow="Get in touch"
            title="We would like to hear from you."
            text="For partnerships, investment opportunities, media and company-specific enquiries, use the form and our team will respond within two business days."
          />
          <div className="contact-cards">
            <article>
              <Icon name="mail" />
              <div>
                <b>Email us</b>
                <span>hello@vinkgroup.com</span>
              </div>
            </article>
            <article>
              <Icon name="map" />
              <div>
                <b>Head office</b>
                <span>
                  Sandton, Johannesburg
                  <br />
                  South Africa
                </span>
              </div>
            </article>
          </div>
          <div className="map-placeholder">
            <Icon name="map" size={36} />
            <span>VINK HEAD OFFICE</span>
            <small>Sandton · Johannesburg</small>
          </div>
        </div>
        <ContactForm bare />
      </section>
      <section className="section soft-section">
        <div className="page-shell enquiry-grid">
          <article>
            <span className="eyebrow">Partnerships</span>
            <h3>Build alongside us.</h3>
            <p>
              Bring an opportunity, a capability or a bold idea. We are always open to aligned
              partnerships.
            </p>
            <a href="mailto:partners@vinkgroup.com" className="text-link">
              partners@vinkgroup.com <Icon name="arrow" size={17} />
            </a>
          </article>
          <article>
            <span className="eyebrow">Investors</span>
            <h3>Think long term with us.</h3>
            <p>
              Learn more about our portfolio, investment philosophy and approach to responsible
              growth.
            </p>
            <a href="mailto:invest@vinkgroup.com" className="text-link">
              invest@vinkgroup.com <Icon name="arrow" size={17} />
            </a>
          </article>
        </div>
      </section>
    </Layout>
  );
}

export function ContactForm({
  id,
  compact = false,
  bare = false,
  title,
  company,
}: {
  id?: string;
  compact?: boolean;
  bare?: boolean;
  title?: string;
  company?: Company;
}) {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCompany, setSelectedCompany] = useState(company?.name || "VINK Group");
  const isInsurance = selectedCompany === "VINK Insurance";
  const isImmigration = selectedCompany === "VINK Immigration Consultancy";
  useEffect(() => {
    setSelectedCompany(company?.name || "VINK Group");
  }, [company?.name]);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    const required = ["name", "email", "phone", "message"];
    if (isInsurance) required.push("coverage");
    if (isImmigration) required.push("destination", "immigration-service");
    required.forEach((k) => {
      if (!fd.get(k)) next[k] = "This field is required";
    });
    if (fd.get("email") && !String(fd.get("email")).includes("@"))
      next.email = "Enter a valid email address";
    if (!fd.get("consent")) next.consent = "Please confirm that we may contact you";
    setErrors(next);
    if (!Object.keys(next).length) setSent(true);
  };
  return (
    <section
      id={id}
      className={`${bare ? "" : "contact-form-section"} ${compact ? "compact-form" : ""}`}
    >
      <div className={bare ? "" : "page-shell"}>
        {!bare && (
          <SectionHeading
            light
            eyebrow="Get in touch"
            title={title || "Tell us how we can help."}
          />
        )}
        <div className="form-card">
          {sent ? (
            <div className="form-success">
              <span>✓</span>
              <h3>Message received.</h3>
              <p>Thank you. A member of our team will be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="form-intro">
                <span>ENQUIRY DETAILS</span>
                <p>Fields marked with an asterisk are required. Your information stays private.</p>
              </div>
              <div className="form-row">
                <Field label="Full name *" name="name" error={errors.name} />
                <Field label="Email address *" name="email" type="email" error={errors.email} />
              </div>
              <div className="form-row">
                <Field label="Phone number *" name="phone" type="tel" error={errors.phone} />
                <Field label="Company or organisation" name="organisation" />
              </div>
              <div className="form-row">
                <label>
                  Enquiry type
                  <select name="type">
                    <option>General enquiry</option>
                    <option>Partnership</option>
                    <option>Investor relations</option>
                    <option>Media</option>
                    <option>Company-specific</option>
                  </select>
                </label>
                <label>
                  Preferred response
                  <select name="contact-preference">
                    <option>Email</option>
                    <option>Phone call</option>
                    <option>WhatsApp</option>
                  </select>
                </label>
              </div>
              <label>
                Which VINK company?
                <select
                  name="company-select"
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                >
                  <option>VINK Group</option>
                  {companies.slice(1).map((c) => (
                    <option key={c.slug} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              {isInsurance && (
                <div className="specialist-fields">
                  <span className="specialist-label">
                    <Icon name="shield" size={18} /> Insurance requirements
                  </span>
                  <div className="form-row">
                    <label>
                      Type of cover *
                      <select name="coverage" className={errors.coverage ? "invalid" : ""}>
                        <option value="">Select cover</option>
                        <option>Personal insurance</option>
                        <option>Vehicle insurance</option>
                        <option>Home and property</option>
                        <option>Business insurance</option>
                        <option>Life and funeral cover</option>
                      </select>
                      {errors.coverage && <small className="error">{errors.coverage}</small>}
                    </label>
                    <label>
                      Cover is for
                      <select name="cover-for">
                        <option>Myself or family</option>
                        <option>My business</option>
                        <option>A client</option>
                      </select>
                    </label>
                  </div>
                  <label>
                    Do you currently have similar cover?
                    <select name="existing-cover">
                      <option>No</option>
                      <option>Yes — I am comparing options</option>
                      <option>Yes — I want to switch</option>
                    </select>
                  </label>
                </div>
              )}
              {isImmigration && (
                <div className="specialist-fields">
                  <span className="specialist-label">
                    <Icon name="globe" size={18} /> Immigration requirements
                  </span>
                  <div className="form-row">
                    <Field label="Current country" name="current-country" />
                    <Field
                      label="Destination country *"
                      name="destination"
                      error={errors.destination}
                    />
                  </div>
                  <label>
                    Service required *
                    <select
                      name="immigration-service"
                      className={errors["immigration-service"] ? "invalid" : ""}
                    >
                      <option value="">Select a service</option>
                      <option>Visa consultation</option>
                      <option>Work or business visa</option>
                      <option>Study visa</option>
                      <option>Family or partner visa</option>
                      <option>Permanent residence</option>
                      <option>Corporate immigration support</option>
                    </select>
                    {errors["immigration-service"] && (
                      <small className="error">{errors["immigration-service"]}</small>
                    )}
                  </label>
                </div>
              )}
              <label>
                Message *
                <textarea
                  name="message"
                  rows={6}
                  placeholder="Share any useful context, timelines or questions"
                />
                {errors.message && <small className="error">{errors.message}</small>}
              </label>
              <label className="consent-field">
                <input type="checkbox" name="consent" />
                <span>
                  I agree that VINK Group may use these details to respond to my enquiry in
                  accordance with the privacy policy.
                </span>
              </label>
              {errors.consent && <small className="error consent-error">{errors.consent}</small>}
              <div className="form-submit">
                <button className="button" type="submit">
                  Send secure enquiry <Icon name="arrow" size={18} />
                </button>
                <span>
                  <Icon name="shield" size={15} /> Secure and confidential
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
export function Field({
  label,
  name,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
}) {
  return (
    <label>
      {label}
      <input name={name} type={type} className={error ? "invalid" : ""} />
      {error && <small className="error">{error}</small>}
    </label>
  );
}

export function DesignSystem() {
  const colors = [
    ["Oxblood", "#650D12"],
    ["Crimson", "#A30D18"],
    ["Metallic gold", "#D3A323"],
    ["Warm ivory", "#FBF7EF"],
    ["Charcoal", "#251A19"],
  ];
  return (
    <Layout>
      <PageHero
        eyebrow="Vink design system"
        title={
          <>
            One visual language.
            <br />
            <em>Built for trust.</em>
          </>
        }
        text="A living reference for the components, foundations and patterns behind the VINK digital experience."
      />
      <section className="section page-shell ds">
        <SectionHeading eyebrow="01 · colour" title="Confident, warm and clear." />
        <div className="swatches">
          {colors.map((c) => (
            <div
              key={c[1]}
              style={{
                background: c[1],
                color: c[1] === "#FBF7EF" || c[1] === "#D3A323" ? "#251A19" : "white",
              }}
            >
              <strong>{c[0]}</strong>
              <span>{c[1]}</span>
            </div>
          ))}
        </div>
        <SectionHeading eyebrow="02 · typography" title="Plus Jakarta Sans." />
        <div className="type-samples">
          <h1>Building everyday life.</h1>
          <h2>Designed for progress.</h2>
          <h3>Strong companies, shared ambition.</h3>
          <p>Minimum 16px body copy ensures every message is clear and comfortable to read.</p>
        </div>
        <SectionHeading eyebrow="03 · components" title="Flexible by design." />
        <div className="component-demo">
          <div>
            <h4>Buttons</h4>
            <div className="button-row">
              <button className="button">Primary action</button>
              <button className="button button-dark">Dark action</button>
              <button className="button button-outline">Secondary</button>
            </div>
          </div>
          <div>
            <h4>Form inputs</h4>
            <Field label="Input label" name="demo" />
            <label>
              Select label
              <select>
                <option>Select an option</option>
              </select>
            </label>
          </div>
          <div>
            <h4>Iconography</h4>
            <div className="icon-row">
              {["building", "bank", "card", "bag", "heart", "shield"].map((i) => (
                <span key={i}>
                  <Icon name={i} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
