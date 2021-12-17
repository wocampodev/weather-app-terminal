require('dotenv').config();

const { readEntry, showMenu, stop, listCities } = require("./helpers/inquirer");
const HandlerCityUseCase = require("./services/HandlerCityUseCase");

(async () => {

  const searches = new HandlerCityUseCase();
  let option = null;

  do {

    option = await showMenu();

    switch (option) {
      case 1:

        const cityInput = await readEntry('Ciudad: ');
        const places = await searches.listCities(cityInput);
        const id = await listCities(places);

        if (id === 0) continue;

        const selectedCity = places.find(l => l.id === id);
        const weatherInCity = await searches.getCityWeather(selectedCity.lat, selectedCity.lng);

        console.log('\nInformación de la ciudad\n'.green);
        console.log('Ciudad:', selectedCity.nombre);
        console.log('Latitud:', selectedCity.lat);
        console.log('Longitud:', selectedCity.lng);
        console.log('Mínima:', weatherInCity.minimo);
        console.log('Máxima:', weatherInCity.maximo);
        console.log('Situación del clima:', `${weatherInCity.descripcion}`.green);

        const infoPersistent = {
          id,
          nombre: selectedCity.nombre,
          latitud: selectedCity.lat,
          longitud: selectedCity.lng
          , ...weatherInCity
        };

        searches.saveRecord(infoPersistent);

        break;

      case 2:

        searches.record.forEach(({ nombre }, index) => {
          const position = `${index + 1}.`.green;
          console.log(`${position} ${nombre}`);
        });

        break;
      default:
        break;
    }

    if (option !== 0) await stop();

  } while (option !== 0);

})();
