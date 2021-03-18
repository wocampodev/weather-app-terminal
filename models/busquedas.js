const axios = require('axios');
const { guardarDB, leerDB } = require('../helpers/mysqlFake');

class Busquedas {

    historial = [];

    constructor() {
        this.recuperarBusquedas();
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

    async recuperarBusquedas() {
        this.historial = await leerDB();
    }

    guardar( ciudad ) {

        const buscado = this.historial.find( lugar => lugar.id === ciudad.id );

        if ( !buscado ) {
            this.historial.unshift( ciudad );
        }

        const datosPersistentes = this.historial.filter( ( _, index ) => index < 5 );

        guardarDB( datosPersistentes );
        this.recuperarBusquedas();

    }

    async ciudadesListado( lugar = '' ) {

        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox 
            });
            
            const respuesta = await instance.get();
            return respuesta.data.features.map( ciudad => ({
                id: ciudad.id,
                nombre: ciudad.place_name,
                lng: ciudad.center[0],
                lat: ciudad.center[1],
            }));

        } catch (error) {
            return [];
        }

    }

    async climaCiudad( lat = 0, lon = 0 ) {

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
            return { error: 'Sin datos' };
        }

    }

}



module.exports = Busquedas;