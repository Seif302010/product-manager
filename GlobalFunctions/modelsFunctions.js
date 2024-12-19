const { OFFSET } = require("tedious/lib/packet");
const { filterByAttributes } = require("./objectsFunctions");

const functions = (Model) => {
  const validAttributes = Object.keys(Model.rawAttributes);
  const primaryKey = Model.primaryKeyAttribute;
  return {
    get: async (options = {}, transaction = null) => {
      options = filterByAttributes(options, validAttributes);
      return await Model.findAll({
        where: options,
        transaction,
      });
    },
    getOne: async (options = {}, transaction = null) => {
      options = filterByAttributes(options, validAttributes);
      return await Model.findOne({
        where: options,
        transaction,
      });
    },
    create: async (data, transaction = null) => {
      return await Model.create(data, { transaction });
    },
    updateById: async (id, data, transaction = null) => {
      return await Model.update(data, {
        where: { [primaryKey]: id },
        transaction,
      });
    },
    deleteById: async (id, transaction = null) => {
      return await Model.destroy({
        where: { [primaryKey]: id },
        transaction,
      });
    },
  };
};

module.exports = (Model) => ({
  ...functions(Model),
});
