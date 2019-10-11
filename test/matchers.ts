import { charAt, isLeaf, isRope, length, Rope } from "../src";

// Dangerous debug function. This could get scary fast.
const ropeToString = (rope: Rope): string =>
  isLeaf(rope) ? rope : ropeToString(rope.left) + ropeToString(rope.right);

const inspect = (rope: Rope): string =>
  `{ ${length(rope)} : '${ropeToString(rope)}' }`;

expect.extend({
  toBeEquivalentTo(received: unknown, expected: Rope) {
    if (!isRope(received)) {
      return {
        message: () => `toBeEquivalent only works on ropes`,
        pass: false,
      };
    }

    const expectedLen = length(expected);
    const len = length(received);
    if (expectedLen !== len) {
      return {
        message: () =>
          `Comparing '${inspect(received)}' to '${inspect(
            expected,
          )}'. Expected ropes to have same length (${len} !== ${expectedLen}).`,
        pass: false,
      };
    }

    for (let i = 0; i < len; i++) {
      const charAtI = charAt(i);
      const chReceived = charAtI(received);
      const chExpected = charAtI(expected);
      if (chReceived !== chExpected) {
        return {
          message: () =>
            `expected ropes to have same characters. Mismatch found at index ${i}. ${chReceived} !== ${chExpected}`,
          pass: false,
        };
      }
    }

    return {
      message: () => `expected rope to be equivalent to received rope`,
      pass: true,
    };
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeEquivalentTo(a: Rope): R;
    }
  }
}
