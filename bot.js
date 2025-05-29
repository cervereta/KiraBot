const { Telegraf } = require('telegraf');
require('dotenv').config();

try {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.start(async (ctx) => {
    try {
      await ctx.reply('Bienvenido a KiraBot 🤖, soy un bot creado por @JoseCervereta Pincha en /menu y accede a todo el contenido');
    } catch (error) {
      if (error.response && error.response.error_code === 403) {
        console.log(`No puedo enviar mensaje a ${ctx.from.id}: bot bloqueado por el usuario`);
      } else {
        console.error('Error en /start:', error);
      }
    }
  });

  bot.help((ctx) => {
    ctx.reply('Mejor utiliza el comando /ayuda');
  });

  bot.settings((ctx) => {
    ctx.reply('No tengo ajustes que puedas configurar,soy un Bot para el entretimiento');
  });

  const saludo = require('./commands/saludo');
  const foto = require('./commands/foto');
  const audio = require('./commands/audio');
  const ayuda = require('./commands/ayuda');
  const cagar = require('./commands/cagar');
  const clima = require('./commands/clima');
  const menu = require('./commands/menu');
  const gato = require('./commands/gato');
  const chiste = require('./commands/chiste');
  const perro = require('./commands/perro');
  const frase = require('./commands/frase');
  const trivia = require('./commands/trivia');
  const riddle = require('./commands/riddle'); // Nuevo módulo

  saludo(bot);
  foto(bot);
  audio(bot);
  ayuda(bot);
  cagar(bot);
  clima(bot);
  menu(bot);
  gato(bot);
  chiste(bot);
  perro(bot);
  frase(bot);
  trivia(bot);
  riddle(bot);

  bot.launch();
  console.log('KiraBot está en marcha!');

  bot.telegram.getMe().then((botInfo) => {
    console.log('Bot conectado como:', botInfo.username);
  }).catch((error) => {
    console.error('Error al conectar con Telegram:', error);
  });
} catch (error) {
  console.error('Error al iniciar KiraBot:', error);
  process.exit(1);
}

