import React from 'react';
import { portfolioData } from '../data/portfolioData';

export const SkillsSection: React.FC = () => {
  return (
    <div id="skills" className="py-10">
      <h2 className="font-medium text-primary/90 text-base">technical skills.</h2>

      <ul className="flex flex-col gap-3 mt-4 font-normal text-primary/90 text-base">
        {portfolioData.skills.map((skill) => (
          <li key={skill.category} className="items-start grid sm:grid-cols-[170px_1fr]">
            <p className="text-primary/90 text-[17px]">{skill.category}:</p>
            <p className="text-muted-foreground text-sm">{skill.items}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
