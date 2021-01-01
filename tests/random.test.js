import Random from "../scripts/random/random.js";
import LCGImplementations from "../scripts/random/lcg-implementations.js";

test("number of implementations", () => {
  expect(Object.keys(LCGImplementations.PARAMETERS).length).toBe(3);
});

test.each([
  [LCGImplementations.GLIBC, "glibc"],
  [LCGImplementations.HOULE, "houle"],
  [LCGImplementations.JAVA, "java"],
])("%s name continuity", (implementation, expected) => {
  expect(implementation).toBe(expected);
});

test.each([
  [LCGImplementations.GLIBC, 0.58230758970603],
  [LCGImplementations.HOULE, 0.88588391632373],
  [LCGImplementations.JAVA, 0.00376241603037],
])("%s value continuity", (implementation, expected) => {
  const random = new Random(42, implementation);
  expect(random.next()).toBeCloseTo(expected);
});

test("invalid implementation", () => {
  expect(() => {
    new Random(42, "invalid-implementation");
  }).toThrowError("Implementation invalid-implementation is not valid");
});

test("default params", () => {
  const random = new Random(42);
  expect(random.implementation).toBe(LCGImplementations.JAVA);
});

test("two seeds different", () => {
  const randomA = new Random(0);
  const randomB = new Random(1);

  expect(randomA.next()).not.toBe(randomB.next());
});

test("two seeds the same", () => {
  const randomA = new Random(25);
  const randomB = new Random(25);

  expect(randomA.next()).toBe(randomB.next());
});

test("uniform distribution", () => {
  const random = new Random(25, LCGImplementations.JAVA);
  const min = 0;
  const max = 10;
  const numSamples = 100000;
  const uniformCounts = {};
  for (let i = 0; i < numSamples; i++) {
    const rand = random.nextInt(min, max);
    if (!uniformCounts.hasOwnProperty(rand)) {
      uniformCounts[rand] = 0;
    }
    uniformCounts[rand]++;
  }

  const expectedMean = numSamples / (max - min);
  for (let value in uniformCounts) {
    const intValue = parseInt(value, 10);
    expect(intValue).toBeGreaterThanOrEqual(min);
    expect(intValue).toBeLessThanOrEqual(max);
    const count = uniformCounts[value];
    expect(count).toBeGreaterThanOrEqual(expectedMean * 0.99);
    expect(count).toBeLessThanOrEqual(expectedMean * 1.01);
  }
});

test("normal distribution", () => {
  const random = new Random(25, LCGImplementations.JAVA);
  const numSamples = 200000;
  const normalCounts = {};
  for (let i = 0; i < numSamples; i++) {
    const rand = Math.floor(random.nextNormal() + 0.5);
    if (!normalCounts.hasOwnProperty(rand)) {
      normalCounts[rand] = 0;
    }
    normalCounts[rand]++;
  }

  for (let valueA in normalCounts) {
    for (let valueB in normalCounts) {
      const absIntValueA = Math.abs(parseInt(valueA, 10));
      const absIntValueB = Math.abs(parseInt(valueB, 10));
      const countA = normalCounts[valueA];
      const countB = normalCounts[valueB];
      if (absIntValueA < absIntValueB) {
        expect(countA).toBeGreaterThan(countB);
      } else if (absIntValueA > absIntValueB) {
        expect(countA).toBeLessThan(countB);
      }
    }
  }
});
