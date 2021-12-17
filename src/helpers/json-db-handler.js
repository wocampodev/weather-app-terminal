const fs = require('fs');
const path = require('path');

const PATH_DB = path.join(__dirname, '../db/data.json');

const saveInDatabase = data => {
  fs.writeFileSync(PATH_DB, JSON.stringify(data));
};

const readFromDatabase = () => {

  if (!fs.existsSync(PATH_DB)) return [];

  const info = fs.readFileSync(PATH_DB, { encoding: 'utf-8' });
  const data = JSON.parse(info);
  return data;

}

module.exports = {
  saveInDatabase,
  readFromDatabase
};
