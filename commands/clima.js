const axios = require('axios');

module.exports = (bot) => {
  bot.command('clima', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    const city = args.join(' ') || 'London';

    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},ES&appid=5b96febd04f7d0b04ad932ee67f2f9ca&lang=es`);
      const tempCelsius = (response.data.main.temp - 273.15).toFixed(1);
      ctx.reply(`El clima en ${city} es: ${response.data.weather[0].description}, ${tempCelsius}°C`);
    } catch (error) {
      ctx.reply(`¡Ups! No pude obtener el clima de ${city}. Asegúrate de escribir bien el nombre.`);
    }
  });
};