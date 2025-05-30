const { Telegraf } = require('telegraf');
require('dotenv').config();

try {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  // Manejador de errores global
  bot.catch((err, ctx) => {
    console.error('Error en Telegraf:', err);
    if (err.code === 'ECONNRESET' || err.error_code === 409) {
      console.log('Reintentando conexión en 5 segundos...');
      setTimeout(() => bot.launch().catch(() => {}), 5000);
    }
  });

  console.log('Registrando comandos...'); // Depuración

  bot.start(async (ctx) => {
    try {
      await ctx.reply('Bienvenido a KiraBot 🤖, soy un bot creado por @JoseCervereta Pincha en /menu y accede a todo el contenido');
    } catch (error) {
      console.error('Error en /start:', error);
    }
  });

  bot.help((ctx) => ctx.reply('Mejor utiliza el comando /ayuda'));
  bot.settings((ctx) => ctx.reply('¡¡Caguen la mare que ta parit, ten paciencia que estoy en Construcción!!'));

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
  const riddle = require('./commands/riddle');

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

// esperemos que esta sea la definitiva