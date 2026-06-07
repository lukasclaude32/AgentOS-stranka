"use client";

import { useEffect, useState } from "react";
import { SiteContent } from "@/lib/types";

interface Message {
  id: string;
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

type Section = keyof SiteContent | "__messages";

const SECTIONS: { key: Section; label: string; icon: string }[] = [
  { key: "__messages", label: "Zprávy", icon: "📨" },
  { key: "hero", label: "Hero", icon: "🏠" },
  { key: "marquee", label: "Marquee", icon: "🔄" },
  { key: "features", label: "Funkce (homepage)", icon: "⚡" },
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "howItWorks", label: "Jak to funguje", icon: "🔧" },
  { key: "socialProof", label: "Social proof", icon: "💬" },
  { key: "cta", label: "CTA", icon: "🎯" },
  { key: "nav", label: "Navigace", icon: "🧭" },
  { key: "footer", label: "Patička", icon: "📄" },
  { key: "funkcePage", label: "Stránka: Funkce", icon: "📋" },
  { key: "cenikPage", label: "Stránka: Ceník", icon: "💰" },
  { key: "blogPage", label: "Stránka: Blog", icon: "📝" },
  { key: "kontaktPage", label: "Stránka: Kontakt", icon: "✉️" },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!authed) return;
    fetch("/api/content").then((r) => r.json()).then(setContent);
    fetch("/api/messages").then((r) => { if (r.ok) return r.json(); return []; }).then(setMessages);
  }, [authed]);

  async function refreshMessages() {
    const res = await fetch("/api/messages");
    if (res.ok) setMessages(await res.json());
  }

  async function markRead(id: string) {
    await fetch("/api/messages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "markRead", id }),
    });
    refreshMessages();
  }

  async function markAllRead() {
    await fetch("/api/messages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "markAllRead" }),
    });
    refreshMessages();
  }

  async function deleteMsg(id: string) {
    await fetch("/api/messages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    if (selectedMsg === id) setSelectedMsg(null);
    refreshMessages();
  }

  async function login() {
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) setAuthed(true);
    else setError("Nesprávné heslo");
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  }

  /* Login screen */
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#09090b", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 400, background: "#111113", border: "1px solid #1e1e22", borderRadius: 16, padding: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <svg width="28" height="28" viewBox="0 0 26 26" fill="none"><rect x="1.25" y="1.25" width="23.5" height="23.5" rx="7" stroke="#7c3aed" strokeWidth="2.5"/><circle cx="13" cy="13" r="4" fill="#7c3aed"/><circle cx="21" cy="5" r="2.4" fill="#7c3aed"/></svg>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-0.02em" }}>AgentOS Admin</span>
          </div>
          <p style={{ color: "#71717a", fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>Zadejte heslo pro přístup do administrace obsahu webu.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Heslo"
            style={{ width: "100%", padding: "12px 16px", borderRadius: 10, background: "#09090b", border: "1.5px solid #27272a", color: "#fff", fontSize: 14, outline: "none", marginBottom: 12, transition: "border-color .15s" }}
            onFocus={(e) => e.target.style.borderColor = "#7c3aed"}
            onBlur={(e) => e.target.style.borderColor = "#27272a"}
          />
          {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <button
            onClick={login}
            style={{ width: "100%", padding: "12px 0", borderRadius: 10, background: "#7c3aed", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", transition: "background .15s" }}
            onMouseOver={(e) => (e.target as HTMLElement).style.background = "#5b21b6"}
            onMouseOut={(e) => (e.target as HTMLElement).style.background = "#7c3aed"}
          >
            Přihlásit se
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div style={{ minHeight: "100vh", background: "#09090b", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#71717a" }}>
          <div style={{ width: 20, height: 20, border: "2px solid #7c3aed", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .6s linear infinite" }} />
          Načítání...
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#e4e4e7", display: "flex" }}>
      {/* ── SIDEBAR ── */}
      <aside style={{
        width: sidebarOpen ? 240 : 0, overflow: "hidden", borderRight: "1px solid #1e1e22", background: "#111113",
        display: "flex", flexDirection: "column", flexShrink: 0, transition: "width .2s ease"
      }}>
        <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #1e1e22", whiteSpace: "nowrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="22" height="22" viewBox="0 0 26 26" fill="none"><rect x="1.25" y="1.25" width="23.5" height="23.5" rx="7" stroke="#7c3aed" strokeWidth="2.5"/><circle cx="13" cy="13" r="4" fill="#7c3aed"/><circle cx="21" cy="5" r="2.4" fill="#7c3aed"/></svg>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>AgentOS</span>
            <span style={{ fontSize: 10, color: "#52525b", marginLeft: 4, background: "#1e1e22", padding: "2px 6px", borderRadius: 4 }}>admin</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: 8, overflowY: "auto" }}>
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              style={{
                width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10, fontSize: 13, whiteSpace: "nowrap", marginBottom: 2,
                transition: "all .12s",
                background: activeSection === s.key ? "rgba(124,58,237,0.12)" : "transparent",
                color: activeSection === s.key ? "#a78bfa" : "#71717a",
                fontWeight: activeSection === s.key ? 600 : 400,
              }}
              onMouseOver={(e) => { if (activeSection !== s.key) (e.target as HTMLElement).style.background = "#18181b"; }}
              onMouseOut={(e) => { if (activeSection !== s.key) (e.target as HTMLElement).style.background = "transparent"; }}
            >
              <span style={{ fontSize: 15, width: 22, textAlign: "center" }}>{s.icon}</span>
              {s.label}
              {s.key === "__messages" && messages.filter((m) => !m.read).length > 0 && (
                <span style={{
                  marginLeft: "auto", background: "#7c3aed", color: "#fff", fontSize: 10, fontWeight: 700,
                  padding: "2px 7px", borderRadius: 99, minWidth: 20, textAlign: "center"
                }}>
                  {messages.filter((m) => !m.read).length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: 8, borderTop: "1px solid #1e1e22" }}>
          <a href="/" target="_blank" rel="noreferrer" style={{
            display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8,
            fontSize: 13, color: "#71717a", textDecoration: "none", transition: "color .15s"
          }}>
            ↗ Zobrazit web
          </a>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: 52, borderBottom: "1px solid #1e1e22", background: "#111113",
          display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer", fontSize: 18, padding: 4 }}>☰</button>
            <h1 style={{ fontSize: 14, fontWeight: 400, color: "#a1a1aa" }}>
              Editace: <span style={{ color: "#a78bfa", fontWeight: 600 }}>{SECTIONS.find((s) => s.key === activeSection)?.label}</span>
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {activeSection !== "__messages" && (
              <>
                {saved && (
                  <span style={{ fontSize: 12, color: "#10b981", display: "flex", alignItems: "center", gap: 4, animation: "fadeIn .3s" }}>
                    ✓ Uloženo
                  </span>
                )}
                <button
                  onClick={save}
                  disabled={saving}
                  style={{
                    padding: "8px 20px", borderRadius: 8, background: "#7c3aed", color: "#fff", border: "none",
                    fontSize: 13, fontWeight: 700, cursor: saving ? "default" : "pointer", opacity: saving ? 0.5 : 1,
                    transition: "all .15s"
                  }}
                  onMouseOver={(e) => { if (!saving) (e.target as HTMLElement).style.background = "#5b21b6"; }}
                  onMouseOut={(e) => (e.target as HTMLElement).style.background = "#7c3aed"}
                >
                  {saving ? "Ukládání..." : "Uložit změny"}
                </button>
              </>
            )}
          </div>
        </header>

        {/* Content area */}
        <div style={{ flex: 1, overflow: "auto", padding: 32 }}>
          {activeSection === "__messages" ? (
            <MessagesInbox
              messages={messages}
              selectedMsg={selectedMsg}
              onSelect={(id) => { setSelectedMsg(id); if (id) markRead(id); }}
              onDelete={deleteMsg}
              onMarkAllRead={markAllRead}
              onRefresh={refreshMessages}
            />
          ) : (
            <div style={{ maxWidth: 720 }}>
              <SectionEditor
                section={activeSection}
                data={content[activeSection as keyof SiteContent] as Record<string, unknown>}
                onChange={(val) => setContent({ ...content, [activeSection as keyof SiteContent]: val })}
              />
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}

/* ── Recursive field editor ── */
function SectionEditor({ section, data, onChange }: { section: string; data: Record<string, unknown>; onChange: (v: Record<string, unknown>) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {Object.entries(data).map(([key, value]) => (
        <FieldEditor key={`${section}-${key}`} label={key} value={value} onChange={(v) => onChange({ ...data, [key]: v })} depth={0} />
      ))}
    </div>
  );
}

function FieldEditor({ label, value, onChange, depth }: { label: string; value: unknown; onChange: (v: unknown) => void; depth: number }) {
  const fmt = label
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/_/g, " ");

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    background: "#09090b", border: "1.5px solid #27272a", color: "#e4e4e7",
    fontSize: 14, outline: "none", transition: "border-color .15s", fontFamily: "inherit",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 11, fontFamily: "ui-monospace, monospace",
    color: "#71717a", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.08em",
  };

  if (typeof value === "string") {
    const isLong = value.length > 80;
    return (
      <div>
        <label style={labelStyle}>{fmt}</label>
        {isLong ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" as const, minHeight: 80 }}
            onFocus={(e) => e.target.style.borderColor = "#7c3aed"}
            onBlur={(e) => e.target.style.borderColor = "#27272a"}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = "#7c3aed"}
            onBlur={(e) => e.target.style.borderColor = "#27272a"}
          />
        )}
      </div>
    );
  }

  if (typeof value === "boolean") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={() => onChange(!value)}
          style={{
            width: 40, height: 22, borderRadius: 99, border: "none", cursor: "pointer",
            background: value ? "#7c3aed" : "#27272a", transition: "background .15s", position: "relative" as const
          }}
        >
          <div style={{
            width: 16, height: 16, borderRadius: "50%", background: "#fff",
            position: "absolute" as const, top: 3, left: value ? 21 : 3, transition: "left .15s"
          }} />
        </button>
        <span style={{ fontSize: 14, color: "#a1a1aa" }}>{fmt}</span>
      </div>
    );
  }

  if (typeof value === "number") {
    return (
      <div>
        <label style={labelStyle}>{fmt}</label>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = "#7c3aed"}
          onBlur={(e) => e.target.style.borderColor = "#27272a"}
        />
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>{fmt} ({value.length})</label>
          <button
            onClick={() => {
              if (value.length > 0 && typeof value[0] === "object") {
                const tpl = Object.fromEntries(Object.keys(value[0] as Record<string, unknown>).map((k) => [k, ""]));
                onChange([...value, tpl]);
              } else {
                onChange([...value, ""]);
              }
            }}
            style={{
              fontSize: 12, color: "#7c3aed", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)",
              padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontWeight: 600, transition: "all .15s"
            }}
          >
            + Přidat
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {value.map((item, i) => (
            <div key={i} style={depth < 2 ? {
              borderRadius: 10, border: "1px solid #1e1e22", background: "#111113", padding: 16
            } : undefined}>
              {depth < 2 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 11, color: "#52525b", fontFamily: "ui-monospace, monospace" }}>#{i + 1}</span>
                  <button
                    onClick={() => onChange(value.filter((_: unknown, j: number) => j !== i))}
                    style={{ fontSize: 11, color: "#71717a", background: "none", border: "none", cursor: "pointer", transition: "color .15s" }}
                    onMouseOver={(e) => (e.target as HTMLElement).style.color = "#ef4444"}
                    onMouseOut={(e) => (e.target as HTMLElement).style.color = "#71717a"}
                  >
                    ✕ Odebrat
                  </button>
                </div>
              )}
              <FieldEditor label={`Item ${i + 1}`} value={item} onChange={(v) => { const n = [...value]; n[i] = v; onChange(n); }} depth={depth + 1} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    return (
      <div>
        {depth === 0 && <label style={{ ...labelStyle, marginBottom: 10 }}>{fmt}</label>}
        <div style={depth === 0 ? {
          borderRadius: 12, border: "1px solid #1e1e22", background: "#111113", padding: 20,
          display: "flex", flexDirection: "column" as const, gap: 20
        } : { display: "flex", flexDirection: "column" as const, gap: 16 }}>
          {Object.entries(obj).map(([k, v]) => (
            <FieldEditor key={k} label={k} value={v} onChange={(nv) => onChange({ ...obj, [k]: nv })} depth={depth + 1} />
          ))}
        </div>
      </div>
    );
  }

  return null;
}

/* ── Messages Inbox ── */
function MessagesInbox({ messages, selectedMsg, onSelect, onDelete, onMarkAllRead, onRefresh }: {
  messages: Message[];
  selectedMsg: string | null;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
  onMarkAllRead: () => void;
  onRefresh: () => void;
}) {
  const selected = messages.find((m) => m.id === selectedMsg);
  const unread = messages.filter((m) => !m.read).length;

  const subjectMap: Record<string, string> = {
    demo: "Demo / prezentace",
    tech: "Technický dotaz",
    enterprise: "Enterprise",
    other: "Jiné",
  };

  function timeAgo(iso: string) {
    const d = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(d / 60000);
    if (mins < 1) return "právě teď";
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} h`;
    const days = Math.floor(hrs / 24);
    return `${days} d`;
  }

  return (
    <div style={{ display: "flex", gap: 0, height: "calc(100vh - 116px)", margin: -32, marginTop: -32 }}>
      {/* List */}
      <div style={{ width: 380, borderRight: "1px solid #1e1e22", overflow: "auto", flexShrink: 0 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e22", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#e4e4e7" }}>Zprávy</span>
            {unread > 0 && <span style={{ marginLeft: 8, fontSize: 12, color: "#a78bfa" }}>{unread} nepřečtených</span>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onRefresh} style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer", fontSize: 16 }} title="Obnovit">↻</button>
            {unread > 0 && (
              <button onClick={onMarkAllRead} style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer", fontSize: 11, whiteSpace: "nowrap" }}>Označit vše</button>
            )}
          </div>
        </div>
        {messages.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#52525b", fontSize: 13 }}>
            Žádné zprávy. Formulář na /kontakt sem posílá zprávy.
          </div>
        ) : (
          messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => onSelect(msg.id)}
              style={{
                width: "100%", textAlign: "left", padding: "14px 20px", border: "none", cursor: "pointer",
                borderBottom: "1px solid #1e1e22", display: "flex", flexDirection: "column", gap: 4,
                background: selectedMsg === msg.id ? "rgba(124,58,237,0.08)" : "transparent",
                transition: "background .1s",
              }}
              onMouseOver={(e) => { if (selectedMsg !== msg.id) (e.currentTarget).style.background = "#18181b"; }}
              onMouseOut={(e) => { if (selectedMsg !== msg.id) (e.currentTarget).style.background = "transparent"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {!msg.read && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#7c3aed", flexShrink: 0 }} />}
                <span style={{ fontSize: 13, fontWeight: msg.read ? 400 : 700, color: msg.read ? "#a1a1aa" : "#e4e4e7", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {msg.name}
                </span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#52525b", flexShrink: 0 }}>{timeAgo(msg.createdAt)}</span>
              </div>
              <div style={{ fontSize: 12, color: "#71717a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {msg.email}{msg.company ? ` · ${msg.company}` : ""}
              </div>
              <div style={{ fontSize: 12, color: "#52525b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {msg.message.slice(0, 100)}
              </div>
            </button>
          ))
        )}
      </div>

      {/* Detail */}
      <div style={{ flex: 1, overflow: "auto", padding: 32 }}>
        {selected ? (
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#e4e4e7", margin: 0 }}>{selected.name}</h2>
                <div style={{ fontSize: 13, color: "#71717a", marginTop: 4 }}>
                  <a href={`mailto:${selected.email}`} style={{ color: "#a78bfa", textDecoration: "none" }}>{selected.email}</a>
                  {selected.company && <span> · {selected.company}</span>}
                </div>
              </div>
              <button
                onClick={() => onDelete(selected.id)}
                style={{ background: "none", border: "1px solid #27272a", borderRadius: 8, color: "#71717a", padding: "6px 14px", cursor: "pointer", fontSize: 12, transition: "all .15s" }}
                onMouseOver={(e) => { (e.target as HTMLElement).style.borderColor = "#ef4444"; (e.target as HTMLElement).style.color = "#ef4444"; }}
                onMouseOut={(e) => { (e.target as HTMLElement).style.borderColor = "#27272a"; (e.target as HTMLElement).style.color = "#71717a"; }}
              >
                Smazat
              </button>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "#1e1e22", color: "#a1a1aa" }}>
                {subjectMap[selected.subject] || selected.subject || "—"}
              </span>
              <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "#1e1e22", color: "#71717a" }}>
                {new Date(selected.createdAt).toLocaleString("cs-CZ")}
              </span>
            </div>

            <div style={{
              background: "#111113", border: "1px solid #1e1e22", borderRadius: 12, padding: 24,
              color: "#d4d4d8", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap",
            }}>
              {selected.message}
            </div>

            <div style={{ marginTop: 20 }}>
              <a
                href={`mailto:${selected.email}?subject=Re: ${subjectMap[selected.subject] || "AgentOS"}`}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8,
                  background: "#7c3aed", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none",
                  transition: "background .15s",
                }}
                onMouseOver={(e) => (e.currentTarget).style.background = "#5b21b6"}
                onMouseOut={(e) => (e.currentTarget).style.background = "#7c3aed"}
              >
                ↩ Odpovědět emailem
              </a>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#3f3f46", fontSize: 14 }}>
            {messages.length > 0 ? "Vyberte zprávu ze seznamu" : "Žádné zprávy k zobrazení"}
          </div>
        )}
      </div>
    </div>
  );
}
