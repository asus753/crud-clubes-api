<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

A clubs REST API

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentation

### Routes and http methods

* GET  /club        --> return an array with information of ALL clubs
* GET  /club/:id    --> return un object with information of ONE club with the corresponding id
* POST /club        --> this is used to create a new club
* PUT  /club/:id    --> this is used to update an existent club
* DELETE /club/:id  --> delete the club with corresponding id


### Data structure objects 

* Get one club - GET /club/:id

```json
{
  "id": 5,
  "name": "Newcastle United FC",
  "shortName": "Newcastle",
  "tla": "NEW",
  "crestUrl": "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg",
  "address": "Sports Direct Arena Newcastle upon Tyne NE1 4ST",
  "phone": "00 44 870 444 1892",
  "website": "http://www.nufc.co.uk",
  "email": "admin@nufc.co.uk",
  "founded": 1881,
  "clubColors": "Black / White",
  "venue": "St. James' Park",
  "active": 1,
  "createdAt": "2020-07-23 17:31:27.320 +00:00",
  "updatedAt": "2020-07-23 17:31:27.320 +00:00",
  "area": {
    "id": 208,
    "name": "England"
  }
}
```

* Get all clubs - GET /club

This is an array with all clubs, the club object inside its equal to the obtained in GET /club/:id


* Create a new club - POST /club

To create a new club, you need send the information in the body of request, the data structe is
very similiar to what you get when you do GET /club/:id

```json
{
  "name": "Club Atlético Boca Juniors",
  "shortName": "Boca",
  "tla": "BOC",
  "crestUrl": "https://es.wikipedia.org/wiki/Club_Atl%C3%A9tico_Boca_Juniors#/media/Archivo:Escudo_del_Club_Atl%C3%A9tico_Boca_Juniors_2012.svg",
  "address": "Brandsen 805, C1161 CABA",
  "phone": "+54 011 5777-1200",
  "website": "https://www.bocajuniors.com.ar/",
  "email": "marketing@bocajuniors.com.ar",
  "founded": 1905,
  "clubColors": "Blue / Yellow",
  "venue": "La Bombonera",
  "active": 1,
  "area": "Argentina"
}
```

not all fields are necessary to create a club, below is a list of optional fields:

    - shortName
    - phone
    - website
    - clubColors
    - venue
    - active --> by default this is set to 1

* Update a club - PUT /club/:id

The structure of body to update a club is very similiar to the create club, but in this you only
need include the properties you want to update.

Here is an example where we only want to update the name and tla

```json
{
  "name": "New name to the club",
  "tla": "ASD"
}
```

:warning: The year of foundation is not upgradeable

* Delete club - DELETE /club/:id

This method will delete **permanently** the club





