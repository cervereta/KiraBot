module.exports = (bot) => {
    bot.command('menu', (ctx) => {
      const userName = ctx.from.first_name || 'amigo';
      ctx.reply(`*¡Hola ${userName}!* ¿Qué quieres hacer?`, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Saludar', callback_data: 'saludo' }],
            [{ text: 'Ver el clima', callback_data: 'clima' }],
            [{ text: 'Foto', callback_data: 'foto' }],
            [{ text: 'Audio', callback_data: 'audio' }],
            [{ text: 'Cerrar', callback_data: 'cerrar' }]
          ]
        }
      });
    }); // Cierre del bot.command
  
    // Acciones de los botones
    bot.action('saludo', (ctx) => {
      const userName = ctx.from.first_name || 'amigo';
      ctx.reply(`¡Hola de nuevo, ${userName}! ¿Qué tal?`);
    });
  
    bot.action('clima', (ctx) => {
      ctx.reply('Escribe /clima <ciudad> para ver el clima, por ejemplo: /clima Madrid');
    });
  
    bot.action('foto', (ctx) => {
      ctx.replyWithPhoto({ source: './media/robot.jpg' });
    });
  
    bot.action('audio', (ctx) => {
      ctx.replyWithAudio({ source: './media/elmio.ogg' });
    });
  
    bot.action('cerrar', (ctx) => {
      ctx.reply('¡Menú cerrado! Usa /menu si quieres volver a verlo.');
      ctx.deleteMessage();
    });
  }; // Cierre del module.exports