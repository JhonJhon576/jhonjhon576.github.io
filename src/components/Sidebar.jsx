import { useEffect, useRef } from "react";
import { TYPES, pad } from "../lib/data.js";
import { nameOf, typeName, useLang } from "../lib/i18n.js";
import { href } from "../lib/router.js";
import { Dropdown, Icon, Sprite } from "./ui.jsx";

export const REPO = "https://github.com/rayan-studio/PokeMmoDex";

export default function Sidebar({ filters, setFilters, visible, currentId, onToggleTheme }) {
  const { lang, t, setLang } = useLang();
  const listRef = useRef(null);
  const searchRef = useRef(null);
  const set = patch => setFilters(f => ({ ...f, ...patch }));
  const dirty = filters.q || filters.gen || filters.type || filters.sort !== "num-asc" || filters.obtainable;

  // Garde la ligne sélectionnée visible
  useEffect(() => {
    listRef.current?.querySelector(`[data-id="${currentId}"]`)?.scrollIntoView({ block: "nearest" });
  }, [currentId]);

  // Ctrl/Cmd + K : recherche
  useEffect(() => {
    const onKey = e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); searchRef.current?.focus(); searchRef.current?.select(); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const onListKey = e => {
    const a = e.target.closest("a[data-id]");
    if (!a) return;
    const li = a.parentElement;
    const next = e.key === "ArrowDown" ? li.nextElementSibling : e.key === "ArrowUp" ? li.previousElementSibling : null;
    const b = next?.querySelector("a[data-id]");
    if (b) { e.preventDefault(); b.focus(); b.click(); }
  };

  const sortKeys = Object.keys(t.sort);
  return (
    <aside className="flex min-h-0 flex-col border-r border-line bg-panel max-[860px]:border-r-0">
      <div className="grid gap-3 border-b border-line px-[18px] pb-3 pt-[18px]">
        <div className="flex items-center gap-2.5">
          <a href="#/" className="flex items-center gap-2.5 font-medium tracking-tight">
            <span className="relative size-5 flex-none overflow-hidden rounded-full border-[1.5px] border-fg">
              <span className="absolute inset-x-0 top-0 h-1/2 border-b-[1.5px] border-fg bg-accent" />
              <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-fg bg-panel" />
            </span>
            {t.siteTitle}
          </a>
          <span className="flex-1" />
          <button type="button" onClick={() => setLang(lang === "fr" ? "en" : "fr")} aria-label={t.langLabel} className="grid h-[30px] min-w-[30px] place-items-center rounded-lg border border-line px-2 text-[0.76rem] font-medium text-muted hover:bg-sunk hover:text-fg">
            {t.langBtn}
          </button>
          <button type="button" onClick={onToggleTheme} aria-label={t.theme} className="grid h-[30px] min-w-[30px] place-items-center rounded-lg border border-line text-muted hover:bg-sunk hover:text-fg">
            {Icon.moon}
          </button>
        </div>

        <label className="relative">
          <span className="sr-only">{t.searchLabel}</span>
          <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-faint">{Icon.search}</span>
          <input
            ref={searchRef}
            id="search"
            type="search"
            autoComplete="off"
            spellCheck={false}
            value={filters.q}
            placeholder={t.search}
            onChange={e => set({ q: e.target.value })}
            onKeyDown={e => {
              if (e.key === "Enter" && visible[0]) location.hash = href({ page: "pokemon", id: visible[0].id }).slice(1);
              if (e.key === "ArrowDown") { e.preventDefault(); listRef.current?.querySelector("a[data-id]")?.focus(); }
            }}
            className="h-[42px] w-full rounded-[11px] border border-transparent bg-sunk pl-[38px] pr-3 text-[0.95rem] placeholder:text-faint focus:border-accent focus:bg-panel focus:outline-none"
          />
        </label>

        <div className="flex flex-wrap gap-1.5">
          <Dropdown
            label={t.region}
            value={filters.gen}
            active={!!filters.gen}
            onChange={v => set({ gen: v })}
            options={[{ value: "", label: t.allRegions }, { sep: true }, ...t.regions.map((r, i) => ({ value: String(i + 1), label: r, tag: `Gen ${i + 1}` }))]}
          />
          <Dropdown
            label={t.type}
            value={filters.type}
            active={!!filters.type}
            onChange={v => set({ type: v })}
            options={[{ value: "", label: t.allTypes }, { sep: true }, ...Object.keys(TYPES).map(k => ({ value: k, label: typeName(k, lang), color: TYPES[k].col }))]}
          />
          <Dropdown
            label={t.sortLbl}
            value={filters.sort}
            active={filters.sort !== "num-asc"}
            onChange={v => set({ sort: v })}
            options={[...sortKeys.slice(0, 3).map(k => ({ value: k, label: t.sort[k] })), { sep: true }, ...sortKeys.slice(3).map(k => ({ value: k, label: t.sort[k] }))]}
          />
          <button
            type="button"
            aria-pressed={filters.obtainable}
            onClick={() => set({ obtainable: !filters.obtainable })}
            className={`h-8 rounded-full border px-3 text-[0.82rem] transition-colors ${filters.obtainable ? "border-transparent bg-accent-soft text-accent-ink" : "border-line text-muted hover:bg-sunk hover:text-fg"}`}
          >
            {t.obtainable}
          </button>
        </div>
      </div>

      <div className="flex justify-between px-[18px] pb-1.5 pt-2.5 text-[0.74rem] uppercase tracking-[0.09em] text-faint">
        <span>{t.showing(visible.length)}</span>
        {dirty && (
          <button type="button" className="uppercase tracking-[0.09em] hover:text-fg" onClick={() => setFilters({ q: "", gen: "", type: "", sort: "num-asc", obtainable: false })}>
            {t.reset}
          </button>
        )}
      </div>

      <ul ref={listRef} onKeyDown={onListKey} className="min-h-0 flex-1 overflow-y-auto px-2 pb-4 [scrollbar-width:thin]">
        {visible.length ? (
          visible.map(p => (
            <li key={p.id} className="[content-visibility:auto] [contain-intrinsic-size:46px]">
              <a
                href={href({ page: "pokemon", id: p.id })}
                data-id={p.id}
                aria-current={p.id === currentId ? "true" : undefined}
                className={`group grid w-full grid-cols-[38px_40px_minmax(0,1fr)_auto] items-center gap-2 rounded-[10px] py-[3px] pl-2 pr-2.5 ${p.id === currentId ? "bg-accent-soft" : "hover:bg-sunk"}`}
              >
                <span className={`font-mono text-[0.72rem] tabular-nums ${p.id === currentId ? "text-accent-ink" : "text-faint"}`}>{pad(p.id)}</span>
                <span className="grid size-10 place-items-center"><Sprite p={p} className="size-10" /></span>
                <span className={`truncate text-[0.93rem] ${p.obtainable ? "" : "text-faint"}`}>{nameOf(p, lang)}</span>
                <span className="flex gap-[3px]">
                  {p.types.map(ty => <i key={ty} title={typeName(ty, lang)} className="size-2 rounded-full" style={{ background: TYPES[ty].col }} />)}
                </span>
              </a>
            </li>
          ))
        ) : (
          <li className="px-[18px] py-10 text-center text-[0.9rem] text-muted">{t.noMatch}</li>
        )}
      </ul>

      <footer className="border-t border-line px-[18px] py-3 text-[0.74rem] text-faint">
        <nav className="flex flex-wrap gap-x-3 gap-y-1">
          <a className="hover:text-fg" href="#/a-propos">{t.footer.about}</a>
          <a className="hover:text-fg" href="#/mentions-legales">{t.footer.legal}</a>
          <a className="hover:text-fg" href="#/confidentialite">{t.footer.privacy}</a>
          <a className="hover:text-fg" href="#/cookies">{t.footer.cookies}</a>
          <a className="inline-flex items-center gap-1 hover:text-fg" href={REPO} target="_blank" rel="noreferrer">{Icon.github}{t.footer.source}</a>
        </nav>
      </footer>
    </aside>
  );
}

