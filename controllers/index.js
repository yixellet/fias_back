const pgp = require('pg-promise')();
const { ParameterizedQuery } = require('pg-promise');
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = require('../config');

const db = pgp(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

function getObjectsByLevel(req, res) {
  const query = new ParameterizedQuery(
    {
      text: 'SELECT * FROM gar.addr_obj WHERE level = $1 AND isactual = $2 ORDER BY name',
      values: [req.query.level, '1'],
    },
  );

  db.any(query)
    .then((data) => {
      res.send({ data });
    })
    .catch((error) => {
      res.send({ error });
    });
}

function getLevels(req, res) {
  const query = new ParameterizedQuery(
    {
      text: 'SELECT * FROM gar.object_levels',
    },
  );

  db.any(query)
    .then((data) => {
      res.send({ data });
    })
    .catch((error) => {
      res.send({ error });
    });
}

function getSteads(req, res) {
  const query = new ParameterizedQuery(
    {
      text: 'SELECT * FROM gar.steads JOIN gar.addr_obj ON steads.objectid = addr_obj.objectid',
    },
  );

  db.any(query)
    .then((data) => {
      res.send({ data });
      console.log(data);
    })
    .catch((error) => {
      res.send({ error });
    });
}

module.exports = { getObjectsByLevel, getLevels, getSteads };
