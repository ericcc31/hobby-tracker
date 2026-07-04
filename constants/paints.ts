export type Paint = { name: string; hex: string };

export type PaintRange = {
  brand: 'Citadel' | 'Army Painter';
  range: string;
  paints: Paint[];
};

// Hex values are approximate/representative swatches (Citadel and Army
// Painter don't publish official hex codes) — close enough for a visual
// reference next to the paint name, not a color-matching tool.
export const PAINT_CATALOG: PaintRange[] = [
  {
    brand: 'Citadel',
    range: 'Base',
    paints: [
      { name: 'Abaddon Black', hex: '#1c1c1e' },
      { name: 'Corax White', hex: '#e8e6df' },
      { name: 'Rhinox Hide', hex: '#3b2a1e' },
      { name: 'Mephiston Red', hex: '#7e1416' },
      { name: 'Khorne Red', hex: '#5c0f11' },
      { name: 'Macragge Blue', hex: '#1b3f6e' },
      { name: 'Kantor Blue', hex: '#12233d' },
      { name: 'Caliban Green', hex: '#0f3d24' },
      { name: 'Waaagh! Flesh', hex: '#2e5c1f' },
      { name: 'Retributor Armour', hex: '#9c7a3c' },
      { name: 'Leadbelcher', hex: '#8a8d90' },
      { name: 'Warplock Bronze', hex: '#6b4a2f' },
      { name: 'Ushabti Bone', hex: '#cbb88d' },
      { name: 'Zandri Dust', hex: '#a68a55' },
      { name: 'Averland Sunset', hex: '#e8a93b' },
      { name: 'Screamer Pink', hex: '#c23a7a' },
      { name: 'Naggaroth Night', hex: '#3a2a5c' },
      { name: 'Steel Legion Drab', hex: '#5a5240' },
    ],
  },
  {
    brand: 'Citadel',
    range: 'Layer',
    paints: [
      { name: 'White Scar', hex: '#f5f4f0' },
      { name: 'Evil Sunz Scarlet', hex: '#c22a1e' },
      { name: 'Wild Rider Red', hex: '#a3181a' },
      { name: 'Troll Slayer Orange', hex: '#e0581c' },
      { name: 'Flash Gitz Yellow', hex: '#f2c92e' },
      { name: 'Yriel Yellow', hex: '#f7e017' },
      { name: 'Sotek Green', hex: '#0f6e5c' },
      { name: 'Warpstone Glow', hex: '#23a343' },
      { name: 'Teclis Blue', hex: '#3fa3d1' },
      { name: 'Hoeth Blue', hex: '#2f6fae' },
      { name: 'Alaitoc Blue', hex: '#274b7d' },
      { name: 'Fenrisian Grey', hex: '#7d97a3' },
      { name: 'Ironbreaker', hex: '#a8abae' },
      { name: 'Runefang Steel', hex: '#c7cacd' },
      { name: 'Auric Armour Gold', hex: '#c9962c' },
      { name: 'Sycorax Bronze', hex: '#8a6b3d' },
      { name: 'Cadian Fleshtone', hex: '#c98a63' },
      { name: 'Kislev Flesh', hex: '#d9a880' },
    ],
  },
  {
    brand: 'Citadel',
    range: 'Shade',
    paints: [
      { name: 'Nuln Oil', hex: '#17161a' },
      { name: 'Agrax Earthshade', hex: '#4a3826' },
      { name: 'Reikland Fleshshade', hex: '#7a4a1e' },
      { name: 'Seraphim Sepia', hex: '#8a5a26' },
      { name: 'Carroburg Crimson', hex: '#5c1a2a' },
      { name: 'Drakenhof Nightshade', hex: '#1f2f4a' },
      { name: 'Biel-Tan Green', hex: '#1f4a2a' },
      { name: 'Athonian Camoshade', hex: '#4a4a1f' },
      { name: 'Casandora Yellow', hex: '#a8842a' },
    ],
  },
  {
    brand: 'Citadel',
    range: 'Contrast',
    paints: [
      { name: 'Black Templar', hex: '#1a1a1e' },
      { name: 'Blood Angels Red', hex: '#8c1c1c' },
      { name: 'Space Wolves Grey', hex: '#5a6b73' },
      { name: 'Talassar Blue', hex: '#1c4a8c' },
      { name: 'Ork Flesh', hex: '#3d6b1f' },
      { name: 'Wyldwood', hex: '#5a3a1e' },
      { name: 'Skeleton Horde', hex: '#cbb87a' },
      { name: 'Aggaros Dunes', hex: '#8a6a3a' },
      { name: 'Gore-Grunta Fur', hex: '#4a3626' },
      { name: 'Snakebite Leather', hex: '#7a5a2e' },
      { name: 'Iyanden Yellow', hex: '#e0b52a' },
      { name: 'Terradon Turquoise', hex: '#1f8a7a' },
    ],
  },
  {
    brand: 'Citadel',
    range: 'Technical',
    paints: [
      { name: 'Blood for the Blood God', hex: '#7a0f12' },
      { name: 'Nihilakh Oxide', hex: '#4a8a7a' },
      { name: 'Typhus Corrosion', hex: '#4a3c2e' },
      { name: 'Astrogranite', hex: '#4a4844' },
      { name: 'Armageddon Dust', hex: '#6b5a3e' },
      { name: "Nurgle's Rot", hex: '#4a5c1f' },
      { name: 'Lahmian Medium', hex: '#d8d0c0' },
    ],
  },
  {
    brand: 'Citadel',
    range: 'Dry',
    paints: [
      { name: 'Necron Compound', hex: '#3a4a4a' },
      { name: 'Terminatus Stone', hex: '#b0a894' },
      { name: 'Administratum Grey', hex: '#8a8a82' },
      { name: 'Ushabti Bone Dry', hex: '#d8c8a0' },
      { name: 'Screaming Skull', hex: '#e8ddc0' },
    ],
  },
  {
    brand: 'Army Painter',
    range: 'Warpaints Fanatic',
    paints: [
      { name: 'Matt Black', hex: '#1a1a1a' },
      { name: 'Matt White', hex: '#f0f0ec' },
      { name: 'Wolf Grey', hex: '#8a8f94' },
      { name: 'Skeleton Bone', hex: '#d8c8a0' },
      { name: 'Angel Green', hex: '#2a6b3a' },
      { name: 'Army Green', hex: '#4a5c2e' },
      { name: 'Necrotic Flesh', hex: '#6a7a4a' },
      { name: 'Dragon Red', hex: '#8a1a1a' },
      { name: 'Greedy Gold', hex: '#b8933a' },
      { name: 'Plate Mail Metal', hex: '#9a9d9f' },
      { name: 'Gun Metal', hex: '#4a4d50' },
      { name: 'Ultramarine Blue', hex: '#1a3a7a' },
      { name: 'Lava Orange', hex: '#d9531e' },
    ],
  },
  {
    brand: 'Army Painter',
    range: 'Fanatic Washes',
    paints: [
      { name: 'Dark Tone', hex: '#2a2420' },
      { name: 'Strong Tone', hex: '#5a4526' },
      { name: 'Soft Tone', hex: '#8a6a3a' },
      { name: 'Military Shader', hex: '#3a3a2a' },
      { name: 'Red Tone', hex: '#5c1a1a' },
      { name: 'Blue Tone', hex: '#1a2a4a' },
    ],
  },
  {
    brand: 'Army Painter',
    range: 'Speedpaint 2.0',
    paints: [
      { name: 'Wardog Brown', hex: '#5c3a20' },
      { name: 'Dragon Red', hex: '#8a1a1a' },
      { name: 'Bloodveil Red', hex: '#6b0f14' },
      { name: 'Fanatic Blue', hex: '#1c4a7a' },
      { name: 'Fangsblood Purple', hex: '#5a1f5c' },
      { name: 'Ash Grey', hex: '#6a6a66' },
      { name: 'Herugrim Forest', hex: '#1f4a2a' },
      { name: 'Goblin Green', hex: '#3a7a2a' },
      { name: 'Zealot Yellow', hex: '#d9b32a' },
      { name: 'Sedna Skin', hex: '#c98a63' },
    ],
  },
];

export function getPaintHex(name: string): string | undefined {
  for (const range of PAINT_CATALOG) {
    const match = range.paints.find((p) => p.name === name);
    if (match) return match.hex;
  }
  return undefined;
}
