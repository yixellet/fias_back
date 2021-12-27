/* eslint-disable no-multi-str */
const pgp = require('pg-promise')();
const { ParameterizedQuery } = require('pg-promise');
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_SCHEMA
} = require('../config');

const db = pgp(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

function liveSearch(req, res) {
  const query = new ParameterizedQuery(
    {
      text: `SELECT ao.objectid, ao.name, ao.typename
             FROM gar.addr_obj ao 
             WHERE LOWER(ao.name) LIKE '%${req.query.string}%' 
              AND ao.isactual = 1 AND ao.isactive = 1
             LIMIT 10`
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

function getAdmDistricts(req, res) {
  const query = new ParameterizedQuery(
    {
      text: 'SELECT * FROM gar.adm_distr'
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

function getAdmDistrictsDetails(req, res) {
  const query = new ParameterizedQuery(
    {
      text: `SELECT * FROM gar."getAdmDistrDetails"($1)`,
      values: [req.query.code]
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

function getMunDistricts(req, res) {
  const query = new ParameterizedQuery(
    {
      text: 'SELECT * FROM gar.m_distr'
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

function getMunStructures(req, res) {
  const query = new ParameterizedQuery(
    {
      text: `SELECT * FROM gar.m_struct`
    },
  );
  const filter1 = new ParameterizedQuery({text: 'SELECT * FROM gar.m_distr'})
  db.any(query)
    .then((data) => {
      db.any(filter1)
        .then((filter) => {
          res.send({
            data: data,
            filters: [{
              name: 'Муниципальный район',
              fieldname: 'mundistr',
              options: filter}]
            });
        })
    })
    .catch((error) => {
      res.send({ error });
    });
}

function getCities(req, res) {
  const query = new ParameterizedQuery(
    {
      text: 'SELECT * FROM gar.cities'
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

function getSettles(req, res) {
  const query = new ParameterizedQuery(
    {
      text: 'SELECT * FROM gar.settles'
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

function getTerritories(req, res) {
  const query = new ParameterizedQuery(
    {
      text: 'SELECT * FROM gar.terr'
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

function getStreets(req, res) {
  const query = new ParameterizedQuery(
    {
      text: 'SELECT * FROM gar.streets'
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
      text: 'SELECT * FROM gar.steads_mv'
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
      text: 'SELECT * FROM gar.houses_mv'
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

module.exports = {
  liveSearch,
  getAdmDistricts,
  getAdmDistrictsDetails,
  getMunDistricts,
  getMunStructures,
  getCities,
  getLevels,
  getSettles,
  getTerritories,
  getStreets,
  getSteads,
  getHouses
};
