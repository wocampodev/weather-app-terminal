const axios = require('axios');
const { saveInDatabase, readFromDatabase } = require('../helpers/json-db-handler');

class HandlerCityUseCase {

  record = [];

  constructor() {
    this.retrieveSearches();
  }

  get paramsMapbox() {
    return {
      'access_token': process.env.MAPBOX_KEY,
      'limit': 5,
      'lenguage': 'es'
    };
  }

  get paramsOpenWeather() {
    return {
      'appid': process.env.OPEN_WEATHER_KEY,
      'units': 'metric',
      'lang': 'es'
    };
  }

  async retrieveSearches() {
    this.record = await readFromDatabase();
  }

  saveRecord(city) {

    const foundCity = this.record.find(place => place.id === city.id);

    if (!foundCity) this.record.unshift(city);

    const recordsInJson = this.record.filter((_, index) => index < 5);

    saveInDatabase(recordsInJson);
    this.retrieveSearches();

  }

  async listCities(place = '') {

    try {

      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
        params: this.paramsMapbox
      });

      const response = await instance.get();
      return response.data.features.map(ciudad => ({
        id: ciudad.id,
        nombre: ciudad.place_name,
        lng: ciudad.center[0],
        lat: ciudad.center[1],
      }));

    } catch (error) {
      return [];
    }

  }

  async getCityWeather(lat = 0, lon = 0) {

    try {

      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { lat, lon, ...this.paramsOpenWeather }
      });

      const respuesta = await instance.get();
      const { main, weather } = respuesta.data;

      return {
        minimo: main.temp_min,
        maximo: main.temp_max,
        descripcion: weather[0].description,
      };

    } catch (error) {
      return { error: 'Without data' };
    }

  }

}

module.exports = HandlerCityUseCase;
