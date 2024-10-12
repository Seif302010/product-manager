const { filterByAttributes } = require("./objectsFunctions");

const functions = (Model) => {
  const validAttributes = Object.keys(Model.rawAttributes);
  return {
    get: async (options = {}) => {
      options = filterByAttributes(options, validAttributes);
      return await Model.findAll({
        where: options,
      });
    },
    create: async (data) => {
      return await Model.create(data);
    },
    updateById: async (id, data) => {
      return await Model.update(data, {
        where: { id },
      });
    },
    deleteById: async (id) => {
      return await Model.destroy({
        where: { id },
      });
    },
  };
};

module.exports = (Model) => ({
  ...functions(Model),
});
