import { useEffect, useState } from "react";
import { useLang } from "../lib/i18n.js";
import { Icon } from "../components/ui.jsx";
import { REPO } from "../components/Sidebar.jsx";
import { TUTORIAL_CATEGORIES } from "../data/tutorials.js";

const thumb = id => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
const watch = id => `https://www.youtube.com/watch?v=${id}`;

export default function TutorialsPage() {
  const { lang, t } = useLang();
  const [cat, setCat] = useState("all");
  const [vlang, setVlang] = useState("all");

  useEffect(() => {
    document.documentElement.style.setProperty("--h", 25);
    document.documentElement.style.setProperty("--cc", 0.13);
  }, []);

  const cats = TUTORIAL_CATEGORIES.filter(c => cat === "all" || c.id === cat);
  const chip = on => `h-8 rounded-full border px-3 text-[0.82rem] ${on ? "border-transparent bg-accent-soft font-medium text-accent-ink" : "border-line text-muted hover:text-fg"}`;

  return (
    <div className="mx-auto grid max-w-[1040px] grid-cols-[minmax(0,1fr)] gap-8 px-8 pb-16 pt-[22px] max-[860px]:px-4 max-[860px]:pt-3.5">
      <title>{`${t.tutoTitle} · PokeMMO Dex`}</title>
      <div className="flex items-center gap-2.5">
        <a href="#/" className="inline-flex h-[34px] items-center gap-1.5 rounded-[10px] border border-line bg-panel px-3 text-[0.82rem] text-muted hover:text-fg">{Icon.left}{t.back}</a>
      </div>

      <div className="max-w-[62ch]">
        <h1 className="text-balance text-[clamp(2rem,4.6vw,3.2rem)] font-light leading-none tracking-[-0.045em]">{t.tutoTitle}</h1>
        <p className="mt-3 text-muted">{t.tutoIntro}</p>
      </div>

      <div className="grid gap-2">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={t.tutoTopics}>
          <button type="button" aria-pressed={cat === "all"} className={chip(cat === "all")} onClick={() => setCat("all")}>{t.tutoAll}</button>
          {TUTORIAL_CATEGORIES.map(c => (
            <button key={c.id} type="button" aria-pressed={cat === c.id} className={chip(cat === c.id)} onClick={() => setCat(c.id)}>{c[lang]}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={t.tutoLang}>
          <span className="mr-1 text-[0.8rem] text-faint">{t.tutoLang} :</span>
          {[["all", t.tutoAllLangs], ["fr", "Français"], ["en", "English"]].map(([v, l]) => (
            <button key={v} type="button" aria-pressed={vlang === v} className={chip(vlang === v)} onClick={() => setVlang(v)}>{l}</button>
          ))}
        </div>
      </div>

      {cats.map(c => {
        const videos = c.videos.filter(v => vlang === "all" || v.lang === vlang);
        if (!videos.length) return null;
        return (
          <section key={c.id}>
            <h2 className="eyebrow mb-4">{c[lang]}</h2>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
              {videos.map(v => (
                <li key={v.yt}>
                  <a href={watch(v.yt)} target="_blank" rel="noreferrer" className="group grid h-full overflow-hidden rounded-2xl border border-line bg-panel hover:border-accent">
                    <span className="relative block aspect-video max-w-full overflow-hidden bg-sunk">
                      <img src={thumb(v.yt)} alt="" loading="lazy" className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" onError={e => { e.currentTarget.style.display = "none"; }} />
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="grid size-11 place-items-center rounded-full bg-black/60 text-white transition-colors group-hover:bg-[oklch(0.58_0.21_27)]">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                        </span>
                      </span>
                      <span className="absolute left-2 top-2 rounded-md bg-black/65 px-1.5 py-0.5 font-mono text-[0.66rem] font-medium uppercase text-white">{v.lang}</span>
                    </span>
                    <span className="flex items-start justify-between gap-2 px-3.5 py-3">
                      <span className="text-[0.92rem] font-medium leading-snug">{v[lang]}</span>
                      <span className="mt-0.5 flex-none text-faint group-hover:text-accent-ink" aria-hidden="true">↗</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <p className="border-t border-line pt-4 text-[0.82rem] text-faint">
        {t.tutoNote}{" "}
        <a className="text-accent-ink underline underline-offset-4" href={REPO + "/issues"} target="_blank" rel="noreferrer">{t.tutoSuggest}</a>
      </p>
    </div>
  );
}
