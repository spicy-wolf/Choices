import { ComponentList } from '.';

// e.g. "v1" | "v2" | "next"
export type ComponentVersions = 'v1';

export type AbstractComponentType = {
  type: keyof typeof ComponentList;
  id?: string;
  condition?: string;
  v?: ComponentVersions;
};
