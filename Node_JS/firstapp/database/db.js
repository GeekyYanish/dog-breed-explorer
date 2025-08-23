const { data } = require('../data/data.js');

async function getDataFromDB() {
  return data;
}

module.exports = { getDataFromDB };

