"use client";

import { useEffect, useRef, useState } from "react";

/* ============================================================================
   EDIT ME  ·  everything you'd want to change lives in this block
   ========================================================================== */

// Your contact card. Drop your photo in  public/sam.jpg  and it shows up
// automatically (until then it falls back to "SE" initials).
const CONTACT = {
  name: "Sam Evans",
  photo: "/sam.jpg",
  phone: "561-402-2249",
  location: "Jacksonville, Florida",
  birthday: "February 6, 2008",
  email: "samuel.c.evans.30@dartmouth.edu",
  textHref: "sms:+15614022249",
  facetimeVideo: "/facetime.mp4", // H.264 transcode of IMG_6425.MOV (universal playback)
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
  { label: "email", href: "mailto:samuel.c.evans.30@dartmouth.edu" },
  { label: "linkedin", href: "https://www.linkedin.com/in/samcevans" },
  { label: "github", href: "https://github.com/psamme" },
  { label: "x", href: "https://x.com/samvsthewxrld" },
  { label: "instagram", href: "https://www.instagram.com/samvsthewrld" },
];

const intro: Line[] = [
  "hey, i'm sam",
  "incoming freshman at dartmouth",
  "i grew up fascinated with words, and when i realized technology could help me play with language in entirely new ways, i was hooked",
  "i landed on spelling bees as an outlet for that curiosity, and building naturally became part of the process for me",
  "had some success competing, but more once i started coaching younger students in high school",
  "somewhere between language, software, and startups i realized that building is what i want to spend my time doing",
  "what do you want to know?",
];

const topics: Topic[] = [
  {
    id: "coaching",
    chip: "coaching",
    prompt: "tell me about coaching",
    lines: [
      "since my freshman year of high school i've spent over 1,000 hours coaching elite spelling bee competitors",
      "i built a comprehensive curriculum covering the linguistic patterns of all the main languages that contribute words to the english dictionary",
      "i'm the first person to coach three consecutive Scripps National Spelling Bee champions (2024 to 2026)",
      "my students have won over $200k in prize money",
      "i've been quoted about my experiences in ESPN, the Washington Post, USA Today, and more",
      "and along the way i made enough profit to cover my first two years of college :)",
    ],
  },
  {
    id: "onyma",
    chip: "onyma",
    prompt: "what's onyma?",
    lines: [
      "earlier this year i co-founded a word-learning platform used by competitive spelling bee participants",
      "we soft-launched last month, after offering two months of beta access",
      "we got mentioned in AP News, PBS, and more after the 2026 Scripps National champion (along with most of the finalists) used our platform extensively",
      "we have the largest spelling and vocabulary practice database on the market",
      "some of our features: AI free-response vocab quizzes for any word list, multiplayer spelling games, and a coaching tool for analyzing mistakes and setting goals",
      "in our first month we scaled to 200 users and over $15k ARR",
      { links: [{ label: "onymalearning.com", href: "https://www.onymalearning.com/" }] },
    ],
  },
  {
    id: "quarries",
    chip: "data work",
    prompt: "tell me about the data work",
    lines: [
      "i built an optimization engine for White Rock Quarries, one of florida's largest producers of limestone aggregates",
      "it evaluated more than one million product combinations against Florida DOT specifications and customer requirements, for a project with no known solution based on existing material data",
      "using log-linear interpolation to standardize sieve sizes and an exhaustive grid search, i found multiple viable blends for an opportunity worth around $10 million",
      "i also built a material testing database so the model can rerun instantly as new lab data comes in",
    ],
  },
  {
    id: "glyphos",
    chip: "what you're building now",
    prompt: "what are you building now?",
    lines: [
      "right now i'm building Glyphos, an optimization layer that reduces the cost of structured AI workflows while protecting output quality",
      "most optimization tools tackle one part of the problem (usually input tokens) and only work well for certain workloads",
      "Glyphos optimizes the entire execution: what goes into the model, what comes out, and the routing, caching, retrieval, and processing in between",
      "it adapts to each workflow and only applies an optimization when it actually beats the existing approach, so you're never forced into a one-size-fits-all compression strategy",
      "if you want to learn more, check out the site and don't hesitate to reach out",
      { links: [{ label: "glyphos.psamm.chatgpt.site", href: "https://glyphos.psamm.chatgpt.site/" }] },
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
const IconPhone = (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path d="M7 2.7 4.3 3.6c-.9.3-1.4 1.2-1.2 2.1C4.3 12.9 9.4 18 16.6 19.4c.9.2 1.8-.3 2.1-1.2l.9-2.6c.2-.7-.1-1.4-.8-1.7l-2.9-1.2c-.6-.2-1.3 0-1.7.5l-.8 1c-1.8-1-3.3-2.5-4.3-4.3l1-.8c.5-.4.7-1.1.5-1.7L9.4 3.5c-.3-.7-1-1-1.7-.8z" fill="currentColor" />
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
      <path d="M5 10v4M9 7.5v9M13 9v6M17 7v10" />
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
  const [facetime, setFacetime] = useState<null | "ringing" | "connected" | "ended">(null);
  const [ftDuration, setFtDuration] = useState("0:00");
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
      const v = ftVideoRef.current;
      if (v)
        v.play().catch(() => {
          v.muted = true;
          void v.play();
        });
    }
    if (facetime === "ended") {
      const t = setTimeout(() => mountedRef.current && setFacetime(null), 2200);
      return () => clearTimeout(t);
    }
  }, [facetime]);

  function endCall() {
    if (facetime === "connected") {
      const secs = Math.max(1, Math.round((Date.now() - ftStartRef.current) / 1000));
      setFtDuration(`${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`);
      setFacetime("ended");
    } else {
      setFacetime(null);
    }
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
              <button type="button" className="imsg-contact" onClick={() => setContactOpen(true)}>
                <Avatar className="imsg-avatar" />
                <span className="imsg-contact-name">
                  {CONTACT.name} <span className="imsg-contact-chev" aria-hidden="true">{IconChevronRight}</span>
                </span>
              </button>
              <button type="button" className="imsg-header-ft" onClick={() => setFacetime("ringing")} aria-label="FaceTime Sam">
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
                  <button type="button" className="imsg-chip ghost" onClick={() => setFacetime("ringing")}>
                    facetime me
                  </button>
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
          <div className="imsg-sheet-scrim" onClick={() => setContactOpen(false)}>
            <div className="imsg-sheet" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="imsg-sheet-close" onClick={() => setContactOpen(false)}>
                Done
              </button>
              <Avatar className="imsg-sheet-avatar" />
              <h2 className="imsg-sheet-name">{CONTACT.name}</h2>
              <div className="imsg-sheet-actions">
                <button type="button" onClick={() => setContactOpen(false)}>
                  <span className="ic">{IconMessage}</span>message
                </button>
                <a href={`tel:${CONTACT.phone.replace(/[^\d+]/g, "")}`}>
                  <span className="ic">{IconPhone}</span>call
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setContactOpen(false);
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
                  <dt>phone</dt>
                  <dd className="link">{CONTACT.phone}</dd>
                </div>
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
              <video
                ref={ftVideoRef}
                className="imsg-ft-video"
                src={CONTACT.facetimeVideo}
                autoPlay
                playsInline
                onEnded={endCall}
              />
            ) : (
              <div className="imsg-ft-bg" style={{ backgroundImage: `url(${CONTACT.photo})` }} />
            )}

            <div className="imsg-ft-inner">
              {facetime === "ringing" && (
                <>
                  <Avatar className="imsg-ft-avatar" />
                  <h2>{CONTACT.name}</h2>
                  <p className="imsg-ft-status">FaceTime</p>
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
              {facetime !== "ended" && (
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
