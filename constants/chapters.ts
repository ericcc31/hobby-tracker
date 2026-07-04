export const SPACE_MARINE_CHAPTERS = [
  'Blood Angels',
  'Dark Angels',
  'Space Wolves',
  'Black Templars',
  'Deathwatch',
] as const;

export function isSpaceMarines(army: string): boolean {
  return army.trim().toLowerCase() === 'space marines';
}
