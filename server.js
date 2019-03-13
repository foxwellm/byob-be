const express = require('express');
// import cors from 'cors'
const app = express();
app.use(express.json())
// app.use(cors())
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.locals.title = 'League Champion Skins';
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

app.get('/api/v1/champions', (request, response) => {
  database('champions').select()
    .then((champions) => {
      response.status(200).json(champions);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/skins', (request, response) => {
  database('skins').select()
    .then((skins) => {
      response.status(200).json(skins);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/champions/:id', (request, response) => {
  database('champions').where('id', request.params.id).select()
    .then(champions => {
      if (champions.length) {
        response.status(200).json(champions);
      } else {
        response.status(404).json({
          error: `Could not find champion with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/skins/:id', (request, response) => {
  database('skins').where('id', request.params.id).select()
    .then(skins => {
      if (skins.length) {
        response.status(200).json(skins);
      } else {
        response.status(404).json({
          error: `Could not find skin with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/champions', (request, response) => {
  const champion = request.body;

  for (let requiredParameter of ['name', 'title']) {
    if (!champion[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, title: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('champions').insert(champion, 'id')
    .then(champion => {
      response.status(201).json({ id: champion[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/skins', (request, response) => {
  const skin = request.body;

  for (let requiredParameter of ['skin_name', 'chroma', 'champion']) {
    if (!skin[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { skin_name: <String>, chroma: <Boolean>, champion: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  database('champions').where('name', skin.champion).select()
    .then(champions => {
      if (champions.length) {
          let newSkin = { skin_name: skin.skin_name, chroma: skin.chroma, champion_id: champions[0].id }
        database('skins').insert(newSkin, 'id')
          .then(skin => {
            response.status(201).json({ id: skin[0] })
          })
      } else {
        response.status(404).json({
          error: `Could not find champion_id associated with champion ${skin.champion}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });

});
