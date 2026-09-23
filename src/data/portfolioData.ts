export interface Project {
  title: string;
  tagline: string;
  badge?: string;
  badgeType?: 'primary' | 'success' | 'warning' | 'info';
  description: string;
  bulletPoints: string[];
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  pypiPackage?: string;
}

export interface Experience {
  role: string;
  organization: string;
  period: string;
  location?: string;
  type?: string;
  description: string[];
  skills: string[];
}

export interface BlogPost {
  title: string;
  url: string;
  date: string;
  readTime: string;
  bulletPoints: string[];
  tags: string[];
}

export interface ResearchPaper {
  title: string;
  status: 'In Progress' | 'Published' | 'Preprint';
  description: string;
  bulletPoints: string[];
  tags: string[];
  url?: string;
}

export interface PortfolioData {
  name: string;
  shortName: string;
  pronouns: string;
  role: string;
  subRole: string;
  bioIntro: string;
  resumeUrl: string;
  aboutBullets: {
    highlight: string;
    text: string;
  }[];
  socials: {
    github: string;
    linkedin: string;
    email: string;
  };
  projects: Project[];
  experiences: Experience[];
  blogs: BlogPost[];
  research: ResearchPaper[];
  skills: {
    category: string;
    items: string;
  }[];
}

export const portfolioData: PortfolioData = {
  name: "Nimesh Chauhan",
  shortName: "nc.",
  pronouns: "20, he/him",
  role: "RL Engineer with experience in astrodynamics and drone technologies",
  subRole: "Specializing in extreme physical regimes, spacecraft guidance & autonomous flight control",
  bioIntro: "hi there 👋, I'm",
  resumeUrl: "https://drive.google.com/file/d/1EeCKbteaDTv1wZGr5wp2VzXcXAvBd6Y7/view?usp=sharing",
  aboutBullets: [
    {
      highlight: "Reinforcement Learning Engineer",
      text: "specializing in non-linear dynamical systems, physics-consistent simulation stacks, and autonomous aerospace flight control.",
    },
    {
      highlight: "ExoRL Author",
      text: "built and published ExoRL (v0.2.0 on PyPI) — a planetary science simulation and reinforcement learning toolkit coupling interior geophysics with spacecraft mission environments.",
    },
    {
      highlight: "Flight-Heritage Systems",
      text: "developed UntumbleRL for spacecraft detumbling and attitude control, which has been partially deployed on real satellites and aligned with JAXA CRD2 debris removal.",
    },
    {
      highlight: "Aerospace & Drone Autonomy",
      text: "engineering trajectory optimization pipelines across hypersonic atmospheric reentry (USSA76 + DKR aerothermal heating), quadrotor thrust-vectoring, and bipedal gait balance.",
    },
  ],
  socials: {
    github: "https://github.com/Weirdnemo",
    linkedin: "https://linkedin.com/in/nimesh-chauhan-15348b2b8",
    email: "nimesh.rl.aero@gmail.com",
  },
  projects: [
    {
      title: "ExoRL",
      tagline: "Planetary Science Simulation & Spacecraft Mission Design RL Toolkit",
      badge: "PyPI Library v0.2.0",
      badgeType: "primary",
      pypiPackage: "exorl",
      description: "A comprehensive planetary science simulation and reinforcement learning toolkit. It models planets from the inside out — interior geophysics, atmosphere, climate, habitability, and orbital mechanics — and connects all of that physics to trainable RL environments for autonomous spacecraft mission design.",
      bulletPoints: [
        "Published package indexed on PyPI (exorl v0.2.0) unifying planetary interior modeling with celestial orbital dynamics.",
        "Connects high-fidelity atmospheric density, climate signatures, and gravity fields directly to Gymnasium-compatible RL environments.",
        "Enables training autonomous navigation policies for orbital insertion, planetary observation, and deep-space trajectory planning.",
      ],
      techStack: ["Python", "PyPI", "Astrodynamics", "Planetary Physics", "Orbital Mechanics", "Gymnasium", "PyTorch"],
      githubUrl: "https://github.com/Weirdnemo/ExoRL",
      liveUrl: "https://pypi.org/project/exorl/",
    },
    {
      title: "UntumbleRL",
      tagline: "Spacecraft Detumbling & Attitude Control for On-Orbit Debris Removal",
      badge: "Partially Deployed On-Orbit",
      badgeType: "success",
      description: "Reinforcement learning for spacecraft detumbling — training a robust control policy to stabilize an uncooperative tumbling satellite's angular velocity in scenarios aligned with JAXA's CRD2 (Commercial Removal of Debris Demonstration) mission.",
      bulletPoints: [
        "Partially flight-deployed on real satellites to evaluate learned attitude stabilization algorithms under real space conditions.",
        "Built in MuJoCo using custom rigid-body spacecraft XML dynamics to model severe tumbling and moments of inertia.",
        "Conducted a 4-agent ablation matrix systematically evaluating PWPF (Pulse-Width Pulse-Frequency) modulation vs bang-bang control and RCS vs reaction wheels.",
        "Engineered multi-objective reward shaping that eliminated degenerate shortcut policies while bounding actuator wear and angular velocity residuals.",
      ],
      techStack: ["Python", "MuJoCo", "Gymnasium", "Attitude Dynamics", "PWPF Modulation", "RCS & Reaction Wheels", "JAXA CRD2"],
      githubUrl: "https://github.com/Weirdnemo/UntumbleRL",
    },
    {
      title: "HotEntry-RL",
      tagline: "Hypersonic Atmospheric Reentry Guidance via Deep Reinforcement Learning",
      badge: "Aerothermal Guidance",
      badgeType: "warning",
      description: "Trained an autonomous RL agent (PPO) to guide a 2D lifting-body vehicle through the hypersonic atmospheric entry corridor, dynamically trading descent rate against severe convective aerothermal heating and structural g-load constraints.",
      bulletPoints: [
        "Built a physics-consistent simulation stack from the ground up: US Standard Atmosphere 1976 (USSA76), modified Newtonian hypersonic aerodynamics, and Detra-Kemp-Riddell (DKR) convective heating.",
        "Formulated 2D planar equations of motion with active control flap authority and corridor-violation diagnostic bounds.",
        "Utilized staged curriculum learning to stabilize long-horizon guidance, outperforming a classical non-learning NPC guidance baseline.",
      ],
      techStack: ["Python", "PyTorch", "PPO", "Hypersonic Aerodynamics", "DKR Heating", "USSA76", "Trajectory Optimization"],
      githubUrl: "https://github.com/Weirdnemo/HotEntry-RL",
    },
    {
      title: "KSP-RL-Agents",
      tagline: "Autonomous Rocket Launch, Hover & Landing via kRPC",
      badge: "Autonomous Flight",
      badgeType: "info",
      description: "Deep reinforcement learning agents trained to execute closed-loop vertical launches, thrust-vectored hovering, and precision powered landings directly inside Kerbal Space Program.",
      bulletPoints: [
        "Interfaced with Kerbal Space Program's physics engine in real-time via kRPC client bridge for closed-loop telemetry and thrust commands.",
        "Trained continuous action policies for thrust-vector gimbaling and throttle control under aerodynamic drag and changing vehicle mass.",
      ],
      techStack: ["Python", "kRPC", "Kerbal Space Program", "Thrust Vectoring", "PID / RL", "Flight Control"],
      githubUrl: "https://github.com/Weirdnemo/KSP-RL-Agents",
    },
    {
      title: "Human-bipedal-UnityML",
      tagline: "Physics-based Humanoid Locomotion & Balance via Deep RL",
      badge: "Foundational Exploration",
      badgeType: "info",
      description: "Explored bipedal locomotion by training a humanoid agent to walk and maintain balance in a dynamic physics-based simulation. One of the earliest foundational projects exploring reward-based motor learning.",
      bulletPoints: [
        "Trained a high-DOF humanoid model in Unity ML-Agents with PyTorch and Proximal Policy Optimization (PPO).",
        "Formulated multi-objective reward shaping balancing forward velocity, joint torque limits, and lateral balance recovery against external perturbations.",
      ],
      techStack: ["Unity", "C#", "ML-Agents", "PPO", "Biomechanics", "PyTorch"],
      githubUrl: "https://github.com/Weirdnemo/Human-bipedal-UnityML",
    },
  ],
  experiences: [
    {
      role: "ML Engineer Intern — Reinforcement Learning",
      organization: "Oil and Natural Gas Corporation (ONGC)",
      period: "Digital Works & Vigilance",
      location: "India",
      type: "Internship",
      description: [
        "Specialized in reinforcement learning and machine learning applications across digital workflows and operational optimization.",
        "Contributed to the Vigilance Department, developing anomaly detection workflows, risk scoring, and intelligence pipelines for institutional governance and compliance oversight.",
        "Investigated optimization methodologies for complex industrial data systems and operational audit trails.",
      ],
      skills: ["Reinforcement Learning", "Machine Learning", "Anomaly Detection", "Risk Analytics", "Python", "Data Systems"],
    },
    {
      role: "Technical Head",
      organization: "College AI Club",
      period: "Leadership & Community",
      location: "On-Campus",
      type: "Leadership",
      description: [
        "Spearheaded technical vision, engineering workshops, and research seminars for the student artificial intelligence community.",
        "Delivered over a dozen hands-on lectures, technical speeches, and workshops on Reinforcement Learning (PPO, Bellman equations, MDPs, policy gradients, sim-to-real, MuJoCo/Gymnasium).",
        "Mentored student teams in building robotics simulations, training RL agents, and participating in hackathons.",
      ],
      skills: ["Reinforcement Learning", "Public Speaking", "Workshops", "Technical Leadership", "Mentorship", "MuJoCo"],
    },
  ],
  blogs: [
    {
      title: "Designing Smarter Airfoils with Reinforcement Learning — Without Spaghetti Shapes",
      url: "https://medium.com/@nimesh.chn/designing-smarter-airfoils-with-reinforcement-learning-without-spaghetti-shapes-23c3e13cb21b",
      date: "Oct 2025",
      readTime: "4 min read",
      bulletPoints: [
        "Walks through parameterizing airfoil geometry (CST, Bézier/B-Spline, PARSEC) so an RL agent explores smooth, physically valid shapes instead of chaotic, self-intersecting geometry.",
        "Covers setting up the RL environment, training a surrogate aerodynamic model to replace expensive CFD runs, and shaping a reward function with hard and soft physical constraints.",
      ],
      tags: ["Reinforcement Learning", "Aerodynamics", "Airfoil Design"],
    },
  ],
  research: [
    {
      title: "UntumbleRL: Reward-Shaped Detumbling Policies for Uncooperative Spacecraft",
      status: "In Progress",
      description: "A formal writeup extending the UntumbleRL project, evaluating actuator and control strategy choices for spacecraft detumbling in scenarios aligned with JAXA's CRD2 debris removal mission.",
      bulletPoints: [
        "Formalizing the 4-agent ablation matrix comparing PWPF modulation vs bang-bang control and RCS vs reaction wheels under MuJoCo rigid-body dynamics.",
        "Analyzing reward-shaping choices that eliminate degenerate shortcut policies while bounding actuator wear and residual angular velocity.",
      ],
      tags: ["Spacecraft Detumbling", "PWPF Modulation", "MuJoCo", "JAXA CRD2"],
    },
  ],
  skills: [
    {
      category: "Reinforcement Learning",
      items: "PPO, SAC, Policy Gradients, Reward Shaping, Curriculum Learning, Ablation Studies, Gym/Gymnasium, Multi-Agent RL",
    },
    {
      category: "Astrodynamics & Physics",
      items: "Atmospheric Reentry Guidance, Orbital Mechanics, Spacecraft Detumbling (JAXA CRD2), Newtonian Hypersonic Aerodynamics, USSA76, DKR Convective Heating, Keplerian Dynamics",
    },
    {
      category: "Robotics & Drones",
      items: "Drone Dynamics, Attitude Control (PWPF, RCS Thrusters, Reaction Wheels), Thrust Vectoring, Bipedal Locomotion, MuJoCo, Unity ML-Agents",
    },
    {
      category: "ML & Frameworks",
      items: "PyTorch, TensorFlow, SciPy, NumPy, OpenCV, MLflow, Scikit-learn",
    },
    {
      category: "Languages",
      items: "Python, C, C#, TypeScript, JavaScript, SQL, Bash",
    },
    {
      category: "Tools & Platforms",
      items: "Linux, Git, MuJoCo Physics, Unity, Kerbal Space Program (kRPC), PyPI Packaging, Blender, Figma",
    },
  ],
};
