export interface Node {
  data: string;

  left: Rope;
  right: Rope;
}

export type Leaf = "_leaf";

export type Rope =
  Leaf | Node;

export const empty = (): Rope => "_leaf";
