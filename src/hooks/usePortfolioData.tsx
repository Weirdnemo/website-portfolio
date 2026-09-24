import React, { createContext, useContext, useEffect, useState } from 'react';
import { portfolioData as defaultPortfolioData, PortfolioData } from '../data/portfolioData';

const PortfolioDataContext = createContext<PortfolioData>(defaultPortfolioData);

/**
 * Fetches the live portfolio content from /api/portfolio (backed by Redis)
 * on mount. Until that resolves — or if the API is unreachable for any
 * reason — the site renders the bundled `defaultPortfolioData`, so it never
 * shows a blank page or breaks if the backend is down.
 */
export const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/portfolio')
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((json: PortfolioData) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        // Silently keep the bundled default — the site stays fully usable.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <PortfolioDataContext.Provider value={data}>{children}</PortfolioDataContext.Provider>;
};

export const usePortfolioData = (): PortfolioData => useContext(PortfolioDataContext);
