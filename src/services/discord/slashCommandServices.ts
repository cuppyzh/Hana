import type { BotClient } from "../../bot.ts";
import { addMinecraftSlashCommands } from "./minecraftSlashCommandServices.ts";

export async function manageCommands(bot: BotClient, resetCommands: boolean){
    await addMinecraftSlashCommands(bot, resetCommands);
}

