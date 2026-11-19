export type Company = {
  slug: string;
  name: string;
  mark: string;
  division: string;
  tagline: string;
  description: string;
};

export const companies: Company[] = [
  {
    slug: "vink",
    name: "VINK",
    mark: "V",
    division: "Group",
    tagline: "Progress, connected.",
    description:
      "The strategic parent connecting capital, expertise and opportunity across the group.",
  },
  {
    slug: "ballylife-online",
    name: "Ballylife Online",
    mark: "BL",
    division: "E-commerce",
    tagline: "Life, made simpler.",
    description: "A trusted digital marketplace making quality essentials easier to access.",
  },
  {
    slug: "mansya",
    name: "Mansya",
    mark: "M",
    division: "Financial Systems",
    tagline: "Finance with clarity.",
    description: "Practical financial systems that help businesses move with confidence.",
  },
  {
    slug: "ophelp",
    name: "OpHelp",
    mark: "OH",
    division: "Community",
    tagline: "Help that reaches further.",
    description: "Connecting people, partners and resources to meaningful community needs.",
  },
  {
    slug: "affordablelife",
    name: "AffordableLife",
    mark: "AL",
    division: "Property",
    tagline: "A place for everyone.",
    description: "Thoughtful, attainable homes designed around real families and communities.",
  },
  {
    slug: "siira",
    name: "Siira",
    mark: "S",
    division: "Payments",
    tagline: "Money in motion.",
    description: "Secure, intuitive payment technology for a more connected economy.",
  },
  {
    slug: "drive-to-own",
    name: "Drive to Own",
    mark: "DO",
    division: "Commerce",
    tagline: "Your road forward.",
    description: "Flexible mobility pathways that turn everyday drivers into vehicle owners.",
  },
  {
    slug: "totoise",
    name: "Totoise",
    mark: "T",
    division: "Financial Systems",
    tagline: "Technology that moves with you.",
    description: "Purpose-built digital solutions that make complex financial journeys simpler.",
  },
  {
    slug: "altegic",
    name: "Altegic",
    mark: "A",
    division: "Financial Systems",
    tagline: "Strategy, engineered.",
    description: "Enterprise technology and advisory for resilient, modern operations.",
  },
  {
    slug: "vink-telecommunications",
    name: "VINK Telecommunications",
    mark: "VT",
    division: "Telecommunications",
    tagline: "Keeping people connected.",
    description: "Reliable communication infrastructure and services for connected communities.",
  },
  {
    slug: "vink-television",
    name: "VINK Television",
    mark: "TV",
    division: "Media & Broadcasting",
    tagline: "Stories that move people.",
    description:
      "Accessible television and broadcasting created for informed, connected audiences.",
  },
  {
    slug: "vink-news-media",
    name: "VINK News Media",
    mark: "VN",
    division: "News Media",
    tagline: "Clarity in every story.",
    description: "Credible reporting and relevant information for audiences across every platform.",
  },
  {
    slug: "vink-vehicle-tracking",
    name: "VINK Vehicle Tracking",
    mark: "VX",
    division: "Vehicle Tracking",
    tagline: "Visibility for every journey.",
    description: "Intelligent vehicle monitoring and fleet security for safer, smarter mobility.",
  },
  {
    slug: "vink-construction",
    name: "VINK Construction",
    mark: "VC",
    division: "Construction",
    tagline: "Building with purpose.",
    description: "Quality construction and infrastructure delivery shaped around lasting value.",
  },
  {
    slug: "vink-energy",
    name: "VINK Energy",
    mark: "VE",
    division: "Energy",
    tagline: "Powering progress responsibly.",
    description: "Reliable and renewable energy solutions for homes, businesses and communities.",
  },
  {
    slug: "call-my-lawyer",
    name: "Call My Lawyer",
    mark: "CML",
    division: "Legal Services",
    tagline: "Legal help, within reach.",
    description: "Accessible legal guidance connecting people and businesses with trusted support.",
  },
  {
    slug: "bakes-braai",
    name: "Bakes Braai",
    mark: "BB",
    division: "Food & Hospitality",
    tagline: "Good food brings us together.",
    description: "A welcoming food and hospitality company celebrating flavour and connection.",
  },
  {
    slug: "vink-insurance",
    name: "VINK Insurance",
    mark: "VI",
    division: "Insurance",
    tagline: "Protection for what matters.",
    description: "Clear, accessible insurance solutions for individuals, families and businesses.",
  },
  {
    slug: "vink-immigration-consultancy",
    name: "VINK Immigration Consultancy",
    mark: "VIC",
    division: "Immigration Services",
    tagline: "Your next chapter, clearly guided.",
    description: "Trusted immigration guidance for people, families and businesses moving forward.",
  },
];

export const companyFilters = ["All", ...Array.from(new Set(companies.slice(1).map((c) => c.division)))];

export const divisions = [
  {
    slug: "property",
    title: "Property & Real Estate",
    label: "Property",
    icon: "building",
    text: "Attainable homes and purposeful commercial spaces built for tomorrow.",
  },
  {
    slug: "financial-systems",
    title: "Banking & Financial Systems",
    label: "Financial Systems",
    icon: "bank",
    text: "Reliable infrastructure and intelligent tools that keep business moving.",
  },
  {
    slug: "payments",
    title: "Payments & Fintech",
    label: "Payments",
    icon: "card",
    text: "Simple, secure payment experiences for people and growing enterprises.",
  },
  {
    slug: "commerce",
    title: "E-commerce & Retail",
    label: "E-commerce",
    icon: "bag",
    text: "Connected marketplaces that put trusted products within easier reach.",
  },
  {
    slug: "community",
    title: "Not-for-Profit & Community Impact",
    label: "Community",
    icon: "heart",
    text: "Partnership-led programmes creating lasting, measurable social progress.",
  },
  {
    slug: "telecommunications",
    title: "Telecommunications",
    label: "Telecommunications",
    icon: "globe",
    text: "Reliable networks and communication services connecting people and opportunity.",
  },
  {
    slug: "media-broadcasting",
    title: "Television & Broadcasting",
    label: "Media & Broadcasting",
    icon: "spark",
    text: "Relevant programming and broadcasting experiences built for modern audiences.",
  },
  {
    slug: "news-media",
    title: "News Media",
    label: "News Media",
    icon: "briefcase",
    text: "Credible journalism and timely information delivered across trusted platforms.",
  },
  {
    slug: "vehicle-tracking",
    title: "Vehicle Tracking Systems",
    label: "Vehicle Tracking",
    icon: "map",
    text: "Connected tracking technology improving fleet visibility, safety and control.",
  },
  {
    slug: "construction",
    title: "Construction & Infrastructure",
    label: "Construction",
    icon: "construction",
    text: "Enduring buildings and infrastructure delivered with discipline and purpose.",
  },
  {
    slug: "energy",
    title: "Energy & Renewables",
    label: "Energy",
    icon: "energy",
    text: "Reliable, future-ready energy solutions powering inclusive economic progress.",
  },
  {
    slug: "legal-services",
    title: "Legal Services",
    label: "Legal Services",
    icon: "shield",
    text: "Clear, accessible legal support for individuals, families and growing businesses.",
  },
  {
    slug: "food-hospitality",
    title: "Food & Hospitality",
    label: "Food & Hospitality",
    icon: "heart",
    text: "Memorable food experiences built around quality, warmth and community.",
  },
  {
    slug: "insurance",
    title: "Insurance",
    label: "Insurance",
    icon: "shield",
    text: "Practical protection designed around the changing needs of people and businesses.",
  },
  {
    slug: "immigration-services",
    title: "Immigration Consultancy",
    label: "Immigration Services",
    icon: "globe",
    text: "Clear, responsible guidance through complex immigration and mobility journeys.",
  },
];

export const images = {
  city: "https://images.unsplash.com/photo-1783260606355-753ae29e557f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=88&w=1800",
  architecture:
    "https://images.unsplash.com/photo-1706164971302-e30c0640cc3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
  people:
    "https://images.unsplash.com/photo-1791594315790-c1454a290ff2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
  community:
    "https://images.unsplash.com/photo-1632215861513-130b66fe97f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
  children:
    "https://images.unsplash.com/photo-1509099836639-18ba1795216d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
  portrait1:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85",
  portrait2:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85",
  portrait3:
    "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=800&q=85",
  office:
    "https://images.unsplash.com/photo-1774953037913-af0cf688491a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=88&w=1600",
  construction:
    "https://images.unsplash.com/photo-1762356731498-99493f6258a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=88&w=1600",
  energy:
    "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=88&w=1600",
};
