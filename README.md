# PokeMMO Dex

Un Pokédex simple pour PokeMMO : les 649 Pokémon des générations 1 à 5, en français et en anglais.

- Recherche par nom (FR ou EN, avec ou sans accents) ou par numéro (`94`, `094`, `#94`)
- Filtres par région, par type, et tri par stats
- Fiche détaillée : stats de base (hexagone + barres), dégâts reçus pour les 17 types, évolutions
- Navigation au clavier : `Ctrl K` pour chercher, `↑` `↓` dans la liste, `←` `→` pour passer au Pokémon précédent ou suivant
- Lien direct vers un Pokémon avec son numéro : `…/#94`
- Thème clair et sombre

## Mise en ligne avec GitHub Pages

1. Settings → Pages
2. Source : **Deploy from a branch**, branche `main`, dossier `/ (root)`
3. Le site sera disponible à `https://rayan-studio.github.io/PokeMmoDex/`

## Données

- Types et stats : [@pkmn/dex](https://www.npmjs.com/package/@pkmn/dex) (données Smogon/Showdown) en Génération 5, la base de PokeMMO, sans le type Fée.
- Noms français : paquet npm `pokemon`.
- Sprites : sprites Noir & Blanc de Pokémon Showdown.

PokeMMO n'a pas d'API publique. Les ajustements propres au jeu (tiers, hordes, lieux de capture) ne sont pas inclus.
