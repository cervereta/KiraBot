const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);



// Comandos básicos
bot.start((ctx) => {
  ctx.reply('Bienvenido a KiraBot');
});

bot.help((ctx) => {
  ctx.reply('mejor utiliza el comando /ayuda que con este se activan todos los bots');
});

bot.settings((ctx) => {
  ctx.reply('¡¡Caguen la mare que ta parit,tin pasiensia que estic en construcció!!');
});

// Importar comandos personalizados
const saludo = require('./commands/saludo');
const foto = require('./commands/foto');
const audio = require('./commands/audio');
const ayuda = require('./commands/ayuda');
const cagar = require('./commands/cagar');
const listeners = require('./commands/listeners');
const clima = require('./commands/clima');
const menu = require('./commands/menu'); // Añadir el menú

// Registrar los comandos
saludo(bot);
foto(bot);
audio(bot);
ayuda(bot);
cagar(bot);
listeners(bot);
clima(bot);
menu(bot);

// Iniciar el bot
bot.launch();

console.log('KiraBot está en marcha!');