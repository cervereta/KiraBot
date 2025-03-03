const axios = require('axios');

module.exports = (bot) => {
  bot.command('perro', async (ctx) => {
    try {
      const response = await axios.get('https://api.thedogapi.com/v1/images/search');
      const imageUrl = response.data[0].url;
      ctx.replyWithPhoto({ url: imageUrl });
    } catch (error) {
      ctx.reply('¡Ups! No pude encontrar un perro. Intenta de nuevo.');
    }
  });
};