const inquirer = require('inquirer');
require('colors');

//D A T O S

const preguntas = [
  {
    type: 'list',
    name: 'opcion',
    message: 'Que desea hacer?',
    choices: [
      { value: 1, name: `${'1.'.green} Buscar ciudad` },
      { value: 2, name: `${'2.'.green} Historial` },
      { value: 0, name: `${'0.'.green} Salir` },
    ]
  }
];

//F U N C I O N E S

/*Funcion que desplega el menu inicial del programa*/
const inquirerMenu = async () => {
  console.clear();
  console.log('=================================='.green);
  console.log('      Seleccione una opcion'.white);
  console.log('==================================\n'.green);

  const { opcion } = await inquirer.prompt(preguntas);

  return opcion;
}

/*Funcion que realiza deja de ejecutar el programa hasta que el usuario presione ENTER.*/
const pausa = async () => {
  const question = [
    {
      type: 'input',
      name: 'enter',
      message: `Presione ${'enter'.green} para continuar`
    }]
  await inquirer.prompt(question)
}

/*Funcion que recibe un mensaje por parametro y lo muestra al usuario esperando una respuesta. */
const leerInput = async (message) => {
  const question = [
    {
      type: 'input',
      name: 'desc',
      message,
      validate(value) {
        if (value.length === 0) {
          return 'Por favor ingrese un valor';
        }
        return true;
      }
    }
  ];

  const { desc } = await inquirer.prompt(question);
  return desc;
}

/*Funcion que muestra al usuario las posibles ubicaciones (enumeradas), en la cual tiene que seleccionar una,
este mismo devuelve el valor de la numeracion que tenia la opcion seleccionada.*/
const listarLugares = async (lugares = []) => {
  const choices = lugares.map((lugar, i) => {
    const idx = `${i + 1}.`.green;
    return {
      value: lugar.id,
      name: `${idx} ${lugar.nombre}`
    }
  })

  choices.unshift({
    value: '0',
    name: '0.'.green + ' Cancelar'
  })

  const preguntas = [
    {
      type: 'list',
      name: 'id',
      message: 'Seleccione lugar: ',
      choices
    }
  ]

  const { id } = await inquirer.prompt(preguntas);
  return id;
}

//E X P O R T A C I O N
module.exports = {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
}