import { BotClient } from "./bot.ts";

// file and console

const bot = new BotClient({
    syncCommands: true,
    resetCommands: true,
});

bot.start();