import { BotClient } from "../../bot.ts";
import type { ApplicationCommand, ApplicationCommandPartial, Collection, ApplicationCommandPermissionsManager } from "../../deps.ts";
import { getConfig } from "../../utils/configUtils.ts";
import { Log } from "../../utils/logUtils.ts";
import { minecraftSlashCommands } from "../discord/commands/minecraftSlashCommands.ts"

interface AllowedServer {
    Name: string;
    Id: string;
}

const namespace = "[service.discord.minecraftSlashCommandServices]"

export async function addMinecraftSlashCommands(bot: BotClient, resetCommands: boolean) {
    const config = await getConfig("discord.minecraft.config");
    const allowedServers = config.AllowedServer;

    Log.Info(`$ Integrating Minecraft Slash Commands --- START`);
    
    for(const server of allowedServers){
        Log.Info(`[${server.Name}] Add minecraft slash commands --- START`);

        const targetServer = await bot.guilds.get(server.Id);

        if (!targetServer){
            Log.Info(`[${server.Name}] Current bot doesn't have access to ${server.Name}. Integration ignored.`);
            continue;
        }

        if (resetCommands){
            const currentCommands = await targetServer.commands.all();
            await resetCurrentCommands(bot,server,currentCommands);
        }

        await createCommands(bot, server);
    }
    
    Log.Info(`Integrating Minecraft Slash Commands --- END`);
}

async function resetCurrentCommands(bot: BotClient, server:AllowedServer, commands: Collection<string,ApplicationCommand>) {
    Log.Info(`[${server.Name}] Removing current commands: ${commands.size}`);

    for(const command of commands){
        await bot.slash.commands.delete(server.Id, command[0])
        .then(() => Log.Info(`[${server.Name}] Removing ${command[1].name} ... Success`))
        .catch((error) =>  Log.Error(`[${server.Name}] Removing ${command[1].name} ... Failed. \n${error}`));
    }
}

async function createCommands(bot: BotClient, server: AllowedServer) {
    for(const command of minecraftSlashCommands){
        await bot.slash.commands.create(command, server.Id)
        .then(() => Log.Info(`[${server.Name}] Creating ${command.name} ... Success`))
        .catch((error) =>  Log.Error(`[${server.Name}] Creating ${command.name} ... Failed. \n${error}`));
    }
}