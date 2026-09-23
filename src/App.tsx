import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ProjectsSection } from './components/ProjectsSection';
import { BlogsResearchSection } from './components/BlogsResearchSection';
import { SkillsSection } from './components/SkillsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { TargetCursor } from './components/TargetCursor';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="w-screen min-h-screen m-0 p-0 overflow-x-hidden text-foreground transition-colors duration-200 relative selection:bg-primary selection:text-primary-foreground">
      <div className="grid-background" />

      {/* Main Container - exact 1:1 width & padding from pragnyanramtha.dev */}
      <div className="mx-auto px-4 pt-6 sm:pt-12 w-full lg:w-2/3 xl:w-1/2 text-foreground">
        <Header theme={theme} toggleTheme={toggleTheme} />

        <main id="main-content" className="min-h-screen">
          <Hero />
          <AboutSection />
          <ExperienceSection />
          <ProjectsSection />
          <BlogsResearchSection />
          <SkillsSection />
          <ContactSection />
          <Footer />
        </main>
      </div>

      {/* Target Reticle Cursor */}
      <TargetCursor />
    </div>
  );
};

export default App;
