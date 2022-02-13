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
            o.typename, 
            o.level 
          FROM ${DB_SCHEMA}.addr_obj o 
          WHERE LOWER(o.name) LIKE LOWER('%${req.query.string}%') 
            AND o.isactual = 1 AND o.isactive = 1 AND o.level IN (${req.query.mode === 'adm_div' ? 
            `'1','2','5','6','7','8','9','10','11','12','13','14','15','16','17'` : 
            `'1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17'`}) 
          LIMIT 10;`)
    .then((data) => {
      res.send({ data });
    })
    .catch((error) => {
      res.send({ error });
    });
}

function search(req, res) {
  function a(data, variable) {
    variable = data
  }
  db.any(`SELECT o.objectid,
            o.name,
            o.typename,
            o.level
          FROM ${DB_SCHEMA}.addr_obj o
          WHERE LOWER(o.name) LIKE LOWER('%${req.query.string}%')
            AND o.isactual = 1 AND o.isactive = 1`)
    .then((data) => {
      const newData = []
      data.forEach((object) => {
        const newObject = object
        let gene
        db.any(`SELECT * FROM ${DB_SCHEMA}.genealogy_mun(${object.objectid})`)
          .then((gen) => {
            a(gen, gene)
          })
        newObject.gen = gene
        console.log(gene)
        newData.push(newObject)
      })
      res.send({ newData });
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

function getObject(req, res) {
  db.one('SELECT objectid, name, typename, level \
          FROM ${schema:name}.addr_obj \
          WHERE objectid=${objectid} AND isactual=1 AND isactive=1',
  {
    objectid: req.query.objectid,
    schema: DB_SCHEMA
  })
    .then((data) => {
      res.send(data)
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
      columnName = 'objectid_adm'
      break;
    case '2':
      tableName = 'borders_Astrakhan'
      columnName = 'objectid_adm'
      break;
    case '3':
      tableName = 'borders_Astrakhan'
      columnName = 'objectid_mun'
      break;
    case '4':
      tableName = 'borders_Astrakhan'
      columnName = 'objectid_mun'
      break;
    case '5':
      tableName = 'settlements'
      columnName = 'objectid_adm'
      break;
    case '6':
      tableName = 'settlements'
      columnName = 'objectid_adm'
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
  db.one('SELECT ST_AsGeoJSON(ab.geom) AS geom, \
            ST_Extent(ab.geom) AS extent \
          FROM ${schema:name}.${table:name} ab \
          WHERE ab.${column:name} = ${objectid} \
          GROUP BY geom;',
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

function getParents(req, res) {
  db.any('SELECT * FROM ${schema:name}.${table:name}(${objectid});',
  {
    objectid: req.query.objectid,
    schema: DB_SCHEMA,
    table: req.query.mode === 'adm_div' ? 'genealogy_adm' : 'genealogy_mun'
  })
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      res.send({ error });
    });
}

module.exports = {
  liveSearch,
  search,
  getLevels,
  getObject,
  getChildren,
  getHouseChildren,
  getRooms,
  getParams,
  getGeometry,
  getParents
};
