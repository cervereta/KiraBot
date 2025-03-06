module.exports = (bot) => {
  bot.command('foto', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args[0] === 'robot') {
      return ctx.replyWithPhoto({ source: './media/robot.jpg' });
    }

    const userId = ctx.from.id;
    try {
      const photos = await bot.telegram.getUserProfilePhotos(userId);
      if (photos.total_count === 0) {
        return ctx.reply('¡No tienes foto de perfil o no puedo verla! Usa /foto robot si quieres ver la mía.');
      }
      const fileId = photos.photos[0][0].file_id;
      const file = await bot.telegram.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
      await ctx.replyWithPhoto({ url: fileUrl });
    } catch (error) {
      console.error('Error en /foto:', error.message);
      ctx.reply('¡Ups! Algo salió mal al intentar obtener tu foto. Intenta de nuevo.');
    }
  });
};