const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);



// Comandos básicos
bot.start((ctx) => {
  ctx.reply('Bienvenido a KiraBot 🤖, soy un bot creado por @JoseCervereta Pincha en /menu y accede a todo el contenido');
});

bot.help((ctx) => {
  ctx.reply('Mejor utiliza el comando /ayuda');
});

bot.settings((ctx) => {
  ctx.reply('¡¡Caguen la mare que ta parit, ten paciencia que estoy en Construcción!!');
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
const gato = require('./commands/gato');
const chiste = require('./commands/chiste');
const perro = require('./commands/perro'); // Nuevo
const frase = require('./commands/frase'); // Nuevo
const adivina = require('./commands/adivina'); // Nuevo

// Registrar los comandos
saludo(bot);
foto(bot);
audio(bot);
ayuda(bot);
cagar(bot);
listeners(bot);
clima(bot);
menu(bot);
gato(bot);
chiste(bot);
perro(bot);
frase(bot);
adivina(bot);

// Iniciar el bot
bot.launch();

console.log('KiraBot está en marcha!');