championsData = require('../../../raw_data/champions')

const createChampion = (knex, champion) => {
  return knex('champions').insert({
    name: champion.name,
    title: champion.title
  }, 'id')
    .then(championId => {
      let skinPromises = [];
      champion.skins.forEach(skin => {
        skinPromises.push(
          createSkin(knex, {
            skin_name: skin.name,
            chroma: skin.chroma,
            champion_id: championId[0]
          })
        )
      });
      return Promise.all(skinPromises);
    })
};

const createSkin = (knex, skin) => {
  return knex('skins').insert(skin);
};

exports.seed = (knex, Promise) => {
  return knex('skins').del()
    .then(() => knex('champions').del())
    .then(() => {
      let championPromises = [];
      championsData.forEach(champion => {
        championPromises.push(createChampion(knex, champion));
      });
      return Promise.all(championPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
