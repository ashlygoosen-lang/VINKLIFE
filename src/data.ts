/** Group head office: used in the footer, contact page and map. */
export const headOffice = {
  city: "Cape Town",
  region: "Western Cape",
  country: "South Africa",
  /** Search text for the map; replace with the full street address when confirmed. */
  mapQuery: "Cape Town City Centre, Cape Town, South Africa",
};

export type CompanyProfile = {
  /** What the name means — shown on the company page. */
  meaning: string;
  /** Long-form "About" copy, one string per paragraph. */
  about: string[];
  /** Four key services: [icon, title, description]. */
  services: [string, string, string][];
  /** Frequently asked questions: [question, answer]. */
  faqs: [string, string][];
  /** Compliance or scope notice shown on the company page and contact form. */
  disclaimer?: string;
};

export type Company = {
  slug: string;
  name: string;
  mark: string;
  division: string;
  tagline: string;
  description: string;
  profile?: CompanyProfile;
  /** Full logo (symbol + name), transparent PNG/SVG in /public/brand/companies. */
  logo?: string;
  /** Symbol-only version for round badges. */
  icon?: string;
  /** The company's own website; the logo on its page links here. */
  website?: string;
};

/*
 * OUTSTANDING DETAILS TO CONFIRM BEFORE GO-LIVE (kept out of the public copy on purpose):
 * - SureBridge: FSP licence number and the name of the underwriting insurer(s).
 * - Buildora Group: CIDB grading, safety certifications and notable projects.
 * - LexBridge: how listed legal professionals are verified.
 * - Connectra Telecom: ICASA licence details.
 * - GlobalPath Immigration: practitioner registration / accreditation details.
 * - Voltora Energy: installer accreditations (e.g. PV GreenCard) and electrical CoC process.
 * - OwnDrive: final model (rent-to-own, financing referrals, vehicle sales, or all) and NCR registration if applicable.
 */

export const companies: Company[] = [
  {
    slug: "vink-group",
    name: "VINK Group",
    mark: "VG",
    division: "Group",
    tagline: "Progress, connected.",
    description:
      "The strategic parent connecting capital, expertise and opportunity across the group.",
  },
  {
    slug: "vink",
    name: "VINK",
    mark: "V",
    division: "Transport Technology",
    tagline: "Moving the taxi industry forward.",
    description:
      "Digital banking, fare collection and fleet management technology built for South Africa’s minibus-taxi industry.",
    logo: "/brand/companies/vink-logo.png",
    icon: "/brand/companies/vink-icon.png",
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
    logo: "/brand/companies/ophelp-logo.png",
    icon: "/brand/companies/ophelp-icon.png",
    division: "Community",
    tagline: "Help that reaches further.",
    description: "Connecting people, partners and resources to meaningful community needs.",
  },
  {
    slug: "affordablelife",
    name: "AffordableLife",
    mark: "AL",
    logo: "/brand/companies/affordablelife-logo.png",
    icon: "/brand/companies/affordablelife-icon.png",
    division: "Property",
    tagline: "A place for everyone.",
    description: "Thoughtful, attainable homes designed around real families and communities.",
  },
  {
    slug: "talentbridge",
    name: "TalentBridge",
    mark: "TB",
    division: "Recruitment",
    tagline: "Connecting Talent to Opportunity.",
    description:
      "A digital recruitment and employment platform connecting job seekers with employers and recruiters.",
    profile: {
      meaning:
        "“Talent” stands for people, skills and potential; “Bridge” represents the connection between job seekers and the employers who need them.",
      about: [
        "TalentBridge is a digital recruitment and employment platform that connects job seekers with employers and recruiters. We make it simpler for people to find work that suits their skills, and for organisations to find the people they need to grow.",
        "Job seekers can create a profile, upload a CV, search and apply for vacancies and receive notifications when suitable roles are posted. Employers and recruiters can advertise vacancies, search for candidates and manage applications in one place.",
        "By giving both sides clear, timely information, we help hiring decisions happen faster and more fairly. Whether you are taking your first step into work or building a growing team, TalentBridge connects talent to opportunity.",
      ],
      services: [
        ["users", "Candidate profiles and CVs", "Build a professional profile, upload your CV and present your skills and experience clearly to employers."],
        ["search", "Job search and alerts", "Search vacancies by role, sector and location, apply online and receive notifications when new roles match your profile."],
        ["briefcase", "Vacancy advertising", "Employers and recruiters can publish vacancies quickly and reach a growing pool of qualified candidates."],
        ["chart", "Application management", "Shortlist, track and manage applications from a single dashboard, with candidate search built in."],
      ],
      faqs: [
        ["Who can use TalentBridge?", "Job seekers at every career stage, as well as employers and recruitment agencies looking to fill vacancies."],
        ["How do I apply for a job?", "Create a profile, upload your CV and apply directly to any vacancy listed on the platform. You can track the status of each application from your profile."],
        ["How do employers advertise a vacancy?", "Employers register an account, publish their vacancy and manage incoming applications through the employer dashboard. Contact our team for help getting started."],
      ],
    },
  },
  {
    slug: "owndrive",
    name: "OwnDrive",
    mark: "OD",
    division: "Vehicle Ownership",
    tagline: "Your Journey to Vehicle Ownership Starts Here.",
    description:
      "A vehicle ownership and mobility platform making vehicle access more achievable through flexible purchasing and financing solutions.",
    profile: {
      meaning:
        "“Own” captures the goal of vehicle ownership; “Drive” stands for mobility and the journey to get there.",
      about: [
        "OwnDrive is a vehicle ownership and mobility platform that makes owning a vehicle more achievable. We offer flexible purchasing options, partnerships with vehicle financiers and structured acquisition solutions for individuals, working drivers and small businesses.",
        "We explain every option clearly, from deposit and term to the total cost of ownership, so customers can choose a path that fits their income and goals. There are no surprises, only a clear plan.",
        "Our team supports customers from the first enquiry and application through to vehicle handover and beyond. With OwnDrive, your journey to vehicle ownership starts here.",
      ],
      services: [
        ["card", "Flexible purchasing options", "Structured payment plans designed to make vehicle ownership attainable for more people."],
        ["bank", "Financing partnerships", "Access to vehicle finance through our network of reputable finance partners."],
        ["map", "Vehicle selection", "Guidance on choosing a dependable vehicle that suits your needs, budget and type of use."],
        ["users", "Ownership support", "Help from application through to handover, with ongoing support throughout your agreement."],
      ],
      faqs: [
        ["Who is OwnDrive for?", "Individuals, working drivers and small businesses who need a reliable vehicle and want a clear, structured route to owning one."],
        ["What do I need to apply?", "Typically a valid ID, a driver’s licence, proof of income and proof of address. Our team will confirm exactly what is needed for your chosen option."],
        ["Is approval guaranteed?", "No. Finance and acquisition options are subject to an affordability assessment and the approval of the relevant credit provider."],
      ],
      disclaimer:
        "Vehicle finance is subject to an affordability assessment, approval by the relevant credit provider and applicable terms and conditions.",
    },
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
    division: "Software Engineering",
    tagline: "Software, engineered.",
    description:
      "A software development and engineering company building web, mobile and cloud platforms for businesses and institutions.",
  },
  {
    slug: "connectra-telecom",
    name: "Connectra Telecom",
    mark: "CT",
    division: "Telecommunications",
    tagline: "Connecting People. Powering Possibilities.",
    description:
      "A telecommunications and connectivity provider offering communication services, internet connectivity and business networking solutions.",
    profile: {
      meaning:
        "“Connect” speaks to communication and networks; “ra” gives a modern, confident finish; “Telecom” names the sector clearly.",
      about: [
        "Connectra Telecom is a telecommunications and connectivity provider helping people, households and businesses stay connected. We offer communication services, internet connectivity, business communication solutions and digital networking technologies designed for reliability and value.",
        "For organisations, we provide voice, data, networking and unified communication services that help teams work efficiently across offices, sites and regions.",
        "We focus on dependable service, clear pricing and responsive support, backed by partners and infrastructure that scale as our customers grow. Connectra Telecom connects people and powers the possibilities that connection creates.",
      ],
      services: [
        ["globe", "Internet connectivity", "Reliable home and business internet solutions, with options to suit different locations and needs."],
        ["phone", "Business communication", "Voice, conferencing and unified communication services that keep teams and customers in touch."],
        ["spark", "Networking solutions", "Design, installation and support of secure networks for offices, sites and multi-branch businesses."],
        ["users", "Customer support", "Responsive technical and account support to keep services running smoothly."],
      ],
      faqs: [
        ["Who does Connectra Telecom serve?", "Households, small and medium businesses and larger organisations that need dependable connectivity and communication services."],
        ["Can you connect multiple business sites?", "Yes. We design networking and communication solutions that link offices, branches and remote teams."],
        ["How do I check service availability?", "Contact our team with your address or site details and we will confirm the options available in your area."],
      ],
    },
  },
  {
    slug: "visionwave-media",
    name: "VisionWave Media",
    mark: "VW",
    division: "Media & Communications",
    tagline: "Stories That Inspire. Media That Connects.",
    description:
      "A multimedia and communications company spanning digital content, television, broadcasting, news, advertising, photography, video production and brand communication.",
    profile: {
      meaning:
        "“Vision” stands for creativity and foresight; “Wave” represents reach, broadcast and momentum.",
      about: [
        "VisionWave Media is a multimedia and communications company that helps businesses, organisations and individuals tell their stories and reach the right audiences. We produce digital content, television and broadcast programming, news and current-affairs content, advertising campaigns, photography, video and brand communication.",
        "Our team handles the whole creative process, from concept and scripting to production, editing and distribution across digital, broadcast and social platforms.",
        "We combine strong storytelling with technical quality to make messages memorable and measurable. From a corporate video to a full campaign, VisionWave Media creates content that informs, inspires and connects.",
      ],
      services: [
        ["spark", "Television and broadcasting", "Programme development, studio and location production, and broadcast-ready delivery."],
        ["briefcase", "News and digital content", "Credible news, features and digital content produced for web, mobile and social audiences."],
        ["chart", "Advertising and brand communication", "Campaign strategy, creative development and brand messaging that builds recognition and trust."],
        ["access", "Photography and video production", "Corporate, commercial and event photography and video, from concept to final edit."],
      ],
      faqs: [
        ["What kind of clients do you work with?", "Businesses, public institutions, non-profit organisations and individuals who need professional content, campaigns or broadcast production."],
        ["Do you manage projects from start to finish?", "Yes. We can handle concept, scripting, production, post-production and distribution, or support any single stage of your project."],
        ["Can you produce content for social media?", "Yes. We create and adapt content for social and digital platforms alongside broadcast and print formats."],
      ],
    },
  },
  {
    slug: "fleetpulse",
    name: "FleetPulse",
    mark: "FP",
    division: "Vehicle Tracking",
    tagline: "Every Vehicle. Every Journey. Under Control.",
    description:
      "Intelligent vehicle tracking, fleet management and telematics for individuals and businesses.",
    profile: {
      meaning:
        "“Fleet” stands for vehicles and operations; “Pulse” represents real-time monitoring and live data.",
      about: [
        "FleetPulse provides intelligent vehicle tracking, fleet management and telematics for individuals and businesses. Our platform shows where every vehicle is, how it is being driven and when it needs attention, so owners and fleet managers can act quickly and with confidence.",
        "Customers can monitor live locations, review trip history, manage drivers, set alerts and receive real-time vehicle information from a single dashboard.",
        "We help businesses improve fleet efficiency, encourage safer driving and strengthen vehicle security, while giving private owners peace of mind. From a single car to a national fleet, FleetPulse keeps every vehicle and every journey under control.",
      ],
      services: [
        ["map", "Live vehicle tracking", "Real-time location, trip history and geofence alerts for every vehicle, on web and mobile."],
        ["chart", "Fleet management", "Utilisation, fuel and maintenance insights that help reduce operating costs and downtime."],
        ["users", "Driver management", "Driver behaviour reporting and driver assignment to support safer, more accountable fleets."],
        ["shield", "Vehicle security", "Instant alerts for unauthorised movement, helping protect vehicles and respond quickly to incidents."],
      ],
      faqs: [
        ["Is FleetPulse only for large fleets?", "No. FleetPulse suits private vehicle owners, small businesses and large fleets alike."],
        ["Can I see my vehicles on my phone?", "Yes. Live locations, trips and alerts are available through our web and mobile platform."],
        ["How is a tracking unit installed?", "Our team arranges professional installation and helps you set up your account, vehicles and drivers."],
      ],
    },
  },
  {
    slug: "motora-automotive",
    name: "Motora Automotive",
    mark: "MA",
    division: "Automotive",
    tagline: "Engineering Mobility. Driving Innovation.",
    description:
      "An automotive manufacturing and mobility solutions company focused on vehicle development, engineering, production, assembly and innovation.",
    profile: {
      meaning:
        "“Motor” stands for vehicles and engineering; “ora” gives a modern, international feel; “Automotive” names the sector clearly.",
      about: [
        "Motora Automotive is an automotive manufacturing and mobility solutions company focused on vehicle development, engineering, production and assembly. We combine engineering capability, disciplined manufacturing processes and a commitment to innovation.",
        "Our work spans product development, component sourcing, assembly, quality assurance and technical support, with vehicles and mobility solutions designed for the needs of African roads and growing markets.",
        "We collaborate with suppliers, technology partners and fleet customers to deliver vehicles that are safe, efficient and dependable. Motora Automotive is engineering mobility and driving innovation for the journeys ahead.",
      ],
      services: [
        ["spark", "Vehicle development and engineering", "Concept, design and engineering of vehicles and components for local and regional markets."],
        ["construction", "Production and assembly", "Structured manufacturing and assembly processes built around safety, efficiency and consistency."],
        ["check", "Quality assurance", "Testing and inspection at every stage to meet required safety and performance standards."],
        ["map", "Mobility solutions", "Vehicle and mobility solutions for businesses, fleets and public-sector partners."],
      ],
      faqs: [
        ["What does Motora Automotive do?", "We develop, engineer, produce and assemble vehicles, and provide related mobility solutions for businesses and fleets."],
        ["Is Motora Automotive a vehicle dealership?", "No. Motora Automotive is an independent manufacturing and mobility company. We are not a dealership and are not affiliated with any other vehicle manufacturer."],
        ["Do you work with partners and suppliers?", "Yes. We work with component suppliers, technology partners and fleet customers. Contact our team to discuss a partnership."],
      ],
      disclaimer:
        "Motora Automotive is an independent company and is not affiliated with, or an authorised dealer for, any other vehicle manufacturer or brand.",
    },
  },
  {
    slug: "buildora-group",
    name: "Buildora Group",
    mark: "BG",
    division: "Construction",
    tagline: "Building Today. Shaping Tomorrow.",
    description:
      "A construction and infrastructure development company delivering residential, commercial and industrial projects.",
    profile: {
      meaning:
        "“Build” with “ora” gives a modern, international feel; “Group” signals scale and multiple capabilities.",
      about: [
        "Buildora Group is a construction and infrastructure development company delivering residential, commercial and industrial projects from concept to completion. We combine skilled workmanship, sound engineering and disciplined project management to deliver projects on specification, on budget and on schedule.",
        "Our services include building construction, civil works, renovations, project management and development support. We work closely with clients, architects, engineers and suppliers, with safety, quality and transparent communication on every site.",
        "Whether you are building a home, a business premises or a major development, Buildora Group turns plans into lasting structures.",
      ],
      services: [
        ["building", "Building construction", "Residential, commercial and industrial construction delivered to specification and schedule."],
        ["construction", "Civil works", "Earthworks, roads, drainage and site infrastructure that prepare the ground for development."],
        ["spark", "Renovations", "Refurbishments, extensions and upgrades that add value to existing properties."],
        ["chart", "Project management", "Planning, budgeting, supplier coordination and reporting from start to handover."],
      ],
      faqs: [
        ["What types of projects do you take on?", "Residential, commercial and industrial projects, including new builds, civil works and renovations."],
        ["Can you work with my architect or engineer?", "Yes. We work closely with clients’ professional teams, or can help appoint one for your project."],
        ["How do you manage safety on site?", "Every site follows a documented health and safety plan, with regular inspections and clear communication with all parties."],
      ],
    },
  },
  {
    slug: "voltora-energy",
    name: "Voltora Energy",
    mark: "VE",
    division: "Energy",
    tagline: "Powering Progress. Energising Tomorrow.",
    description:
      "An energy solutions company delivering sustainable services across renewable energy, solar power, electricity infrastructure, energy storage and power management.",
    profile: {
      meaning:
        "“Volt” stands for electricity and power; “ora” gives a modern, forward-looking finish.",
      about: [
        "Voltora Energy is an energy solutions company delivering sustainable energy services for homes, businesses and communities. We work across renewable energy, solar power, electricity infrastructure, energy storage and power management.",
        "Our team assesses each site, designs the right system, manages installation and supports customers with monitoring and maintenance after commissioning. The result is lower energy costs, greater reliability and a smaller environmental footprint.",
        "From rooftop solar and battery backup to larger commercial and infrastructure projects, we deliver practical solutions built for long-term performance. Voltora Energy powers progress today while energising a more sustainable tomorrow.",
      ],
      services: [
        ["energy", "Solar power systems", "Design and installation of solar PV systems for homes, businesses and community facilities."],
        ["shield", "Energy storage and backup", "Battery storage and backup power solutions that keep essential operations running."],
        ["construction", "Electrical infrastructure", "Electrical installation and infrastructure projects delivered safely and to standard."],
        ["chart", "Power management", "Monitoring, maintenance and efficiency advice to get the most from every system."],
      ],
      faqs: [
        ["How do I know what size of system I need?", "We start with a site assessment and a review of your energy use, then recommend a system sized to your needs and budget."],
        ["Do you install for businesses as well as homes?", "Yes. We deliver residential, commercial and larger infrastructure projects."],
        ["Do you provide maintenance after installation?", "Yes. We offer monitoring and maintenance support to keep systems performing well over time."],
      ],
    },
  },
  {
    slug: "lexbridge",
    name: "LexBridge",
    mark: "LB",
    division: "Legal Services",
    tagline: "Connecting People to Legal Solutions.",
    description:
      "A digital legal services platform connecting individuals and businesses with qualified legal professionals and law firms.",
    profile: {
      meaning: "“Lex” is Latin for law; “Bridge” represents the connection between people and legal help.",
      about: [
        "LexBridge is a digital legal services platform that makes legal assistance easier to find and use. We connect individuals and businesses with qualified legal professionals, law firms and legal service providers across a range of practice areas.",
        "Users can browse a lawyer directory, access general legal information, request consultations and submit legal enquiries online.",
        "Our aim is to remove the confusion and delay from finding the right legal help, so people can understand their options and take informed next steps with the right professional.",
      ],
      services: [
        ["search", "Lawyer directory", "Find legal professionals and law firms by practice area and location."],
        ["access", "Legal information", "Plain-language guides that explain common legal topics and processes."],
        ["users", "Consultation requests", "Request a consultation with a suitable legal professional online."],
        ["mail", "Online legal enquiries", "Submit your enquiry once and be referred to a professional who can help."],
      ],
      faqs: [
        ["Does LexBridge give legal advice?", "No. LexBridge provides general legal information and connects you with independent legal professionals, who provide advice directly."],
        ["Who are the legal professionals on LexBridge?", "Independent attorneys, law firms and legal service providers who are responsible for their own qualifications and services."],
        ["How much does a consultation cost?", "Fees are set by each legal professional. They will confirm their fees with you before any work begins."],
      ],
      disclaimer:
        "LexBridge provides general legal information and a connection service. It does not provide regulated legal advice. Listed professionals are independently responsible for their qualifications and services.",
    },
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
    slug: "surebridge",
    name: "SureBridge",
    mark: "SB",
    division: "Insurance",
    tagline: "Protecting What Matters Most.",
    description:
      "An insurance solutions company providing individuals, families and businesses with reliable insurance products that protect their assets, financial wellbeing and future.",
    profile: {
      meaning:
        "“Sure” signals certainty and protection; “Bridge” represents connecting customers to the right cover.",
      about: [
        "SureBridge is an insurance solutions company that helps individuals, families and businesses protect what they have worked hard to build. We take the time to understand each customer’s circumstances, then connect them with suitable cover through clear, honest advice and simple processes.",
        "Our range covers personal, family, vehicle, property and business protection, with support from the first quotation through to claims assistance. Customers can request quotes, review policy information and get help with claims through a straightforward online platform backed by a responsive support team.",
        "We believe insurance should be easy to understand, fairly explained and dependable when it matters most.",
      ],
      services: [
        ["heart", "Personal and family cover", "Life, funeral and personal cover that protects the people who depend on you."],
        ["shield", "Vehicle and property insurance", "Cover for your car, home and belongings against loss, damage and theft."],
        ["briefcase", "Business insurance", "Protection for business assets, liability and continuity, tailored to your operations."],
        ["users", "Claims support", "Guidance and assistance through every step of the claims process."],
      ],
      faqs: [
        ["How do I get a quote?", "Complete the enquiry form on this page or contact our team. We will ask a few questions about your needs and come back to you with suitable options."],
        ["Can you help me with a claim?", "Yes. Our team supports customers through the claims process, from submitting documents to following up with the insurer."],
        ["Who underwrites the policies?", "Policies are underwritten by our insurer partners. The insurer and policy terms are set out clearly in every quotation."],
      ],
      disclaimer: "Cover is subject to the terms and conditions of the underwriting insurer.",
    },
  },
  {
    slug: "globalpath-immigration",
    name: "GlobalPath Immigration",
    mark: "GP",
    logo: "/brand/companies/globalpath-logo.png",
    icon: "/brand/companies/globalpath-icon.png",
    website: "https://globalpath-production.up.railway.app",
    division: "Immigration Services",
    tagline: "Your Journey. Your Future. Our Guidance.",
    description:
      "Immigration and migration support for individuals, families and businesses, from visa guidance and document preparation to residency, work permits and study pathways.",
    profile: {
      meaning:
        "“Global” reflects international reach; “Path” represents a clear, guided route to your destination.",
      about: [
        "GlobalPath Immigration provides immigration and migration support for individuals, families and businesses planning a move across borders. We guide clients through visa applications, document preparation, residency, work permits and study pathways.",
        "Every case begins with a consultation to understand your goals, followed by a clear plan, a document checklist and a realistic timeline. Businesses rely on us to support the relocation of skilled employees and to navigate work-permit processes with care.",
        "Your journey is your own. Our role is to guide you through it clearly and responsibly, in line with the regulations that apply.",
      ],
      services: [
        ["globe", "Visa application guidance", "Advice on the right visa category and support in preparing a complete application."],
        ["download", "Document preparation", "Checklists and review of supporting documents to reduce delays and avoidable errors."],
        ["briefcase", "Work permits and relocation", "Support for employers and skilled professionals with work permits and relocation."],
        ["access", "Residency and study pathways", "Guidance on permanent residency, family reunification and study-visa routes."],
      ],
      faqs: [
        ["Can you guarantee my application will be approved?", "No. Decisions are made by the relevant immigration authorities. We help you prepare a complete, accurate application to give it the best chance."],
        ["Which countries do you assist with?", "We support applications for South Africa and a range of international destinations. Contact us with your destination to confirm."],
        ["Do you assist businesses?", "Yes. We support employers with work permits and the relocation of skilled employees."],
      ],
      disclaimer:
        "GlobalPath Immigration provides guidance and application support. All applications are subject to the laws and requirements of the relevant authorities, and approval cannot be guaranteed.",
    },
  },
];

/** Portfolio groups: how companies are presented in columns across the site. */
export type Cluster = { slug: string; name: string; text: string; companies: string[] };
export const clusters: Cluster[] = [
  {
    slug: "mobility",
    name: "Mobility & Transport",
    text: "Moving people, vehicles and fleets.",
    companies: ["vink", "fleetpulse", "motora-automotive", "owndrive"],
  },
  {
    slug: "financial",
    name: "Financial & Insurance",
    text: "Protecting and moving money.",
    companies: ["surebridge", "mansya", "totoise"],
  },
  {
    slug: "infrastructure",
    name: "Infrastructure & Energy",
    text: "Building and powering places.",
    companies: ["buildora-group", "voltora-energy", "affordablelife"],
  },
  {
    slug: "digital",
    name: "Technology & Media",
    text: "Connecting people and markets.",
    companies: ["altegic", "connectra-telecom", "visionwave-media", "talentbridge", "ballylife-online"],
  },
  {
    slug: "services",
    name: "Services & Community",
    text: "Guidance, care and hospitality.",
    companies: ["lexbridge", "globalpath-immigration", "ophelp", "bakes-braai"],
  },
];
export const companiesIn = (cluster: Cluster) =>
  cluster.companies
    .map((slug) => companies.find((c) => c.slug === slug))
    .filter((c): c is Company => Boolean(c));
export const clusterOf = (company: Company) =>
  clusters.find((g) => g.companies.includes(company.slug));

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
    slug: "recruitment",
    title: "Recruitment & Employment",
    label: "Recruitment",
    icon: "users",
    text: "Digital platforms connecting job seekers with employers, recruiters and opportunity.",
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
    slug: "transport-technology",
    title: "Transport Technology & Fintech",
    label: "Transport Technology",
    icon: "card",
    text: "Digital banking, fare collection and fleet tools for the minibus-taxi industry.",
  },
  {
    slug: "software-engineering",
    title: "Software Development & Engineering",
    label: "Software Engineering",
    icon: "spark",
    text: "Custom software, platforms and digital products engineered for growing organisations.",
  },
  {
    slug: "telecommunications",
    title: "Telecommunications",
    label: "Telecommunications",
    icon: "globe",
    text: "Reliable networks and communication services connecting people and opportunity.",
  },
  {
    slug: "media-communications",
    title: "Media & Communications",
    label: "Media & Communications",
    icon: "spark",
    text: "Television, broadcasting, news, advertising and digital content that inform and connect audiences.",
  },
  {
    slug: "vehicle-tracking",
    title: "Vehicle Tracking & Telematics",
    label: "Vehicle Tracking",
    icon: "map",
    text: "Connected tracking technology improving fleet visibility, safety and control.",
  },
  {
    slug: "automotive",
    title: "Automotive & Mobility",
    label: "Automotive",
    icon: "construction",
    text: "Vehicle development, engineering, production and assembly for growing markets.",
  },
  {
    slug: "vehicle-ownership",
    title: "Vehicle Ownership & Finance",
    label: "Vehicle Ownership",
    icon: "card",
    text: "Flexible, structured routes that make owning a vehicle more achievable.",
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
    text: "Digital access to qualified legal professionals for individuals and businesses.",
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

/** Old company URLs that now point to a renamed company. */
export const companyRedirects: Record<string, string> = {
  "vink-insurance": "surebridge",
  "vink-construction": "buildora-group",
  "vink-television": "visionwave-media",
  "vink-news-media": "visionwave-media",
  "call-my-lawyer": "lexbridge",
  "vink-vehicle-tracking": "fleetpulse",
  "vink-telecommunications": "connectra-telecom",
  "vink-immigration-consultancy": "globalpath-immigration",
  siira: "talentbridge",
  "vink-energy": "voltora-energy",
  "drive-to-own": "owndrive",
};

/** Old division URLs that were merged or renamed. */
export const divisionRedirects: Record<string, string> = {
  payments: "recruitment",
  "media-broadcasting": "media-communications",
  "news-media": "media-communications",
};

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
