import Link from "next/link";
import MarbleField from "./MarbleField";

const links = [
  ["linkedin", "https://www.linkedin.com/in/samcevans"],
  ["github", "https://github.com/psamme"],
  ["x", "https://x.com/samvsthewxrld"],
  ["instagram", "https://www.instagram.com/samvsthewrld"],
  ["onyma", "https://www.onymalearning.com/"],
  ["monkeytype", "https://monkeytype.com/profile/samevans"],
  ["spotify", "https://open.spotify.com/"],
  ["email", "mailto:samuel.c.evans.30@dartmouth.edu"],
] as const;

const work = [
  {
    number: "01",
    title: "Coaching",
    role: "coach & curriculum builder",
    detail: "three consecutive national champions",
    body: "Since my freshman year of high school, I have spent over 1,000 hours coaching elite spelling bee competitors. During my time, I built a comprehensive curriculum covering the linguistic patterns of all of the main languages contributing to words in the English dictionary. I am the first person to coach three consecutive Scripps National Spelling Bee champions (2024-2026), and my students have won over $200k in prize money. I’ve been quoted about my experiences in ESPN, The Washington Post, USA Today, and more. Along the way, I’ve made enough profit to cover my first two years of college :).",
    href: null,
  },
  {
    number: "02",
    title: "Onyma",
    role: "co-founder & ceo",
    detail: "200 users · $15k+ ARR in month one",
    body: "Earlier this year, I co-founded a word-learning platform used by competitive spelling bee participants. We soft-launched last month, after offering two months of beta access, and were mentioned in AP News, PBS, and more after the 2026 Scripps National Spelling Bee Champion (along with the majority of the competition’s finalists) extensively used our platform. We have the largest spelling and vocabulary practice database on the market, and some of our unique features include AI-powered free-response vocab quizzes for any word list, multiplayer spelling games, and a coaching feature for analyzing mistakes and setting goals for learners. In our first month, we scaled to 200 users and over $15k ARR.",
    href: "https://www.onymalearning.com/",
  },
  {
    number: "03",
    title: "Quarries",
    role: "quantitative analyst",
    detail: "$10M opportunity · 1M+ combinations",
    body: "I also built an optimization engine for White Rock Quarries, one of Florida’s largest producers of limestone aggregates. The engine evaluated more than one million product combinations against Florida Department of Transportation specifications and customer requirements for a project with no known solution based on existing material data. Using log-linear interpolation to standardize sieve sizes and an exhaustive grid search, I identified multiple viable blends for an opportunity worth approximately $10 million. I also built a material testing database that allows the model to be rerun instantly as new lab data becomes available.",
    href: null,
  },
  {
    number: "04",
    title: "Currently",
    role: "building Glyphos",
    detail: "optimization for structured AI workflows",
    body: "Currently, I am building Glyphos, an optimization layer that reduces the cost of structured AI workflows while protecting output quality. Most optimization tools tackle one part of the problem (usually input tokens) and only work well for certain workloads. Glyphos optimizes the entire execution: what goes into the model, what comes out, and the routing, caching, retrieval, and processing in between. It adapts to each workflow and only applies an optimization when it beats the existing approach, so the system benefits without being forced into a one-size-fits-all compression strategy. If you’d like to learn more, check out the website and don’t hesitate to reach out.",
    href: "https://glyphos.psamm.chatgpt.site/",
  },
] as const;

export default function Home() {
  return (
    <main className="site-shell" id="top">
      <MarbleField />

      <div className="site-content">
        <header className="masthead">
          <a className="wordmark" href="#top" aria-label="Sam Evans, home">
            sam evans<span aria-hidden="true">.</span>
          </a>
          <nav className="socials" aria-label="Social links">
            <Link href="/messages" className="socials-imessage">
              imessage
            </Link>
            {links.map(([label, href]) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
              >
                {label}
              </a>
            ))}
          </nav>
        </header>

        <section
          className="story-panel"
          data-marble-barrier
          aria-labelledby="story-title"
        >
          <h1 id="story-title">
            Hi, I’m Sam, an incoming freshman at Dartmouth.
          </h1>
          <div className="story-copy">
            <p>
              I grew up being fascinated with words, and when I realized
              technology could help me play with language in entirely new ways,
              I was hooked.
            </p>
            <p>
              I landed on spelling bees as an outlet for this curiosity, and
              building naturally became a part of that process for me. I had
              some success as a competitor, but more when I started coaching
              younger students in high school. Just earlier this year, I became
              the first person to coach three Scripps National Spelling Bee
              champions consecutively.
            </p>
            <p>
              Along the way, I started building little tools for myself and my
              students, which eventually grew into bigger projects. Somewhere
              between language, software, and startups, I realized that building
              is what I want to spend my time doing, and now I’m chasing that
              curiosity.
            </p>
          </div>
        </section>

        <section className="work-section" aria-labelledby="work-title">
          <h2 id="work-title">work</h2>
          <div className="work-graph">
            <div className="graph-line" data-marble-barrier aria-hidden="true" />
            {work.map((item) => (
              <details className="work-node" data-marble-barrier key={item.number}>
                <summary className="work-summary">
                  <span className="node-number">{item.number}</span>
                  <span className="node-dot" aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.role}</p>
                  <small>{item.detail}</small>
                </summary>
                <div className="work-detail">
                  <p>{item.body}</p>
                  {item.href && (
                    <a href={item.href} target="_blank" rel="noreferrer">
                      {item.title === "Currently" ? "glyphos.psamm.chatgpt.site" : "onymalearning.com"}
                    </a>
                  )}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
