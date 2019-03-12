
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('skins', function (table) {
      table.boolean('chroma');
    })
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('skins', function (table) {
      table.dropColumn('chroma');
    })
  ]);
};
