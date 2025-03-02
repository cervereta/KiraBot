module.exports = (bot) => {
    bot.command('foto', (ctx) => {
      ctx.replyWithPhoto({ source: './media/robot.jpg' });
    });
  };