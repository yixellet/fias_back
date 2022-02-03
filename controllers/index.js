/* eslint-disable no-multi-str */
const pgp = require('pg-promise')();
const { ParameterizedQuery } = require('pg-promise');
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_SCHEMA,
  DB_GEOM_SCHEMA
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
      res.send({
        children: data
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

function getParams(req, res) {
  db.any('SELECT * FROM ${schema:name}.getparams(${objectid});',
  {
    objectid: req.query.objectid,
    schema: DB_SCHEMA
  })
    .then((data) => {
      res.send({params: data})
    })
    .catch((error) => {
      res.send({ error });
    });
}

function getGeometry(req, res) {
  let tableName
  let columnName
  switch (req.query.level) {
    case '1':
      tableName = 'borders_Astrakhan'
      columnName = 'gar_id_adm'
      break;
    case '2':
      tableName = 'borders_Astrakhan'
      columnName = 'gar_id_adm'
      break;
    case '3':
      tableName = 'borders_Astrakhan'
      columnName = 'gar_id_mun'
      break;
    case '4':
      tableName = 'borders_Astrakhan'
      columnName = 'gar_id_mun'
      break;
    case '5':
      tableName = 'settlements'
      columnName = 'gar_id_adm'
      break;
    case '6':
      tableName = 'settlements'
      columnName = 'gar_id_adm'
      break;
    case '7':
      tableName = 'territories'
      columnName = 'objectid_adm'
      break;
    case '8':
      tableName = 'streets'
      columnName = 'objectid_adm'
      break;
    case '9':
      tableName = 'landuse'
      columnName = 'objectid_adm'
      break;
    case '10':
      tableName = 'buildings'
      columnName = 'objectid_adm'
      break;
  }
  console.log(`SELECT ab.name, ST_AsGeoJSON(ab.geom) AS geom, ST_X(ST_Centroid(ab.geom)) AS centroid_x, ST_y(ST_Centroid(ab.geom)) AS centroid_y, ST_Extent(ab.geom) AS extent \
            FROM ${DB_GEOM_SCHEMA}.${tableName} ab WHERE ab.${columnName} = ${req.query.objectid} GROUP BY name, geom`)
  db.any('SELECT ab.name, \
            ST_AsGeoJSON(ab.geom) AS geom, \
            ST_X(ST_Centroid(ab.geom)) AS centroid_x, \
            ST_y(ST_Centroid(ab.geom)) AS centroid_y, \
            ST_Extent(ab.geom) AS extent \
          FROM ${schema:name}.${table:name} ab \
          WHERE ab.${column:name} = ${objectid} \
          GROUP BY name, geom',
    {
      objectid: req.query.objectid,
      schema: DB_GEOM_SCHEMA,
      table: tableName,
      column: columnName,
    })
    .then((data) => {
      res.send({
        data: data
      })
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
  getRooms,
  getParams,
  getGeometry
};
