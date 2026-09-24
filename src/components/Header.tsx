import React, { useEffect, useState } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const NAV_ITEMS = [
  { href: '#experience', label: 'experience' },
  { href: '#projects', label: 'projects' },
  { href: '#blogs-research', label: 'blogs' },
  { href: '#skills', label: 'skills' },
  { href: '#contact', label: 'contact' },
];

export const RollingNavLink: React.FC<{ href: string; label: string; onClick?: () => void }> = ({
  href,
  label,
  onClick,
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
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
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the drawer automatically if the viewport grows past the mobile
  // breakpoint (e.g. rotating a tablet, resizing a window).
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className="flex justify-between items-end pb-2 relative">
      <div className="cursor-target">
        <a
          href="/"
          className="font-bold text-xl tracking-tighter text-primary/90 inline-block py-0 hover:opacity-80 transition-opacity"
        >
          sol.
        </a>
      </div>

      <nav className="flex items-center gap-2">
        {/* Desktop nav links */}
        <ul className="hidden sm:flex items-center gap-2 sm:gap-0">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <RollingNavLink href={item.href} label={item.label} />
            </li>
          ))}
        </ul>

        {/* Theme Switcher Icon Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="cursor-target p-1.5 rounded-md text-primary/80 hover:text-primary transition-colors cursor-pointer ml-1"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Hamburger — mobile only */}
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="cursor-target sm:hidden p-1.5 rounded-md text-primary/80 hover:text-primary transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </nav>

      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 sm:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-in side menu */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-64 max-w-[80vw] bg-background border-l border-border shadow-xl transition-transform duration-300 ease-out sm:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-border">
          <span className="font-bold text-lg tracking-tighter text-primary/90">sol.</span>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="cursor-target p-1.5 rounded-md text-primary/80 hover:text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ul className="flex flex-col gap-1 p-4">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <RollingNavLink href={item.href} label={item.label} onClick={() => setMobileOpen(false)} />
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};
