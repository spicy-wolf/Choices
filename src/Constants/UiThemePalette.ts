import brown from '@mui/material/colors/brown';
import deepPurple from '@mui/material/colors/deepPurple';
import blue from '@mui/material/colors/blue';
import lightGreen from '@mui/material/colors/lightGreen';
import orange from '@mui/material/colors/orange';
import red from '@mui/material/colors/red';
import { PaletteOptions } from '@mui/material/styles/createPalette';

const UiThemePalette: { [key: string]: PaletteOptions } = {
  brown: {
    primary: { main: brown[500] },
    secondary: { main: red[400] },
  },
  deepPurple: {
    primary: { main: deepPurple[300] },
    secondary: { main: lightGreen[600] },
  },
  blue: {
    primary: { main: blue[300] },
    secondary: { main: orange[500] },
  },
};

export { UiThemePalette };
