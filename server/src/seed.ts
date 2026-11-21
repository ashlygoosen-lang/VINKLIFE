import type { Db } from "./db.js";

const img = {
  city: "https://images.unsplash.com/photo-1783260606355-753ae29e557f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=88&w=1800",
  architecture: "https://images.unsplash.com/photo-1706164971302-e30c0640cc3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
  people: "https://images.unsplash.com/photo-1791594315790-c1454a290ff2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
  office: "https://images.unsplash.com/photo-1774953037913-af0cf688491a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=88&w=1600",
  community: "https://images.unsplash.com/photo-1632215861513-130b66fe97f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
  children: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
};

const jobs = [
  ["investment-associate", "Investment Associate", "Strategy", "Cape Town", "Full-time", "Help evaluate and structure investments across the VINK portfolio.", "You will support the investment team with market analysis, financial modelling and due diligence on new and existing opportunities across property, financial systems and commerce.\n\nYou bring strong analytical skills, commercial curiosity and the discipline to turn complex information into clear recommendations."],
  ["product-designer", "Product Designer", "Technology", "Hybrid", "Full-time", "Design clear, accessible digital products used by thousands of people.", "Work with engineers and company leads to design products across recruitment, commerce and community platforms, from first sketch to shipped interface.\n\nYou care about accessibility, systems thinking and craft, and you can explain your design decisions to non-designers."],
  ["financial-analyst", "Financial Analyst", "Finance", "Cape Town", "Full-time", "Own reporting, forecasting and performance insight for group companies.", "You will build and maintain management reporting, support budgeting cycles and give company leaders the numbers they need to decide with confidence.\n\nYou are comfortable in spreadsheets and databases, and meticulous about accuracy."],
  ["partnerships-manager", "Partnerships Manager", "Impact", "Cape Town", "Full-time", "Build lasting partnerships with community organisations and funders.", "You will grow and steward the partnerships behind OpHelp and group-wide impact work, from first conversation to measured outcomes.\n\nYou listen well, follow through, and can balance the needs of communities, partners and the business."],
  ["operations-lead", "Operations Lead", "Operations", "Cape Town", "Full-time", "Keep group operations running smoothly and improve how we work.", "You will coordinate processes, vendors and internal teams across several companies, finding and fixing what slows people down.\n\nYou are organised, calm under pressure and good at turning messy problems into simple routines."],
];

const articles: [string, string, string, string, string, string, boolean, string][] = [
  ["designing-ecosystems-not-empires", "Designing ecosystems, not empires: VINK’s model for shared growth", "Group news", "How a connected group of independent companies shares expertise without losing its entrepreneurial edge.", img.city, "2026-10-14", true,
    "Most groups grow by absorbing. VINK grows by connecting. Each of our companies runs with its own leadership, customers and ambition, while drawing on shared capital, systems and know-how.\n\nThat model keeps decisions close to the people who understand the customer, and lets a recruitment platform, a property developer and a media company learn from each other.\n\nThe result is an ecosystem where progress in one company creates opportunity in the next, and where the group's strength is measured by how well its parts work together."],
  ["accessible-housing-everyday-life", "Why accessible housing begins with understanding everyday life", "Impact", "Good housing starts with how families actually live, travel, earn and save.", img.architecture, "2026-09-30", false,
    "Affordable housing is often framed as a construction problem. In practice it is a life problem: where people work, how they get there, what they can afford each month and which services they rely on.\n\nOur property and community teams start by listening, then design homes and spaces around what they hear.\n\nWhen housing connects to jobs, transport and small-business space, it stops being just shelter and becomes a platform for opportunity."],
  ["next-generation-african-fintech", "Five principles shaping the next generation of African fintech", "Perspective", "Simple, secure and genuinely useful: what we believe good financial technology looks like.", img.people, "2026-09-12", false,
    "First, design for the person with the least time and the least patience. Second, make security invisible but uncompromising. Third, build for the realities of connectivity and cost.\n\nFourth, connect products so that one good experience leads naturally to the next. Fifth, measure success by customers served well, not accounts opened.\n\nThese principles guide how our financial-systems companies build."],
  ["new-company-joins-portfolio", "VINK welcomes a new company to its connected portfolio", "Group news", "Another specialist business joins the VINK ecosystem.", img.office, "2026-08-27", false,
    "We are pleased to welcome a new company to the VINK portfolio, extending the group's reach into another essential sector.\n\nLike every VINK company, it keeps its own identity and leadership while gaining access to the group's capital, operating expertise and partner network.\n\nWe will share more as integration progresses."],
  ["community-partnership-built-to-last", "Inside a community partnership built to last", "Impact", "What it takes to move from a funded project to a programme a community owns.", img.community, "2026-08-05", false,
    "Lasting impact depends on ownership. The most successful programmes we support are designed with local teachers, organisers and families from the first day.\n\nThat means funding, skills and connections, but also patience: agreeing what success looks like, reporting honestly and staying involved after the launch.\n\nOur partners tell us the difference is simple: we listened first."],
  ["compounding-value-of-patient-capital", "The compounding value of patient capital", "Perspective", "Why long time horizons help businesses build things that last.", img.children, "2026-07-18", false,
    "Short-term pressure rewards quick wins. Patient capital rewards durable ones: better systems, stronger teams, deeper customer trust.\n\nBy committing for the long term, we give our companies room to invest in what compounds, from technology to training to community relationships.\n\nThe returns are slower to arrive and harder to copy."],
];

export async function seed(db: Db) {
  const j = await db.query<{ n: number }>("select count(*)::int as n from jobs");
  if (j.rows[0].n === 0) {
    for (const [slug, title, department, location, type, summary, description] of jobs)
      await db.query(
        "insert into jobs (slug,title,department,location,employment_type,summary,description) values ($1,$2,$3,$4,$5,$6,$7)",
        [slug, title, department, location, type, summary, description],
      );
  }
  const a = await db.query<{ n: number }>("select count(*)::int as n from articles");
  if (a.rows[0].n === 0) {
    for (const [slug, title, category, excerpt, image, date, featured, body] of articles)
      await db.query(
        "insert into articles (slug,title,category,excerpt,body,image_url,status,featured,published_at) values ($1,$2,$3,$4,$5,$6,'published',$7,$8)",
        [slug, title, category, excerpt, body, image, featured, date],
      );
  }
}
