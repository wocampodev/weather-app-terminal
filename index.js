require('dotenv').config();

const { leerEntrada, mostrarMenu, pausar, listarCiudades } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");



(async () => {

    const busquedas = new Busquedas();
    let opcion = null;

    console.log(busquedas.historial);

    do {

        opcion = await mostrarMenu();
        
        switch  ( opcion ) {
            case 1:

                const entrada = await leerEntrada('Ciudad: ');
                const lugares = await busquedas.ciudadesListado( entrada );
                const id = await listarCiudades( lugares );

                if ( id === 0 ) continue;

                const seleccionado = lugares.find( l => l.id === id );
                const clima = await busquedas.climaCiudad( seleccionado.lat, seleccionado.lng );

                console.log( '\nInformación de la ciudad\n'.green );
                console.log( 'Ciudad:', seleccionado.nombre );
                console.log( 'Latitud:', seleccionado.lat );
                console.log( 'Longitud:', seleccionado.lng );
                console.log( 'Mínima:', clima.minimo );
                console.log( 'Máxima:', clima.maximo );
                console.log( 'Situación del clima:', `${ clima.descripcion }`.green );

                const persistente = { 
                    id,
                    nombre: seleccionado.nombre, 
                    latitud: seleccionado.lat, 
                    longitud: seleccionado.lng
                    ,...clima 
                };

                await busquedas.guardar( persistente );

                break;

            case 2:
                busquedas.historial.forEach( ( { nombre }, index) => {
                    const posicion = `${ index +1 }.`.green;
                    console.log( `${ posicion } ${ nombre }` );
                });
                break;
            default:
                break;
        }

        if ( opcion !== 0 ) await pausar();

    } while ( opcion !== 0 );

})();