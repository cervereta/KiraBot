module.exports = (bot) => {
  const sendHelp = (ctx) => {
    ctx.reply(`Estos son todos los comandos que tengo por ahora:
    
/start - Inicia el bot
/help - No lo uses, usa /ayuda en su lugar
/settings - Configuración (en construcción)
/saludo - Te saludo por tu nombre
/saludar - Igual que /saludo
/cagar - Una respuesta graciosa
/pisar - Otra respuesta graciosa
/foto - Muestra tu foto de perfil (si es pública) o usa /foto robot para la mía
/audio - Te envío un audio
/clima <ciudad> - Consulta el clima (ej: /clima Madrid)
/gato - Foto random de un gato
/chiste - Un chiste en español
/perro - Foto random de un perro
/frase - Frase inspiradora
/adivina - Juego para adivinar un número
/trivia [categoria] - Pregunta de trivia de opción múltiple (ej: /trivia cine, /trivia ciencia, /trivia historia, /trivia musica, /trivia geografia, /trivia deportes, /trivia general)
/menu - Abre el menú interactivo`);
  };

  bot.command('ayuda', sendHelp);
  bot.action('ayuda', sendHelp);
};