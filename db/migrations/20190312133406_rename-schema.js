
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('skins', function (table) {
      table.dropColumn('champions_id');
      table.string('champion_id');
    })
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('skins', function (table) {
      table.dropColumn('champion_id');
      table.string('champions_id');

    })
  ]);
};
