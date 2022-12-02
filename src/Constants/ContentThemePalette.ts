import React from 'react';

const ContentThemePalette: {
  [key: string]: {
    backgroundColor: React.CSSProperties['backgroundColor'];
    color: React.CSSProperties['color'];
  };
} = {
  dark: {
    backgroundColor: '#1d1f21',
    color: '#c5c8c6',
  },
  lightGrey: {
    backgroundColor: '#f9f9f9',
    color: '#000000de',
  },
  matcha: {
    backgroundColor: '#dcedc8',
    color: '#000000de',
  },
  lightYellow: {
    backgroundColor: '#fffde7',
    color: '#000000de',
  },
};

export { ContentThemePalette };
