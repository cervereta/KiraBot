const axios = require('axios');
const translate = require('@iamtraction/google-translate');

module.exports = (bot) => {
  bot.command('frase', async (ctx) => {
    try {
      const response = await axios.get('https://zenquotes.io/api/random');
      const quoteEn = `${response.data[0].q} — ${response.data[0].a}`;
      const translated = await translate(quoteEn, { to: 'es' });
      ctx.reply(translated.text);
    } catch (error) {
      ctx.reply('¡Ups! No pude encontrar o traducir una frase. Intenta de nuevo.');
    }
  });
};