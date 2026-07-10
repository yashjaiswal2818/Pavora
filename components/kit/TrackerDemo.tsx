"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  ChevronDown,
  CircleDashed,
  Flag,
  Inbox,
  LayoutGrid,
  ListFilter,
  Map,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react";

/* A SaaS project tracker, skinned entirely by the active kit's tokens. Nothing
   here hard-codes a colour: cards read --card, actions read --primary, task
   labels and project dots read the --chart-* ramp, the rail reads the
   --sidebar-* family. Drop a different kit on the scope and the whole app
   re-themes. This is the surface a buyer feels at full scale. */

type MemberId = "am" | "rk" | "ts" | "yj";

const MEMBERS: Record<MemberId, { name: string; initials: string; color: string }> = {
  am: { name: "Ana Morales", initials: "AM", color: "var(--chart-1)" },
  rk: { name: "Ravi Kumar", initials: "RK", color: "var(--chart-4)" },
  ts: { name: "Tia Sato", initials: "TS", color: "var(--chart-5)" },
  yj: { name: "Yara Joshi", initials: "YJ", color: "var(--chart-3)" },
};

const LABELS: Record<string, string> = {
  Design: "var(--chart-1)",
  Frontend: "var(--chart-4)",
  Backend: "var(--chart-3)",
  A11y: "var(--chart-5)",
  Docs: "var(--chart-2)",
};

type Priority = "high" | "medium" | "low";
const PRIORITY: Record<Priority, { label: string; color: string }> = {
  high: { label: "High", color: "var(--destructive)" },
  medium: { label: "Medium", color: "var(--chart-2)" },
  low: { label: "Low", color: "var(--muted-foreground)" },
};

interface Task {
  title: string;
  labels: string[];
  priority?: Priority;
  assignee: MemberId;
  due?: string;
  comments?: number;
  attachments?: number;
  subtasks?: string;
  done?: boolean;
}

const COLUMNS: { id: string; name: string; dot: string; tasks: Task[] }[] = [
  {
    id: "todo",
    name: "To Do",
    dot: "var(--muted-foreground)",
    tasks: [
      { title: "Redesign the onboarding flow", labels: ["Design"], priority: "high", assignee: "am", due: "Jun 24", comments: 3 },
      { title: "SSO via SAML for enterprise plans", labels: ["Backend"], priority: "medium", assignee: "rk", subtasks: "2/5" },
      { title: "Audit colour-contrast tokens", labels: ["A11y", "Design"], priority: "low", assignee: "ts" },
    ],
  },
  {
    id: "doing",
    name: "In Progress",
    dot: "var(--chart-1)",
    tasks: [
      { title: "Build the theme demo route", labels: ["Frontend"], priority: "high", assignee: "yj", due: "Jun 21", comments: 5, attachments: 2 },
      { title: "Migrate gallery to Tailwind v4", labels: ["Frontend", "Docs"], priority: "medium", assignee: "am", subtasks: "6/9" },
    ],
  },
  {
    id: "done",
    name: "Done",
    dot: "var(--chart-5)",
    tasks: [
      { title: "Set up the CI pipeline", labels: ["Backend"], assignee: "rk", done: true },
      { title: "Write the contributing guide", labels: ["Docs"], assignee: "ts", done: true },
    ],
  },
];

function Avatar({ id, size = 22 }: { id: MemberId; size?: number }) {
  const m = MEMBERS[id];
  return (
    <span
      className="tk-avatar"
      title={m.name}
      style={{ background: m.color, width: size, height: size, fontSize: size * 0.42 }}
    >
      {m.initials}
    </span>
  );
}

export function TrackerDemo() {
  const [draft, setDraft] = useState("");

  return (
    <div className="tk">
      {/* ---- Sidebar ---- */}
      <aside className="tk-sidebar">
        <button className="tk-ws" type="button">
          <span className="tk-ws-mark">N</span>
          <span className="tk-ws-name">Northwind</span>
          <ChevronDown size={15} className="tk-ws-caret" />
        </button>

        <nav className="tk-nav" aria-label="Primary">
          <NavItem icon={<Inbox size={16} />} label="Inbox" badge="3" />
          <NavItem icon={<CircleDashed size={16} />} label="My issues" />
          <NavItem icon={<LayoutGrid size={16} />} label="Boards" active />
          <NavItem icon={<Map size={16} />} label="Roadmap" />
          <NavItem icon={<Users size={16} />} label="Members" />
          <NavItem icon={<Settings size={16} />} label="Settings" />
        </nav>

        <div className="tk-group">
          <span className="tk-group-label">Projects</span>
          <Project name="Web app" color="var(--chart-4)" />
          <Project name="Mobile" color="var(--chart-1)" />
          <Project name="Marketing site" color="var(--chart-5)" />
        </div>

        <div className="tk-user">
          <Avatar id="yj" size={28} />
          <span className="tk-user-meta">
            <span className="tk-user-name">Yara Joshi</span>
            <span className="tk-user-role">Owner</span>
          </span>
          <span className="tk-status" aria-hidden />
        </div>
      </aside>

      {/* ---- Main ---- */}
      <div className="tk-main">
        <header className="tk-topbar">
          <div className="tk-crumbs">
            <span className="tk-crumb-muted">Boards</span>
            <span className="tk-crumb-sep">/</span>
            <h1 className="tk-crumb">Sprint 24</h1>
          </div>

          <div className="tk-tabs" role="tablist" aria-label="View">
            <button className="tk-tab is-active" role="tab" aria-selected="true">Board</button>
            <button className="tk-tab" role="tab" aria-selected="false">List</button>
            <button className="tk-tab" role="tab" aria-selected="false">Timeline</button>
          </div>

          <div className="tk-actions">
            <label className="tk-search">
              <Search size={15} aria-hidden />
              <input type="text" placeholder="Search tasks" aria-label="Search tasks" />
            </label>
            <button className="tk-btn tk-btn--outline" type="button">
              <ListFilter size={15} /> Filter
            </button>
            <button className="tk-icon-btn" type="button" aria-label="Notifications">
              <Bell size={16} />
            </button>
            <button className="tk-btn tk-btn--primary" type="button">
              <Plus size={15} /> New task
            </button>
          </div>
        </header>

        <div className="tk-subbar">
          <div className="tk-avatars">
            {(["am", "rk", "ts", "yj"] as MemberId[]).map((id) => (
              <Avatar key={id} id={id} />
            ))}
            <span className="tk-avatars-more">4 members</span>
          </div>
          <div className="tk-sprint">
            <span className="tk-sprint-range">Jun 17 – Jun 28</span>
            <span className="tk-progress" role="img" aria-label="12 of 18 tasks done">
              <span className="tk-progress-track">
                <span className="tk-progress-fill" style={{ width: "66%" }} />
              </span>
              <span className="tk-progress-text">12 / 18</span>
            </span>
          </div>
        </div>

        <div className="tk-board">
          {COLUMNS.map((col, ci) => (
            <section key={col.id} className="tk-col" style={{ animationDelay: `${ci * 70}ms` }}>
              <div className="tk-col-head">
                <span className="tk-col-dot" style={{ background: col.dot }} />
                <h2 className="tk-col-name">{col.name}</h2>
                <span className="tk-count">{col.tasks.length}</span>
                <button className="tk-col-add" type="button" aria-label={`Add task to ${col.name}`}>
                  <Plus size={15} />
                </button>
              </div>

              <div className="tk-col-body">
                {col.tasks.map((t, ti) => (
                  <article
                    key={t.title}
                    className={`tk-card${t.done ? " is-done" : ""}`}
                    tabIndex={0}
                    style={{ animationDelay: `${ci * 70 + ti * 45}ms` }}
                  >
                    <div className="tk-card-top">
                      <div className="tk-labels">
                        {t.labels.map((l) => (
                          <span
                            key={l}
                            className="tk-label"
                            style={{
                              color: LABELS[l],
                              background: `color-mix(in oklab, ${LABELS[l]} 15%, transparent)`,
                            }}
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                      <button className="tk-card-more" type="button" aria-label="Task actions">
                        <MoreHorizontal size={15} />
                      </button>
                    </div>

                    <p className="tk-card-title">
                      {t.done && <Check size={14} className="tk-done-check" aria-hidden />}
                      {t.title}
                    </p>

                    <div className="tk-card-foot">
                      <div className="tk-meta">
                        {t.priority && (
                          <span className="tk-pri" style={{ color: PRIORITY[t.priority].color }}>
                            <Flag size={13} fill="currentColor" />
                            {PRIORITY[t.priority].label}
                          </span>
                        )}
                        {t.due && <span className="tk-due">{t.due}</span>}
                        {t.subtasks && (
                          <span className="tk-chip-meta">
                            <Check size={13} /> {t.subtasks}
                          </span>
                        )}
                        {t.comments != null && (
                          <span className="tk-chip-meta">
                            <MessageSquare size={13} /> {t.comments}
                          </span>
                        )}
                        {t.attachments != null && (
                          <span className="tk-chip-meta">
                            <Paperclip size={13} /> {t.attachments}
                          </span>
                        )}
                      </div>
                      <Avatar id={t.assignee} />
                    </div>
                  </article>
                ))}

                {col.id === "doing" && (
                  <form
                    className="tk-quickadd"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setDraft("");
                    }}
                  >
                    <input
                      type="text"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Add a task…"
                      aria-label="New task title"
                    />
                    <button className="tk-btn tk-btn--primary tk-btn--sm" type="submit" disabled={!draft.trim()}>
                      Add
                    </button>
                  </form>
                )}

                {col.id === "done" && <p className="tk-col-foot">Cleared every Friday</p>}
              </div>
            </section>
          ))}
        </div>
      </div>

      <style>{styles}</style>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <button type="button" className={`tk-nav-item${active ? " is-active" : ""}`}>
      <span className="tk-nav-ico">{icon}</span>
      <span className="tk-nav-label">{label}</span>
      {badge && <span className="tk-nav-badge">{badge}</span>}
    </button>
  );
}

function Project({ name, color }: { name: string; color: string }) {
  return (
    <button type="button" className="tk-project">
      <span className="tk-dot" style={{ background: color }} />
      {name}
    </button>
  );
}

const styles = `
.tk {
  display: flex;
  height: 100%;
  background: var(--background);
  color: var(--foreground);
  font-family: var(--kit-font-sans);
  font-size: 14px;
  line-height: 1.45;
  -webkit-font-smoothing: antialiased;
}
.tk button { font-family: inherit; cursor: pointer; }

/* ---------- Sidebar ---------- */
.tk-sidebar {
  flex: 0 0 234px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 10px;
  background: var(--sidebar);
  color: var(--sidebar-foreground);
  border-right: 1px solid var(--sidebar-border);
}
.tk-ws {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 7px 8px;
  margin-bottom: 6px;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: inherit;
  transition: background 0.15s ease;
}
.tk-ws:hover { background: var(--sidebar-accent); }
.tk-ws-mark {
  display: grid; place-items: center;
  width: 26px; height: 26px;
  border-radius: 7px;
  background: var(--sidebar-primary);
  color: var(--sidebar-primary-foreground);
  font-weight: 700; font-size: 14px;
}
.tk-ws-name { font-weight: 600; font-size: 14px; }
.tk-ws-caret { margin-left: auto; opacity: 0.5; }

.tk-nav { display: flex; flex-direction: column; gap: 1px; }
.tk-nav-item {
  display: flex; align-items: center; gap: 10px;
  width: 100%;
  padding: 7px 9px;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--sidebar-foreground);
  font-size: 13.5px; font-weight: 500;
  text-align: left;
  transition: background 0.14s ease, color 0.14s ease;
}
.tk-nav-ico { display: grid; place-items: center; opacity: 0.7; }
.tk-nav-item:hover { background: var(--sidebar-accent); }
.tk-nav-item.is-active {
  background: var(--sidebar-accent);
  color: var(--sidebar-accent-foreground);
  font-weight: 600;
}
.tk-nav-item.is-active .tk-nav-ico { opacity: 1; color: var(--sidebar-primary); }
.tk-nav-label { flex: 1; }
.tk-nav-badge {
  font-size: 11px; font-weight: 600;
  padding: 1px 7px; border-radius: 999px;
  background: var(--sidebar-primary);
  color: var(--sidebar-primary-foreground);
}

.tk-group { display: flex; flex-direction: column; gap: 1px; margin-top: 16px; }
.tk-group-label {
  padding: 4px 9px;
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}
.tk-project {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 6px 9px;
  border: none; border-radius: var(--radius-md);
  background: transparent; color: var(--sidebar-foreground);
  font-size: 13.5px; font-weight: 500; text-align: left;
  transition: background 0.14s ease;
}
.tk-project:hover { background: var(--sidebar-accent); }
.tk-dot { width: 8px; height: 8px; border-radius: 50%; flex: none; }

.tk-user {
  display: flex; align-items: center; gap: 9px;
  margin-top: auto;
  padding: 8px;
  border-radius: var(--radius-md);
  border: 1px solid var(--sidebar-border);
}
.tk-user-meta { display: flex; flex-direction: column; line-height: 1.25; min-width: 0; }
.tk-user-name { font-size: 13px; font-weight: 600; }
.tk-user-role { font-size: 11.5px; color: var(--muted-foreground); }
.tk-status {
  width: 8px; height: 8px; border-radius: 50%;
  margin-left: auto; background: var(--chart-5);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--chart-5) 22%, transparent);
}

/* ---------- Main ---------- */
.tk-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }

.tk-topbar {
  display: flex; align-items: center; gap: 16px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--border);
}
.tk-crumbs { display: flex; align-items: baseline; gap: 7px; min-width: 0; }
.tk-crumb-muted { font-size: 13px; color: var(--muted-foreground); }
.tk-crumb-sep { color: var(--muted-foreground); opacity: 0.6; }
.tk-crumb { font-size: 17px; font-weight: 700; letter-spacing: -0.01em; margin: 0; }

.tk-tabs {
  display: flex; gap: 2px; padding: 3px;
  border-radius: var(--radius-lg);
  background: var(--muted);
}
.tk-tab {
  padding: 5px 13px;
  border: none; border-radius: var(--radius-md);
  background: transparent;
  color: var(--muted-foreground);
  font-size: 13px; font-weight: 600;
  transition: color 0.14s ease, background 0.14s ease;
}
.tk-tab:hover { color: var(--foreground); }
.tk-tab.is-active {
  background: var(--card);
  color: var(--foreground);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
}

.tk-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }
.tk-search {
  display: flex; align-items: center; gap: 7px;
  padding: 0 10px; height: 34px;
  border: 1px solid var(--input);
  border-radius: var(--radius-md);
  background: var(--background);
  color: var(--muted-foreground);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.tk-search:focus-within {
  border-color: var(--ring);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 28%, transparent);
}
.tk-search input {
  border: none; outline: none; background: transparent;
  color: var(--foreground); font-size: 13.5px; width: 150px;
}
.tk-search input::placeholder { color: var(--muted-foreground); }

.tk-btn {
  display: inline-flex; align-items: center; gap: 6px;
  height: 34px; padding: 0 13px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  font-size: 13.5px; font-weight: 600;
  transition: background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease, transform 0.05s ease;
}
.tk-btn--sm { height: 30px; padding: 0 12px; }
.tk-btn:active { transform: translateY(0.5px); }
.tk-btn--primary { background: var(--primary); color: var(--primary-foreground); }
.tk-btn--primary:hover { background: color-mix(in oklab, var(--primary) 88%, black); }
.tk-btn--primary:disabled { opacity: 0.5; cursor: not-allowed; }
.tk-btn--outline { background: var(--background); color: var(--foreground); border-color: var(--border); }
.tk-btn--outline:hover { background: var(--accent); color: var(--accent-foreground); }

.tk-icon-btn {
  display: grid; place-items: center;
  width: 34px; height: 34px;
  border: 1px solid var(--border); border-radius: var(--radius-md);
  background: var(--background); color: var(--muted-foreground);
  transition: background 0.15s ease, color 0.15s ease;
}
.tk-icon-btn:hover { background: var(--accent); color: var(--accent-foreground); }

.tk-subbar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; padding: 10px 18px;
  border-bottom: 1px solid var(--border);
}
.tk-avatars { display: flex; align-items: center; }
.tk-avatars .tk-avatar { margin-right: -7px; box-shadow: 0 0 0 2px var(--background); }
.tk-avatars-more { margin-left: 16px; font-size: 12.5px; color: var(--muted-foreground); }
.tk-sprint { display: flex; align-items: center; gap: 14px; }
.tk-sprint-range { font-size: 12.5px; color: var(--muted-foreground); }
.tk-progress { display: flex; align-items: center; gap: 9px; }
.tk-progress-track {
  width: 132px; height: 6px; border-radius: 999px;
  background: var(--muted); overflow: hidden;
}
.tk-progress-fill { display: block; height: 100%; border-radius: 999px; background: var(--chart-1); }
.tk-progress-text { font-size: 12.5px; font-weight: 600; color: var(--muted-foreground); }

/* ---------- Board ---------- */
.tk-board {
  flex: 1; min-height: 0;
  display: flex; gap: 14px;
  padding: 16px 18px;
  overflow-x: auto;
}
.tk-col {
  flex: 0 0 286px;
  display: flex; flex-direction: column;
  min-height: 0;
  animation: tk-rise 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.tk-col-head {
  display: flex; align-items: center; gap: 8px;
  padding: 4px 6px 10px;
}
.tk-col-dot { width: 9px; height: 9px; border-radius: 50%; }
.tk-col-name { font-size: 13.5px; font-weight: 700; margin: 0; }
.tk-count {
  font-size: 12px; font-weight: 600;
  color: var(--muted-foreground);
  background: var(--muted);
  padding: 1px 8px; border-radius: 999px;
}
.tk-col-add {
  margin-left: auto;
  display: grid; place-items: center;
  width: 26px; height: 26px;
  border: none; border-radius: var(--radius-sm);
  background: transparent; color: var(--muted-foreground);
  transition: background 0.14s ease, color 0.14s ease;
}
.tk-col-add:hover { background: var(--accent); color: var(--accent-foreground); }

.tk-col-body {
  display: flex; flex-direction: column; gap: 9px;
  overflow-y: auto; padding: 2px;
}

.tk-card {
  display: flex; flex-direction: column; gap: 9px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--card);
  color: var(--card-foreground);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
  outline: none;
  animation: tk-rise 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: transform 0.16s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.16s ease, border-color 0.16s ease;
}
.tk-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgb(0 0 0 / 0.12);
  border-color: color-mix(in oklab, var(--primary) 45%, var(--border));
}
.tk-card:focus-visible {
  border-color: var(--ring);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 30%, transparent);
}
.tk-card.is-done { opacity: 0.72; }
.tk-card.is-done .tk-card-title { color: var(--muted-foreground); }

.tk-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.tk-labels { display: flex; flex-wrap: wrap; gap: 5px; }
.tk-label {
  font-size: 11px; font-weight: 600;
  padding: 2px 8px; border-radius: 999px;
}
.tk-card-more {
  display: grid; place-items: center;
  width: 22px; height: 22px; flex: none;
  border: none; border-radius: var(--radius-sm);
  background: transparent; color: var(--muted-foreground);
  opacity: 0; transition: opacity 0.14s ease, background 0.14s ease;
}
.tk-card:hover .tk-card-more, .tk-card:focus-within .tk-card-more { opacity: 1; }
.tk-card-more:hover { background: var(--accent); }

.tk-card-title {
  display: flex; align-items: flex-start; gap: 6px;
  margin: 0; font-size: 13.5px; font-weight: 600; line-height: 1.35;
}
.tk-done-check { color: var(--chart-5); margin-top: 2px; flex: none; }

.tk-card-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.tk-meta { display: flex; align-items: center; gap: 11px; flex-wrap: wrap; }
.tk-pri { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; }
.tk-due {
  font-size: 12px; font-weight: 500; color: var(--muted-foreground);
  padding: 1px 7px; border-radius: 6px; background: var(--muted);
}
.tk-chip-meta { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: var(--muted-foreground); }

.tk-avatar {
  display: grid; place-items: center;
  border-radius: 50%; flex: none;
  color: #fff; font-weight: 700;
  letter-spacing: 0.01em;
}

.tk-quickadd {
  display: flex; gap: 7px; align-items: center;
  padding: 7px; margin-top: 1px;
  border: 1px dashed var(--border);
  border-radius: var(--radius-lg);
}
.tk-quickadd input {
  flex: 1; min-width: 0;
  height: 30px; padding: 0 9px;
  border: 1px solid var(--input); border-radius: var(--radius-md);
  background: var(--background); color: var(--foreground);
  font-size: 13px; outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.tk-quickadd input::placeholder { color: var(--muted-foreground); }
.tk-quickadd input:focus {
  border-color: var(--ring);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 28%, transparent);
}
.tk-col-foot { font-size: 12px; color: var(--muted-foreground); padding: 4px 6px; }

@keyframes tk-rise {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 880px) {
  .tk-sidebar { display: none; }
}
@media (max-width: 620px) {
  .tk-tabs, .tk-search { display: none; }
  .tk-topbar { flex-wrap: wrap; }
}
@media (prefers-reduced-motion: reduce) {
  .tk-card, .tk-col { animation: none; }
  .tk-card:hover { transform: none; }
}
`;
