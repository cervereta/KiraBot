const { Telegraf } = require('telegraf');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

//comandos basicos
bot.start((ctx) => {
    ctx.reply('Bienvenido a KiraBot');
})

bot.help((ctx) => {
    ctx.reply('Espera estoy en construccion');
})

bot.settings((ctx) => {
    ctx.reply('¡¡Caguen la mare que ta parit,tin pasiensia que estic en construcció!!');
})

//comandos personalizados

bot.command( ['saludo', 'saludar'], (ctx) => {
    console.log(ctx)
    ctx.reply('Hola, soy KiraBot, en que puedo ayudarte?')
})

bot.command( ['cagar', 'pisar'], (ctx) => {
    
    ctx.reply('disa de dir coxinaes,¡¡marrano¡¡')
})

//comando personal para pedir fotos

bot.command('foto', (ctx) => {
    ctx.replyWithPhoto({ source: 'robot.jpg' })
})

//vamos a probar con audio

bot.command('audio', (ctx) => {
    ctx.replyWithAudio({ source: 'elmio.ogg' })
})

//comando de escucha

bot.hears('computadora', (ctx) => {
    ctx.reply('yeeee ¡¡figura!! yo soy una maquina tambien');
})

//comando de escucha para cualquier texto

//bot.on('text', (ctx) => {
 //   ctx.reply('yeeee estas parlan masa');
//})

//comando escucha para los stickers

bot.on('sticker', (ctx) => {
    ctx.reply('¡¡Que guay,!! mira quins ninots mes chulos');
})

bot.launch();