import type { CSSProperties } from "react";

const links = [
  ["linkedin", "https://www.linkedin.com/in/samcevans"],
  ["github", "https://github.com/psamme"],
  ["x", "https://x.com/samvsthewxrld"],
  ["instagram", "https://www.instagram.com/samvsthewrld"],
  ["email", "mailto:samuel.c.evans.30@dartmouth.edu"],
] as const;

const work = [
  {
    number: "01",
    title: "Onyma",
    role: "co-founder & ceo",
    description:
      "The spelling and vocabulary platform I wish existed when I was competing — from multiplayer practice to AI-powered study tools.",
    note: "$10k ARR in month one · used by the 2026 Scripps champion",
    href: "https://www.onymalearning.com/",
  },
  {
    number: "02",
    title: "Spelling",
    role: "coach & curriculum builder",
    description:
      "I turned years of pattern-spotting into the curriculum behind three consecutive national champions — a first in Scripps history.",
    note: "$200k+ in student winnings · three straight champions",
    href: null,
  },
  {
    number: "03",
    title: "Optimization",
    role: "quantitative analyst",
    description:
      "For a $20M rock-blending problem with no known solution, I built an engine that tested more than a million material combinations.",
    note: "1M+ combinations · Florida DOT specifications",
    href: null,
  },
  {
    number: "04",
    title: "Language tools",
    role: "ongoing experiments",
    description:
      "Phonetic analysis, word-rarity models, and other small systems for finding the hidden structure inside language and learning.",
    note: "Python · NLP · a few unnamed side quests",
    href: null,
  },
] as const;

const blocks = [
  ["sage", "5%", "0%", "32%", "13%", "-3deg", "0.1s", "-34deg"],
  ["lavender", "39%", "0%", "23%", "20%", "4deg", "0.35s", "26deg"],
  ["sage", "65%", "0%", "29%", "11%", "-5deg", "0.6s", "-24deg"],
  ["lavender", "8%", "14%", "21%", "18%", "5deg", "0.8s", "30deg"],
  ["sage", "31%", "20%", "34%", "12%", "-2deg", "1.05s", "-22deg"],
  ["lavender", "68%", "12%", "24%", "22%", "6deg", "1.25s", "38deg"],
  ["sage", "4%", "34%", "34%", "15%", "2deg", "1.5s", "-30deg"],
  ["lavender", "41%", "34%", "20%", "19%", "-5deg", "1.75s", "25deg"],
  ["sage", "63%", "36%", "32%", "13%", "4deg", "2s", "-25deg"],
  ["lavender", "8%", "51%", "24%", "21%", "-4deg", "2.2s", "32deg"],
  ["sage", "35%", "53%", "27%", "14%", "3deg", "2.45s", "-35deg"],
  ["lavender", "65%", "52%", "27%", "19%", "-2deg", "2.7s", "27deg"],
  ["sage", "4%", "69%", "30%", "13%", "5deg", "2.95s", "-24deg"],
  ["lavender", "37%", "70%", "25%", "17%", "-4deg", "3.2s", "33deg"],
  ["sage", "66%", "72%", "29%", "12%", "3deg", "3.45s", "-28deg"],
] as const;

type BlockStyle = CSSProperties & {
  "--left": string;
  "--bottom": string;
  "--width": string;
  "--height": string;
  "--rotation": string;
  "--delay": string;
  "--spin": string;
};

export default function Home() {
  return (
    <main className="portfolio-shell">
      <section className="content-panel">
        <header className="masthead">
          <a className="wordmark" href="#top" id="top" aria-label="Sam Evans, home">
            sam evans<span aria-hidden="true">.</span>
          </a>
          <nav className="socials" aria-label="Social links">
            {links.map(([label, href]) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
              >
                {label}<span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
        </header>

        <section className="story" aria-labelledby="story-title">
          <p className="eyebrow">builder · student · language obsessive</p>
          <h1 id="story-title">
            I find hidden patterns,<br />
            then build with them.
          </h1>
          <div className="story-copy">
            <p>
              I grew up fascinated by words. Spelling bees became the outlet, and
              the little tools I made to study them became something bigger: a
              love for designing systems that help people learn.
            </p>
            <p>
              Now I&apos;m a first-year at Dartmouth, building at the edge of
              language, software, and startups — following the curiosity wherever
              it goes, whether it&apos;s about words or not.
            </p>
          </div>
        </section>

        <section className="work-section" aria-labelledby="work-title">
          <div className="section-heading">
            <h2 id="work-title">Selected work</h2>
            <span>2022—now</span>
          </div>
          <div className="work-grid">
            {work.map((item) => {
              const content = (
                <>
                  <div className="work-topline">
                    <span>{item.number}</span>
                    <span>{item.role}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <small>{item.note}</small>
                </>
              );

              return item.href ? (
                <a
                  className="work-card"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  key={item.number}
                  aria-label={`${item.title}: ${item.role}`}
                >
                  {content}
                </a>
              ) : (
                <article className="work-card" key={item.number}>
                  {content}
                </article>
              );
            })}
          </div>
        </section>

        <footer className="footer-line">
          <span>currently in Hanover, NH</span>
          <a href="mailto:samuel.c.evans.30@dartmouth.edu">let&apos;s make something ↗</a>
        </footer>
      </section>

      <aside className="block-stage" aria-hidden="true">
        <div className="stage-label">
          <span>things in motion</span>
          <span>↓</span>
        </div>
        <div className="fall-zone">
          {blocks.map(([tone, left, bottom, width, height, rotation, delay, spin], index) => (
            <span
              className={`metal-block ${tone}`}
              key={index}
              style={{
                "--left": left,
                "--bottom": bottom,
                "--width": width,
                "--height": height,
                "--rotation": rotation,
                "--delay": delay,
                "--spin": spin,
              } as BlockStyle}
            />
          ))}
        </div>
        <p className="stage-note">language / systems / software / learning</p>
      </aside>
    </main>
  );
}
