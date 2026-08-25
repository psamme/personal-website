"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "./Analytics";

/* ============================================================================
   EDIT ME  ·  everything you'd want to change lives in this block
   ========================================================================== */

// Your contact card. Drop your photo in  public/sam.jpg  and it shows up
// automatically (until then it falls back to "SE" initials).
const CONTACT = {
  name: "Sam Evans",
  photo: "/sam.jpg",
  location: "jacksonville, florida",
  birthday: "february 6, 2008",
  email: "samuel.c.evans.30@dartmouth.edu",
  facetimeVideo: "/facetime.mp4", // H.264 transcode of IMG_6454.MOV (universal playback)
};

type LinkItem = { label: string; href: string };
type Line = string | { links: LinkItem[] };

type Topic = {
  id: string;
  chip: string; // label on the tappable suggestion
  prompt: string; // what "you" send
  lines: Line[]; // what Sam replies (edit these!)
};

const reachLinks: LinkItem[] = [
  { label: "x", href: "https://x.com/samvsthewxrld" },
  { label: "linkedin", href: "https://www.linkedin.com/in/samcevans" },
  { label: "instagram", href: "https://www.instagram.com/samvsthewrld" },
  { label: "github", href: "https://github.com/psamme" },
  { label: "email", href: "mailto:samuel.c.evans.30@dartmouth.edu" },
  { label: "monkeytype", href: "https://monkeytype.com/profile/samevans" },
];

const intro: Line[] = [
  "hey, i'm sam",
  "incoming freshman at dartmouth",
  "i grew up fascinated with words, and when i realized technology could help me play with language in entirely new ways, i was hooked",
  "i landed on spelling bees as an outlet for that curiosity, and building naturally became part of the process for me",
  "had some success competing, but more once i started coaching younger students in high school",
  "along the way i started creating little tools for myself and my students, which eventually grew into bigger projects",
  "now, i've realized that building is what i want to spend my time doing, and i'm all in on exploring language, software, and startups",
  "what do you want to know?",
];

const topics: Topic[] = [
  {
    id: "coaching",
    chip: "coaching",
    prompt: "tell me about coaching",
    lines: [
      "since my freshman year of high school i've spent over 1,000 hours coaching spelling bee competitors",
      "i'm the first person to coach three consecutive scripps national spelling bee champions (2024 to 2026)",
      "i've been quoted about my experiences in espn, the washington post, usa today, and more",
      "coaching is what first got me into entrepreneurship",
    ],
  },
  {
    id: "onyma",
    chip: "onyma",
    prompt: "what's onyma?",
    lines: [
      "earlier this year i co-founded a word-learning platform used by competitive spelling bee participants",
      "we soft-launched last month, after offering two months of beta access",
      "we got mentioned in ap news, pbs, and more after the 2026 scripps national champion (along with most of the finalists) used our platform extensively",
      "we are the most comprehensive, most efficient, and most engaging spelling and vocabulary practice platform to date",
      "in our first month we scaled to 200 users and over $15k arr",
      { links: [{ label: "onymalearning.com", href: "https://www.onymalearning.com/" }] },
    ],
  },
  {
    id: "quarries",
    chip: "data work",
    prompt: "tell me about the data work",
    lines: [
      "i built an optimization engine for white rock quarries, one of florida's largest producers of limestone aggregates",
      "it evaluated more than one million product combinations against florida dot specifications and customer requirements, for a project with no known solution based on previous company efforts",
      "using log-linear interpolation to standardize sieve sizes and an exhaustive grid search, i found multiple viable blends for an opportunity worth around $10 million",
      "i also built a material testing database so the model can rerun instantly as new lab data comes in",
    ],
  },
  {
    id: "glyphos",
    chip: "what you're building now",
    prompt: "what are you building now?",
    lines: [
      "earlier this summer, i explored whether language models could learn a better way to communicate than tokens, first through discrete glyph programs and later through learned links between their internal representations",
      "check out what i found below",
      { links: [{ label: "glyphos-research.vercel.app", href: "https://glyphos-research.vercel.app/" }] },
      "i also worked on trimference, a scanner that catches wasteful llm patterns in your codebase before they ship ie. runaway agent loops, repeated embeddings, huge contexts, and missing output caps",
      { links: [{ label: "trimference", href: "https://github.com/psamme/trimference" }] },
      "another project i worked on is chatoyant, a local imessage assistant that runs entirely on-device so your messages never leave your laptop",
      "i actually built this just a few days before openai released the apple messages plugin, but some people have found that having a more private, local option like chatoyant is better",
      "so, if u feel the same, try it out and lmk what you think",
      { links: [{ label: "chatoyant", href: "https://github.com/psamme/chatoyant" }] },
      "another thing i've had a lot of fun experimenting with is the meta ray-ban display glasses",
      "i have a few projects in the works, and i think wearable tech has a ton of untapped potential that i'd love to explore",
      "honestly i'm still figuring out what my next chapter looks like. i'm looking to either join a team or start my own, and tackle my next big project before the year is over",
    ],
  },
  {
    id: "reach",
    chip: "how to reach you",
    prompt: "how do i reach you?",
    lines: ["easiest ways to reach me:", { links: reachLinks }],
  },
];

// The other conversations you see when you tap back to the inbox.
// Only Sam's chat is real; the rest are just for flavor (tapping shows a toast).
type Convo = {
  id: string;
  name: string;
  preview: string;
  time: string;
  initials: string;
  color: string;
  real?: boolean;
};

const inbox: Convo[] = [
  {
    id: "sam",
    name: "Sam Evans",
    preview: "what do you want to know?",
    time: "now",
    initials: "SE",
    color: "linear-gradient(160deg,#ac9fc6,#8fa88b)",
    real: true,
  },
  { id: "sophia", name: "Sophia Lopez", preview: "haha ok see you there", time: "Tue", initials: "SL", color: "linear-gradient(160deg,#f0967d,#e0607a)" },
  { id: "blake", name: "Blake Bouwman", preview: "you pulling up tonight?", time: "Tue", initials: "BB", color: "linear-gradient(160deg,#5aa9e6,#3d6fd6)" },
  { id: "sohum", name: "Sohum Sukhatankar", preview: "did you see the new word list", time: "Mon", initials: "SS", color: "linear-gradient(160deg,#7ac29a,#3f9d6d)" },
  { id: "jacob", name: "Jacob Palmer", preview: "gg wp", time: "Sun", initials: "JP", color: "linear-gradient(160deg,#c8a6e8,#8a6fd0)" },
];

/* ============================================================================
   Apple-style SVG glyphs (in place of emoji)
   ========================================================================== */

const IconMessage = (
  <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
    <path d="M12 3.6c-5.2 0-9.4 3.4-9.4 7.6 0 2.4 1.4 4.6 3.5 6-.2 1-.8 2.2-1.6 3 1.5-.1 3-.7 4.2-1.5 1 .3 2.1.5 3.3.5 5.2 0 9.4-3.4 9.4-7.5S17.2 3.6 12 3.6z" fill="currentColor" />
  </svg>
);
const IconVideo = (
  <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
    <rect x="2.5" y="6" width="13" height="12" rx="3.2" fill="currentColor" />
    <path d="M16.5 10.5 20.4 8c.6-.4 1.4 0 1.4.8v6.4c0 .8-.8 1.2-1.4.8l-3.9-2.5z" fill="currentColor" />
  </svg>
);
const IconMail = (
  <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
    <rect x="2.5" y="5" width="19" height="14" rx="3.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
    <path d="M3.5 7.5 12 13l8.5-5.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconSearch = (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.9" />
    <path d="m15 15 4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);
const IconCompose = (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path d="M4 20h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M14.5 4.5 19 9l-8.5 8.5H6V13z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);
const IconPlus = (
  <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
    <path d="M12 5.5v13M5.5 12h13" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);
const IconWave = (
  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <rect x="9.15" y="3.2" width="5.7" height="10.6" rx="2.85" />
      <path d="M6 11.2a6 6 0 0 0 12 0M12 17.5v3.2" />
    </g>
  </svg>
);
const IconChevronLeft = (
  <svg viewBox="0 0 12 20" width="11" height="18" aria-hidden="true">
    <path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconFaceTime = (
  <svg viewBox="0 0 28 18" width="23" height="15" aria-hidden="true">
    <rect x="1.2" y="1.2" width="17" height="15.6" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M19.5 6 26 1.8v14.4L19.5 12z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);
const IconChevronRight = (
  <svg viewBox="0 0 12 20" width="9" height="15" aria-hidden="true">
    <path d="M2 2l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconArrowUp = (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path d="M12 19V6M6 11l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---- FaceTime call controls (crisp, SF-style) ---- */
const IconFtMic = (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
    <path d="M6 11a6 6 0 0 0 12 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 17.2V20.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const IconFtVideo = (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <rect x="2.6" y="6.6" width="13" height="10.8" rx="3" fill="currentColor" />
    <path d="M15.6 10.6 20.3 7.7c.6-.4 1.4.05 1.4.78v7c0 .73-.8 1.18-1.4.78L15.6 13.4z" fill="currentColor" />
  </svg>
);
const IconFtMore = (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <circle cx="5.5" cy="12" r="1.8" fill="currentColor" />
    <circle cx="12" cy="12" r="1.8" fill="currentColor" />
    <circle cx="18.5" cy="12" r="1.8" fill="currentColor" />
  </svg>
);
const IconFtX = (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
  </svg>
);
const IconFtCam = (
  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
    <path d="M4 8.6h2.7L8 6.9h8l1.3 1.7H20V18H4z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="12" cy="12.8" r="2.9" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

/* ============================================================================
   Component
   ========================================================================== */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const typingTime = (line: Line) =>
  typeof line === "string" ? Math.min(680 + line.length * 24, 1900) : 850;

type Msg = { id: number; side: "in" | "out"; text?: string; links?: LinkItem[] };

function Avatar({ className }: { className?: string }) {
  const [ok, setOk] = useState(true);
  if (ok)
    return (
      <span className={`${className ?? ""} imsg-ava`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={CONTACT.photo} alt={CONTACT.name} onError={() => setOk(false)} />
      </span>
    );
  return (
    <div className={className} style={{ background: "linear-gradient(160deg,#ac9fc6,#8fa88b)" }}>
      SE
    </div>
  );
}

export default function Messages() {
  const [view, setView] = useState<"inbox" | "chat">("chat");
  const [contactOpen, setContactOpen] = useState(false);
  const [contactClosing, setContactClosing] = useState(false);
  const [facetime, setFacetime] = useState<null | "ringing" | "connected" | "ended">(null);
  const [ftDuration, setFtDuration] = useState("0:00");
  const [ftElapsed, setFtElapsed] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(false);
  const [asked, setAsked] = useState<string[]>([]);

  const idRef = useRef(0);
  const startedRef = useRef(false);
  const mountedRef = useRef(true);
  const threadRef = useRef<HTMLDivElement>(null);
  const ftVideoRef = useRef<HTMLVideoElement>(null);
  const ftStartRef = useRef(0);

  const push = (msg: Omit<Msg, "id">) =>
    setMessages((prev) => [...prev, { ...msg, id: idRef.current++ }]);

  async function samSay(lines: Line[]) {
    setBusy(true);
    for (const line of lines) {
      setTyping(true);
      await sleep(typingTime(line));
      if (!mountedRef.current) return;
      setTyping(false);
      if (typeof line === "string") push({ side: "in", text: line });
      else push({ side: "in", links: line.links });
      await sleep(540);
      if (!mountedRef.current) return;
    }
    setBusy(false);
  }

  function ask(topic: Topic) {
    if (busy) return;
    track("topic_selected", { topic: topic.id });
    push({ side: "out", text: topic.prompt });
    setAsked((a) => [...a, topic.id]);
    void samSay(topic.lines);
  }

  useEffect(() => {
    mountedRef.current = true;
    if (!startedRef.current) {
      startedRef.current = true;
      void samSay(intro);
    }
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const remaining = topics.filter((t) => !asked.includes(t.id));
  const showChips = !busy && !typing && messages.length > 0;

  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    // scroll after layout settles so the newest message clears the buttons
    const id = requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
    return () => cancelAnimationFrame(id);
  }, [messages, typing, view, busy, showChips, remaining.length]);

  useEffect(() => {
    if (facetime === "ringing") {
      const t = setTimeout(() => mountedRef.current && setFacetime("connected"), 2000);
      return () => clearTimeout(t);
    }
  }, [facetime]);

  useEffect(() => {
    if (facetime === "connected") {
      ftStartRef.current = Date.now();
      setFtElapsed(0);
      const v = ftVideoRef.current;
      if (v) {
        v.muted = true;
        void v.play().catch(() => {});
      }
      const tick = setInterval(() => {
        if (mountedRef.current) setFtElapsed(Math.round((Date.now() - ftStartRef.current) / 1000));
      }, 1000);
      return () => clearInterval(tick);
    }
    if (facetime === "ended") {
      const t = setTimeout(() => mountedRef.current && setFacetime(null), 2200);
      return () => clearTimeout(t);
    }
  }, [facetime]);

  const fmtDuration = (secs: number) =>
    `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;

  function endCall() {
    if (facetime === "connected") {
      const secs = Math.max(1, Math.round((Date.now() - ftStartRef.current) / 1000));
      setFtDuration(fmtDuration(secs));
      setFacetime("ended");
    } else {
      setFacetime(null);
    }
  }

  function closeContact() {
    if (contactClosing) return;
    setContactClosing(true);
    setTimeout(() => {
      if (!mountedRef.current) return;
      setContactOpen(false);
      setContactClosing(false);
    }, 340); // matches the slide-down animation duration
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => mountedRef.current && setToast(null), 2400);
  }

  return (
    <main className="imsg-page">
      <aside className="imsg-aside">
        <h1 className="imsg-aside-title">my story, as a text thread</h1>
        <p className="imsg-aside-body">
          tap a suggestion to hear about what i&apos;ve been working on. give the contact photo or
          facetime a try too.
        </p>
      </aside>

      <div className="imsg-phone">
        {/* ---------------- INBOX ---------------- */}
        {view === "inbox" && (
          <div className="imsg-screen">
            <header className="imsg-inbox-head">
              <div className="imsg-inbox-topbar">
                <span className="imsg-inbox-edit">Edit</span>
                <span className="imsg-inbox-compose">{IconCompose}</span>
              </div>
              <h1 className="imsg-inbox-title">Messages</h1>
              <div className="imsg-search" aria-hidden="true">
                {IconSearch} <span>Search</span>
                <span className="imsg-search-mic">{IconWave}</span>
              </div>
            </header>
            <ul className="imsg-list">
              {inbox.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className="imsg-list-row"
                    onClick={() =>
                      c.real
                        ? setView("chat")
                        : showToast("that conversation is private. sam's is the one you want")
                    }
                  >
                    <span className="imsg-unread" style={{ opacity: c.real ? 1 : 0 }} />
                    {c.real ? (
                      <Avatar className="imsg-list-avatar" />
                    ) : (
                      <span className="imsg-list-avatar" style={{ background: c.color }}>
                        {c.initials}
                      </span>
                    )}
                    <span className="imsg-list-text">
                      <span className="imsg-list-top">
                        <span className="imsg-list-name">{c.name}</span>
                        <span className="imsg-list-time">{c.time}</span>
                      </span>
                      <span className="imsg-list-preview">{c.preview}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ---------------- CHAT ---------------- */}
        {view === "chat" && (
          <div className="imsg-screen">
            <header className="imsg-header">
              <button type="button" className="imsg-back" aria-hidden="true" tabIndex={-1}>
                {IconChevronLeft}
              </button>
              <button type="button" className="imsg-contact" onClick={() => { track("contact_opened"); setContactOpen(true); }}>
                <Avatar className="imsg-avatar" />
                <span className="imsg-contact-name">
                  {CONTACT.name} <span className="imsg-contact-chev" aria-hidden="true">{IconChevronRight}</span>
                </span>
              </button>
              <button type="button" className="imsg-header-ft" onClick={() => { track("facetime_started", { from: "header" }); setFacetime("ringing"); }} aria-label="FaceTime Sam">
                {IconFaceTime}
              </button>
            </header>

            <div className="imsg-thread" ref={threadRef}>
              <div className="imsg-timestamp">iMessage · today</div>
              {messages.map((m, i) => {
                const next = messages[i + 1];
                const isLastOfGroup =
                  !next || next.side !== m.side || (m.side === "in" && typing && i === messages.length - 1);
                return (
                  <div key={m.id} className={`imsg-row ${m.side} ${isLastOfGroup ? "tail" : ""}`}>
                    {m.links ? (
                      <div className="imsg-bubble in links">
                        {m.links.map((l) => (
                          <a
                            key={l.label}
                            href={l.href}
                            target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                            rel={l.href.startsWith("mailto:") ? undefined : "noreferrer"}
                            className="imsg-link"
                          >
                            {l.label}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className={`imsg-bubble ${m.side}`}>{m.text}</div>
                    )}
                  </div>
                );
              })}
              {typing && (
                <div className="imsg-row in tail">
                  <div className="imsg-bubble in typing" aria-label="Sam is typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}
            </div>

            <div className="imsg-composer">
              {showChips && (
                <div className="imsg-chips">
                  {remaining.map((t) => (
                    <button key={t.id} type="button" className="imsg-chip" onClick={() => ask(t)}>
                      {t.chip}
                    </button>
                  ))}
                  {remaining.length === 0 && (
                    <span className="imsg-chip-note">that&apos;s the whole story. tap the contact photo up top for more</span>
                  )}
                </div>
              )}
              <div className="imsg-inputbar" aria-hidden="true">
                <div className="imsg-plus">{IconPlus}</div>
                <div className="imsg-input">
                  <span>{busy ? "sam is typing" : "iMessage"}</span>
                  <span className="imsg-input-wave">{IconWave}</span>
                </div>
                <div className="imsg-send">{IconArrowUp}</div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- CONTACT CARD ---------------- */}
        {contactOpen && (
          <div
            className={`imsg-sheet-scrim ${contactClosing ? "closing" : ""}`}
            onClick={closeContact}
          >
            <div className="imsg-sheet" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="imsg-sheet-close" onClick={closeContact}>
                Done
              </button>
              <Avatar className="imsg-sheet-avatar" />
              <h2 className="imsg-sheet-name">{CONTACT.name}</h2>
              <div className="imsg-sheet-actions">
                <button type="button" onClick={closeContact}>
                  <span className="ic">{IconMessage}</span>message
                </button>
                <button
                  type="button"
                  onClick={() => {
                    track("facetime_started", { from: "contact_card" });
                    setContactOpen(false);
                    setContactClosing(false);
                    setFacetime("ringing");
                  }}
                >
                  <span className="ic">{IconVideo}</span>video
                </button>
                <a href={`mailto:${CONTACT.email}`}>
                  <span className="ic">{IconMail}</span>mail
                </a>
              </div>
              <dl className="imsg-sheet-info">
                <div>
                  <dt>from</dt>
                  <dd>{CONTACT.location}</dd>
                </div>
                <div>
                  <dt>birthday</dt>
                  <dd>{CONTACT.birthday}</dd>
                </div>
                <div>
                  <dt>email</dt>
                  <dd className="link">{CONTACT.email}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* ---------------- FACETIME ---------------- */}
        {facetime && (
          <div className={`imsg-ft ${facetime}`}>
            {facetime === "connected" ? (
              <>
                <video
                  ref={ftVideoRef}
                  className="imsg-ft-video"
                  src={CONTACT.facetimeVideo}
                  autoPlay
                  muted
                  playsInline
                  onEnded={endCall}
                />
                {/* top-left name pill */}
                <div className="imsg-ft-namepill">
                  <Avatar className="imsg-ft-namepill-ava" />
                  <span className="imsg-ft-namepill-name">{CONTACT.name}</span>
                  <span className="imsg-ft-namepill-chev" aria-hidden="true">{IconChevronRight}</span>
                </div>

                {/* top-right circle button */}
                <button type="button" className="imsg-ft-tr" aria-label="Full screen" />

                {/* right-side vertical control stack */}
                <div className="imsg-ft-stack">
                  <button type="button" className="imsg-ft-round green" aria-label="Camera">{IconFtVideo}</button>
                  <button type="button" className="imsg-ft-round white" aria-label="Mute microphone">{IconFtMic}</button>
                  <button type="button" className="imsg-ft-round more" aria-label="More">{IconFtMore}</button>
                  <button type="button" className="imsg-ft-round end" onClick={endCall} aria-label="End call">{IconFtX}</button>
                </div>

                {/* self-view PiP (your camera), bottom-left */}
                <div className="imsg-ft-pip">
                  <span className="imsg-ft-pip-label">You</span>
                  <span className="imsg-ft-pip-flip" aria-hidden="true">{IconFtCam}</span>
                </div>
              </>
            ) : (
              <div className="imsg-ft-bg" style={{ backgroundImage: `url(${CONTACT.photo})` }} />
            )}

            <div className="imsg-ft-inner">
              {facetime === "ringing" && (
                <>
                  <Avatar className="imsg-ft-avatar" />
                  <h2>{CONTACT.name}</h2>
                  <p className="imsg-ft-status">Connecting&hellip;</p>
                </>
              )}
              {facetime === "ended" && (
                <>
                  <Avatar className="imsg-ft-avatar" />
                  <h2>{CONTACT.name}</h2>
                  <p className="imsg-ft-status">Call Ended</p>
                  <p className="imsg-ft-duration">{ftDuration}</p>
                </>
              )}
              {facetime === "ringing" && (
                <button type="button" className="imsg-ft-end" onClick={endCall} aria-label="End call">
                  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
                    <path
                      d="M12 9c-2.5 0-4.9.4-7 1.2-.7.3-1.2 1-1.2 1.7v2.1c0 .5.4.9.9.9.4 0 .8-.3.9-.7l.5-1.8c.1-.4.4-.7.8-.8 1.4-.4 2.8-.6 4.2-.6s2.8.2 4.2.6c.4.1.7.4.8.8l.5 1.8c.1.4.5.7.9.7.5 0 .9-.4.9-.9v-2.1c0-.7-.5-1.4-1.2-1.7-2.1-.8-4.5-1.2-7-1.2z"
                      fill="#fff"
                      transform="rotate(135 12 12)"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {toast && <div className="imsg-toast">{toast}</div>}
      </div>
    </main>
  );
}
