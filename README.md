# Nimesh Chauhan — Portfolio Website

A static portfolio website for **Nimesh Chauhan** (`Weirdnemo`), Reinforcement Learning Engineer specializing in astrodynamics, spacecraft guidance, and drone technologies.

Directly inspired by the minimalist craft of [pragnyanramtha.dev](https://pragnyanramtha.dev/), this site features rolling character navigation, a dark/light theme switcher, left-accented project timelines, and an interactive real-time orbital mechanics & drone flight simulation canvas.

---

## 🚀 Featured Projects

1. **ExoRL** — *Planetary Science Simulation & Spacecraft Mission Design RL Toolkit*
   - Published PyPI package (`pip install exorl v0.2.0`).
   - Coupes interior geophysics, planetary atmosphere, and orbital mechanics to trainable Gymnasium environments.
2. **UntumbleRL** — *Spacecraft Detumbling & Attitude Control for On-Orbit Debris Removal*
   - Partially deployed on real satellites under real space conditions.
   - Modeled after JAXA's CRD2 mission using MuJoCo and a 4-agent PWPF thruster / reaction-wheel ablation study.
3. **HotEntry-RL** — *Hypersonic Atmospheric Reentry Guidance via Deep RL (PPO)*
   - Ground-up physics stack: US Standard Atmosphere 1976 (USSA76), modified Newtonian aerodynamics, and Detra-Kemp-Riddell (DKR) aerothermal heating.
4. **KSP-RL-Agents** — *Autonomous Rocket Flight Control inside Kerbal Space Program*
   - Real-time closed-loop launch, thrust-vectored hover, and pinpoint landing via kRPC.
5. **Human-bipedal-UnityML** — *Physics-based Humanoid Locomotion & Balance via Deep RL*
   - Foundational exploration of motor skill acquisition using Unity ML-Agents and PPO.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables & Coordinate Grid Mask
- **Micro-interactions**: Rolling letter hover animations, canvas-confetti, smooth scroll
- **Interactive Physics Canvas**: Real-time 2D Canvas simulating Keplerian orbits, PWPF thruster firing, and quadrotor PID attitude control
- **Icons**: Lucide React
- **Deployment**: Zero-configuration static hosting (Vercel, GitHub Pages, Netlify)

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build production bundle
npm run build

# 4. Preview static production build
npm run preview
```

---

## 🌐 Deploy to Vercel (Free & Instant)

Since you don't possess a custom domain yet, you can host this for free on Vercel with a `*.vercel.app` domain:

1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git remote add origin https://github.com/Weirdnemo/portfolio.git
   git push -u origin main
   ```
2. Log into [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your `portfolio` repository.
4. Vercel will automatically detect **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Your site will be live instantly with a free SSL certificate!
