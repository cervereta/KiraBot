const axios = require('axios');
const translate = require('@iamtraction/google-translate');

module.exports = (bot) => {
  let riddleInterval = null; // Timer for periodic riddles
  let currentRiddle = null; // Current riddle: { riddle: "...", answer: "..." }
  let riddleChatId = null; // Chat ID where the game is active

  /**
   * Fetches a riddle from API Ninjas, translates it to Spanish, stores it, and sends it.
   * @param {number|string} chatId The chat ID to send the riddle to.
   * @returns {Promise<boolean>} True if successful, false if failed.
   */
  const sendRiddle = async (chatId) => {
    currentRiddle = null; // Reset riddle
    try {
      console.log('Solicitando acertijo de API Ninjas...');
      const response = await axios.get('https://api.api-ninjas.com/v1/riddles', {
        headers: { 'X-Api-Key': process.env.RIDDLES_API_KEY }
      });
      const { question: riddleEn, answer: answerEn, title } = response.data[0];

      console.log('Acertijo recibido:', riddleEn);
      const translatedRiddle = await translate(riddleEn, { to: 'es' });
      const translatedAnswer = await translate(answerEn, { to: 'es' });

      currentRiddle = {
        riddle: translatedRiddle.text,
        answer: translatedAnswer.text.toLowerCase().trim(),
      };

      console.log('Enviando acertijo traducido:', translatedRiddle.text);
      await bot.telegram.sendMessage(
        chatId,
        `🧠 ¡Nuevo acertijo! 🧠\n${translatedRiddle.text}\nResponde aquí en el grupo con la respuesta (sin comandos). ¡Tienes hasta el próximo acertijo!`
      );
      return true;
    } catch (error) {
      currentRiddle = null;
      console.error('Error al enviar acertijo:', error.message);
      return false;
    }
  };

  // /riddles: Starts the riddle game in a group
  bot.command('riddles', async (ctx) => {
  try {
    console.log('Comando /riddles recibido en chat:', ctx.chat.id, 'tipo:', ctx.chat.type);
    const chatId = ctx.chat.id;
    if (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup') {
      console.log('Comando /riddles usado fuera de un grupo');
      await ctx.reply('Este comando solo funciona en grupos. Añádeme a un grupo y usa /riddles.');
      return;
    }
    // Resto del código sin cambios

      if (riddleInterval) {
        await ctx.reply('El juego de acertijos ya está activo en este grupo. Usa /stopriddles para pararlo.');
        return;
      }

      riddleChatId = chatId;
      const firstRiddleSuccess = await sendRiddle(chatId);

      if (!firstRiddleSuccess || !currentRiddle) {
        await ctx.reply('No pude iniciar el juego porque no se pudo obtener el primer acertijo. Inténtalo de nuevo más tarde.');
        return;
      }

      riddleInterval = setInterval(async () => {
        const success = await sendRiddle(chatId);
        if (!success) {
          clearInterval(riddleInterval);
          riddleInterval = null;
          currentRiddle = null;
          if (riddleChatId) {
            await bot.telegram.sendMessage(
              riddleChatId,
              'No se pudo obtener un nuevo acertijo. El juego se ha detenido. Usa /riddles para empezar de nuevo.'
            ).catch(err => console.error('Error sending stop message:', err));
          }
        }
      }, 60 * 60 * 1000); // Every 60 minutes

      await ctx.reply('¡Juego de acertijos iniciado! Enviaré un acertijo cada 60 minutos. Usa /stopriddles para parar.');
    } catch (error) {
      console.error('Error en /riddles:', error);
      currentRiddle = null;
      if (error.response && error.response.error_code === 403) {
        console.log(`No puedo responder a ${chatId}: bot bloqueado o sin permisos`);
      }
      await ctx.reply('¡Ups! Algo salió mal al iniciar el juego. Intenta de nuevo.');
    }
  });

  // /stopriddles: Stops the riddle game
  bot.command('stopriddles', async (ctx) => {
    try {
      if (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup') {
        await ctx.reply('Este comando solo funciona en grupos.');
        return;
      }

      if (!riddleInterval) {
        await ctx.reply('No hay juego de acertijos activo en este grupo.');
        return;
      }

      clearInterval(riddleInterval);
      riddleInterval = null;
      currentRiddle = null;
      riddleChatId = null;

      await ctx.reply('Juego de acertijos detenido. Usa /riddles para empezar de nuevo.');
    } catch (error) {
      console.error('Error en /stopriddles:', error);
      if (error.response && error.response.error_code === 403) {
        console.log(`No puedo responder a ${ctx.chat.id}: bot bloqueado o sin permisos`);
      }
      await ctx.reply('¡Ups! Algo salió mal al parar el juego. Intenta de nuevo.');
    }
  });

  // Handles user answers
  bot.on('text', async (ctx) => {
    try {
      const chatId = ctx.chat.id;
      const userId = ctx.from.id;
      const username = ctx.from.username || ctx.from.first_name;

      if (chatId !== riddleChatId || !currentRiddle) return;
      if (ctx.message.text.startsWith('/')) return;

      const userAnswer = ctx.message.text.toLowerCase().trim();
      const correctAnswer = currentRiddle.answer;

      if (userAnswer === correctAnswer) {
        await ctx.reply(`¡Correcto, @${username}! La respuesta era: ${correctAnswer}. ¡Espera el próximo acertijo en 60 minutos!`);
        currentRiddle = null;
      } else {
        await ctx.reply(`Lo siento, @${username}, "${userAnswer}" no es correcto. ¡Inténtalo con el próximo acertijo!`);
      }
    } catch (error) {
      console.error('Error al procesar respuesta:', error);
      if (error.response && error.response.error_code === 403) {
        console.log(`No puedo responder a ${userId}: bot bloqueado o sin permisos`);
      }
    }
  });
};