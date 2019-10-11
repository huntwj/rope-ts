import { isNode } from "../src";

describe("Rope.isNode", () => {
  it("should return false for strings (they are leaves)", () => {
    expect(isNode("test")).toBe(false);
  });

  it("should return true for non-string Ropes", () => {
    expect(isNode({ left: "something", right: "else" })).toBe(true);
  });
});
