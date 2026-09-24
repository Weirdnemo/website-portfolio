# Nimesh Chauhan's Portfolio Website

A portfolio website for **Nimesh Chauhan** (`Weirdnemo`), Reinforcement Learning Engineer specializing in astrodynamics, spacecraft guidance, and drone technologies.

This site features rolling character navigation, a dark/light theme switcher, a faded coordinate grid background, a custom reticle cursor that inverts against whatever it's over, left-accented project timelines, a merged blogs and research section, an interactive real-time orbital mechanics and drone flight simulation canvas, and a lightweight admin panel for editing content without redeploying.

This project is open source. Fork it, swap in your own data, and it's your site.

---

## Features

- **Rolling nav links**: letter-by-letter hover animation on the header navigation.
- **Custom reticle cursor**: a rotating corner-bracket cursor that locks onto and confines whatever you hover, with a color-inverting blend mode and a subtle jiggle tied to mouse movement.
- **Coordinate grid background**: a faded grid, brightest at the top left, fixed in place behind all content.
- **Left-accented timelines**: experience, projects, and research entries share a consistent bordered card layout.
- **Blogs and research section**: a single merged section for writing and in-progress research, so you don't need two separate content types.
- **Interactive simulation canvas**: a real-time 2D canvas simulating Keplerian orbits, PWPF thruster firing, and quadrotor PID attitude control.
- **Admin panel** (`/admin`): a password-gated page for editing your resume link, projects, blog posts, and research entries through plain form fields. No JSON, no redeploy, changes go live immediately.

---

## Featured Projects

1. **ExoRL**, *Planetary Science Simulation and Spacecraft Mission Design RL Toolkit*
   - Published PyPI package (`pip install exorl`, v0.2.0).
   - Couples interior geophysics, planetary atmosphere, and orbital mechanics to trainable Gymnasium environments.
2. **UntumbleRL**, *Spacecraft Detumbling and Attitude Control for On-Orbit Debris Removal*
   - Partially deployed on real satellites under real space conditions.
   - Modeled after JAXA's CRD2 mission using MuJoCo and a 4-agent PWPF thruster / reaction-wheel ablation study.
3. **HotEntry-RL**, *Hypersonic Atmospheric Reentry Guidance via Deep RL (PPO)*
   - Ground-up physics stack: US Standard Atmosphere 1976 (USSA76), modified Newtonian aerodynamics, and Detra-Kemp-Riddell (DKR) aerothermal heating.
4. **KSP-RL-Agents**, *Autonomous Rocket Flight Control inside Kerbal Space Program*
   - Real-time closed-loop launch, thrust-vectored hover, and pinpoint landing via kRPC.
5. **Human-bipedal-UnityML**, *Physics-based Humanoid Locomotion and Balance via Deep RL*
   - Foundational exploration of motor skill acquisition using Unity ML-Agents and PPO.

---

## Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS, custom CSS variables, and a coordinate grid mask
- **Micro-interactions**: rolling letter hover animations, a custom target-lock cursor, smooth scroll
- **Interactive physics canvas**: real-time 2D canvas simulating Keplerian orbits, PWPF thruster firing, and quadrotor PID attitude control
- **Icons**: Lucide React
- **Backend**: Vercel Serverless Functions (`/api`) backed by Upstash Redis, for the admin panel and live content storage
- **Deployment**: Vercel (frontend and backend together)

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start the frontend-only dev server (no /admin or /api routes)
npm run dev

# 3. Build production bundle
npm run build

# 4. Preview static production build
npm run preview
```

The commands above are enough if you're only editing the static site itself. To test the admin panel and API routes locally, see the next section.

---

## Environment Variables and the Admin Panel

This site ships with a small backend: a password-gated `/admin` page for editing your resume link, projects, blog posts, and research entries, backed by an Upstash Redis key-value store on Vercel's free tier.

Copy `.env.example` to `.env.local` and fill in:

| Variable | Where it comes from |
|---|---|
| `UPSTASH_REDIS_REST_URL` | Auto-filled when you connect Upstash Redis via Vercel's Storage tab (Marketplace integration, free tier) |
| `UPSTASH_REDIS_REST_TOKEN` | Same as above |
| `ADMIN_PASSWORD` | Set this yourself, any password you choose, used to log into `/admin` |

### Running the full stack locally

Since `/api/*` routes are Vercel Serverless Functions, Vite's dev server alone won't run them. The simplest way to test everything locally, including `/admin`, is the Vercel CLI:

```bash
npx vercel dev
```

The first run will prompt you to log in and link the project (this does not deploy or publish anything, it just registers the project so local commands know what env vars to use). Once linked, pull your environment variables down with:

```bash
vercel env pull .env.local
```

Then `npx vercel dev` serves the frontend and the `/api` functions together on one local port, exactly as they behave in production.

### Security note

`/admin` auth is intentionally minimal: a single shared password checked server-side, no hashing, no rate limiting, no sessions beyond a token held in `sessionStorage`. That's fine for keeping casual visitors out of your own personal site's admin panel. It is not hardened against a real attacker, so don't reuse a password you use anywhere important, and change it (just update the env var and redeploy) if you ever suspect it's leaked.

---

## Deploy to Vercel (Free)

1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git remote add origin https://github.com/your-username/portfolio.git
   git push -u origin main
   ```
2. Log into [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your repository. Vercel auto-detects Vite:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Before your first deploy (or right after), go to your project's **Storage** tab and add **Upstash Redis** (free tier) so `/api/portfolio` has somewhere to read and write content.
5. Go to **Settings → Environment Variables** and add `ADMIN_PASSWORD`.
6. Click **Deploy**. Your site is live with a free SSL certificate, and the first request to `/api/portfolio` seeds Redis with the data already in `src/data/portfolioData.ts`.

---

## Forking This for Your Own Site

If you're using this as a template:

1. Edit `src/data/portfolioData.ts` with your own name, bio, socials, projects, blog posts, and research entries. This file is the fallback the site renders if the backend is ever unreachable, so keep it reasonably current even after you're using `/admin` day to day.
2. Swap the resume link, GitHub username, and social URLs throughout.
3. Follow the environment variable setup above with your own Upstash instance and admin password. Each fork needs its own, they are not shared.
4. Add a `LICENSE` file if you want to specify terms for others reusing this code. None is included by default.

Contributions, issues, and forks are welcome.
