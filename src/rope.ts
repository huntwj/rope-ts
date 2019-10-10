export interface Node {
  left: Rope;
  right: Rope;
}

export type Leaf = string;

export type Rope = Leaf | Node;

export const empty = (): Rope => "";

export const fromString = (data: string): Rope => data;

export const isLeaf = (rope: Rope): rope is Leaf => typeof rope === "string";

export const isNode = (rope: Rope): rope is Node => !isLeaf(rope);

const isNodeRaw = (something: unknown): something is Node =>
  typeof something === "object" &&
  something !== null &&
  isRope((something as Node).left) &&
  isRope((something as Node).right);

export const isRope = (something: unknown): something is Rope =>
  typeof something === "string" || isNodeRaw(something);

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

/**
 * Get a character at a specific index. If you need more that one char, use slice first.
 *
 * @param index the 0-based index of the character to retrieve.
 *
 * @returns the character at that index or undefined if none exists.
 */
export const charAt = (index: number) => (rope: Rope): string => {
  if (isLeaf(rope)) {
    return rope[index];
  } else {
    const leftLen = length(rope.left);
    return leftLen < index + 1
      ? charAt(index - leftLen)(rope.right)
      : charAt(index)(rope.left);
  }
};

/**
 * Retrieve a slice or sub-robe of the given rope
 *
 * The start and end index conventions mirror those of `String.slice`.
 *
 * @param start the inclusive start index
 * @param end the non-include end index
 */
export const slice = (start: number, end: number) => (rope: Rope): Rope => {
  if (end <= start) {
    return empty();
  }

  if (isLeaf(rope)) {
    // We're a leaf, let String handle it.
    return rope.slice(start, end);
  }

  const leftLen = length(rope.left);
  if (start < leftLen) {
    // The slice at least begins on the left hand side.
    if (end < leftLen) {
      // The slice is entirely on the left hand side.
      return slice(start, end)(rope.left);
    } else {
      const leftBit = slice(start, leftLen)(rope.left);
      const rightBit = slice(0, end - leftLen)(rope.right);
      return concat(leftBit, rightBit);
    }
  } else {
    // The slice is entirely on the right hand side.
    return slice(start - leftLen, end - leftLen)(rope.right);
  }
};

export const insertAt = (index: number, other: Rope) => (source: Rope): Rope =>
  concat(
    concat(slice(0, index)(source), other),
    slice(index, length(source))(source),
  );
