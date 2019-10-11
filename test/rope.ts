import { pipe } from "fp-ts/lib/pipeable";

import {
  charAt,
  concat,
  deleteRange,
  empty,
  fromString,
  insertAt,
  length,
  Rope,
  slice,
} from "../src";

const assertSameAsString = (targetString: string) => (r: Rope) => {
  const len = targetString.length;
  expect(length(r)).toBe(len);

  for (let i = 0; i < len; i++) {
    expect(charAt(i)(r)).toBe(targetString[i]);
  }
};

describe("Rope", () => {
  const test = "test string";
  const rope = fromString(test);
  const test2 = "1234";
  const rope2 = fromString(test2);

  const complexRope = () =>
    concat(
      concat("this", concat(" is a", " more")),
      concat(concat(" complex ", "rope"), " to deal with."),
    );

  describe("Rope.empty", () => {
    it("should create an empty rope", () => {
      expect(empty()).not.toBeUndefined();
    });

    it("should be equal to other empty ropes", () => {
      expect(empty()).toEqual(empty());
    });

    it("should have length 0", () => {
      expect(length(empty())).toBe(0);
    });
  });

  describe("Rope.concat", () => {
    it("concatenating two empty Ropes should still be empty", () => {
      expect(concat(empty(), empty())).toEqual(empty());
    });
  });

  describe("charAt", () => {
    describe("empty", () => {
      it("should return undefined for all charAt calls", () => {
        expect(charAt(0)(empty())).toBeUndefined();
        expect(charAt(1)(empty())).toBeUndefined();
      });
    });
  });

  describe("Rope.fromString", () => {
    it("should be able to create a rope from a string", () => {
      expect(rope).not.toEqual(empty());

      assertSameAsString(test)(rope);
    });

    it("should differentiate between different ropes", () => {
      expect(fromString("something")).not.toBeEquivalentTo(fromString("else"));
    });
  });

  describe("Rope.concat", () => {
    describe("empty ropes", () => {
      it("should be left idempotent", () => {
        expect(concat(empty(), test)).toBeEquivalentTo(rope);
      });
      it("should be right idempotent", () => {
        expect(concat(rope, empty())).toBeEquivalentTo(rope);
      });
    });

    it("should concat two non-empty ropes", () => {
      const big = concat(rope, rope2);
      expect(length(big)).toBe(length(rope) + length(rope2));

      expect(charAt(5)(big)).toBe("s");
      expect(charAt(10)(big)).toBe("g");
      expect(charAt(11)(big)).toBe("1");
      expect(charAt(12)(big)).toBe("2");
    });
  });

  describe("slice", () => {
    it("should return empty when end is before start", () => {
      expect(slice(2, 1)(complexRope())).toBeEquivalentTo(empty());
    });

    it("should return an empty Rope on slice(0,0)", () => {
      expect(slice(0, 0)(complexRope())).toBeEquivalentTo(empty());
    });

    it("should be able to grab a slice from the first piece", () => {
      const result = slice(1, 3)(complexRope());
      expect(result).toBeEquivalentTo(fromString("hi"));
    });

    it("should be able to grab a slice from the second piece", () => {
      const result = slice(5, 7)(complexRope());
      expect(result).toBeEquivalentTo(fromString("is"));
    });

    it("should be able to graft pieces across multiple slices", () => {
      const result = slice(2, 7)(complexRope());
      expect(result).toBeEquivalentTo(fromString("is is"));
    });

    it("should be able to slice from the right hand side as well", () => {
      const result = slice(15, 22)(complexRope());
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

  describe("deleteRange", () => {
    it("should be idempotent when end is less than start", () => {
      const result = pipe(
        complexRope(),
        deleteRange(1, 0),
      );
      expect(result).toBeEquivalentTo(complexRope());
    });

    it("should delete from the beginnig", () => {
      const result = pipe(
        complexRope(),
        deleteRange(0, 5),
      );
      expect(result).toBeEquivalentTo(
        fromString("is a more complex rope to deal with."),
      );
    });

    it("should delete from the middle", () => {
      const result = pipe(
        complexRope(),
        deleteRange(10, 15),
      );
      expect(result).toBeEquivalentTo(
        fromString("this is a complex rope to deal with."),
      );
    });

    it("should delete from the end", () => {
      const result = pipe(
        complexRope(),
        deleteRange(35, 41),
      );

      expect(result).toBeEquivalentTo(
        fromString("this is a more complex rope to deal"),
      );
    });

    it("should allow start to be negative", () => {
      const result = pipe(
        complexRope(),
        deleteRange(-5, 5),
      );

      expect(result).toBeEquivalentTo(
        fromString("is a more complex rope to deal with."),
      );
    });

    it("should allow the end to run past the rope end", () => {
      const result = pipe(
        complexRope(),
        deleteRange(35, 50),
      );

      expect(result).toBeEquivalentTo(
        fromString("this is a more complex rope to deal"),
      );
    });
  });
});
