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
    title: "Spelling",
    role: "coach & curriculum builder",
    detail: "three consecutive national champions",
    href: null,
  },
  {
    number: "02",
    title: "Onyma",
    role: "co-founder & ceo",
    detail: "$10k ARR in month one",
    href: "https://www.onymalearning.com/",
  },
  {
    number: "03",
    title: "Optimization",
    role: "quantitative analyst",
    detail: "1M+ material combinations tested",
    href: null,
  },
  {
    number: "04",
    title: "Language tools",
    role: "NLP experiments",
    detail: "phonetics, rarity & learning",
    href: null,
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
            {work.map((item) => {
              const content = (
                <>
                  <span className="node-number">{item.number}</span>
                  <span className="node-dot" aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.role}</p>
                  <small>{item.detail}</small>
                </>
              );

              return item.href ? (
                <a
                  className="work-node"
                  data-marble-barrier
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  key={item.number}
                  aria-label={`${item.title}: ${item.role}`}
                >
                  {content}
                </a>
              ) : (
                <article className="work-node" data-marble-barrier key={item.number}>
                  {content}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
