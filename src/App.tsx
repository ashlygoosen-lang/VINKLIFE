import { useMemo } from "react";
import { useRoute } from "./router";
import { AdminPage } from "./admin";
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

export default function App() {
  const route = useRoute();
  return useMemo(() => {
    if (route === "home") return <Home />;
    if (route === "about") return <About />;
    if (route === "companies") return <CompaniesPage />;
    if (route.startsWith("company/")) return <CompanyDetail slug={route.split("/")[1]} />;
    if (route === "divisions") return <DivisionsPage />;
    if (route.startsWith("division/")) return <DivisionsPage slug={route.split("/")[1]} />;
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
}
