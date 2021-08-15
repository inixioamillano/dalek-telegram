const TelegramBot = require('node-telegram-bot-api');
var pjson = require('./package.json');

require('dotenv').config();

console.log(`Booting up ${pjson.displayName} - v${pjson.version}`);

const bot = new TelegramBot(process.env.TOKEN, {polling: true});

const commands = [
    {
        command: '/exterminate',
        description: 'I\'ll exterminate the user in the quoted message'
    },
    {
        command: '/commands',
        description: 'Get commands list'
    },
    {
        command: '/help',
        description: 'I give you basic info about me'
    }
];

if (process.env.PAYMENT_TOKEN) {
    commands.push({
        command: '/contribute',
        description: 'Contribute to this project with a small contribution'
    });
}

bot.setMyCommands(commands);

bot.onText(/\/exterminate/, (msg, match) => {
    if (!msg.reply_to_message) {
        bot.sendMessage(msg.chat.id, 'Stu-pid hu-man... Quo-te a me-ssage from the u-ser to be ex-ter-mi-nated');
        return;
    }
    const exterminated = msg.reply_to_message.from;
    if (exterminated.username === 'Ex_Ter_Mi_Nate_Bot') {
        bot.sendMessage(msg.chat.id, 'Are you try-ing to ex-ter-mi-nate me?? YOU WILL BE EX-TER-MI-NATED!! Da-leks are su-pe-rior...');
        return;
    }
    bot.sendMessage(msg.chat.id, `${exterminated.username ? `@${exterminated.username}` : exterminated.username} will be EX-TER-MI-NATED`);
})

bot.onText(/\/help/, async (msg, match) => {
    let text = `${pjson.displayName}\nv${pjson.version}\n` 
        + `Source code <a href="${pjson.repository.url}">here</a>`;
    if (process.env.PAYMENT_TOKEN) {
        text = text + `\n\nSupport this project with /support`;
    }
    bot.sendMessage(msg.chat.id, text,
    {
        parse_mode: 'HTML'
    });
});


bot.onText(/\/commands/, (msg, match) => {
    let text = `Available commands (v${pjson.version})\n\n`;
    commands.forEach(c => {
        text = text + `${c.command} - ${c.description}\n\n`
    })
    bot.sendMessage(msg.chat.id, text);
})

bot.onText(/\/contribute/, (msg, match) => {
    if (!process.env.PAYMENT_TOKEN) return;
    bot.sendInvoice(msg.chat.id, 'Support this project or you will be EX-TER-MI-NATED', 'Help to keep this project alive with a small contribution', pjson.displayName, process.env.PAYMENT_TOKEN, null, 'EUR', [{
        label: 'Contribution',
        amount: 100 //Cents
    }])
})

bot.on('polling_error', (e) => console.log(e))