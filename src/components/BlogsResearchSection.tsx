import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { usePortfolioData } from '../hooks/usePortfolioData';

export const BlogsResearchSection: React.FC = () => {
  const portfolioData = usePortfolioData();

  return (
    <div id="blogs-research" className="py-8 sm:py-10">
      <h2 className="font-medium text-primary/90 text-base">blogs &amp; research.</h2>

      {/* Blogs */}
      <h3 className="mt-5 sm:mt-6 text-muted-foreground text-xs uppercase tracking-wide">blogs</h3>
      <ul className="flex flex-col gap-8 sm:gap-12 mt-3 sm:mt-4 font-normal text-primary/90 text-base">
        {portfolioData.blogs.map((post) => (
          <li key={post.title} className="cursor-target">
            <div className="pl-3 sm:pl-4 border-muted-foreground/40 hover:border-primary border-l size-full transition-all duration-300">
              <div className="flex sm:flex-row flex-col justify-between items-start">
                <p className="text-primary/90 text-base sm:text-lg flex items-center flex-wrap">
                  <span>{post.title}</span>
                </p>
                <span className="inline-block bg-secondary text-secondary-foreground max-sm:mb-2 ml-2 px-1.5 sm:px-2 py-0.5 rounded text-[11px] sm:text-xs whitespace-nowrap">
                  {post.date}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm mt-1">
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline underline-offset-2"
                >
                  Read full post
                  <ArrowUpRight className="w-4 h-4 ml-0.5" />
                </a>
                <span className="text-muted-foreground">{post.readTime}</span>
              </div>

              <ul className="space-y-1 mt-1 pl-3 text-muted-foreground text-xs sm:text-sm text-justify list-disc">
                {post.bulletPoints.map((bullet, i) => (
                  <li key={i}>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <ul className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2 pl-3">
                {post.tags.map((tag) => (
                  <li key={tag} className="bg-muted text-muted-foreground px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[11px] sm:text-xs">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>

      {/* Research */}
      <h3 className="mt-8 sm:mt-10 text-muted-foreground text-xs uppercase tracking-wide">research</h3>
      <ul className="flex flex-col gap-8 sm:gap-12 mt-3 sm:mt-4 font-normal text-primary/90 text-base">
        {portfolioData.research.map((paper) => (
          <li key={paper.title} className="cursor-target">
            <div className="pl-3 sm:pl-4 border-muted-foreground/40 hover:border-primary border-l size-full transition-all duration-300">
              <div className="flex sm:flex-row flex-col justify-between items-start">
                <p className="text-primary/90 text-base sm:text-lg flex items-center flex-wrap">
                  <span>{paper.title}</span>
                </p>
                <span className="inline-block bg-secondary text-secondary-foreground max-sm:mb-2 ml-2 px-1.5 sm:px-2 py-0.5 rounded text-[11px] sm:text-xs whitespace-nowrap">
                  {paper.status}
                </span>
              </div>

              <p className="text-muted-foreground text-xs sm:text-sm mt-1">{paper.description}</p>

              <ul className="space-y-1 mt-1 pl-3 text-muted-foreground text-xs sm:text-sm text-justify list-disc">
                {paper.bulletPoints.map((bullet, i) => (
                  <li key={i}>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <ul className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2 pl-3">
                {paper.tags.map((tag) => (
                  <li key={tag} className="bg-muted text-muted-foreground px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[11px] sm:text-xs">
                    {tag}
                  </li>
                ))}
              </ul>

              {paper.url && (
                <div className="mt-2 pl-3">
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs sm:text-sm hover:underline underline-offset-2 w-fit"
                  >
                    View Paper
                    <ArrowUpRight className="w-4 h-4 ml-0.5" />
                  </a>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
