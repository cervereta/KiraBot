const axios = require('axios');
const translate = require('@iamtraction/google-translate');

module.exports = (bot) => {
  const triviaGames = new Map();
  const adivinaGames = new Map();

  const backsideCategories = {
    'general': 9,
    'cine': 11,
    'musica': 12,
    'ciencia': 17,
    'historia': 23,
    'geografia': 22,
    'deportes': 21
  };

  // Función auxiliar para enviar una pregunta de trivia
  const sendTriviaQuestion = async (ctx, categoryId, categoryName = '') => {
    const userId = ctx.from.id;
    console.log('Solicitando pregunta para categoría:', categoryName || 'general');

    try {
      console.log('Solicitando pregunta a Open Trivia DB...');
      const response = await axios.get('https://opentdb.com/api.php', {
        params: {
          amount: 1,
          type: 'multiple',
          category: categoryId
        }
      });
      console.log('Respuesta recibida:', response.data);

      const questionData = response.data.results[0];

      const questionEn = questionData.question;
      const correctAnswerEn = questionData.correct_answer;
      const incorrectAnswersEn = questionData.incorrect_answers;

      const translatedQuestion = await translate(questionEn, { to: 'es' });
      const translatedCorrectAnswer = await translate(correctAnswerEn, { to: 'es' });
      const translatedIncorrectAnswers = await Promise.all(
        incorrectAnswersEn.map(answer => translate(answer, { to: 'es' }))
      );

      const answers = [...translatedIncorrectAnswers.map(t => t.text), translatedCorrectAnswer.text];
      const shuffledAnswers = answers.sort(() => Math.random() - 0.5);

      triviaGames.set(userId, {
        correctAnswer: translatedCorrectAnswer.text,
        question: translatedQuestion.text,
        options: shuffledAnswers,
        chatId: ctx.chat.id
      });

      const optionsText = shuffledAnswers.map((answer, index) => `${index + 1}. ${answer}`).join('\n');
      console.log('Enviando pregunta traducida:', translatedQuestion.text);
      await ctx.reply(`Aquí tienes tu pregunta de trivia${categoryName ? ` sobre ${categoryName}` : ''}:\n\n${translatedQuestion.text}\n\nOpciones:\n${optionsText}\n\nResponde con el número de la opción correcta (1-4).`);
    } catch (error) {
      console.error('Error en trivia:', error.message);
      if (error.response) {
        console.error('Detalles:', error.response.data);
        console.error('Código:', error.response.status);
      }
      await ctx.reply('¡Ups! No pude obtener o traducir una pregunta de trivia. Intenta de nuevo.');
    }
  };

  // Comando /trivia
  bot.command('trivia', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    const categoryInput = args[0]?.toLowerCase();
    const categoryId = backsideCategories[categoryInput] || 9;
    const categoryName = categoryInput || 'general';
    await sendTriviaQuestion(ctx, categoryId, categoryName);
  });

  // Manejadores de botones inline
  bot.action('trivia_cine', async (ctx) => {
    await sendTriviaQuestion(ctx, 11, 'cine');
  });

  bot.action('trivia_ciencia', async (ctx) => {
    await sendTriviaQuestion(ctx, 17, 'ciencia');
  });

  bot.action('trivia_historia', async (ctx) => {
    await sendTriviaQuestion(ctx, 23, 'historia');
  });

  bot.action('trivia_musica', async (ctx) => {
    await sendTriviaQuestion(ctx, 12, 'música');
  });

  bot.action('trivia_geografia', async (ctx) => {
    await sendTriviaQuestion(ctx, 22, 'geografía');
  });

  bot.action('trivia_deportes', async (ctx) => {
    await sendTriviaQuestion(ctx, 21, 'deportes');
  });

  bot.action('trivia_general', async (ctx) => {
    await sendTriviaQuestion(ctx, 9, 'general');
  });

  // Comando /adivina
  bot.command('adivina', (ctx) => {
    const userId = ctx.from.id;
    const number = Math.floor(Math.random() * 100) + 1;
    adivinaGames.set(userId, { number, attempts: 0, chatId: ctx.chat.id });
    ctx.reply('¡He pensado en un número entre 1 y 100! Adivina cuál es. Escribe un número.');
  });

  // Manejador de texto ajustado
  bot.on('text', (ctx) => {
    const userId = ctx.from.id;
    const chatId = ctx.chat.id;
    const triviaGame = triviaGames.get(userId);
    const adivinaGame = adivinaGames.get(userId);

    if (!triviaGame && !adivinaGame) return;

    if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
      const isReplyToBot = ctx.message.reply_to_message && ctx.message.reply_to_message.from.id === ctx.botInfo.id;
      const isOriginalChat = (triviaGame && triviaGame.chatId === chatId) || (adivinaGame && adivinaGame.chatId === chatId);
      if (!isReplyToBot && !isOriginalChat) return;
    }

    if (ctx.message.text.startsWith('/')) return;

    const guess = parseInt(ctx.message.text);
    if (isNaN(guess)) {
      ctx.reply('Por favor, escribe un número válido.');
      return;
    }

    if (triviaGame) {
      if (guess < 1 || guess > 4) {
        ctx.reply('Por favor, responde con un número entre 1 y 4.');
        return;
      }
      const selectedAnswer = triviaGame.options[guess - 1];
      if (selectedAnswer === triviaGame.correctAnswer) {
        ctx.reply(`¡Correcto! La respuesta era: ${triviaGame.correctAnswer}. ¡Buen trabajo! Usa /trivia para otra pregunta.`);
      } else {
        ctx.reply(`¡Incorrecto! La respuesta correcta era: ${triviaGame.correctAnswer}. Inténtalo de nuevo con /trivia.`);
      }
      triviaGames.delete(userId);
      return;
    }

    if (adivinaGame) {
      adivinaGame.attempts += 1;
      if (guess === adivinaGame.number) {
        ctx.reply(`¡Felicidades! Adivinaste el número ${adivinaGame.number} en ${adivinaGame.attempts} intentos.`);
        adivinaGames.delete(userId);
      } else if (guess < adivinaGame.number) {
        ctx.reply('Demasiado bajo. ¡Inténtalo de nuevo!');
      } else {
        ctx.reply('Demasiado alto. ¡Inténtalo de nuevo!');
      }
    }
  });
};