import React from 'react';

export const ExperienceSection: React.FC = () => {
  return (
    <div id="experience" className="py-10">
      <h2 className="font-medium text-primary/90 text-base">experience.</h2>

      <ul className="flex flex-col gap-12 mt-4 font-normal text-primary/90 text-base">
        {/* ONGC */}
        <li className="cursor-target">
          <div className="pl-4 border-muted-foreground/40 hover:border-primary border-l size-full transition-all duration-300">
            <div className="flex sm:flex-row flex-col justify-between items-start">
              <div>
                <p className="text-primary/90 text-lg">
                  ML Engineer Intern (RL)
                  <span className="inline-block bg-secondary text-secondary-foreground max-sm:mb-2 ml-2 px-2 py-0.5 rounded text-xs">
                    India
                  </span>
                </p>
                <p className="flex items-center text-sm text-muted-foreground mt-0.5">
                  at, <span className="ml-1 text-primary/90 font-medium">Oil and Natural Gas Corporation (ONGC)</span>
                </p>
              </div>
              <p className="text-muted-foreground text-sm">2026</p>
            </div>

            <ul className="space-y-1 mt-1 pl-3 text-muted-foreground text-sm text-justify list-disc">
              <li>
                <span>
                  Specialized in <strong className="font-bold text-primary underline-offset-4">reinforcement learning</strong> and predictive systems across digital workflows and operational process optimization.
                </span>
              </li>
              <li>
                <span>
                  Contributed to the <strong className="font-bold text-primary underline-offset-4">Vigilance Department</strong>, architecting automated anomaly detection pipelines and risk analytics for operational oversight and governance.
                </span>
              </li>
            </ul>

            <ul className="flex flex-wrap items-center gap-2 mt-2 pl-3">
              <li className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">Reinforcement Learning</li>
              <li className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">Digital Workflows</li>
              <li className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">Vigilance &amp; Anomaly Detection</li>
              <li className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">Risk Analytics</li>
              <li className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">Python</li>
            </ul>
          </div>
        </li>

        {/* College AI Club */}
        <li className="cursor-target">
          <div className="pl-4 border-muted-foreground/40 hover:border-primary border-l size-full transition-all duration-300">
            <div className="flex sm:flex-row flex-col justify-between items-start">
              <div>
                <p className="text-primary/90 text-lg">
                  Technical Head
                  <span className="inline-block bg-secondary text-secondary-foreground max-sm:mb-2 ml-2 px-2 py-0.5 rounded text-xs">
                    On-Campus
                  </span>
                </p>
                <p className="flex items-center text-sm text-muted-foreground mt-0.5">
                  at, <span className="ml-1 text-primary/90 font-medium">College AI Club</span>
                </p>
              </div>
              <p className="text-muted-foreground text-sm">2024 - 2025</p>
            </div>

            <ul className="space-y-1 mt-1 pl-3 text-muted-foreground text-sm text-justify list-disc">
              <li>
                <span>
                  Spearheaded technical vision, engineering seminars, and hackathon initiatives for the student artificial intelligence community.
                </span>
              </li>
              <li>
                <span>
                  Delivered <strong className="font-bold text-primary underline-offset-4">over a dozen lectures, speeches, and hands-on workshops on RL</strong>, covering PPO, Bellman equations, MDPs, policy gradients, sim-to-real, and MuJoCo physics simulation.
                </span>
              </li>
            </ul>

            <ul className="flex flex-wrap items-center gap-2 mt-2 pl-3">
              <li className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">Deep RL</li>
              <li className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">Technical Workshops</li>
              <li className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">MuJoCo</li>
              <li className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">Mentorship</li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
};
