import { images } from "./data";
import type { ArticleCard, Job } from "./api";

/** Shown only if the API is unreachable, so the site never looks empty. */
export const fallbackArticles: ArticleCard[] = [
  { slug: "", title: "Designing ecosystems, not empires: VINK’s model for shared growth", category: "Group news", excerpt: "How a connected group of independent companies shares expertise without losing its entrepreneurial edge.", imageUrl: images.city, featured: true, publishedAt: "2026-10-14T00:00:00Z" },
  { slug: "", title: "Why accessible housing begins with understanding everyday life", category: "Impact", excerpt: "", imageUrl: images.architecture, featured: false, publishedAt: "2026-09-30T00:00:00Z" },
  { slug: "", title: "Five principles shaping the next generation of African fintech", category: "Perspective", excerpt: "", imageUrl: images.people, featured: false, publishedAt: "2026-09-12T00:00:00Z" },
];

export const fallbackJobs: Job[] = [];
