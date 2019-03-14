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

// app.get('/api/v1/champions', (request, response) => {
//   database('champions').select()
//     .then((champions) => {
//       response.status(200).json(champions);
//     })
//     .catch((error) => {
//       response.status(500).json({ error });
//     });
// });

app.get('/api/v1/champions', async (request, response) => {
  try {
    const currentChampions = await database('champions').select()
    return response.status(200).json(currentChampions);
  } catch (error) {
    return response.status(500).json({ error });
  }
});

// app.get('/api/v1/skins', (request, response) => {
//   database('skins').select()
//     .then((skins) => {
//       response.status(200).json(skins);
//     })
//     .catch((error) => {
//       response.status(500).json({ error });
//     });
// });

app.get('/api/v1/skins', async (request, response) => {
  try {
    const currentSkins = await database('skins').select()
    return response.status(200).json(currentSkins);
  } catch (error) {
    return response.status(500).json({ error });
  }
});

// app.get('/api/v1/champions/:id', (request, response) => {
//   database('champions').where('id', request.params.id).select()
//     .then(champions => {
//       if (champions.length) {
//         response.status(200).json(champions);
//       } else {
//         response.status(404).json({
//           error: `Could not find champion with id ${request.params.id}`
//         });
//       }
//     })
//     .catch(error => {
//       response.status(500).json({ error });
//     });
// });

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

// app.get('/api/v1/skins/:id', (request, response) => {
//   database('skins').where('id', request.params.id).select()
//     .then(skins => {
//       if (skins.length) {
//         response.status(200).json(skins);
//       } else {
//         response.status(404).json({
//           error: `Could not find skin with id ${request.params.id}`
//         });
//       }
//     })
//     .catch(error => {
//       response.status(500).json({ error });
//     });
// });

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

// app.post('/api/v1/champions', (request, response) => {
//   const champion = request.body;
//   for (let requiredParameter of ['name', 'title']) {
//     if (!champion[requiredParameter]) {
//       return response
//         .status(422)
//         .send({ error: `Expected format: { name: <String>, title: <String> }. You're missing a "${requiredParameter}" property.` });
//     }
//   }
//   database('champions').insert(champion, 'id')
//     .then(champion => {
//       response.status(201).json({ id: champion[0] })
//     })
//     .catch(error => {
//       response.status(500).json({ error });
//     });
// });

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

//{"skin_name": "new", "chroma": "true", "champion_id": "37"}

// app.post('/api/v1/skins', (request, response) => {
//   const skin = request.body;

//   for (let requiredParameter of ['skin_name', 'chroma', 'champion']) {
//     if (!skin[requiredParameter]) {
//       return response
//         .status(422)
//         .send({ error: `Expected format: { skin_name: <String>, chroma: <Boolean>, champion: <String> }. You're missing a "${requiredParameter}" property.` });
//     }
//   }

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

app.delete('/api/v1/champions/:champion', (request, response) => {
  database('champions').where('name', request.params.champion).select()
    .then(champions => {

      if (champions.length) {
        console.log(champions)
        database('champions').where('name', request.params.champion).del()
          .then(champion => {
            database('skins').where('champion_id', champion[0].id).select()
              .then(skins => {
                if (skins.length) {
                  database('skins').where('champion_id', champion[0].id).del()
                } else {
                  response.status(201).json({ id: champion[0].id })
                }
              })
          })
      } else {
        response.status(404).json({
          error: `Could not find champion_id associated with champion ${request.params.champion}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});


