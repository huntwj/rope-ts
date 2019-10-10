import * as Rope from "../src/index";

describe("Empty Ropes", () => {
  it("should create an empty rope", () => {
    expect(Rope.empty()).not.toBeUndefined();
  });

  it("should be consistent when empty", () => {
    expect(Rope.empty()).toEqual(Rope.empty());
  });

  it("should have length 0", () => {
    expect(Rope.length(Rope.empty())).toBe(0);
  });

  it("empty concat empty should still be empty", () => {
    expect(Rope.concat(Rope.empty(), Rope.empty())).toEqual(Rope.empty());
  });

  it("should return undefined for all charAt calls", () => {
    expect(Rope.charAt(0)(Rope.empty())).toBeUndefined();
    expect(Rope.charAt(1)(Rope.empty())).toBeUndefined();
  });
});

describe("Short Ropes", () => {
  const test = "test string";
  const rope = Rope.fromString(test);
  const test2 = "1234";
  const rope2 = Rope.fromString(test2);

  it("should be able to create a rope from a string", () => {
    expect(rope).not.toEqual(Rope.empty());
    expect(Rope.length(rope)).toBe(test.length);
  });

  describe("concatenation", () => {
    describe("empty ropes", () => {
      it("should be left idempotent", () => {
        expect(Rope.length(Rope.concat(Rope.empty(), test))).toBe(
          Rope.length(rope),
        );
      });
      it("should be right idempotent", () => {
        expect(Rope.length(Rope.concat(test, Rope.empty()))).toBe(
          Rope.length(rope),
        );
      });
      it("should concat two non-empty ropes", () => {
        const big = Rope.concat(rope, rope2);
        expect(Rope.length(big)).toBe(Rope.length(rope) + Rope.length(rope2));

        expect(Rope.charAt(5)(big)).toBe("s");
        expect(Rope.charAt(12)(big)).toBe("2");
      });
    });
  });
});
