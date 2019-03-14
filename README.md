# League of Legends Champion Skins
This REST API is an accumulation of all League of Legends champions and their associated skins currently available. Data was pulled from Leagues own REST API, champions from http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json and skins from http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion/Aatrox.json with the name being matched to the champion.

## Requests
The base URL for all requests is: ` http://localhost:3000`

GET, POST, and DELETE requests can be made to the API endpoints. Responses are in JSON format.

## Champions

#### GET all champions
* #### GET `api/v1/champions`

  Example Response:
  ```json
  [
    {
        "id": 59,
        "name": "Aatrox",
        "title": "The Darkin Blade",
        "created_at": "2019-03-14T22:32:03.377Z",
        "updated_at": "2019-03-14T22:32:03.377Z"
    },
    {
        "id": 60,
        "name": "Alistar",
        "title": "The Minotaur",
        "created_at": "2019-03-14T22:32:03.377Z",
        "updated_at": "2019-03-14T22:32:03.377Z"
    },
    ...
  ]
  ```
#### GET a specific champion
  * #### GET `api/v1/champions/:id`

  Example Response:
  ```json
  [
    {
        "id": 59,
        "name": "Aatrox",
        "title": "The Darkin Blade",
        "created_at": "2019-03-14T22:32:03.377Z",
        "updated_at": "2019-03-14T22:32:03.377Z"
    }
  ]
  ```

#### POST a new champion
  * #### POST `api/v1/champions`

| Body    | Format   | Required  |
| --------|:--------:| ---------:|
| name    | string   | true      |
| title   | string   | true      |

Example Request:

```js
  const response = await fetch('http://localhost:3000api/v1/champions', {
        method: 'POST',
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ name: 'New Champion', title: 'New Champion Title'})
      })
```

  Example Response:
  ```json
    {
        "id": 62
    }
  ```


  ## Skins

#### GET all skins
* #### GET `api/v1/skins`

  Example Response:
  ```json
  [
    {
        "id": 106,
        "skin_name": "Justicar Aatrox",
        "chroma": false,
        "champion_id": 59,
        "created_at": "2019-03-14T22:32:03.377Z",
        "updated_at": "2019-03-14T22:32:03.377Z"
    },
    {
        "id": 107,
        "skin_name": "Mecha Aatrox",
        "chroma": false,
        "champion_id": 59,
        "created_at": "2019-03-14T22:32:03.377Z",
        "updated_at": "2019-03-14T22:32:03.377Z"
    },
    ...
  ]
  ```

#### GET a specific skin
  * #### GET `api/v1/skin/:id`

  Example Response:
  ```json
  [
    {
        "id": 119,
        "skin_name": "Vancouver Amumu",
        "chroma": false,
        "created_at": "2019-03-14T22:32:03.377Z",
        "updated_at": "2019-03-14T22:32:03.377Z"
    }
  ]
  ```

#### POST a new skin
  * #### POST `api/v1/skins`

| Body        | Format   | Required  |
| ------------|:--------:| ---------:|
| skin_name   | string   | true      |
| chroma      | boolean  | true      |
| champion_id | number   | true      |

Example Request:

```js
  const response = await fetch('http://localhost:3000api/v1/skins', {
        method: 'POST',
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ skin_name: 'New Skin', chroma: true, champion_id: 59})
      })
```

  Example Response:
  ```json
    {
        "id": 121
    }
  ```

#### DELETE a champion and associated skins

  * #### DELETE `api/v1/champions/:id`

Response of 204 is sent if a champion matching that id was found and it was, along with all associated skins deleted.
