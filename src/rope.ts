export interface Node {
  left: Rope;
  right: Rope;
}

export type Leaf = string;

export type Rope = Leaf | Node;

export const empty = (): Rope => "";

export const fromString = (data: string): Rope => data;

export const isLeaf = (rope: Rope): rope is Leaf => typeof rope === "string";

export const length = (rope: Rope): number =>
  isLeaf(rope) ? rope.length : length(rope.left) + length(rope.right);

export const concat = (left: Rope, right: Rope): Rope =>
  left === ""
    ? right
    : right === ""
    ? left
    : {
        left,
        right,
      };

export const charAt = (index: number) => (rope: Rope): string => {
  if (isLeaf(rope)) {
    return rope[index];
  } else {
    const leftLen = length(rope.left);
    return leftLen < index
      ? charAt(index - leftLen)(rope.right)
      : charAt(index)(rope.left);
  }
};
