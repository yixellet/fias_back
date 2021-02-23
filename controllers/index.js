
const pgp = require('pg-promise')();
const { ParameterizedQuery } = require('pg-promise');
const {
  DB_HOST, 
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = require('../config');

const db = pgp(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

function getObjectsByLevel(req, res) {
  const getDistrs = new ParameterizedQuery(
    {text: 'SELECT * FROM fiastest.addr_obj WHERE level = $1 AND (isactual = $2 AND isactive = $3)', values: [req.query.level, 1, 1]}
  );
  db.any(getDistrs)
  .then((data) => {
    res.send({data});
  })
  .catch((error) => {
    res.send({error});;
  });
}

module.exports = { getObjectsByLevel };
