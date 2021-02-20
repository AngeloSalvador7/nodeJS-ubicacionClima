require('dotenv').config()
const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async () => {

  const busquedas = new Busquedas();
  let opt;

  do {

    opt = await inquirerMenu();

    switch (opt) {

      case 1:
        /*Se solicita al usuario la ubicacion a buscar.*/
        const termino = await leerInput('Ciudad: ');

        /*Se buscan las opciones con la ubicacion ingresada por el usuario y se guarda en un array.*/
        const lugares = await busquedas.ciudad(termino);

        /*Se muestra al usuario las posibles ubicaciones (enumeradas), el valor de la opcion
        seleccionada se guarda en una constante.*/
        const id = await listarLugares(lugares);

        /*Se recorre el array que almacena las opciones de la ubicacion, comparando el id de cada una 
        con el id seleccionado para asi encontrar y guardar la ubicacion seleccionada en una constante*/
        const lugarSelec = lugares.find(l => l.id === id);
        /*En caso de que el id seleccionado sea 0, se muestra el menu inicial (0 == Cancelar)*/
        if (id === '0') continue;

        /*Se guarda en la DB el nombre de la ubicacion seleccionada.*/
        busquedas.agregarHistorial(lugarSelec.nombre);

        /*Se busca el clima y las variantes de la ubicacion seleccionada, almacenando en una constante la informacion.*/
        const clima = await busquedas.clima(lugarSelec.lat, lugarSelec.lng);

        /*Se muestra al usuario toda la informacion recolectada de la ubicacion seleccionada*/
        console.log('\nInformacion de la ciudad\n'.blue);
        console.log('Ciudad: ', lugarSelec.nombre.green);
        console.log('Lat: ', lugarSelec.lat);
        console.log('Lng: ', lugarSelec.lng);
        console.log('Temperatura: ', clima.temp);
        console.log('Minima: ', clima.min);
        console.log('Maxima: ', clima.max);
        console.log('Descripcion clima: ', clima.desc.green);
        break;

      case 2:
        //Se muestra al usuario el historial de busquedas de ubicaciones.
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}`.green;
          console.log(`${idx} ${lugar}`);
        })
        break;

      case 0:
        //Cierre del programa.
        console.log('Hasta pronto.')
        break;
    }

    if (opt !== 0) await pausa();

  } while (opt !== 0);

}

main();