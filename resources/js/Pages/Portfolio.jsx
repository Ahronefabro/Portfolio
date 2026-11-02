import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import ContactForm from '../Components/ContactForm';
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';
import ProjectsSection from '../Components/ProjectsSection';
import ScrollProgress from '../Components/ScrollProgress';
import SectionTitle from '../Components/SectionTitle';
import useScrollReveal from '../hooks/useScrollReveal';

const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

const skillGroups = [
  { title: 'Front-end', style: 'solid', items: ['HTML5', 'Tailwind CSS', 'JavaScript', 'CSS3'] },
  { title: 'App & back-end', style: 'solid', items: ['Flutter', 'Dart', 'Firebase', 'Laravel', 'PHP', 'MySQL'] },
  { title: 'Tools', style: 'outline', items: ['Git & GitHub', 'VS Code', 'Figma', 'Chrome DevTools'] },
  { title: 'Soft skills', style: 'dashed', items: ['Communication', 'Teamwork', 'Problem solving', 'Time management'] },
];

const skillChip = {
  solid: 'rounded-md bg-ink px-3 py-1 text-paper dark:bg-chalk dark:text-night',
  outline: 'rounded-md border border-ink/20 px-3 py-1 dark:border-chalk/20',
  dashed: 'rounded-md border border-dashed border-accent px-3 py-1 dark:border-ember',
};

const education = [
  { years: '2024 – Present', title: 'Bachelor of Science in Information Technology', school: 'Urdaneta City University', current: true },
  { years: '2017 – 2023', title: 'Junior & Senior High School', school: 'Lananpin National High School' },
  { years: '2011 – 2017', title: 'Elementary', school: 'Lananpin Elementary School' },
];

const profileCode = `{
  "role": "Aspiring Web Developer",
  "studying": "BS Information Technology",
  "learning": ["Flutter", "Laravel", "Tailwind"],
  "open_to": "OJT / Internship"
}`;

const marqueeText = 'HTML5 ✦ Tailwind CSS ✦ CSS3 ✦ JavaScript ✦ Flutter ✦ Laravel ✦ Accessibility ✦ Responsive Design ✦ UI / UX ✦';

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const stagger = (i) => ({ '--d': `${i * 120}ms` });

// Profile card that types itself out
function TypedCode() {
  const [length, setLength] = useState(() => (reduceMotion() ? profileCode.length : 0));

  useEffect(() => {
    if (reduceMotion()) return;
    const introDelay = document.documentElement.classList.contains('no-intro') ? 0 : 1300; // matches --intro in CSS
    let pos = 0;
    let timer;

    function typeNext() {
      pos++;
      setLength(pos);
      if (pos < profileCode.length) {
        timer = setTimeout(typeNext, profileCode[pos - 1] === '\n' ? 140 : 22); // small pause at each new line
      }
    }
    timer = setTimeout(typeNext, introDelay + 1300);
    return () => clearTimeout(timer);
  }, []);

  // The invisible full text keeps the card at its final height while the visible copy types over it
  return (
    <pre aria-hidden="true" className="relative overflow-x-auto whitespace-pre-wrap break-words leading-7 xl:whitespace-pre">
      <code className="invisible">{profileCode}</code>
      <span className="absolute inset-0">
        <code>{profileCode.slice(0, length)}</code><span className="type-cursor">▍</span>
      </span>
    </pre>
  );
}

function Hero() {
  const heroRef = useRef(null);

  // Spotlight follows the mouse (desktop only)
  function moveSpotlight(e) {
    if (reduceMotion() || !window.matchMedia('(pointer: fine)').matches) return;
    const rect = heroRef.current.getBoundingClientRect();
    heroRef.current.style.setProperty('--x', `${e.clientX - rect.left}px`);
    heroRef.current.style.setProperty('--y', `${e.clientY - rect.top}px`);
  }

  // Split the name into letters for the rise animation
  let letterIndex = 0;
  const nameWords = 'Ahrone B. Fabro'.split(' ');

  return (
    <section id="home" ref={heroRef} onPointerMove={moveSpotlight} className="relative scroll-mt-20 overflow-hidden">
      <div className="spotlight" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-[1.3fr_1fr] md:py-28">
        <div>
          <p data-hero="" style={{ '--d': '0s' }} className="font-mono text-sm text-accent dark:text-ember">// hello, I'm</p>
          <h1 className="mt-3 text-5xl font-bold leading-[1.15] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="sr-only">Ahrone B. Fabro</span>
            <span aria-hidden="true">
              {nameWords.map((word, w) => (
                <span key={word}>
                  <span className="word-mask">
                    {[...word].map((letter) => (
                      <span key={letterIndex} className="char" style={{ '--i': letterIndex++ }}>{letter}</span>
                    ))}
                  </span>
                  {w < nameWords.length - 1 && ' '}
                </span>
              ))}
            </span>
          </h1>
          <p data-hero="" style={{ '--d': '.7s' }} className="mt-6 max-w-xl text-lg text-ink/75 dark:text-chalk/75">IT student who builds websites and applications that are clean, fast, and easy for everyone to use.</p>
          <div data-hero="" style={{ '--d': '.9s' }} className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="group rounded-md bg-accent px-6 py-3 font-medium text-white transition hover:bg-ink dark:bg-ember dark:text-night dark:hover:bg-chalk">
              View my projects <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a href="#contact" className="rounded-md border border-ink/20 px-6 py-3 font-medium transition hover:border-ink dark:border-chalk/20 dark:hover:border-chalk">Get in touch</a>
          </div>
        </div>

        <div data-hero="" style={{ '--d': '1.1s' }} className="min-w-0 rounded-xl border border-ink/15 bg-white p-6 font-mono text-sm shadow-[6px_6px_0_0_var(--color-ink)] dark:border-chalk/15 dark:bg-white/5 dark:shadow-[6px_6px_0_0_var(--color-ember)]">
          <p className="mb-4 flex items-center justify-between border-b border-ink/10 pb-3 text-xs text-ink/70 dark:border-chalk/10 dark:text-chalk/70">
            <span>profile.json</span><span aria-hidden="true">● ● ●</span>
          </p>
          <p className="sr-only">Profile: aspiring web developer studying BS Information Technology, learning Flutter, Laravel and Tailwind, open to OJT or internship.</p>
          <TypedCode />
        </div>
      </div>
    </section>
  );
}

export default function Portfolio({ projects }) {
  useScrollReveal([projects]);

  return (
    <>
      <Head title="Portfolio" />

      <div className="intro-curtain" aria-hidden="true">
        <div className="text-center">
          <p className="font-mono text-5xl font-semibold">AF<span className="text-ember">.</span></p>
          <span className="intro-line" />
        </div>
      </div>
      <div className="grain" aria-hidden="true" />
      <ScrollProgress />

      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-white">Skip to content</a>

      <Navbar links={navLinks} />

      <main id="main">
        <Hero />

        {/* Marquee strip (decorative) */}
        <div className="marquee border-y border-ink/10 bg-ink py-4 text-paper dark:border-chalk/10 dark:bg-chalk dark:text-night" aria-hidden="true">
          <div className="marquee-track font-mono text-sm uppercase tracking-[0.3em]">
            <span>{marqueeText}</span>
            <span>{marqueeText}</span>
          </div>
        </div>

        {/* About */}
        <section id="about" className="scroll-mt-20 border-b border-ink/10 dark:border-chalk/10">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-24 md:grid-cols-[auto_1fr] md:gap-16">
            <div data-reveal="" style={stagger(0)} className="relative size-40 md:size-48">
              <span className="ring-spin absolute -inset-3 rounded-full border-2 border-dashed border-accent dark:border-ember" aria-hidden="true" />
              <img src="/images/profile.jpg" alt="Photo of Ahrone B. Fabro" width="1024" height="1024" loading="lazy" decoding="async" className="size-full rounded-full object-cover" />
            </div>
            <div data-reveal="" style={stagger(1)}>
              <SectionTitle number="01" label="about" title="About me" reveal={false} />
              <p className="mt-6 max-w-2xl text-lg text-ink/75 dark:text-chalk/75">I'm Ahrone, a BS Information Technology student at Urdaneta City University. I started in 2024 after getting curious about how the apps and websites I used every day were actually put together and I've been building my own ever since. Most of my time goes into front-end work: HTML, Tailwind CSS, and JavaScript, plus Figma when a project starts as a design.</p>
              <p className="mt-4 max-w-2xl text-lg text-ink/75 dark:text-chalk/75">Right now I'm learning Flutter and Laravel so I can build a whole project, not just the part people see. I want my work to load fast and stay easy to read on a phone, not only on a laptop. I'm looking for an OJT or internship where I can build real things with a team and keep learning.</p>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="scroll-mt-20 border-b border-ink/10 dark:border-chalk/10">
          <div className="mx-auto max-w-6xl px-5 py-24">
            <SectionTitle number="02" label="skills" title="What I work with" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {skillGroups.map((group, i) => (
                <article key={group.title} data-reveal="" style={stagger(i)} className="rounded-xl border border-ink/10 bg-white p-6 hover:-translate-y-1.5 hover:shadow-[6px_6px_0_0_var(--color-ink)] dark:border-chalk/10 dark:bg-white/5 dark:hover:shadow-[6px_6px_0_0_var(--color-ember)]">
                  <h3 className="text-lg font-bold">{group.title}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2 font-mono text-sm">
                    {group.items.map((item) => <li key={item} className={skillChip[group.style]}>{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Projects: the dynamic section, loaded from the database */}
        <ProjectsSection projects={projects} />

        {/* Education */}
        <section id="education" className="scroll-mt-20 border-b border-ink/10 dark:border-chalk/10">
          <div className="mx-auto max-w-6xl px-5 py-24">
            <SectionTitle number="04" label="education" title="Education" />
            <ol className="mt-10 max-w-2xl space-y-10 border-l-2 border-ink/15 pl-8 dark:border-chalk/15">
              {education.map((item, i) => (
                <li key={item.title} data-reveal="" style={stagger(i)} className="relative">
                  <span className={`absolute -left-[41px] top-1.5 size-4 rounded-full border-2 border-paper dark:border-night ${item.current ? 'bg-accent dark:bg-ember' : 'bg-ink dark:bg-chalk'}`} aria-hidden="true" />
                  <p className="font-mono text-sm text-accent dark:text-ember">{item.years}</p>
                  <h3 className="mt-1 text-lg font-bold">{item.title}</h3>
                  <p className="text-ink/75 dark:text-chalk/75">{item.school}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 md:grid-cols-2">
            <div data-reveal="" style={stagger(0)}>
              <SectionTitle number="05" label="contact" title="Let's talk" reveal={false} />
              <p className="mt-6 text-lg text-ink/75 dark:text-chalk/75">Open to OJT, internships, and small web projects. Send a message and I'll get back to you.</p>
              <ul className="mt-8 space-y-3 font-mono text-sm">
                <li><a href="mailto:ahronefabro22@gmail.com" className="underline decoration-accent decoration-2 underline-offset-4 dark:decoration-ember">ahronefabro22@gmail.com</a></li>
              </ul>
            </div>
            <div data-reveal="" style={stagger(1)}>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
