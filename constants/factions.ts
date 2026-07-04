export type Allegiance = 'Space Marines' | 'Imperium' | 'Chaos' | 'Xenos';

export const FACTIONS: Record<Allegiance, string[]> = {
  'Space Marines': ['Space Marines'],
  Imperium: [
    'Astra Militarum',
    'Adeptus Mechanicus',
    'Adepta Sororitas',
    'Adeptus Custodes',
    'Grey Knights',
    'Imperial Knights',
    'Agents of the Imperium',
  ],
  Chaos: [
    'Chaos Space Marines',
    'Death Guard',
    'Thousand Sons',
    'World Eaters',
    "Emperor's Children",
    'Chaos Daemons',
    'Chaos Knights',
  ],
  Xenos: [
    'Orks',
    'Necrons',
    'Tyranids',
    'Aeldari',
    'Drukhari',
    'Tau Empire',
    'Genestealer Cults',
    'Leagues of Votann',
  ],
};

// Only these Space Marine chapters have their own codex supplement.
export const SPACE_MARINE_CHAPTERS = [
  'Blood Angels',
  'Dark Angels',
  'Space Wolves',
  'Black Templars',
  'Deathwatch',
] as const;

export function isSpaceMarines(army: string): boolean {
  return army === 'Space Marines';
}

const ARMY_TO_ALLEGIANCE: Record<string, Allegiance> = {};
for (const [allegiance, armies] of Object.entries(FACTIONS)) {
  for (const army of armies) ARMY_TO_ALLEGIANCE[army] = allegiance as Allegiance;
}

export function getAllegiance(army: string): Allegiance | 'Unassigned' {
  return ARMY_TO_ALLEGIANCE[army] ?? 'Unassigned';
}
