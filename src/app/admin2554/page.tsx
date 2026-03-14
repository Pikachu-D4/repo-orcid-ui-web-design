"use client";

import { useMemo, useState } from "react";
import {
  getDefaultSiteMediaContent,
  loadSiteMediaContent,
  resetSiteMediaContent,
  saveSiteMediaContent,
  type SiteMediaContent,
} from "@/lib/site-content";

export default function AdminPanelPage() {
  const defaults = useMemo(() => getDefaultSiteMediaContent(), []);
  const [content, setContent] = useState<SiteMediaContent>(() => loadSiteMediaContent());
  const [message, setMessage] = useState<string>("");

  const updateProject = (index: number, field: "poster" | "video", value: string) => {
    setContent((prev) => {
      const projects = [...prev.projects];
      projects[index] = { ...projects[index], [field]: value };
      return { ...prev, projects };
    });
  };

  const updateTestimonialAvatar = (index: number, value: string) => {
    setContent((prev) => {
      const testimonials = [...prev.testimonials];
      testimonials[index] = { ...testimonials[index], avatar: value };
      return { ...prev, testimonials };
    });
  };

  const handleSave = () => {
    saveSiteMediaContent(content);
    setMessage("Saved! Refresh the home page to see updated photos/videos.");
  };

  const handleReset = () => {
    resetSiteMediaContent();
    const fresh = defaults;
    setContent(fresh);
    setMessage("Reset to default website media.");
  };

  return (
    <main className="admin-panel-page">
      <div className="admin-panel-wrap">
        <h1>Admin Panel</h1>
        <p className="admin-panel-subtitle">
          Update website media here. This saves in your browser (localStorage) and updates the homepage at <code>/</code>.
        </p>

        <div className="admin-panel-actions">
          <button onClick={handleSave}>Save Changes</button>
          <button onClick={handleReset} className="secondary">Reset Defaults</button>
          {message ? <span className="status-msg">{message}</span> : null}
        </div>

        <section>
          <h2>Project Posters & Videos</h2>
          <div className="admin-grid">
            {content.projects.map((project, index) => (
              <article key={project.id} className="admin-card">
                <h3>{project.title}</h3>
                <label>
                  Poster URL
                  <input
                    type="url"
                    value={project.poster}
                    onChange={(event) => updateProject(index, "poster", event.target.value)}
                  />
                </label>
                <label>
                  Video URL
                  <input
                    type="url"
                    value={project.video}
                    onChange={(event) => updateProject(index, "video", event.target.value)}
                  />
                </label>
                <div className="admin-preview-row">
                  <img src={project.poster} alt={`${project.title} poster preview`} loading="lazy" />
                  <video src={project.video} controls muted playsInline />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2>Testimonial Profile Photos</h2>
          <div className="admin-grid testimonials">
            {content.testimonials.map((testimonial, index) => (
              <article key={testimonial.author} className="admin-card">
                <h3>{testimonial.author}</h3>
                <label>
                  Avatar URL
                  <input
                    type="url"
                    value={testimonial.avatar}
                    onChange={(event) => updateTestimonialAvatar(index, event.target.value)}
                  />
                </label>
                <div className="admin-avatar-preview">
                  <img src={testimonial.avatar} alt={`${testimonial.author} avatar preview`} loading="lazy" />
                  <p>{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
