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
            { text: '➕ Más opciones', callback_data: 'mas_opciones' } // Botón para submenú
          ],
          [
            { text: '🚪 Cerrar', callback_data: 'cerrar' }
          ]
        ]
      }
    });
  });

  // Submenú "Más opciones"
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
            { text: '⬅️ Volver', callback_data: 'volver' }
          ]
        ]
      }
    });
  });

  // Acción para volver al menú principal
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

  // Acciones de los botones del menú principal
  bot.action('saludo', (ctx) => {
    const userName = ctx.from.first_name || 'amigo';
    ctx.reply(`¡Hola de nuevo, ${userName}! ¿Qué tal?`);
  });

  bot.action('clima', (ctx) => {
    ctx.reply('Escribe /clima <ciudad> para ver el clima, por ejemplo: /clima Madrid');
  });

  bot.action('foto', (ctx) => {
    ctx.replyWithPhoto({ source: './media/robot.jpg' });
  });

  bot.action('audio', async (ctx) => {
    const audioPath = './media/benny.mp3'; // Cambiado a .mp3
    try {
      if (!fs.existsSync(audioPath)) {
        return ctx.reply('¡Ups! No encuentro el archivo de audio en el servidor.');
      }
      await ctx.replyWithAudio({ source: audioPath });
    } catch (error) {
      ctx.reply('¡Ups! Algo salió mal al enviar el audio.Utiliza el comando /audio directamente');
    }
  });

  bot.action('gato', (ctx) => {
    ctx.reply('Escribe /gato para ver una foto de un gato random 😺');
  });

  bot.action('chiste', (ctx) => {
    ctx.reply('Escribe /chiste para reírte un rato 😂');
  });

  bot.action('ayuda', (ctx) => {
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
/clima <ciudad>
/gato
/chiste
/perro
/frase
/adivina
/menu`);
  });

  bot.action('cerrar', (ctx) => {
    ctx.reply('¡Menú cerrado! Usa /menu si quieres volver a verlo.');
    ctx.deleteMessage();
  });

  // Acciones del submenú (solo indican el comando por ahora)
  bot.action('perro', (ctx) => {
    ctx.reply('Escribe /perro para ver una foto de un perro random 🐶');
  });

  bot.action('frase', (ctx) => {
    ctx.reply('Escribe /frase para una dosis de inspiración 💬');
  });

  bot.action('adivina', (ctx) => {
    ctx.reply('Escribe /adivina para empezar el juego 🎲');
  });
};