const inquirer = require('inquirer');
require('colors');

const questions = [
  {
    type: 'list',
    name: 'option',
    message: 'Qué desea hacer?',
    choices: [
      {
        value: 1,
        name: `${'1.'.green} Buscar ciudad`,
      },
      {
        value: 2,
        name: `${'2.'.green} Historial`,
      },
      {
        value: 0,
        name: `${'0.'.green} Salir`,
      },
    ],
  },
];

const showMenu = async () => {
  console.log('======================='.green);
  console.log(' Seleccione una opción '.white);
  console.log('=======================\n'.green);

  const { option } = await inquirer.prompt(questions);

  return option;
};

const stop = async () => {
  console.log('\n');

  const { option } = await inquirer.prompt([
    {
      type: 'input',
      name: 'close',
      message: `Presiona ${'ENTER'.green} para continuar.`,
    },
  ]);

  return option;
};

const readEntry = async message => {

  const question = [
    {
      type: 'input',
      name: 'ciudad',
      message,
      validate(value) {
        if (value.length === 0) {
          return 'Ingrese una ciudad';
        }
        return true;
      },
    },
  ];

  const { ciudad } = await inquirer.prompt(question);

  return ciudad;

};

const listOptions = (ciudades = [], message = '') => {

  const choices = ciudades.map((ciudad, index) => {
    const posicion = `${index + 1}.`.green;
    return {
      value: ciudad.id,
      name: `${posicion} ${ciudad.nombre}`,
    };
  });

  choices.unshift({
    value: 0,
    name: '0.'.green + 'Cancelar',
  });

  const question = [
    {
      type: 'list',
      name: 'option',
      message,
      choices,
    }
  ];

  return question;

};

const listCities = async (lugares = []) => {

  const question = listOptions(lugares, 'Eliga una ciudad a consultar');

  const { option } = await inquirer.prompt(question);

  return option;

};

module.exports = {
  showMenu,
  stop,
  readEntry,
  listCities,
  listOptions
};
