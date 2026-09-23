import React from 'react';
import { ArrowUp } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex max-md:flex-col justify-between items-center max-md:gap-2 mb-6 py-10 border-border border-t">
      <p className="text-muted-foreground text-base text-center">
        {portfolioData.name} · {new Date().getFullYear()}
      </p>

      <button
        onClick={scrollToTop}
        className="flex items-center gap-2 w-fit text-muted-foreground text-base cursor-pointer hover:text-foreground transition-colors cursor-target"
      >
        <span>Elevate to the top</span>
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
};
