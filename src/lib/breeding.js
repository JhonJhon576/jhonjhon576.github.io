import { ALL, STATS, ABILITY_RATINGS, familyRoot, family, genderInfo, RARITIES } from "./data.js";

export const NATURES = {
  Hardy: [null, null, "Hardi"], Lonely: ["atk", "def", "Solo"], Brave: ["atk", "spe", "Brave"], Adamant: ["atk", "spa", "Rigide"], Naughty: ["atk", "spd", "Mauvais"],
  Bold: ["def", "atk", "Assuré"], Docile: [null, null, "Docile"], Relaxed: ["def", "spe", "Relax"], Impish: ["def", "spa", "Malin"], Lax: ["def", "spd", "Lâche"],
  Timid: ["spe", "atk", "Timide"], Hasty: ["spe", "def", "Pressé"], Serious: [null, null, "Sérieux"], Jolly: ["spe", "spa", "Jovial"], Naive: ["spe", "spd", "Naïf"],
  Modest: ["spa", "atk", "Modeste"], Mild: ["spa", "def", "Doux"], Quiet: ["spa", "spe", "Discret"], Bashful: [null, null, "Pudique"], Rash: ["spa", "spd", "Foufou"],
  Calm: ["spd", "atk", "Calme"], Gentle: ["spd", "def", "Gentil"], Sassy: ["spd", "spe", "Malpoli"], Careful: ["spd", "spa", "Prudent"], Quirky: [null, null, "Bizarre"],
};
export const natureFor = (plus, minus) => Object.keys(NATURES).find(k => NATURES[k][0] === plus && NATURES[k][1] === minus);
export const natName = (k, lang) => (lang === "fr" ? NATURES[k][2] : k);
export const natFx = (k, t) => {
  const [p, m] = NATURES[k];
  return p ? `+${t.short[p]} −${t.short[m]}` : t.neutral;
};

export const ABIL_FR = {
  "Stench": "Puanteur", "Drizzle": "Crachin", "Speed Boost": "Turbo", "Battle Armor": "Armurbaston", "Sturdy": "Fermeté", "Damp": "Moiteur", "Limber": "Échauffement",
  "Sand Veil": "Voile Sable", "Static": "Statik", "Volt Absorb": "Absorb Volt", "Water Absorb": "Absorb Eau", "Oblivious": "Benêt", "Cloud Nine": "Ciel Gris",
  "Compound Eyes": "Œil Composé", "Compoundeyes": "Œil Composé", "Insomnia": "Insomnia", "Color Change": "Déguisement", "Immunity": "Vaccin", "Flash Fire": "Torche", "Shield Dust": "Écran Poudre",
  "Own Tempo": "Tempo Perso", "Suction Cups": "Ventouse", "Intimidate": "Intimidation", "Shadow Tag": "Marque Ombre", "Rough Skin": "Peau Dure",
  "Wonder Guard": "Garde Mystik", "Levitate": "Lévitation", "Effect Spore": "Pose Spore", "Synchronize": "Synchro", "Clear Body": "Corps Sain",
  "Natural Cure": "Médic Nature", "Lightning Rod": "Paratonnerre", "Lightningrod": "Paratonnerre", "Serene Grace": "Sérénité", "Swift Swim": "Glissade", "Chlorophyll": "Chlorophylle",
  "Illuminate": "Lumiattirance", "Trace": "Calque", "Huge Power": "Coloforce", "Poison Point": "Point Poison", "Inner Focus": "Attention",
  "Magma Armor": "Armumagma", "Water Veil": "Ignifu-Voile", "Magnet Pull": "Magnépiège", "Soundproof": "Anti-Bruit", "Rain Dish": "Cuvette",
  "Sand Stream": "Sable Volant", "Pressure": "Pression", "Thick Fat": "Isograisse", "Early Bird": "Matinal", "Flame Body": "Corps Ardent", "Run Away": "Fuite",
  "Keen Eye": "Regard Vif", "Hyper Cutter": "Hyper Cutter", "Pickup": "Ramassage", "Truant": "Absentéisme", "Hustle": "Agitation", "Cute Charm": "Joli Sourire",
  "Plus": "Plus", "Minus": "Minus", "Forecast": "Météo", "Sticky Hold": "Glue", "Shed Skin": "Mue", "Guts": "Cran", "Marvel Scale": "Écaille Spéciale",
  "Liquid Ooze": "Suintement", "Overgrow": "Engrais", "Blaze": "Brasier", "Torrent": "Torrent", "Swarm": "Essaim", "Rock Head": "Tête de Roc",
  "Drought": "Sécheresse", "Arena Trap": "Piège Sable", "Vital Spirit": "Esprit Vital", "White Smoke": "Écran Fumée", "Pure Power": "Force Pure",
  "Shell Armor": "Coque Armure", "Air Lock": "Air Lock", "Tangled Feet": "Pieds Confus", "Motor Drive": "Motorisé", "Rivalry": "Rivalité",
  "Steadfast": "Impassible", "Snow Cloak": "Rideau Neige", "Gluttony": "Gloutonnerie", "Anger Point": "Colérique", "Unburden": "Délestage",
  "Heatproof": "Ignifuge", "Simple": "Simple", "Dry Skin": "Peau Sèche", "Download": "Télécharge", "Iron Fist": "Poing de Fer", "Poison Heal": "Soin Poison",
  "Adaptability": "Adaptabilité", "Skill Link": "Multi-Coups", "Hydration": "Hydratation", "Solar Power": "Force Soleil", "Quick Feet": "Pied Véloce",
  "Normalize": "Normalise", "Sniper": "Sniper", "Magic Guard": "Garde Magik", "No Guard": "Annule Garde", "Stall": "Frein", "Technician": "Technicien",
  "Leaf Guard": "Feuille Garde", "Klutz": "Maladresse", "Mold Breaker": "Brise Moule", "Super Luck": "Chanceux", "Aftermath": "Boom Final",
  "Anticipation": "Anticipation", "Forewarn": "Prédiction", "Unaware": "Inconscient", "Tinted Lens": "Lentiteintée", "Filter": "Filtre",
  "Slow Start": "Début Calme", "Scrappy": "Querelleur", "Storm Drain": "Lavabo", "Ice Body": "Corps Gel", "Solid Rock": "Solide Roc",
  "Snow Warning": "Alerte Neige", "Honey Gather": "Cherche Miel", "Frisk": "Fouille", "Reckless": "Téméraire", "Multitype": "Multi-Type",
  "Flower Gift": "Don Floral", "Bad Dreams": "Mauvais Rêve", "Pickpocket": "Pickpocket", "Sheer Force": "Sans Limite", "Contrary": "Contestation",
  "Unnerve": "Tension", "Defiant": "Acharné", "Defeatist": "Défaitiste", "Cursed Body": "Corps Maudit", "Healer": "Cœur Soin", "Friend Guard": "Garde Amie",
  "Weak Armor": "Armurouillée", "Heavy Metal": "Heavy Metal", "Light Metal": "Light Metal", "Multiscale": "Multiécaille", "Toxic Boost": "Rage Poison",
  "Flare Boost": "Rage Brûlure", "Harvest": "Récolte", "Telepathy": "Télépathe", "Moody": "Lunatique", "Overcoat": "Envelocape", "Poison Touch": "Toxitouche",
  "Regenerator": "Régé-Force", "Big Pecks": "Cœur de Coq", "Sand Rush": "Baigne Sable", "Wonder Skin": "Peau Miracle", "Analytic": "Analyste",
  "Illusion": "Illusion", "Imposter": "Imposteur", "Infiltrator": "Infiltration", "Mummy": "Momie", "Moxie": "Impudence", "Justified": "Cœur Noble",
  "Rattled": "Phobique", "Magic Bounce": "Miroir Magik", "Sap Sipper": "Herbivore", "Prankster": "Farceur", "Sand Force": "Force Sable",
  "Iron Barbs": "Épine de Fer", "Zen Mode": "Mode Transe", "Victory Star": "Victorieux", "Turboblaze": "TurboBrasier", "Teravolt": "Téra-Voltage",
};
export const abilName = (a, lang) => (lang === "fr" ? ABIL_FR[a] || a : a);

// Nature et IV utiles, déduits des stats de l'évolution finale
export function recommend(s) {
  const phys = s.atk >= s.spa, main = phys ? "atk" : "spa", dump = phys ? "spa" : "atk";
  const mixed = Math.abs(s.atk - s.spa) < 12 && Math.max(s.atk, s.spa) >= 80;
  const wall = Math.max(s.atk, s.spa) < 80 && Math.max(s.def, s.spd) >= 85;
  if (wall) {
    const dumpW = s.atk <= s.spa ? "atk" : "spa", plus = s.def >= s.spd ? "def" : "spd", other = plus === "def" ? "spd" : "def";
    return { role: "wall", primary: natureFor(plus, dumpW), alt: natureFor(other, dumpW), useless: [dumpW] };
  }
  const useless = mixed ? [] : [dump];
  if (s.spe >= 70) return { role: phys ? "fastP" : "fastS", primary: natureFor("spe", dump), alt: natureFor(main, dump), useless };
  if (s.spe <= 45) return { role: phys ? "slowP" : "slowS", primary: natureFor(main, dump), alt: natureFor(main, "spe"), useless, trickRoom: true };
  return { role: phys ? "midP" : "midS", primary: natureFor(main, dump), alt: natureFor("spe", dump), useless };
}

// Talents classés selon les notes de Showdown ; le 3e emplacement est le talent caché
export function abilityRanking(p) {
  return p.abilities
    .map((name, i) => (name ? { name, hidden: i === 2, rating: ABILITY_RATINGS[name] ?? 0 } : null))
    .filter(Boolean)
    .filter((a, i, arr) => arr.findIndex(b => b.name === a.name) === i)
    .sort((a, b) => b.rating - a.rating || a.hidden - b.hidden);
}

const HORDE = RARITIES.indexOf("Horde");
export function breedInfo(p) {
  const root = familyRoot(p);
  const fam = family(p);
  const breeder = fam.find(s => !s.eggGroups.includes("cannot breed")) || root;
  const groups = breeder.eggGroups;
  const g = genderInfo(breeder);
  const famIds = new Set(fam.map(s => s.id));
  // Mâles conseillés : même groupe œuf, 50/50, de préférence trouvables en horde
  const males = ALL
    .filter(q => !q.prevo && q.obtainable && q.gender === 127 && !famIds.has(q.id) && q.eggGroups.some(e => groups.includes(e)))
    .map(q => ({ q, horde: q.locs.some(l => l[2] === HORDE) }))
    .sort((a, b) => b.horde - a.horde || a.q.id - b.q.id)
    .slice(0, 8);
  return {
    root, groups, gender: g, males,
    canBreed: !groups.includes("cannot breed") && !groups.includes("ditto"),
    needsDitto: g.kind === "N" || g.kind === "M" || groups.includes("genderless"),
  };
}

// Arbre PokeMMO : chaque parent tient un objet et les deux parents disparaissent.
// Un IV à 31 chez les deux parents passe toujours ; le bracelet verrouille l'IV propre à chaque parent.
// La Pierre Stase est tenue à chaque étape par le parent qui porte la nature.
//
// Le choix des IV à verrouiller à chaque étape est cherché pour équilibrer les Pokémon de base :
// pour un 6×31, ça donne 8/8/4/4/4/4 au lieu de 32/16/8/4/2/1, bien plus simple à réunir.
const merge = (a, b) => { const o = { ...a }; for (const [k, v] of Object.entries(b)) o[k] = (o[k] || 0) + v; return o; };
const spread = leaves => Object.values(leaves).reduce((a, v) => a + v * v, 0);
const without = (T, s) => T.filter(x => x !== s);
const planMemo = new Map();
function plan(T) {
  const key = T.join();
  if (planMemo.has(key)) return planMemo.get(key);
  let best = { leaves: { [T[0]]: 1 }, pick: null };
  if (T.length > 1) {
    let score = Infinity;
    for (const x of T) for (const y of T) {
      if (x === y) continue;
      const leaves = merge(plan(without(T, y)).leaves, plan(without(T, x)).leaves);
      if (spread(leaves) < score) { score = spread(leaves); best = { leaves, pick: [x, y] }; }
    }
  }
  planMemo.set(key, best);
  return best;
}
const natMemo = new Map();
function planNat(T) {
  const key = T.join();
  if (natMemo.has(key)) return natMemo.get(key);
  let best = { leaves: {}, pick: null };
  if (T.length) {
    let score = Infinity;
    for (const x of T) {
      const leaves = merge(planNat(without(T, x)).leaves, plan(T).leaves);
      if (spread(leaves) < score) { score = spread(leaves); best = { leaves, pick: x }; }
    }
  }
  natMemo.set(key, best);
  return best;
}

export function buildTree(ivs, natured) {
  let nid = 0;
  function node(ivs, nat, gender, spine, item) {
    const n = { id: nid++, ivs, nat, gender, spine, item, kids: null };
    if (nat ? ivs.length === 0 : ivs.length <= 1) return n;
    if (nat) {
      const x = planNat(ivs).pick;
      n.kids = [node(without(ivs, x), true, "F", spine, "ever"), node(ivs, false, "M", false, x)];
    } else {
      const [x, y] = plan(ivs).pick;
      n.kids = [node(without(ivs, y), false, "F", spine, x), node(without(ivs, x), false, "M", false, y)];
    }
    return n;
  }
  return node(ivs, natured, null, true, null);
}

export function walk(n, fn) {
  fn(n);
  n.kids?.forEach(k => walk(k, fn));
}

export function planSummary(tree, femaleShare) {
  let breeds = 0, genderSel = 0, rareSel = 0, ever = 0;
  const braces = {}, leaves = [];
  walk(tree, n => {
    if (n.kids) {
      breeds++;
      if (n.id !== 0) { genderSel++; if (n.spine && femaleShare < 0.5) rareSel++; }
    } else leaves.push(n);
    if (n.item === "ever") ever++;
    else if (n.item) braces[n.item] = (braces[n.item] || 0) + 1;
  });
  const braceTotal = Object.values(braces).reduce((a, b) => a + b, 0);
  // Étapes : accouplements groupés par hauteur dans l'arbre
  const steps = [];
  (function collect(n) {
    if (!n.kids) return 0;
    const h = 1 + Math.max(...n.kids.map(collect));
    (steps[h] ||= []).push(n);
    return h;
  })(tree);
  return { breeds, genderSel, rareSel, ever, braces, braceTotal, leaves, steps: steps.filter(Boolean) };
}

export const PRICE_DEFAULTS = { brace: 10000, ever: 0, gender: 5000, rare: 25000 };
export { STATS };
