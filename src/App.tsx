import { useEffect, useMemo } from "react";
import { useRoute } from "./router";
import { companies, companyRedirects, divisionRedirects, divisions } from "./data";
import { AdminPage } from "./admin";
import { pageChanged } from "./motion";
import {
  About,
  ApplyPage,
  ArticlePage,
  Careers,
  CompaniesPage,
  CompanyDetail,
  Contact,
  DesignSystem,
  DivisionsPage,
  Home,
  Impact,
  News,
} from "./pages";

const SITE = "VINK Group";
const pageNames: Record<string, string> = {
  about: "About Us",
  companies: "Our Companies",
  divisions: "Divisions",
  impact: "Impact",
  news: "News & Insights",
  careers: "Careers",
  contact: "Contact Us",
  admin: "Admin",
  "design-system": "Design System",
};

function titleFor(route: string) {
  const [section, slug] = route.split("/");
  if (section === "company") {
    const c = companies.find((x) => x.slug === (companyRedirects[slug] ?? slug));
    if (c) return `${c.name} | ${SITE}`;
  }
  if (section === "division") {
    const d = divisions.find((x) => x.slug === (divisionRedirects[slug] ?? slug));
    if (d) return `${d.title} | ${SITE}`;
  }
  if (section === "careers" && route.startsWith("careers/apply/")) return `Apply | Careers | ${SITE}`;
  if (pageNames[section]) return `${pageNames[section]} | ${SITE}`;
  return `${SITE} | Official Website`;
}

export default function App() {
  const route = useRoute();
  useEffect(() => {
    document.title = titleFor(route);
    pageChanged();
  }, [route]);
  const page = useMemo(() => {
    if (route === "home") return <Home />;
    if (route === "about") return <About />;
    if (route === "companies") return <CompaniesPage />;
    if (route.startsWith("company/")) return <CompanyDetail slug={companyRedirects[route.split("/")[1]] ?? route.split("/")[1]} />;
    if (route === "divisions") return <DivisionsPage />;
    if (route.startsWith("division/")) return <DivisionsPage slug={divisionRedirects[route.split("/")[1]] ?? route.split("/")[1]} />;
    if (route === "impact") return <Impact />;
    if (route === "news") return <News />;
    if (route.startsWith("news/")) return <ArticlePage slug={route.split("/")[1]} />;
    if (route.startsWith("careers/apply/")) return <ApplyPage slug={route.split("/")[2]} />;
    if (route === "admin") return <AdminPage />;
    if (route === "careers") return <Careers />;
    if (route === "contact") return <Contact />;
    if (route === "design-system") return <DesignSystem />;
    return <Home />;
  }, [route]);
  return (
    <>
      <div className="route-progress" aria-hidden="true" />
      {page}
    </>
  );
}
