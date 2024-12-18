import { BotClient } from "./bot.ts";

const bot = new BotClient({
    syncCommands: true
});

bot.start();