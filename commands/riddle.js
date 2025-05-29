const axios = require('axios');
const translate = require('@iamtraction/google-translate');

module.exports = (bot) => {
  let riddleInterval = null; // Temporizador
  let currentRiddle = null; // Acertijo actual
  let riddleChatId = null; // Chat ID del grupo

  // Enviar un acertijo
  const sendRiddle = async (chatId) => {
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
    } catch (error) {
      console.error('Error al enviar acertijo:', error.message);
      await bot.telegram.sendMessage(
        chatId,
        '¡Ups! No pude obtener un acertijo. Intentaré de nuevo en 60 minutos.',
        { disable_notification: true }
      ).catch((err) => {
        if (err.response && err.response.error_code === 403) {
          console.log(`No puedo enviar mensaje a ${chatId}: bot bloqueado o sin permisos`);
        }
      });
    }
  };

  // Comando /riddles
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

      riddleChatId = chatId;
      await sendRiddle(chatId);

      riddleInterval = setInterval(() => {
        sendRiddle(chatId);
      }, 60 * 60 * 1000); // Cada 60 minutos

      await ctx.reply('¡Juego de acertijos iniciado! Enviaré un acertijo cada 60 minutos. Usa /stopriddles para parar.');
    } catch (error) {
      console.error('Error en /riddles:', error);
      if (error.response && error.response.error_code === 403) {
        console.log(`No puedo responder a ${chatId}: bot bloqueado o sin permisos`);
      }
      await ctx.reply('¡Ups! Algo salió mal al iniciar el juego. Intenta de nuevo.');
    }
  });

  // Comando /stopriddles
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

  // Manejador de respuestas
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
        currentRiddle = null; // Evitar respuestas repetidas
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