import * as Rope from "../src/index";

describe("Placeholder rope test", () => {
  it("should create an empty rope", () => {
    expect(Rope.empty()).not.toBeUndefined();
  });

  it("should be consistent when empty", () => {
    expect(Rope.empty()).toEqual(Rope.empty());
  });
});
