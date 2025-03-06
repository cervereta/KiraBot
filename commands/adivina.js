/*module.exports = (bot) => {
    const games = new Map(); // Almacenar el estado del juego por usuario
  
    bot.command('adivina', (ctx) => {
      const userId = ctx.from.id;
      const number = Math.floor(Math.random() * 100) + 1; // Número entre 1 y 100
      games.set(userId, { number, attempts: 0 });
      ctx.reply('¡He pensado en un número entre 1 y 100! Adivina cuál es. Escribe un número.');
    });
  
    bot.on('text', (ctx) => {
      const userId = ctx.from.id;
      const game = games.get(userId);
      if (!game || ctx.message.text.startsWith('/')) return; // Ignorar si no hay juego o es un comando
  
      const guess = parseInt(ctx.message.text);
      if (isNaN(guess)) {
        ctx.reply('Por favor, escribe un número válido.');
        return;
      }
  
      game.attempts += 1;
      if (guess === game.number) {
        ctx.reply(`¡Felicidades! Adivinaste el número ${game.number} en ${game.attempts} intentos.`);
        games.delete(userId);
      } else if (guess < game.number) {
        ctx.reply('Demasiado bajo. ¡Intentalo de nuevo!');
      } else {
        ctx.reply('Demasiado alto. ¡Intentalo de nuevo!');
      }
    });
  };*/