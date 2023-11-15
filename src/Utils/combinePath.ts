// https://stackoverflow.com/questions/29855098/is-there-a-built-in-javascript-function-similar-to-os-path-join/29855282#29855282
export function combinePath(...parts: string[]) {
  const separator = '/';
  const replace = new RegExp(separator + '{1,}', 'g');
  return parts.join(separator).replace(replace, separator);
}
