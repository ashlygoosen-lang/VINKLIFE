import { useSyncExternalStore } from "react";

export function routeFromLocation() {
  return location.pathname.replace(/^\/|\/$/g, "") || "home";
}

export function navigate(path: string) {
  const target = path === "home" ? "/" : `/${path}`;
  if (target !== location.pathname) history.pushState({}, "", target);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
}

function subscribe(cb: () => void) {
  window.addEventListener("popstate", cb);
  return () => window.removeEventListener("popstate", cb);
}

export function useRoute() {
  return useSyncExternalStore(subscribe, routeFromLocation, () => "home");
}
