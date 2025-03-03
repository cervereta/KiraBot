const axios = require('axios');

module.exports = (bot) => {
  bot.command('chiste', async (ctx) => {
    try {
      const response = await axios.get('https://v2.jokeapi.dev/joke/Any?lang=es');
      const joke = response.data.type === 'single' 
        ? response.data.joke 
        : `${response.data.setup} - ${response.data.delivery}`;
      ctx.reply(joke);
    } catch (error) {
      ctx.reply('¡Ups! No pude encontrar un chiste. Intenta de nuevo.');
    }
  });
};