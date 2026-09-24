import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronRight, X } from 'lucide-react';
import type { Project } from '../data/portfolioData';
import { usePortfolioData } from '../hooks/usePortfolioData';

const ProjectDetailModal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-background border border-border rounded-lg max-w-sm w-full max-h-[80vh] overflow-y-auto p-5 shadow-xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <p className="text-lg font-medium text-primary/90 pr-6 flex items-center flex-wrap gap-2">
          <span>{project.title}</span>
          {project.badge && (
            <span className="inline-block bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-[11px]">
              {project.badge}
            </span>
          )}
        </p>

        <p className="text-muted-foreground text-sm mt-2">{project.description}</p>

        <ul className="space-y-1 mt-3 pl-3 text-muted-foreground text-xs text-justify list-disc">
          {project.bulletPoints.map((bullet, i) => (
            <li key={i}>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <ul className="flex flex-wrap items-center gap-1.5 mt-3">
          {project.techStack.map((tech) => (
            <li key={tech} className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-[11px]">
              {tech}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 text-xs mt-4">
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline underline-offset-2 text-primary/90"
            href={project.liveUrl || project.githubUrl}
          >
            {project.liveUrl ? 'View Package' : 'View Project'}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          {project.liveUrl && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
              href={project.githubUrl}
            >
              Source
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProjectsSection: React.FC = () => {
  const portfolioData = usePortfolioData();
  const [selected, setSelected] = useState<Project | null>(null);

  // Close the modal automatically if the viewport grows past mobile.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) setSelected(null);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div id="projects" className="py-8 sm:py-10">
      <h2 className="font-medium text-primary/90 text-base">projects.</h2>

      <ul className="flex flex-col gap-8 sm:gap-12 mt-3 sm:mt-4 font-normal text-primary/90 text-base">
        {portfolioData.projects.map((project) => (
          <li key={project.title} className="cursor-target">
            <div className="pl-3 sm:pl-4 border-muted-foreground/40 hover:border-primary border-l size-full transition-all duration-300">
              {/* Compact mobile card: title, one-line tagline, tag, View Project, expand chevron */}
              <div className="sm:hidden">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-base text-primary/90">{project.title}</p>
                  <button
                    onClick={() => setSelected(project)}
                    aria-label={`View details for ${project.title}`}
                    className="cursor-target shrink-0 p-1 rounded-md border border-muted-foreground/40 text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-muted-foreground text-xs truncate mt-0.5">{project.tagline}</p>

                <div className="flex items-center gap-3 text-xs mt-1.5">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline underline-offset-2"
                    href={project.liveUrl || project.githubUrl}
                  >
                    View Project
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  {project.badge && (
                    <span className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-[11px]">
                      {project.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Full desktop card: unchanged */}
              <div className="hidden sm:block">
                <div className="flex sm:flex-row flex-col justify-between items-start">
                  <div>
                    <p className="text-primary/90 text-lg flex items-center flex-wrap">
                      <span>{project.title}</span>
                      {project.badge && (
                        <span className="inline-block bg-secondary text-secondary-foreground ml-2 px-2 py-0.5 rounded text-xs">
                          {project.badge}
                        </span>
                      )}
                    </p>

                    <div className="flex items-center gap-3 text-sm mt-1">
                      <div className="flex items-center">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:underline underline-offset-2"
                          href={project.liveUrl || project.githubUrl}
                        >
                          {project.liveUrl ? 'View Package' : 'View Project'}
                          <ArrowUpRight className="w-4 h-4 ml-0.5" />
                        </a>
                      </div>

                      {project.liveUrl && (
                        <div className="flex items-center">
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                            href={project.githubUrl}
                          >
                            Source
                            <ArrowUpRight className="w-4 h-4 ml-0.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <ul className="space-y-1 mt-1 pl-3 text-muted-foreground text-sm text-justify list-disc">
                  {project.bulletPoints.map((bullet, i) => (
                    <li key={i}>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <ul className="flex flex-wrap items-center gap-2 mt-2 pl-3">
                  {project.techStack.map((tech) => (
                    <li key={tech} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-center mt-6 sm:mt-8">
        <a
          className="inline-flex justify-center items-center bg-background hover:bg-accent disabled:opacity-50 shadow-sm px-4 py-2 border border-border rounded-md font-medium text-muted-foreground text-sm whitespace-nowrap transition-colors hover:text-accent-foreground cursor-target"
          href="https://github.com/Weirdnemo?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
        >
          View all projects
        </a>
      </div>

      {selected && <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};
