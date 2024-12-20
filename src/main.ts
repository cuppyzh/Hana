import { BotClient } from "./bot.ts";

export const bot = new BotClient({
    syncCommands: true,
    resetCommands: true,
});

bot.start();