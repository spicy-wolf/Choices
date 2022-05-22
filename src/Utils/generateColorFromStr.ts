export const generateColorFromStr = (str: string) => {
  const strPad = str.padStart(32, ' ');
  let hash: number = 0;
  for (const char of strPad) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
};
