import { pipe } from "fp-ts/lib/pipeable";

import {
  charAt,
  concat,
  empty,
  fromString,
  insertAt,
  isNode,
  isRope,
  length,
  Rope,
  slice,
} from "../src";

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
          `expected ropes to have same length (${len} !== ${expectedLen}).`,
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

const assertSameAsString = (targetString: string) => (r: Rope) => {
  const len = targetString.length;
  expect(length(r)).toBe(len);

  for (let i = 0; i < len; i++) {
    expect(charAt(i)(r)).toBe(targetString[i]);
  }
};

describe("isNode", () => {
  it("should return false for strings (they are leaves)", () => {
    expect(isNode("test")).toBe(false);
  });

  it("should return true for non-string Ropes", () => {
    expect(isNode({ left: "something", right: "else" })).toBe(true);
  });
});

describe("isRope", () => {
  it("should return false for numbers", () => {
    expect(isRope(2)).toBe(false);
  });

  it("shouldreturn false for functions", () => {
    expect(isRope(() => 4)).toBe(false);
  });

  it("should return false for objects without a left property", () => {
    expect(isRope({ right: empty() })).toBe(false);
  });

  it("should return false for objects without a right property", () => {
    expect(isRope({ left: empty() })).toBe(false);
  });

  it("should return false when left is not a Rope", () => {
    expect(isRope({ left: 4, right: empty() })).toBe(false);
  });

  it("should return false when right is not a Rope", () => {
    expect(isRope({ left: empty(), right: 4 })).toBe(false);
  });

  it("shoudl return true for strings", () => {
    expect(isRope("a string")).toBe(true);
  });

  it("should gracefully return false when left is null", () => {
    expect(isRope({ left: null, right: "right" })).toBe(false);
  });

  it("should gracefully return false when left is null", () => {
    expect(isRope({ left: "left", right: null })).toBe(false);
  });
});

describe("Empty Ropes", () => {
  it("should create an empty rope", () => {
    expect(empty()).not.toBeUndefined();
  });

  it("should be consistent when empty", () => {
    expect(empty()).toEqual(empty());
  });

  it("should have length 0", () => {
    expect(length(empty())).toBe(0);
  });

  it("empty concat empty should still be empty", () => {
    expect(concat(empty(), empty())).toBeEquivalentTo(empty());
  });

  it("should return undefined for all charAt calls", () => {
    expect(charAt(0)(empty())).toBeUndefined();
    expect(charAt(1)(empty())).toBeUndefined();
  });
});

describe("Short Ropes", () => {
  const test = "test string";
  const rope = fromString(test);
  const test2 = "1234";
  const rope2 = fromString(test2);

  it("should be able to create a rope from a string", () => {
    expect(rope).not.toEqual(empty());

    assertSameAsString(test)(rope);
  });

  it("should differentiate between different ropes", () => {
    expect(fromString("something")).not.toBeEquivalentTo(fromString("else"));
  });

  describe("concatenation", () => {
    describe("empty ropes", () => {
      it("should be left idempotent", () => {
        expect(concat(empty(), test)).toBeEquivalentTo(rope);
      });
      it("should be right idempotent", () => {
        expect(concat(rope, empty())).toBeEquivalentTo(rope);
      });
    });

    describe("short ropes", () => {
      it("should concat two non-empty ropes", () => {
        const big = concat(rope, rope2);
        expect(length(big)).toBe(length(rope) + length(rope2));

        expect(charAt(5)(big)).toBe("s");
        expect(charAt(10)(big)).toBe("g");
        expect(charAt(11)(big)).toBe("1");
        expect(charAt(12)(big)).toBe("2");
      });
    });
  });
});

const complexRope = () =>
  concat(
    concat("this", concat(" is a", " more")),
    concat(concat(" complex ", "rope"), " to deal with."),
  );

describe("slice", () => {
  const rope = complexRope();

  it("should return empty when end is before start", () => {
    expect(slice(2, 1)(rope)).toBeEquivalentTo(empty());
  });

  it("should return an empty Rope on slice(0,0)", () => {
    expect(slice(0, 0)(rope)).toBeEquivalentTo(empty());
  });

  it("should be able to grab a slice from the first piece", () => {
    const result = slice(1, 3)(rope);
    expect(result).toBeEquivalentTo(fromString("hi"));
  });

  it("should be able to grab a slice from the second piece", () => {
    const result = slice(5, 7)(rope);
    expect(result).toBeEquivalentTo(fromString("is"));
  });

  it("should be able to graft pieces across multiple slices", () => {
    const result = slice(2, 7)(rope);
    expect(result).toBeEquivalentTo(fromString("is is"));
  });

  it("should be able to slice from the right hand side as well", () => {
    const result = slice(15, 22)(rope);
    expect(result).toBeEquivalentTo(fromString("complex"));
  });
});

describe("insert", () => {
  it("should insert at the beginning", () => {
    const result = pipe(
      "right",
      fromString,
      insertAt(0, fromString("left")),
    );

    expect(result).toBeEquivalentTo(fromString("leftright"));
  });

  it("should insert at the end", () => {
    const result = pipe(
      "left",
      fromString,
      insertAt(4, fromString("right")),
    );

    expect(result).toBeEquivalentTo(fromString("leftright"));
  });

  it("should insert in the middle", () => {
    const result = pipe(
      complexRope(),
      insertAt(10, fromString("XXXX")),
    );

    expect(result).toBeEquivalentTo(
      fromString("this is a XXXXmore complex rope to deal with."),
    );
  });
});
