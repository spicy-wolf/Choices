import brown from '@mui/material/colors/brown';
import deepPurple from '@mui/material/colors/deepPurple';
import blue from '@mui/material/colors/blue';
import lightGreen from '@mui/material/colors/lightGreen';
import orange from '@mui/material/colors/orange';
import red from '@mui/material/colors/red';
import { PaletteOptions } from '@mui/material/styles/createPalette';

enum ThemeModes {
  Light = 'light',
  Dark = 'dark',
}

enum UiThemePaletteNames {
  Brown = 'brown',
  DeepPurple = 'deepPurple',
  Blue = 'blue',
}

const UiThemePalette: { [key in `${UiThemePaletteNames}`]: PaletteOptions } = {
  [UiThemePaletteNames.Brown]: {
    primary: { main: brown[500] },
    secondary: { main: red[400] },
  },
  [UiThemePaletteNames.DeepPurple]: {
    primary: { main: deepPurple[300] },
    secondary: { main: lightGreen[600] },
  },
  [UiThemePaletteNames.Blue]: {
    primary: { main: blue[300] },
    secondary: { main: orange[500] },
  },
};
enum ContentThemePaletteNames {
  Dark = 'dark',
  LightGrey = 'lightGrey',
  Matcha = 'matcha',
  LightYellow = 'lightYellow',
}

const ContentThemePalette: {
  [key in `${ContentThemePaletteNames}`]: {
    backgroundColor: React.CSSProperties['backgroundColor'];
    color: React.CSSProperties['color'];
  };
} = {
  [ContentThemePaletteNames.Dark]: {
    backgroundColor: '#1d1f21',
    color: '#c5c8c6',
  },
  [ContentThemePaletteNames.LightGrey]: {
    backgroundColor: '#f9f9f9',
    color: '#000000de',
  },
  [ContentThemePaletteNames.Matcha]: {
    backgroundColor: '#dcedc8',
    color: '#000000de',
  },
  [ContentThemePaletteNames.LightYellow]: {
    backgroundColor: '#fffde7',
    color: '#000000de',
  },
};

export {
  UiThemePalette,
  ContentThemePalette,
  ThemeModes,
  UiThemePaletteNames,
  ContentThemePaletteNames,
};
