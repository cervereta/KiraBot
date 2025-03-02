module.exports = (bot) => {
    bot.command('audio', (ctx) => {
      ctx.replyWithAudio({ source: './media/elmio.ogg' });
    });
  };