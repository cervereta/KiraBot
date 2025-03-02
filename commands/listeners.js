module.exports = (bot) => {
    bot.hears('computadora', (ctx) => {
      ctx.reply('yeeee ¡¡figura!! yo soy una maquina tambien');
    });
  
    bot.on('sticker', (ctx) => {
      ctx.reply('¡¡Que guay,!! mira quins ninots mes chulos');
    });
  };