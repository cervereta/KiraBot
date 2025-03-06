const fs = require('fs');

module.exports = (bot) => {
  bot.command('menu', (ctx) => {
    const userName = ctx.from.first_name || 'amigo';
    ctx.reply(`*¡Hola ${userName}!* ¿Qué quieres hacer?
      Ten en cuenta que aun estoy en fase Pruebas`, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '👋 Saludar', callback_data: 'saludo' },
            { text: '🌤️ Ver el clima', callback_data: 'clima' }
          ],
          [
            { text: '📸 Foto', callback_data: 'foto' },
            { text: '🎵 Audio', callback_data: 'audio' }
          ],
          [
            { text: '🐱 Gato', callback_data: 'gato' },
            { text: '😂 Chiste', callback_data: 'chiste' }
          ],
          [
            { text: '❓ Ayuda', callback_data: 'ayuda' },
            { text: '➕ Más opciones', callback_data: 'mas_opciones' }
          ],
          [
            { text: '🚪 Cerrar', callback_data: 'cerrar' }
          ]
        ]
      }
    });
  });

  bot.action('mas_opciones', (ctx) => {
    const userName = ctx.from.first_name || 'amigo';
    ctx.editMessageText(`*${userName}, aquí tienes más opciones:*`, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🐶 Perro', callback_data: 'perro' },
            { text: '💬 Frase', callback_data: 'frase' }
          ],
          [
            { text: '🎲 Adivina', callback_data: 'adivina' },
            { text: '❔ Trivia', callback_data: 'trivia' }
          ],
          [
            { text: '⬅️ Volver', callback_data: 'volver' }
          ]
        ]
      }
    });
  });

  bot.action('volver', (ctx) => {
    const userName = ctx.from.first_name || 'amigo';
    ctx.editMessageText(`*¡Hola ${userName}!* ¿Qué quieres hacer?
      Ten en cuenta que aun estoy en fase Pruebas`, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '👋 Saludar', callback_data: 'saludo' },
            { text: '🌤️ Ver el clima', callback_data: 'clima' }
          ],
          [
            { text: '📸 Foto', callback_data: 'foto' },
            { text: '🎵 Audio', callback_data: 'audio' }
          ],
          [
            { text: '🐱 Gato', callback_data: 'gato' },
            { text: '😂 Chiste', callback_data: 'chiste' }
          ],
          [
            { text: '❓ Ayuda', callback_data: 'ayuda' },
            { text: '➕ Más opciones', callback_data: 'mas_opciones' }
          ],
          [
            { text: '🚪 Cerrar', callback_data: 'cerrar' }
          ]
        ]
      }
    });
  });

  bot.action('saludo', (ctx) => {
    const userName = ctx.from.first_name || 'amigo';
    ctx.reply(`¡Hola de nuevo, ${userName}! ¿Qué tal?`);
  });

  bot.action('clima', (ctx) => {
    ctx.reply('Escribe /clima <ciudad> para ver el clima, por ejemplo: /clima Madrid');
  });

  bot.action('foto', async (ctx) => {
    const userId = ctx.from.id;
    try {
      const photos = await bot.telegram.getUserProfilePhotos(userId);
      if (photos.total_count === 0) {
        return ctx.reply('¡No tienes foto de perfil o no puedo verla! Usa /foto robot si quieres ver la mía.');
      }
      const fileId = photos.photos[0][0].file_id;
      const file = await bot.telegram.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
      await ctx.replyWithPhoto({ url: fileUrl });
    } catch (error) {
      console.error('Error en botón Foto:', error.message);
      ctx.reply('¡Ups! Algo salió mal al intentar obtener tu foto.');
    }
  });

  bot.action('audio', async (ctx) => {
    const audioPath = './media/benny.mp3';
    try {
      if (!fs.existsSync(audioPath)) {
        return ctx.reply('¡Ups! No encuentro el archivo de audio en el servidor.');
      }
      await ctx.replyWithAudio({ source: audioPath });
    } catch (error) {
      ctx.reply('¡Ups! Algo salió mal al enviar el audio. Utiliza el comando /audio directamente');
    }
  });

  bot.action('gato', (ctx) => {
    ctx.reply('Escribe /gato para ver una foto de un gato random 😺');
  });

  bot.action('chiste', (ctx) => {
    ctx.reply('Escribe /chiste para reírte un rato 😂');
  });

  bot.action('cerrar', (ctx) => {
    ctx.reply('¡Menú cerrado! Usa /menu si quieres volver a verlo.');
    ctx.deleteMessage();
  });

  bot.action('perro', (ctx) => {
    ctx.reply('Escribe /perro para ver una foto de un perro random 🐶');
  });

  bot.action('frase', (ctx) => {
    ctx.reply('Escribe /frase para una dosis de inspiración 💬');
  });

  bot.action('adivina', (ctx) => {
    ctx.reply('Escribe /adivina para empezar el juego 🎲');
  });

  bot.action('trivia', (ctx) => {
    ctx.reply('Elige una categoría para tu trivia:', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Cine', callback_data: 'trivia_cine' },
            { text: 'Ciencia', callback_data: 'trivia_ciencia' }
          ],
          [
            { text: 'Historia', callback_data: 'trivia_historia' },
            { text: 'Música', callback_data: 'trivia_musica' }
          ],
          [
            { text: 'Geografía', callback_data: 'trivia_geografia' },
            { text: 'Deportes', callback_data: 'trivia_deportes' }
          ],
          [
            { text: 'General', callback_data: 'trivia_general' }
          ]
        ]
      }
    });
  });
};