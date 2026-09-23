import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export const ProjectsSection: React.FC = () => {
  return (
    <div id="projects" className="py-10">
      <h2 className="font-medium text-primary/90 text-base">projects.</h2>

      <ul className="flex flex-col gap-12 mt-4 font-normal text-primary/90 text-base">
        {portfolioData.projects.map((project) => (
          <li key={project.title} className="cursor-target">
            <div className="pl-4 border-muted-foreground/40 hover:border-primary border-l size-full transition-all duration-300">
              <div className="flex sm:flex-row flex-col justify-between items-start">
                <div>
                  <p className="text-primary/90 text-lg flex items-center flex-wrap">
                    <span>{project.title}</span>
                    {project.badge && (
                      <span className="inline-block bg-secondary text-secondary-foreground max-sm:mb-2 ml-2 px-2 py-0.5 rounded text-xs">
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
          </li>
        ))}
      </ul>

      <div className="flex justify-center mt-8">
        <a
          className="inline-flex justify-center items-center bg-background hover:bg-accent disabled:opacity-50 shadow-sm px-4 py-2 border border-border rounded-md font-medium text-muted-foreground text-sm whitespace-nowrap transition-colors hover:text-accent-foreground cursor-target"
          href="https://github.com/Weirdnemo?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
        >
          View all projects
        </a>
      </div>
    </div>
  );
};
