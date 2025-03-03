const fs = require('fs');

module.exports = (bot) => {
  bot.command('audio', async (ctx) => {
    const audioPath = './media/benny.mp3'; // Cambiado a .mp3
    try {
      if (!fs.existsSync(audioPath)) {
        return ctx.reply('¡Ups! No encuentro el archivo de audio en el servidor.');
      }
      await ctx.replyWithAudio({ source: audioPath });
    } catch (error) {
      console.error('Error al enviar el audio:', error.message);
      ctx.reply('¡Ups! Algo salió mal al enviar el audio, Utiliza directamente el comando /audio');
    }
  });
};