import { useEffect } from "react";
import { ENCOUNTERS, LOCATIONS, METHODS, TYPES, pad } from "../lib/data.js";
import { locName, nameOf, useLang } from "../lib/i18n.js";
import { href } from "../lib/router.js";
import { Icon, Section, Sprite, TypePill } from "../components/ui.jsx";
import { RarityChip } from "./LocationsTab.jsx";

export default function LocationPage({ locKey }) {
  const { lang, t } = useLang();
  const loc = LOCATIONS[locKey];
  const list = ENCOUNTERS[locKey] || [];

  // Teinte du lieu : celle du type le plus présent
  useEffect(() => {
    if (!list.length) return;
    const count = {};
    list.forEach(e => (count[e.p.types[0]] = (count[e.p.types[0]] || 0) + 1));
    const top = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
    document.documentElement.style.setProperty("--h", TYPES[top].h);
    document.documentElement.style.setProperty("--cc", Math.max(TYPES[top].c, 0.05));
  }, [locKey]);

  if (!loc) {
    return (
      <div className="grid h-full place-items-center p-8 text-center text-muted">
        <div><p>{t.unknownLocation}</p><a className="mt-3 inline-block text-accent-ink underline" href="#/">{t.home}</a></div>
      </div>
    );
  }

  const byMethod = new Map();
  for (const e of [...list].sort((a, b) => a.rarity - b.rarity || a.min - b.min || a.p.id - b.p.id)) {
    if (!byMethod.has(e.method)) byMethod.set(e.method, []);
    byMethod.get(e.method).push(e);
  }
  const name = locName(loc, lang);

  return (
    <div className="mx-auto grid max-w-[980px] grid-cols-[minmax(0,1fr)] gap-8 px-8 pb-14 pt-[22px] max-[860px]:px-4 max-[860px]:pt-3.5">
      <title>{`${name} · ${t.regions[loc.region]} · PokeMMO Dex`}</title>
      <div className="flex items-center gap-2.5">
        <button type="button" onClick={() => history.back()} className="inline-flex h-[34px] items-center gap-1.5 rounded-[10px] border border-line bg-panel px-3 text-[0.82rem] text-muted hover:text-fg">
          {Icon.left}{t.back}
        </button>
        <span className="font-mono text-[0.78rem] text-muted">{t.locationPage} · {t.regions[loc.region]}</span>
      </div>

      <div className="flex items-end gap-4">
        <span className="grid size-[76px] flex-none place-items-center rounded-[20px] bg-accent-soft text-accent-ink [&_svg]:size-8">{Icon.pin}</span>
        <div>
          <h1 className="text-balance text-[clamp(1.9rem,4.4vw,3.2rem)] font-light leading-none tracking-[-0.045em]">{name}</h1>
          <p className="mt-1.5 text-muted">{lang === "fr" ? loc.en : loc.fr} · {t.encountersHere(new Set(list.map(e => e.p.id)).size)}</p>
        </div>
      </div>

      {[...byMethod.entries()].map(([method, rows]) => (
        <Section key={method} title={t.methods[METHODS[method]] || METHODS[method]} aside={String(rows.length)}>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-2">
            {rows.map((e, i) => (
              <li key={i}>
                <a href={href({ page: "pokemon", id: e.p.id, tab: "lieux" })} className="flex items-center gap-3 rounded-2xl border border-line bg-panel px-3 py-2 hover:border-accent">
                  <span className="grid size-12 flex-none place-items-center"><Sprite p={e.p} className="size-12" /></span>
                  <span className="grid min-w-0 flex-1 gap-1">
                    <span className="flex items-baseline gap-2">
                      <span className="truncate font-medium">{nameOf(e.p, lang)}</span>
                      <span className="font-mono text-[0.72rem] text-faint">#{pad(e.p.id)}</span>
                    </span>
                    <span className="flex flex-wrap items-center gap-1.5">
                      <RarityChip r={e.rarity} />
                      <span className="font-mono text-[0.74rem] text-faint">{t.levels(e.min, e.max)}</span>
                    </span>
                  </span>
                  <span className="flex flex-col items-end gap-1">{e.p.types.map(ty => <TypePill key={ty} t={ty} size="sm" />)}</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </div>
  );
}
