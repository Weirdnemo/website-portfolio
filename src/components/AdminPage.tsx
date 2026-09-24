import React, { useEffect, useState } from 'react';
import type { Project, BlogPost, ResearchPaper } from '../data/portfolioData';
import { TargetCursor } from './TargetCursor';

const TOKEN_KEY = 'admin_token';
type SaveState = 'idle' | 'saving' | 'saved' | 'error';

// Pre-filled templates for "+ Add" — just replace the placeholder text/links,
// no need to know the JSON shape.
const emptyProject: Project = {
  title: 'New Project Title',
  tagline: 'One-line description of what it does',
  badge: '',
  badgeType: 'info',
  description: 'A longer paragraph describing the project.',
  bulletPoints: ['First achievement or feature', 'Second achievement or feature'],
  techStack: ['Python'],
  githubUrl: 'https://github.com/yourusername/repo-name',
  liveUrl: '',
};

const emptyBlog: BlogPost = {
  title: 'New Blog Post Title',
  url: 'https://yourblog.com/post-url',
  date: 'Month Year',
  readTime: '5 min read',
  bulletPoints: ['What the post covers', 'Key takeaway'],
  tags: ['Tag1', 'Tag2'],
};

const emptyResearch: ResearchPaper = {
  title: 'New Research Paper Title',
  status: 'In Progress',
  description: 'What this research covers.',
  bulletPoints: ['Key finding or method', 'Another point'],
  tags: ['Tag1', 'Tag2'],
  url: '',
};

const inputClass =
  'w-full bg-muted text-foreground rounded-md px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary text-sm';

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <label className="block mb-3">
    <span className="block text-xs text-muted-foreground mb-1">{label}</span>
    {children}
    {hint && <span className="block text-[11px] text-muted-foreground/70 mt-1">{hint}</span>}
  </label>
);

const SaveButton: React.FC<{ state: SaveState; onClick: () => void; label?: string }> = ({ state, onClick, label = 'Save section' }) => (
  <button
    onClick={onClick}
    disabled={state === 'saving'}
    className="cursor-target bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-sm px-3 py-1.5 rounded-md transition-colors"
  >
    {state === 'saving' ? 'Saving…' : state === 'saved' ? 'Saved ✓' : label}
  </button>
);

// Manages one editable array (projects / blogs / research): local edits,
// delete (persists immediately), add (local only until "Save section").
function useListSection<T>(field: 'projects' | 'blogs' | 'research', initial: T[], token: string) {
  const [items, setItems] = useState<T[]>(initial);
  const [state, setState] = useState<SaveState>('idle');

  useEffect(() => setItems(initial), [initial]);

  const update = (index: number, patch: Partial<T>) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  };

  const persist = async (next: T[]) => {
    setState('saving');
    try {
      const res = await fetch('/api/portfolio-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ [field]: next }),
      });
      if (!res.ok) throw new Error();
      setItems(next);
      setState('saved');
      setTimeout(() => setState('idle'), 1500);
    } catch {
      setState('error');
    }
  };

  const remove = (index: number) => {
    if (!window.confirm('Delete this entry? This saves immediately.')) return;
    persist(items.filter((_, i) => i !== index));
  };

  const add = (template: T) => setItems((prev) => [...prev, template]);
  const save = () => persist(items);

  return { items, update, remove, add, save, state };
}

const ListField: React.FC<{ label: string; hint: string; value: string[]; onChange: (v: string[]) => void }> = ({
  label,
  hint,
  value,
  onChange,
}) => (
  <Field label={label} hint={hint}>
    <textarea
      value={value.join('\n')}
      onChange={(e) => onChange(e.target.value.split('\n'))}
      rows={3}
      className={inputClass}
    />
  </Field>
);

const TagsField: React.FC<{ label: string; hint: string; value: string[]; onChange: (v: string[]) => void }> = ({
  label,
  hint,
  value,
  onChange,
}) => (
  <Field label={label} hint={hint}>
    <input
      type="text"
      value={value.join(', ')}
      onChange={(e) => onChange(e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
      className={inputClass}
    />
  </Field>
);

const ProjectCard: React.FC<{ item: Project; onChange: (p: Partial<Project>) => void; onDelete: () => void }> = ({
  item,
  onChange,
  onDelete,
}) => (
  <div className="border border-border rounded-md p-4 mb-4">
    <div className="flex justify-between items-start mb-3">
      <span className="text-primary/90 font-medium">{item.title || 'Untitled project'}</span>
      <button onClick={onDelete} className="cursor-target text-destructive text-xs hover:underline">
        Delete
      </button>
    </div>
    <Field label="Title">
      <input className={inputClass} value={item.title} onChange={(e) => onChange({ title: e.target.value })} />
    </Field>
    <Field label="Tagline">
      <input className={inputClass} value={item.tagline} onChange={(e) => onChange({ tagline: e.target.value })} />
    </Field>
    <Field label="Badge text" hint="Small label shown next to the title, e.g. 'Aerothermal Guidance'. Leave blank for none.">
      <input className={inputClass} value={item.badge || ''} onChange={(e) => onChange({ badge: e.target.value })} />
    </Field>
    <Field label="Description">
      <textarea className={inputClass} rows={3} value={item.description} onChange={(e) => onChange({ description: e.target.value })} />
    </Field>
    <ListField
      label="Bullet points"
      hint="One point per line."
      value={item.bulletPoints}
      onChange={(v) => onChange({ bulletPoints: v })}
    />
    <TagsField
      label="Tech stack"
      hint="Comma-separated, e.g. Python, PyTorch, MuJoCo"
      value={item.techStack}
      onChange={(v) => onChange({ techStack: v })}
    />
    <Field label="GitHub URL">
      <input className={inputClass} value={item.githubUrl} onChange={(e) => onChange({ githubUrl: e.target.value })} />
    </Field>
    <Field label="Live URL" hint="Optional — link to a live demo, package page, etc.">
      <input className={inputClass} value={item.liveUrl || ''} onChange={(e) => onChange({ liveUrl: e.target.value })} />
    </Field>
  </div>
);

const BlogCard: React.FC<{ item: BlogPost; onChange: (p: Partial<BlogPost>) => void; onDelete: () => void }> = ({
  item,
  onChange,
  onDelete,
}) => (
  <div className="border border-border rounded-md p-4 mb-4">
    <div className="flex justify-between items-start mb-3">
      <span className="text-primary/90 font-medium">{item.title || 'Untitled post'}</span>
      <button onClick={onDelete} className="cursor-target text-destructive text-xs hover:underline">
        Delete
      </button>
    </div>
    <Field label="Title">
      <input className={inputClass} value={item.title} onChange={(e) => onChange({ title: e.target.value })} />
    </Field>
    <Field label="URL" hint="Link to the full post (Medium, your blog, etc.)">
      <input className={inputClass} value={item.url} onChange={(e) => onChange({ url: e.target.value })} />
    </Field>
    <div className="grid grid-cols-2 gap-3">
      <Field label="Date" hint="e.g. Oct 2025">
        <input className={inputClass} value={item.date} onChange={(e) => onChange({ date: e.target.value })} />
      </Field>
      <Field label="Read time" hint="e.g. 4 min read">
        <input className={inputClass} value={item.readTime} onChange={(e) => onChange({ readTime: e.target.value })} />
      </Field>
    </div>
    <ListField
      label="Bullet points"
      hint="One point per line."
      value={item.bulletPoints}
      onChange={(v) => onChange({ bulletPoints: v })}
    />
    <TagsField label="Tags" hint="Comma-separated" value={item.tags} onChange={(v) => onChange({ tags: v })} />
  </div>
);

const ResearchCard: React.FC<{ item: ResearchPaper; onChange: (p: Partial<ResearchPaper>) => void; onDelete: () => void }> = ({
  item,
  onChange,
  onDelete,
}) => (
  <div className="border border-border rounded-md p-4 mb-4">
    <div className="flex justify-between items-start mb-3">
      <span className="text-primary/90 font-medium">{item.title || 'Untitled paper'}</span>
      <button onClick={onDelete} className="cursor-target text-destructive text-xs hover:underline">
        Delete
      </button>
    </div>
    <Field label="Title">
      <input className={inputClass} value={item.title} onChange={(e) => onChange({ title: e.target.value })} />
    </Field>
    <Field label="Status">
      <select
        className={inputClass}
        value={item.status}
        onChange={(e) => onChange({ status: e.target.value as ResearchPaper['status'] })}
      >
        <option value="In Progress">In Progress</option>
        <option value="Preprint">Preprint</option>
        <option value="Published">Published</option>
      </select>
    </Field>
    <Field label="Description">
      <textarea className={inputClass} rows={3} value={item.description} onChange={(e) => onChange({ description: e.target.value })} />
    </Field>
    <ListField
      label="Bullet points"
      hint="One point per line."
      value={item.bulletPoints}
      onChange={(v) => onChange({ bulletPoints: v })}
    />
    <TagsField label="Tags" hint="Comma-separated" value={item.tags} onChange={(v) => onChange({ tags: v })} />
    <Field label="Paper URL" hint="Optional — leave blank until it's published somewhere.">
      <input className={inputClass} value={item.url || ''} onChange={(e) => onChange({ url: e.target.value })} />
    </Field>
  </div>
);

export const AdminPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [resumeUrl, setResumeUrl] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [research, setResearch] = useState<ResearchPaper[]>([]);
  const [resumeState, setResumeState] = useState<SaveState>('idle');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((data) => {
        setResumeUrl(data.resumeUrl || '');
        setProjects(data.projects || []);
        setBlogs(data.blogs || []);
        setResearch(data.research || []);
      })
      .finally(() => setLoading(false));
  }, [token]);

  // These are called unconditionally on every render (rules-of-hooks) —
  // they simply operate on empty arrays until data has loaded.
  const projectsSection = useListSection<Project>('projects', projects, token || '');
  const blogsSection = useListSection<BlogPost>('blogs', blogs, token || '');
  const researchSection = useListSection<ResearchPaper>('research', research, token || '');

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordInput }),
    });
    if (res.ok) {
      sessionStorage.setItem(TOKEN_KEY, passwordInput);
      setToken(passwordInput);
    } else {
      setLoginError('Wrong password.');
    }
  };

  const saveResumeUrl = async () => {
    if (!token) return;
    setResumeState('saving');
    try {
      const res = await fetch('/api/portfolio-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ resumeUrl }),
      });
      if (!res.ok) throw new Error();
      setResumeState('saved');
      setTimeout(() => setResumeState('idle'), 1500);
    } catch {
      setResumeState('error');
    }
  };

  return (
    <>
      <TargetCursor />

      {!token ? (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
          <form onSubmit={login} className="w-full max-w-xs space-y-3">
            <h1 className="text-lg font-medium text-center mb-4">Admin login</h1>
            <input
              type="password"
              autoFocus
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Password"
              className={inputClass}
            />
            {loginError && <p className="text-destructive text-sm">{loginError}</p>}
            <button type="submit" className="cursor-target w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-3 py-2 rounded-md transition-colors">
              Log in
            </button>
          </form>
        </div>
      ) : (
        <div className="min-h-screen bg-background text-foreground px-4 py-10">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-bold">Portfolio admin</h1>
              <button
                onClick={() => {
                  sessionStorage.removeItem(TOKEN_KEY);
                  setToken(null);
                }}
                className="cursor-target text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Log out
              </button>
            </div>
            <p className="text-muted-foreground text-xs mb-8">
              Fill in plain fields below — no JSON required. "Save section" publishes everything in that section live
              immediately. Deleting an entry saves right away (after a confirmation).
            </p>

            {loading ? (
              <p className="text-muted-foreground text-sm">Loading current content…</p>
            ) : (
              <>
                {/* Resume */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-primary/90 font-medium text-base">Resume URL</h3>
                    <SaveButton state={resumeState} onClick={saveResumeUrl} label="Save" />
                  </div>
                  <input
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    className={inputClass}
                  />
                  {resumeState === 'error' && <p className="text-destructive text-sm mt-1">Save failed — try again.</p>}
                </div>

                {/* Projects */}
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-primary/90 font-medium text-base">Projects ({projectsSection.items.length})</h2>
                    <SaveButton state={projectsSection.state} onClick={projectsSection.save} />
                  </div>
                  {projectsSection.items.map((item, i) => (
                    <ProjectCard
                      key={i}
                      item={item}
                      onChange={(patch) => projectsSection.update(i, patch)}
                      onDelete={() => projectsSection.remove(i)}
                    />
                  ))}
                  <button
                    onClick={() => projectsSection.add(emptyProject)}
                    className="cursor-target text-sm text-primary hover:underline"
                  >
                    + Add project
                  </button>
                  {projectsSection.state === 'error' && (
                    <p className="text-destructive text-sm mt-2">Save failed — try again.</p>
                  )}
                </div>

                {/* Blogs */}
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-primary/90 font-medium text-base">Blogs ({blogsSection.items.length})</h2>
                    <SaveButton state={blogsSection.state} onClick={blogsSection.save} />
                  </div>
                  {blogsSection.items.map((item, i) => (
                    <BlogCard
                      key={i}
                      item={item}
                      onChange={(patch) => blogsSection.update(i, patch)}
                      onDelete={() => blogsSection.remove(i)}
                    />
                  ))}
                  <button
                    onClick={() => blogsSection.add(emptyBlog)}
                    className="cursor-target text-sm text-primary hover:underline"
                  >
                    + Add blog post
                  </button>
                  {blogsSection.state === 'error' && (
                    <p className="text-destructive text-sm mt-2">Save failed — try again.</p>
                  )}
                </div>

                {/* Research */}
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-primary/90 font-medium text-base">Research ({researchSection.items.length})</h2>
                    <SaveButton state={researchSection.state} onClick={researchSection.save} />
                  </div>
                  {researchSection.items.map((item, i) => (
                    <ResearchCard
                      key={i}
                      item={item}
                      onChange={(patch) => researchSection.update(i, patch)}
                      onDelete={() => researchSection.remove(i)}
                    />
                  ))}
                  <button
                    onClick={() => researchSection.add(emptyResearch)}
                    className="cursor-target text-sm text-primary hover:underline"
                  >
                    + Add research paper
                  </button>
                  {researchSection.state === 'error' && (
                    <p className="text-destructive text-sm mt-2">Save failed — try again.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
