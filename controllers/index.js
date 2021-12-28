/* eslint-disable no-multi-str */
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

function getObjectsByLevel(req, res) {
  const query = new ParameterizedQuery(
    {
      text: 'SELECT * FROM gar.addr_obj WHERE level = $1 AND isactual = $2 ORDER BY name',
      values: [req.query.level, '1'],
    },
  );

  db.any(query)
    .then((data) => {
      res.send({ data: data, filter: null, columns: Object.keys(data[0]) });
    })
    .catch((error) => {
      res.send({ error });
    });
}

function getSelsovets(req, res) {
  const dataQuery = new ParameterizedQuery(
    {
      text: 'SELECT * FROM gar.selsovets ORDER BY mo_name',
    },
  );
  const munDistrFilterQuery = new ParameterizedQuery(
    {
      text: 'SELECT * FROM gar.mun_distr ORDER BY mun_name',
    },
  );

  db.any(dataQuery)
    .then((data) => {
      db.any(munDistrFilterQuery)
        .then((filter) => {
          res.send({ data: data, filter: {name: 'Муниципальный район', data: filter}, columns: Object.keys(data[0]) });
        })
    })
    .catch((error) => {
      res.send({ error });
    });
}

function getSteads(req, res) {
  const query = new ParameterizedQuery(
    {
      text: 'SELECT steads.objectid, steads.objectguid, addr_obj.typename || \' \' || \
      addr_obj.name AS streetname, steads.number FROM gar.adm_hierarchy JOIN gar.addr_obj \
      ON adm_hierarchy.parentobjid = addr_obj.objectid JOIN gar.steads ON \
      adm_hierarchy.objectid = steads.objectid ORDER BY streetname, number LIMIT 1000',
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

function getHouses(req, res) {
  const query = new ParameterizedQuery(
    {
      text: 'SELECT houses.objectid, houses.objectguid, addr_obj.typename || \' \' || \
      addr_obj.name AS streetname, houses.housenum, houses.addnum1, houses.addnum2 FROM gar.adm_hierarchy JOIN gar.addr_obj \
      ON adm_hierarchy.parentobjid = addr_obj.objectid JOIN gar.houses ON \
      adm_hierarchy.objectid = houses.objectid ORDER BY streetname, housenum LIMIT 1000',
    },
  );

  db.any(query)
    .then((data) => {
      res.send({ data });
    })
    .catch((error) => {
      console.log(error)
      res.send({ error });
    });
}

module.exports = { getObjectsByLevel, getSelsovets, getLevels, getSteads, getHouses };
