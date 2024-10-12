const filterByDeletingEmpty = (object) => {
  for (const key in object) {
    if (object[key] === "") {
      object[key] = undefined;
    }
  }
  return object;
};

const filterByAttributes = (object, validAttributes) => {
  return Object.keys(object).reduce((filtered, key) => {
    if (validAttributes.includes(key)) {
      filtered[key] = object[key];
    }
    return filtered;
  }, {});
};

module.exports = { filterByDeletingEmpty, filterByAttributes };
