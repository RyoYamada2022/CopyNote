export interface Theme {
  id: string;
  name: string;
  group: 'light' | 'dark';
  colors: {
    preview: string;
    bgPrimary: string;
    bgSecondary: string;
    textPrimary: string;
    textSecondary: string;
    accentColor: string;
  };
}

export const themes: Theme[] = [
  // Light Themes
  {
    id: 'theme-paper',
    name: 'Papel',
    group: 'light',
    colors: {
      preview: '#ffffff',
      bgPrimary: '#f1f1f1',
      bgSecondary: '#ffffff',
      textPrimary: '#202124',
      textSecondary: '#5f6368',
      accentColor: '#fbbc05',
    },
  },
  {
    id: 'theme-sakura',
    name: 'Sakura',
    group: 'light',
    colors: {
      preview: '#FFC0CB',
      bgPrimary: '#FFF0F5',
      bgSecondary: '#ffffff',
      textPrimary: '#581845',
      textSecondary: '#C70039',
      accentColor: '#FF69B4',
    },
  },
  {
    id: 'theme-mint',
    name: 'Menta',
    group: 'light',
    colors: {
      preview: '#98FF98',
      bgPrimary: '#F0FFF4',
      bgSecondary: '#ffffff',
      textPrimary: '#004D40',
      textSecondary: '#00695C',
      accentColor: '#20C997',
    },
  },
  {
    id: 'theme-canary',
    name: 'Canario',
    group: 'light',
    colors: {
      preview: '#FFFF99',
      bgPrimary: '#FFFACD',
      bgSecondary: '#ffffff',
      textPrimary: '#5D4037',
      textSecondary: '#795548',
      accentColor: '#FFCA28',
    },
  },
  {
    id: 'theme-aqua',
    name: 'Aqua',
    group: 'light',
    colors: {
      preview: '#AFEEEE',
      bgPrimary: '#E0FFFF',
      bgSecondary: '#ffffff',
      textPrimary: '#006064',
      textSecondary: '#00838F',
      accentColor: '#00BCD4',
    },
  },
  // Dark Themes
  {
    id: 'theme-graphite',
    name: 'Grafito',
    group: 'dark',
    colors: {
      preview: '#313235',
      bgPrimary: '#202124',
      bgSecondary: '#313235',
      textPrimary: '#e8eaed',
      textSecondary: '#a8b0b6',
      accentColor: '#fbbc05',
    },
  },
  {
    id: 'theme-onyx',
    name: 'Ónix',
    group: 'dark',
    colors: {
      preview: '#1C1C1E',
      bgPrimary: '#000000',
      bgSecondary: '#1C1C1E',
      textPrimary: '#FFFFFF',
      textSecondary: '#98989f',
      accentColor: '#0A84FF',
    },
  },
  {
    id: 'theme-midnight',
    name: 'Medianoche',
    group: 'dark',
    colors: {
      preview: '#172a45',
      bgPrimary: '#0a192f',
      bgSecondary: '#172a45',
      textPrimary: '#ccd6f6',
      textSecondary: '#a0a8c4',
      accentColor: '#64ffda',
    },
  },
  {
    id: 'theme-sunset',
    name: 'Atardecer',
    group: 'dark',
    colors: {
      preview: '#402b4b',
      bgPrimary: '#2c1e33',
      bgSecondary: '#402b4b',
      textPrimary: '#f5e3ff',
      textSecondary: '#e0c0ed',
      accentColor: '#FD6A02',
    },
  },
  {
    id: 'theme-plum',
    name: 'Ciruela',
    group: 'dark',
    colors: {
      preview: '#2a002a',
      bgPrimary: '#1a001a',
      bgSecondary: '#2a002a',
      textPrimary: '#f0e6f0',
      textSecondary: '#c0a0c0',
      accentColor: '#a040a0',
    },
  },
];
