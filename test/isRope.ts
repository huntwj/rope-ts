import { empty, isRope } from "../src";

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
