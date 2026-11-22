/**
 * VINK Group motion system. One small engine, no libraries.
 *
 *  - first-visit brand intro: the gold V settles on oxblood, then the curtain parts
 *  - scroll reveals with stagger across every page, plus clip reveals for imagery
 *  - hero parallax and a soft gold pointer light (desktop only)
 *  - magnetic primary buttons and gentle 3D card tilt (fine pointers only)
 *  - route progress line and page-enter on every navigation
 *
 * Content stays visible without JavaScript: hidden start states only apply once <html>
 * carries the `motion` class, which is never added when reduced motion is requested.
 */
import { Children, Fragment, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

const REVEAL = [
  // headings and intros
  ".section-heading", ".heading-row > :not(.section-heading)", ".why-intro > *", ".spotlight-copy > *",
  ".split-story > *", ".key-quote", ".article-body > *", ".featured-article", ".form-intro > *",
  // grids and lists, staggered by parent
  ".stats-grid > div", ".division-card", ".growth-card", ".company-card", ".values-grid > *",
  ".mission-grid > *", ".leader-grid > *", ".impact-grid > *", ".case-grid > *", ".service-grid > *",
  ".article-grid > *", ".contact-cards > *", ".timeline > *", ".benefit-list > *", ".governance-points > *",
  ".portfolio-col", ".child-nodes > *", ".parent-node", ".directory-group", ".faq-section details",
  ".jobs > *", ".enquiry-grid > *", ".news-preview .article-grid > *", ".cta-inner > *", ".newsletter-section .page-shell > *",
  // imagery
  ".spotlight-image", ".article-image", ".impact-collage > *", ".gallery > *", ".culture-gallery > *", ".company-hero-photo",
].join(",");

const IMAGE = ".spotlight-image, .article-image, .impact-collage > *, .gallery > *, .culture-gallery > *, .company-hero-photo";
const TILT = ".company-card, .growth-card";
const MAGNET = ".hero-copy .button, .cta-inner .button, .header-cta, .footer-cta-action .button";
const APP_ROUTES = /^\/(admin|design-system)/;

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => matchMedia("(hover: hover) and (pointer: fine)").matches;

let io: IntersectionObserver | null = null;

function tag(root: ParentNode) {
  if (APP_ROUTES.test(location.pathname)) return;
  root.querySelectorAll<HTMLElement>(REVEAL).forEach((el) => {
    if (el.dataset.reveal || el.dataset.revealed) return;
    if (el.closest(".home-hero, .page-hero")) return; // heroes have their own entrance
    el.dataset.reveal = el.matches(IMAGE) ? "image" : "up";
    const parent = el.parentElement;
    if (parent) {
      const sibs = Array.from(parent.children).filter((c) => (c as HTMLElement).matches?.(REVEAL));
      const i = sibs.indexOf(el);
      if (sibs.length > 1 && i > 0) el.style.setProperty("--i", String(Math.min(i, 8)));
    }
    io?.observe(el);
  });
}

let raf = 0;
function onScroll() {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    document.documentElement.style.setProperty("--scroll", String(Math.min(scrollY, 1200)));
  });
}

function onPointerMove(e: PointerEvent) {
  const t = e.target as HTMLElement;
  const hero = t.closest<HTMLElement>(".home-hero, .page-hero");
  if (hero) {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    hero.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  }
  const mag = t.closest<HTMLElement>(MAGNET);
  if (mag) {
    const r = mag.getBoundingClientRect();
    mag.style.setProperty("--tx", `${(((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(2)}px`);
    mag.style.setProperty("--ty", `${(((e.clientY - r.top) / r.height - 0.5) * 8).toFixed(2)}px`);
    mag.classList.add("is-magnet");
  }
  const card = t.closest<HTMLElement>(TILT);
  if (card) {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.setProperty("--rx", `${(-py * 4).toFixed(2)}deg`);
    card.style.setProperty("--ry", `${(px * 5).toFixed(2)}deg`);
    card.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
    card.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
  }
}
function onPointerOut(e: PointerEvent) {
  const t = e.target as HTMLElement;
  const rel = e.relatedTarget as Node | null;
  const mag = t.closest<HTMLElement>(".is-magnet");
  if (mag && !mag.contains(rel)) {
    mag.style.removeProperty("--tx");
    mag.style.removeProperty("--ty");
    mag.classList.remove("is-magnet");
  }
  const card = t.closest<HTMLElement>(TILT);
  if (card && !card.contains(rel)) {
    card.style.removeProperty("--rx");
    card.style.removeProperty("--ry");
  }
}

export function initMotion() {
  if (typeof window === "undefined" || reduced()) return;
  document.documentElement.classList.add("motion");

  io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        const el = en.target as HTMLElement;
        el.classList.add("is-in");
        io!.unobserve(el);
        const delay = Number(el.style.getPropertyValue("--i") || 0) * 70;
        // once revealed, hand the element back to its own hover transitions
        setTimeout(() => {
          el.dataset.revealed = "1";
          delete el.dataset.reveal;
          el.style.removeProperty("--i");
        }, 1700 + delay);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      tag(document);
    });
  }).observe(document.getElementById("root") || document.body, { childList: true, subtree: true });
  tag(document);

  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (finePointer()) {
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });
  }
  addEventListener("beforeprint", () => document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in")));
}

/** First visit of a session: the gold V settles on oxblood, then the curtain parts. About one second. */
export function playIntro() {
  if (typeof window === "undefined" || reduced()) return;
  try {
    if (sessionStorage.getItem("vink-intro")) return;
    sessionStorage.setItem("vink-intro", "1");
  } catch {
    return;
  }
  const html = document.documentElement;
  html.classList.add("has-intro");
  const el = document.createElement("div");
  el.className = "vk-intro";
  el.setAttribute("aria-hidden", "true");
  el.innerHTML =
    '<div class="vk-intro-half vk-intro-top"></div><div class="vk-intro-half vk-intro-bottom"></div>' +
    '<div class="vk-intro-mark"><img src="/brand/vink-v-emblem.png" alt="" width="84" height="90"><span>VINK <i>Group</i></span></div>';
  document.body.appendChild(el);
  setTimeout(() => el.classList.add("is-leaving"), 850);
  setTimeout(() => el.remove(), 1700);
  setTimeout(() => html.classList.remove("has-intro"), 4200);
}

/** On every route change: restart the page-enter transition and the gold progress line. */
export function pageChanged() {
  if (!document.documentElement.classList.contains("motion")) return;
  for (const el of [document.querySelector(".route-progress"), document.getElementById("main")]) {
    if (!el) continue;
    el.classList.remove("is-running");
    void (el as HTMLElement).offsetWidth;
    el.classList.add("is-running");
  }
}

/**
 * Splits a heading's text into clipped word spans for a word-by-word rise, keeping line breaks
 * and inline elements (such as the gold <em>) intact. Screen readers read the plain text.
 */
export function SplitHeading({ children }: { children: ReactNode }) {
  let n = 0;
  const walk = (node: ReactNode): ReactNode =>
    Children.map(node, (child) => {
      if (typeof child === "string" || typeof child === "number") {
        const parts = String(child).split(/(\s+)/);
        return parts.map((part, i) =>
          /^\s+$/.test(part) || part === "" ? (
            <Fragment key={i}>{part}</Fragment>
          ) : (
            <span className="w" key={i} style={{ ["--w" as string]: n++ }}>
              <span>{part}</span>
            </span>
          ),
        );
      }
      if (isValidElement(child)) {
        const el = child as ReactElement<{ children?: ReactNode }>;
        if (el.type === "br" || el.props.children == null) return el;
        return cloneElement(el, undefined, walk(el.props.children));
      }
      return child;
    });
  return <>{walk(children)}</>;
}
