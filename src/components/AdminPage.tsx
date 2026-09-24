import React, { useEffect, useState } from 'react';
import type { Project, BlogPost, ResearchPaper } from '../data/portfolioData';

const TOKEN_KEY = 'admin_token';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

const JsonEditor: React.FC<{
  label: string;
  value: unknown;
  onSaved: (value: unknown) => void;
  token: string;
  field: 'projects' | 'blogs' | 'research';
}> = ({ label, value, onSaved, token, field }) => {
  const [text, setText] = useState(JSON.stringify(value, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<SaveState>('idle');

  const save = async () => {
    setError(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      setError('That\u2019s not valid JSON — check for a missing comma or bracket.');
      return;
    }

    setState('saving');
    try {
      const res = await fetch('/api/portfolio-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: parsed }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      onSaved(updated[field]);
      setState('saved');
      setTimeout(() => setState('idle'), 1500);
    } catch {
      setState('error');
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-primary/90 font-medium text-base">{label}</h3>
        <button
          onClick={save}
          disabled={state === 'saving'}
          className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-sm px-3 py-1.5 rounded-md transition-colors"
        >
          {state === 'saving' ? 'Saving…' : state === 'saved' ? 'Saved ✓' : 'Save'}
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        rows={14}
        className="w-full font-mono text-xs bg-muted text-foreground rounded-md p-3 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
      />
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
      {state === 'error' && !error && (
        <p className="text-destructive text-sm mt-1">Save failed — check the password/server and try again.</p>
      )}
    </div>
  );
};

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

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
        <form onSubmit={login} className="w-full max-w-xs space-y-3">
          <h1 className="text-lg font-medium text-center mb-4">Admin login</h1>
          <input
            type="password"
            autoFocus
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Password"
            className="w-full bg-muted text-foreground rounded-md px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {loginError && <p className="text-destructive text-sm">{loginError}</p>}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-3 py-2 rounded-md transition-colors"
          >
            Log in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold">Portfolio admin</h1>
          <button
            onClick={() => {
              sessionStorage.removeItem(TOKEN_KEY);
              setToken(null);
            }}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Log out
          </button>
        </div>

        {loading ? (
          <p className="text-muted-foreground text-sm">Loading current content…</p>
        ) : (
          <>
            <div className="mb-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-primary/90 font-medium text-base">Resume URL</h3>
                <button
                  onClick={saveResumeUrl}
                  disabled={resumeState === 'saving'}
                  className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-sm px-3 py-1.5 rounded-md transition-colors"
                >
                  {resumeState === 'saving' ? 'Saving…' : resumeState === 'saved' ? 'Saved ✓' : 'Save'}
                </button>
              </div>
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                className="w-full bg-muted text-foreground rounded-md px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              />
              {resumeState === 'error' && (
                <p className="text-destructive text-sm mt-1">Save failed — try again.</p>
              )}
            </div>

            <JsonEditor label="Projects" value={projects} onSaved={(v) => setProjects(v as Project[])} token={token} field="projects" />
            <JsonEditor label="Blogs" value={blogs} onSaved={(v) => setBlogs(v as BlogPost[])} token={token} field="blogs" />
            <JsonEditor label="Research" value={research} onSaved={(v) => setResearch(v as ResearchPaper[])} token={token} field="research" />

            <p className="text-muted-foreground text-xs mt-4">
              Edits save straight to the live site — no rebuild needed. Keep the JSON shape matching the existing entries.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
