import React from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export const Hero: React.FC = () => {
  return (
    <section className="pt-12">
      <div className="space-y-2">
        <p className="font-normal text-muted-foreground text-base">hi there👋, I'm</p>
        <div>
          <h1 className="font-bold text-primary/90 text-4xl tracking-tight">
            {portfolioData.name}
          </h1>
          <div className="flex flex-col gap-0 font-normal text-primary/90 text-base">
            <span>{portfolioData.pronouns}</span>
            <span>{portfolioData.role}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm pt-1">
          <div className="cursor-target">
            <a
              href="#contact"
              className="hover:bg-primary/90 inline-flex justify-center items-center bg-primary shadow px-4 py-2 rounded-md h-9 font-medium text-primary-foreground text-sm whitespace-nowrap transition-colors"
              aria-label="Contact"
            >
              <span>Contact</span>
            </a>
          </div>

          <div className="cursor-target">
            <a
              href={portfolioData.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-primary/90 inline-flex justify-center items-center bg-primary shadow px-4 py-2 rounded-md h-9 font-medium text-primary-foreground text-sm whitespace-nowrap transition-colors"
              aria-label="Resume"
            >
              <span>Resume</span>
            </a>
          </div>

          <div className="flex gap-1 sm:gap-2">
            <div className="cursor-target">
              <a
                href={`mailto:${portfolioData.socials.email}`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2 text-primary/90"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>

            <div className="cursor-target">
              <a
                href={portfolioData.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2 text-primary/90"
                aria-label="Github"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>

            <div className="cursor-target">
              <a
                href={portfolioData.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2 text-primary/90"
                aria-label="Linkedin"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
