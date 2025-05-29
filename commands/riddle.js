const axios = require('axios');
const translate = require('@iamtraction/google-translate');

module.exports = (bot) => {
  // MODULE-LEVEL VARIABLES:
  // `riddleInterval`: Stores the timer ID from setInterval. Used to repeatedly send riddles
  //                   and to stop the riddle game via clearInterval. Null if no game is active.
  let riddleInterval = null;
  // `currentRiddle`: An object holding the current active riddle's text and answer.
  //                  Null if no riddle is currently active or if fetching a riddle failed.
  //                  Its structure is: { riddle: "...", answer: "..." }
  let currentRiddle = null;
  // `riddleChatId`: Stores the ID of the chat where the riddle game is currently active.
  //                 Ensures the bot listens for answers only in that specific chat. Null if no game is active.
  let riddleChatId = null;

  /**
   * Fetches a new riddle, translates it to Spanish, stores it, and sends it to the specified chat.
   * Resets `currentRiddle` at the beginning of each attempt.
   * @param {number|string} chatId The ID of the chat to send the riddle to.
   * @returns {Promise<boolean>} True if a riddle was successfully sent, false otherwise.
   */
  const sendRiddle = async (chatId) => {
    // Reset currentRiddle at the start of each attempt to ensure no stale riddle data persists.
    currentRiddle = null;
    try {
      console.log('Solicitando acertijo de la API...');
      const response = await axios.get('https://riddles-api.vercel.app/random');
      const { riddle: riddleEn, answer: answerEn } = response.data;

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
      return true; // Indicate success: riddle fetched, translated, stored, and sent.
    } catch (error) {
      // If any error occurs (API request, translation, sending message),
      // ensure currentRiddle is null, log the error for debugging.
      currentRiddle = null;
      console.error('Error al enviar acertijo:', error);
      // Return false to indicate that sending a riddle failed.
      // The caller (e.g., /riddles command or setInterval callback) is responsible
      // for handling this failure (e.g., informing the user, stopping the game).
      return false;
    }
  };

  // Comando /riddles: Initiates the riddle game in a group chat.
  bot.command('riddles', async (ctx) => {
    try {
      const chatId = ctx.chat.id;
      if (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup') {
        await ctx.reply('Este comando solo funciona en grupos. Añádeme a un grupo y usa /riddles.');
        return;
      }

      if (riddleInterval) {
        await ctx.reply('El juego de acertijos ya está activo en este grupo. Usa /stopriddles para pararlo.');
        return;
      }

      riddleChatId = chatId; // Store the chat ID for the current game.

      // Attempt to send the first riddle. This is awaited to ensure it completes
      // before deciding whether to start the periodic riddle sending.
      const firstRiddleSuccess = await sendRiddle(chatId);

      // CRITICAL CHECK:
      // 1. `!firstRiddleSuccess`: Checks the explicit return value of `sendRiddle`. If false, an error occurred.
      // 2. `currentRiddle === null`: This is a defensive check. `sendRiddle` sets `currentRiddle` to null
      //    at its start and on error. If it's still null, it means no riddle was successfully loaded.
      // If either is true, the game cannot start.
      if (currentRiddle === null || !firstRiddleSuccess) {
        await ctx.reply('No pude iniciar el juego de acertijos porque no se pudo obtener el primer acertijo. Inténtalo de nuevo más tarde.');
        // Optional: riddleChatId = null; // Reset if game couldn't start, to be very clean.
        return; // Stop further execution.
      }

      // If the first riddle was sent successfully, start the interval timer.
      // The setInterval callback is `async` because `sendRiddle` is an async function.
      riddleInterval = setInterval(async () => {
        // Attempt to send a new riddle.
        const success = await sendRiddle(chatId);
        // If `sendRiddle` returns `false`, it failed to get or send a riddle.
        if (!success) {
          // Stop the game: clear the interval, reset state variables.
          clearInterval(riddleInterval);
          riddleInterval = null;
          currentRiddle = null; // Ensure no active riddle.
          // Inform the chat that the game has stopped due to an error.
          // Check riddleChatId to ensure we're not trying to send to a null ID if something went wrong.
          if (riddleChatId) {
            await bot.telegram.sendMessage(
              riddleChatId,
              'No se pudo obtener un nuevo acertijo. El juego de acertijos se ha detenido. Puedes intentar iniciarlo de nuevo más tarde con /riddles.'
            ).catch(err => console.error('Error sending stop message:', err));
          }
        }
      }, 60 * 60 * 1000); // Interval: 60 minutes

      await ctx.reply('¡Juego de acertijos iniciado! Enviaré un acertijo cada 60 minutos. Usa /stopriddles para parar.');
    } catch (error) {
      console.error('Error en /riddles:', error);
      // General error handler for the /riddles command itself.
      // Ensure currentRiddle is reset in case an unexpected error occurred during setup.
      currentRiddle = null;
      // riddleChatId = null; // Also good to reset this on failure.
      if (error.response && error.response.error_code === 403) {
        console.log(`No puedo responder a ${chatId}: bot bloqueado o sin permisos`);
      }
      await ctx.reply('¡Ups! Algo salió mal al iniciar el juego. Intenta de nuevo.');
    }
  });

  // Comando /stopriddles: Stops the active riddle game in a group chat.
  bot.command('stopriddles', async (ctx) => {
    try {
      if (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup') {
        await ctx.reply('Este comando solo funciona en grupos.');
        return;
      }

      // Check if a game is actually running.
      if (!riddleInterval) {
        await ctx.reply('No hay juego de acertijos activo en este grupo.');
        return;
      }

      // Stop the interval timer.
      clearInterval(riddleInterval);
      // Reset all game-related state variables.
      riddleInterval = null;
      currentRiddle = null;
      riddleChatId = null;

      await ctx.reply('Juego de acertijos detenido. Usa /riddles para empezar de nuevo.');
    } catch (error) {
      // Log any errors that occur during the stopping process.
      console.error('Error en /stopriddles:', error);
      if (error.response && error.response.error_code === 403) {
        console.log(`No puedo responder a ${ctx.chat.id}: bot bloqueado o sin permisos`);
      }
      await ctx.reply('¡Ups! Algo salió mal al parar el juego. Intenta de nuevo.');
    }
  });

  // Manejador de respuestas: Processes incoming text messages to check for riddle answers.
  bot.on('text', async (ctx) => {
    try {
      const chatId = ctx.chat.id;
      const userId = ctx.from.id;
      const username = ctx.from.username || ctx.from.first_name;

      // Conditions to process a message as an answer:
      // 1. `chatId === riddleChatId`: The message must come from the chat where the game is active.
      // 2. `currentRiddle`: There must be an active riddle waiting for an answer.
      //    (If null, it means no riddle is active, or one was just solved).
      if (chatId !== riddleChatId || !currentRiddle) return; // Ignore if not relevant.

      // 3. `!ctx.message.text.startsWith('/')`: Ignore commands.
      if (ctx.message.text.startsWith('/')) return;

      // Prepare user's answer: convert to lowercase and trim whitespace for consistent comparison.
      const userAnswer = ctx.message.text.toLowerCase().trim();
      const correctAnswer = currentRiddle.answer;

      if (userAnswer === correctAnswer) {
        await ctx.reply(`¡Correcto, @${username}! La respuesta era: ${correctAnswer}. ¡Espera el próximo acertijo en 60 minutos!`);
        // Reset currentRiddle immediately after a correct answer to prevent multiple correct responses
        // for the same riddle and to signify that this riddle is now "closed".
        currentRiddle = null;
      } else {
        // Optionally, you might want to give feedback for wrong answers or just ignore them.
        // Current implementation gives feedback.
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