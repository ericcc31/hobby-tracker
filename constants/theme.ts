import { Platform } from 'react-native';

// Wet Palette is dark-only by design (see app.json userInterfaceStyle).
export const Colors = {
  background: '#0f0f12',
  surface: '#1b1b20',
  surface2: '#24242b',
  border: '#33333c',
  text: '#ECEDEE',
  textSecondary: '#9BA1A6',
  accent: '#c0392b',
};

export const Stages = [
  'bought',
  'built',
  'primed',
  'painted',
  'based',
  'transfers',
  'finished',
] as const;

export type Stage = (typeof Stages)[number];

export const StageLabels: Record<Stage, string> = {
  bought: 'Bought',
  built: 'Built',
  primed: 'Primed',
  painted: 'Painted',
  based: 'Based',
  transfers: 'Transfers',
  finished: 'Finished',
};

export const StageColors: Record<Stage, string> = {
  bought: '#7a7a82',
  built: '#b9772e',
  primed: '#3672b9',
  painted: '#3e8e5e',
  based: '#8b5fb0',
  transfers: '#c9a227',
  finished: '#d65c8a',
};

// Shared layout numbers for the floating pill nav bar + the Fab that sits beside it.
export const NavBar = {
  height: 68,
  bottom: 28,
  sideMargin: 24,
  fabSize: 56,
  fabGap: 12,
};

// How much bottom padding scrollable screens need so content clears the floating nav bar.
export const SCREEN_BOTTOM_PADDING = NavBar.bottom + NavBar.height + 24;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    rounded: 'normal',
    mono: 'monospace',
  },
});
