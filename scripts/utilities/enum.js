const Enum = (o, name) => {
  const size = () => {
    return Object.keys(o).length;
  };

  const has = (value) => {
    return Object.values(o).includes(value);
  };

  const forEach = (callback) => {
    let i = 0;
    for (let key in o) {
      callback(o[key], i);
      i++;
    }
  };

  const validate = (value) => {
    if (!has(value)) {
      if (name === undefined) {
        throw `Value ${value} is not a valid enum entry`;
      } else {
        throw `Value ${value} is not valid for enum ${name}`;
      }
    }
  };

  const e = {
    size: size,
    has: has,
    forEach: forEach,
    validate: validate,
    ...o,
  };

  Object.freeze(e);

  return e;
};

export default Enum;
