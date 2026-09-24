import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <div id="aboutme" className="py-8 sm:py-10">
      <h2 className="font-medium text-primary/90 text-base">about me.</h2>

      <ul className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 text-muted-foreground text-sm sm:text-base">
        <li className="flex gap-2">
          <span className="text-primary/40 mt-0.5 select-none shrink-0">•</span>
          <span>
            I'm an <strong className="font-bold text-primary underline-offset-4">RL Engineer</strong> specializing in <strong className="font-bold text-primary underline-offset-4">astrodynamics</strong>, <strong className="font-bold text-primary underline-offset-4">spacecraft guidance</strong>, and <strong className="font-bold text-primary underline-offset-4">drone technologies</strong>
          </span>
        </li>

        <li className="flex gap-2">
          <span className="text-primary/40 mt-0.5 select-none shrink-0">•</span>
          <span>
            I built <strong className="font-bold text-primary underline-offset-4"><a href="https://pypi.org/project/exorl/" target="_blank" rel="noopener noreferrer" className="font-bold text-primary italic underline underline-offset-4 hover:text-primary/80 transition-colors">ExoRL</a></strong> solo — a planetary science simulation &amp; RL toolkit published on PyPI
          </span>
        </li>

        <li className="flex gap-2">
          <span className="text-primary/40 mt-0.5 select-none shrink-0">•</span>
          <span>
            I developed <strong className="font-bold text-primary underline-offset-4"><a href="https://github.com/Weirdnemo/UntumbleRL" target="_blank" rel="noopener noreferrer" className="font-bold text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">UntumbleRL</a></strong> for spacecraft detumbling — partially deployed on real satellites and aligned with JAXA's CRD2 debris removal mission
          </span>
        </li>

        <li className="flex gap-2">
          <span className="text-primary/40 mt-0.5 select-none shrink-0">•</span>
          <span>
            I'm focused on developing learned control policies that bridge non-linear physical dynamics to real-world embedded deployment
          </span>
        </li>

        <li className="flex gap-2">
          <span className="text-primary/40 mt-0.5 select-none shrink-0">•</span>
          <span>
            My core specializations: hypersonic atmospheric reentry guidance (<strong className="font-bold text-primary underline-offset-4">HotEntry-RL</strong>), PWPF thruster modulation, MuJoCo physics simulation, and autonomous drone flight control.
          </span>
        </li>
      </ul>
    </div>
  );
};
