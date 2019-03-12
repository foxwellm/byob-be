const express = require('express');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.get('/api/v1/champions', (request, response) => {
  database('champions').select()
    .then((champions) => {
      response.status(200).json(champions);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});