import Enum from "../scripts/utilities/enum.js";

test("empty", () => {
  const MyEnum = Enum({});

  expect(MyEnum.size()).toBe(0);
  expect(MyEnum.has("a")).toBe(false);
  MyEnum.forEach(() => {
    expect(true).toBe(false);
  });
});

test("basic operations", () => {
  const MyEnum = Enum({
    A: "a",
    B: "b",
    C: "c",
  });

  expect(MyEnum.A).toBe("a");
  expect(MyEnum.size()).toBe(3);
  expect(MyEnum.has("b")).toBe(true);
  expect(MyEnum.has("d")).toBe(false);
  let numEach = 0;
  MyEnum.forEach((v, i) => {
    expect(i).toBeGreaterThanOrEqual(0);
    expect(i).toBeLessThanOrEqual(2);
    expect(MyEnum.has(v)).toBe(true);
    numEach++;
  });
  expect(numEach).toBe(3);
});

test("validate", () => {
  const MyEnumWithoutName = Enum({});
  expect(() => {
    MyEnumWithoutName.validate("a");
  }).toThrowError("Value a is not a valid enum entry");

  const MyEnumWithName = Enum({}, "MyEnumWithName");
  expect(() => {
    MyEnumWithName.validate("a");
  }).toThrowError("Value a is not valid for enum MyEnumWithName");
});

test("frozen", () => {
  const MyEnum = Enum({});
  expect(() => {
    MyEnum["A"] = "a";
  }).toThrowError("Cannot add property A, object is not extensible");
});
