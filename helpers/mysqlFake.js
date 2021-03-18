const fs = require('fs');

const PATH_DB = './db/data.json';

const guardarDB = data => {
  fs.writeFileSync( PATH_DB, JSON.stringify(data) );
};

const leerDB = () => {

  if ( !fs.existsSync(PATH_DB) ) return [];

  const info = fs.readFileSync( PATH_DB, { encoding: 'utf-8' } );
  const data = JSON.parse(info);
  
  return data;

}

module.exports = {
  guardarDB,
  leerDB
};
