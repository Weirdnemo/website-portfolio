import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const RollingNavLink: React.FC<{ href: string; label: string }> = ({ href, label }) => {
  return (
    <a
      href={href}
      className="group relative block w-fit leading-[1.2rem] rounded-lg p-0 text-base text-primary/90 whitespace-nowrap sm:px-2 sm:py-1 cursor-target cursor-pointer"
    >
      <span className="relative inline-block cursor-pointer">
        {label.split('').map((char, i) => (
          <span key={i} className="relative inline-block overflow-hidden">
            <span
              className="block transition-transform duration-300 group-hover:-translate-y-full"
              style={{ transitionDelay: `${i * 12}ms` }}
            >
              {char}
            </span>
            <span
              className="block absolute left-0 top-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0"
              style={{ transitionDelay: `${i * 12}ms` }}
            >
              {char}
            </span>
          </span>
        ))}
      </span>
    </a>
  );
};

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="flex justify-between items-end pb-2">
      <div className="cursor-target">
        <a
          href="/"
          className="font-bold text-xl tracking-tighter text-primary/90 inline-block py-0 hover:opacity-80 transition-opacity"
        >
          sol.
        </a>
      </div>

      <nav className="flex items-center gap-2">
        <ul className="flex items-center gap-2 sm:gap-0">
          <li>
            <RollingNavLink href="#experience" label="experience" />
          </li>
          <li>
            <RollingNavLink href="#projects" label="projects" />
          </li>
          <li>
            <RollingNavLink href="#blogs-research" label="blogs" />
          </li>
          <li>
            <RollingNavLink href="#skills" label="skills" />
          </li>
          <li>
            <RollingNavLink href="#contact" label="contact" />
          </li>
        </ul>

        {/* Theme Switcher Icon Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="cursor-target p-1.5 rounded-md text-primary/80 hover:text-primary transition-colors cursor-pointer ml-1"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </button>
      </nav>
    </header>
  );
};
