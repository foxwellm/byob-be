const express = require('express');
const cors = require('cors')
const app = express();
app.use(express.json())
app.use(cors())
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3001);

app.locals.title = 'League Champion Skins';
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

app.get('/api/v1/champions', async (request, response) => {
  try {
    const currentChampions = await database('champions').select()
    return response.status(200).json(currentChampions);
  } catch (error) {
    return response.status(500).json({ error });
  }
});

app.get('/api/v1/skins', async (request, response) => {
  try {
    const currentSkins = await database('skins').select()
    return response.status(200).json(currentSkins);
  } catch (error) {
    return response.status(500).json({ error });
  }
});

app.get('/api/v1/champions/:id', async (request, response) => {
  try {
    const champion = await database('champions').where('id', request.params.id).select()
    if (champion.length) {
      return response.status(200).json(champion)
    } else {
      return response.status(404).json({
        error: `Could not find champion with id ${request.params.id}`
      })
    }
  } catch (error) {
    response.status(500).json({ error });
  }
});

app.get('/api/v1/skins/:id', async (request, response) => {
  try {
    const skin = await database('skins').where('id', request.params.id).select()
    if (skin.length) {
      return response.status(200).json(skin)
    } else {
      return response.status(404).json({
        error: `Could not find skin with id ${request.params.id}`
      })
    }
  } catch (error) {
    response.status(500).json({ error });
  }
});

app.post('/api/v1/champions', async (request, response) => {
  const champion = request.body;
  for (let requiredParameter of ['name', 'title']) {
    if (!champion[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, title: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  try {
    const newChampion = await database('champions').insert(champion, 'id')
    return response.status(201).json({ id: newChampion[0] })
  } catch {
    return response.status(500).json({ error });
  }
});

  app.post('/api/v1/skins', async (request, response) => {
    const skin = request.body;
    for (let requiredParameter of ['skin_name', 'chroma', 'champion_id']) {
      if (!skin[requiredParameter]) {
        return response
          .status(422)
          .send({ error: `Expected format: { skin_name: <String>, chroma: <Boolean>, champion_id: <Number> }. You're missing a "${requiredParameter}" property.` })
      }
    }
    try {
      const championCheck = await database('champions').where('id', skin.champion_id).select()
      if(championCheck.length) {
        const newSkin = await database('skins').insert(skin, 'id')
        return response.status(201).json({ id: newSkin[0] })
      } else {
        response.status(404).json({
          error: `Could not find champion_id associated with champion ${skin.champion}`
        })
      }
    } catch(error) {
      return response.status(500).json({ error })
    }
});

app.delete('/api/v1/champions/:championId', async(request, response) => {
  const championId = request.params.championId
  try {
    const championToDelete = await database('champions').where('id', championId).select()
    const skinsToDelete = await database('skins').where('champion_id', championId).select()
    if(championToDelete.length && skinsToDelete.length) {
      await database('champions').where('id', championId).del();
      await database('skins').where('champion_id', championId).del();
      return response.sendStatus(204)
    } else if(championToDelete.length) {
      await database('champions').where('id', championId).del()
      return response.send(204).json('hello')
    } else {
      response.status(404).json({
        error: `Could not find champion_id associated with champion ${championId}`
      });
    }
  } catch(error) {
    response.status(500).json('Something wrong');
  }
});