export type Project = {
  id: number;
  title: string;
  description: string;
  category: string;
  poster: string;
  video: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  stars: number;
};

export type SiteMediaContent = {
  projects: Project[];
  testimonials: Testimonial[];
};

const MEDIA_STORAGE_KEY = "orcid-ui-media-content";

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Nebula Launch Film",
    description: "Cinematic brand trailer built for a SaaS product launch.",
    category: "Film",
    poster: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 2,
    title: "Modern Creator Landing",
    description: "Conversion-focused portfolio website for a digital creator.",
    category: "Web",
    poster: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 3,
    title: "Pulse Reels Campaign",
    description: "Short-form vertical edits optimized for social engagement.",
    category: "Social",
    poster: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    video: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 4,
    title: "Aerial Story Sequence",
    description: "Travel film cut with smooth transitions and color grading.",
    category: "Film",
    poster: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 5,
    title: "Event Teaser Edit",
    description: "Fast-paced teaser with motion typography and sound design.",
    category: "Film",
    poster: "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=1200&q=80",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 6,
    title: "Studio Identity Site",
    description: "Minimal site experience with interactive visual storytelling.",
    category: "Web",
    poster: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    video: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 7,
    title: "Luxury Product Edit",
    description: "Premium product showcase using macro visuals and light FX.",
    category: "Social",
    poster: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 8,
    title: "Creator Intro Film",
    description: "Personal brand intro designed to increase booking inquiries.",
    category: "Film",
    poster: "https://images.unsplash.com/photo-1491897554428-130a60dd4757?auto=format&fit=crop&w=1200&q=80",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 9,
    title: "Interactive Brand Page",
    description: "Futuristic website with smooth sections and rich motion.",
    category: "Web",
    poster: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=1200&q=80",
    video: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 10,
    title: "Social Story Edit Pack",
    description: "Batch storytelling edits crafted for daily posting cadence.",
    category: "Social",
    poster: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    quote: "He made our brand look premium in both web and video. The final result converted immediately.",
    author: "Samantha R.",
    role: "Founder, Flux Atelier",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
    stars: 5,
  },
  {
    quote: "Fast delivery, exceptional taste, and clean execution. Exactly the creative partner we needed.",
    author: "Daniel K.",
    role: "Marketing Lead, Nova Labs",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
    stars: 5,
  },
  {
    quote: "Our launch video and landing page finally feel cohesive. Clients mention it on every call.",
    author: "Amelia J.",
    role: "Brand Strategist",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80",
    stars: 5,
  },
];

export function getDefaultSiteMediaContent(): SiteMediaContent {
  return {
    projects: DEFAULT_PROJECTS,
    testimonials: DEFAULT_TESTIMONIALS,
  };
}

export function loadSiteMediaContent(): SiteMediaContent {
  if (typeof window === "undefined") {
    return getDefaultSiteMediaContent();
  }

  const defaults = getDefaultSiteMediaContent();
  const storedValue = window.localStorage.getItem(MEDIA_STORAGE_KEY);
  if (!storedValue) return defaults;

  try {
    const parsed = JSON.parse(storedValue) as Partial<SiteMediaContent>;
    return {
      projects: Array.isArray(parsed.projects) && parsed.projects.length === defaults.projects.length
        ? parsed.projects.map((project, index) => ({ ...defaults.projects[index], ...project }))
        : defaults.projects,
      testimonials: Array.isArray(parsed.testimonials) && parsed.testimonials.length === defaults.testimonials.length
        ? parsed.testimonials.map((testimonial, index) => ({ ...defaults.testimonials[index], ...testimonial }))
        : defaults.testimonials,
    };
  } catch {
    return defaults;
  }
}

export function saveSiteMediaContent(content: SiteMediaContent) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(content));
}

export function resetSiteMediaContent() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(MEDIA_STORAGE_KEY);
}
