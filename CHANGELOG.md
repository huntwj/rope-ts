# Changelog

# 0.1.3

- Add functions (curried for a rope manipulation pipeline)
  - isNode = (rope: Rope): rope is Node
  - isRope = (something: unknown): something is Rope
  - slice = (start: number, end: number) => (rope: Rope): Rope
  - insertAt = (index: number, other: Rope) => (source: Rope): Rope
  - deleteRange = (start: number, end: number) => (rope: Rope): Rope
- Document functions a bit better

# 0.1.2

- Fix off-by-one error in charAt

# 0.1.1

- Initial implementation of Rope data structures and subset of initial functionality
- Implement functions: empty, fromString, length, concat, and charAt

# 0.1.0

- Get basic dev environment setup and placeholder npm package uploaded. We're `rope-adt` now. Woot!
