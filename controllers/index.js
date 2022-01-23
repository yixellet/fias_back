/* eslint-disable no-multi-str */
const pgp = require('pg-promise')();
const { default: contentSecurityPolicy } = require('helmet/dist/middlewares/content-security-policy');
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
  db.any(`SELECT o.objectid,
            o.name,
            o.typename
          FROM ${DB_SCHEMA}.addr_obj o
          WHERE LOWER(o.name) LIKE LOWER('%${req.query.string}%')
            AND o.isactual = 1 AND o.isactive = 1
          LIMIT 10`)
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
      text: `SELECT ol.level, ol.name FROM ${DB_SCHEMA}.object_levels ol
             WHERE ol.isactive = true ORDER BY ol.level`,
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

function getChildren(req, res) {
  db.any('SELECT * FROM ${schema:name}.${table:name}(${objectid})',
    {
      objectid: req.query.objectid,
      schema: DB_SCHEMA,
      table: req.query.mode === 'adm_div' ? 'getchildren_adm' : 'getchildren_mun'
    })
    .then((data) => {
      db.any(req.query.mode === 'adm_div' ? 'SELECT * FROM ${schema:name}.genealogy_adm(${objectid});' : 'SELECT * FROM ${schema:name}.genealogy_mun(${objectid});',
        {
          objectid: req.query.objectid,
          schema: DB_SCHEMA
        })
        .then((gen) => {
          res.send({
            genealogy: gen,
            children: data
          })
        })
    })
    .catch((error) => {
      res.send({ error });
    });
}

function getHouseChildren(req, res) {
  db.any('SELECT * FROM ${schema:name}.gethousechildren(${objectid});',
  {
    objectid: req.query.objectid,
    schema: DB_SCHEMA
  })
    .then((data) => {
      res.send({children: data})
    })
    .catch((error) => {
      res.send({ error });
    });
}

function getRooms(req, res) {
  db.any('SELECT * FROM ${schema:name}.getrooms(${objectid});',
  {
    objectid: req.query.objectid,
    schema: DB_SCHEMA
  })
    .then((data) => {
      res.send({children: data})
    })
    .catch((error) => {
      res.send({ error });
    });
}

module.exports = {
  liveSearch,
  getLevels,
  getChildren,
  getHouseChildren,
  getRooms
};
