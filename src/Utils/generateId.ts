import { nanoid } from 'nanoid';

export const generateId = (size: number = 10) => {
  // Nano ID Collision https://zelark.github.io/nano-id-cc/
  return nanoid(size);
};
