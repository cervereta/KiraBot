module.exports = (bot) => {
  bot.command(['saludo', 'saludar'], (ctx) => {
    const userName = ctx.from.first_name || 'amigo'; // Si no hay nombre, usa "amigo" por defecto
    console.log(ctx);
    ctx.reply(`Hola ${userName}, soy KiraBot, ¿en qué puedo ayudarte?`);
  });
};