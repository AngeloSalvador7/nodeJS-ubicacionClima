const fs = require('fs');
const axios = require('axios');

class Busquedas {

  //A T R I B U T O S

  historial = [];

  dbPath = './db/database.json';

  get paramsMapBox() {
    return { 'access_token': process.env.MAPBOX_KEY, 'limit': 5, 'language': 'es' }
  }

  get historialCapitalizado() {
    return this.historial.map(lugar => {
      let palabras = lugar.split(' ');
      palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));
      return palabras.join(' ');
    })
  }

  //C O N S T R U C T OR

  constructor() { this.leerDB(); }

  //M E T O D O S

  /*Metodo que busca las opciones con la ubicacion ingresada por el usuario.
  Cada ubicacion encontrada retorna {id, nombre, longitud y latitud}*/
  async ciudad(lugar) {
    try {
      // peticion http
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapBox
      });

      const resp = await instance.get();

      return resp.data.features.map(lugar => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));

    } catch (error) {
      return [];
    }
  }

  /*Metodo que busca de la ubicacion seleccionada el clima y sus variantes, pasando por parametros
  latitud y longitud de la misma. Retorna temp actual, temp min, temp max y descripcion de la misma.*/
  async clima(lat, lon) {
    try {
      // peticion http
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { lat, lon, 'appid': process.env.OPENWEATHER_KEY, 'units': 'metric', 'lang': 'es' }
      });

      const resp = await instance.get();

      return {
        temp: resp.data.main.temp,
        min: resp.data.main.temp_min,
        max: resp.data.main.temp_max,
        desc: resp.data.weather[0].description
      }

    } catch (error) {
      return;
    }
  }

  /*Metodo que agrega la ubicacion seleccionada al array del historial de ubicaciones buscadas,
  (en caso de que no este registrada ya). Solo permite tener almacenados cinco registros como maximo.*/
  agregarHistorial(lugar) {
    if (this.historial.includes(lugar.toLocaleLowerCase())) { return; }

    this.historial.unshift(lugar.toLocaleLowerCase());

    //Solo permitir 5 registros en el historial.
    this.historial = this.historial.splice(0, 5);

    //Guardar en DB
    this.guardarDB();
  }

  /*Metodo que crea/reescribe el archivo.JSON donde almacenamos el historial de ubicaciones buscadas.*/
  guardarDB() {
    fs.writeFileSync(this.dbPath, JSON.stringify(this.historial));
  }

  /*Metodo que extrae la informacion de la base de datos (si existe) para tener consistencia en los datos.*/
  leerDB() {
    //Verificar si existe el archivo, si no existe, el array de historial queda como se declaro (vacio).
    if (fs.existsSync(this.dbPath)) {
      const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
      const data = JSON.parse(info);
      this.historial = data;
    }
  }
}

//E X P O R T A C I O N
module.exports = Busquedas;