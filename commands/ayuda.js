module.exports = (bot) => {
    bot.command('ayuda', (ctx) => {
      ctx.reply(`Estos son todos los comandos que tengo por ahora:
      
  /start
  /help
  /settings
  /saludo
  /saludar
  /cagar
  /pisar
  /foto
  /audio
  /clima
  /menu`);
    });
  };