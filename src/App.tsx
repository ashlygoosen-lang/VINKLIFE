import { useMemo } from "react";
import { useRoute } from "./router";
import {
  About,
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
    if (route === "careers") return <Careers />;
    if (route === "contact") return <Contact />;
    if (route === "design-system") return <DesignSystem />;
    return <Home />;
  }, [route]);
}
