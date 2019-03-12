
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('champions', function (table) {
      table.increments('id').primary();
      table.string('name');
      table.string('title');
      table.timestamps(true, true);
    }),

    knex.schema.createTable('skins', function (table) {
      table.increments('id').primary();
      table.string('skin_name');
      table.integer('champions_id').unsigned()
      table.foreign('champions_id')
        .references('champions.id');
      table.timestamps(true, true);
    })
  ])
};


exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('champions'),
    knex.schema.dropTable('skins')
  ]);
};