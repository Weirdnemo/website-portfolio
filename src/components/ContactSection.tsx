import React from 'react';
import { Mail, FileText, Github, Linkedin } from 'lucide-react';
import { usePortfolioData } from '../hooks/usePortfolioData';

export const ContactSection: React.FC = () => {
  const portfolioData = usePortfolioData();

  return (
    <section className="py-10" id="contact">
      <div className="space-y-6 text-center">
        <div className="space-y-4">
          <h2 className="font-bold text-3xl text-primary/90">Let's work together.</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-base">
            I'm always interested in new opportunities, aerospace research, and ambitious RL engineering projects. Whether you have a project in mind or just want to chat about tech, I'd love to hear from you.
          </p>
        </div>

        <div className="flex sm:flex-row flex-col justify-center items-center gap-4">
          <a
            href={`mailto:${portfolioData.socials.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center bg-primary hover:bg-primary/90 shadow px-4 rounded-md h-9 font-medium text-primary-foreground text-sm whitespace-nowrap transition-colors cursor-target"
          >
            <Mail className="mr-2 w-4 h-4" />
            Get in touch
          </a>

          <a
            href={portfolioData.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center hover:bg-primary/10 shadow px-4 border border-primary rounded-md h-9 font-medium text-primary text-sm whitespace-nowrap transition-colors cursor-target"
          >
            <FileText className="mr-2 w-4 h-4" />
            Download Resume
          </a>
        </div>

        <div className="flex justify-center items-center gap-6 pt-2">
          <a
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground hover:text-foreground transition-colors cursor-target"
            href={portfolioData.socials.github}
          >
            <Github className="w-5 h-5" />
          </a>

          <a
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted-foreground hover:text-foreground transition-colors cursor-target"
            href={portfolioData.socials.linkedin}
          >
            <Linkedin className="w-5 h-5" />
          </a>

          <a
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Email"
            className="text-muted-foreground hover:text-foreground transition-colors cursor-target"
            href={`mailto:${portfolioData.socials.email}`}
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>

        <div className="pt-4 cursor-target">
          <p className="text-muted-foreground text-sm">
            Open to RL engineering roles, aerospace research, and autonomous systems collaboration
          </p>
          <p className="mt-2 text-muted-foreground/60 text-xs">
            Response time: Usually within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
};
