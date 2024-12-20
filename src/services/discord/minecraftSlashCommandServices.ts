import test from "node:test";
import { BotClient } from "../../bot.ts";
import {
    ApplicationCommand,
    type Collection,
    Embed,
    Interaction,
    Message,
    TextChannel,
} from "../../deps.ts";
import { getConfig } from "../../utils/configUtils.ts";
import { Log } from "../../utils/logUtils.ts";
import { minecraftSlashCommands } from "../discord/commands/minecraftSlashCommands.ts";

import { EventEmitter } from "node:events";
import { bot } from "../../main.ts";

interface AllowedServer {
    Name: string;
    Id: string;
    ServerHostName: string;
    RestApiEndpoint: string;
    RestApiKey: string;
}

const config = await getConfig("discord.minecraft.config");
const allowedServers = config.AllowedServer as AllowedServer[];
const firstWaitingMessage = "I'm Lookin for that information! *** (╭ರ_•́)";

export async function addMinecraftSlashCommands(
    bot: BotClient,
    resetCommands: boolean,
) {
    Log.info(`Integrating Minecraft Slash Commands --- START`);

    for (const server of allowedServers) {
        Log.info(`[${server.Name}] Add minecraft slash commands --- START`);

        const targetServer = await bot.guilds.get(server.Id);

        if (!targetServer) {
            Log.info(
                `[${server.Name}] Current bot doesn't have access to ${server.Name}. Integration ignored.`,
            );
            continue;
        }

        if (resetCommands) {
            const currentCommands = await targetServer.commands.all();
            await resetCurrentCommands(bot, server, currentCommands);
        }

        await createCommands(bot, server);
        addCommandHandlers(bot, server);
    }

    Log.info(`Integrating Minecraft Slash Commands --- END`);
}

function addCommandHandlers(bot: BotClient, server: AllowedServer) {
    bot.slash.commands.slash.handlers.push({
        name: "minecraft_info",
        guild: server.Id,
        handler: minecraftInfoHandler.bind(bot),
    });

    bot.slash.commands.slash.handlers.push({
        name: "minecraft_online",
        guild: server.Id,
        handler: minecraftOnlineHandler.bind(bot),
    });

    bot.slash.commands.slash.handlers.push({
        name: "minecraft_coordinates",
        guild: server.Id,
        handler: minecraftCoordinatesHandler.bind(bot),
    });

    bot.slash.commands.slash.handlers.push({
        name: "minecraft_add_coordinates",
        guild: server.Id,
        handler: Object.bind(bot),
    });

    bot.slash.commands.slash.handlers.push({
        name: "minecraft_delete_coordinates",
        guild: server.Id,
        handler: Object.bind(bot),
    });
}

// Handler Bind Function -- raise event --> Even Handler
async function minecraftInfoHandler(i: Interaction) {
    i.respond({
        content: firstWaitingMessage,
    });

    const responseMessage = await i.fetchResponse();
    myEmitter.emit("minecraft_info", {
        guildId: i.guild?.id,
        channelId: responseMessage.channelID,
        messageId: responseMessage.id,
    });
}

async function minecraftOnlineHandler(i: Interaction) {
    i.respond({
        content: firstWaitingMessage,
    });

    const responseMessage = await i.fetchResponse();
    myEmitter.emit("minecraft_online", {
        guildId: i.guild?.id,
        channelId: responseMessage.channelID,
        messageId: responseMessage.id,
    });
}

async function minecraftCoordinatesHandler(i: Interaction) {
    i.respond({
        content: firstWaitingMessage,
    });

    const responseMessage = await i.fetchResponse();
    myEmitter.emit("minecraft_coordinates", {
        guildId: i.guild?.id,
        channelId: responseMessage.channelID,
        messageId: responseMessage.id,
    });
}

// Event Handler
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// event::minecraft_info
myEmitter.on("minecraft_info", async (prop) => {
    const message = await getMessage(prop.channelId, prop.messageId);
    const server = getGuild(prop.guildId);
    const embed = getBaseMessage(server.Name);

    try {
        embed.addField({
            name: "Server Status",
            value:
                (await isGameServerOnline(server) ? "🟢 Online" : "❌ Offline"),
        });

        embed.addField({
            name: "Hostname",
            value: `${server.ServerHostName}`,
        });

        await message.edit({ embeds: [embed] });
    } catch (error) {
        Log.error(error);
        await message.edit({
            embeds: GetDiscrodInteractionResponseErrorMessage(),
        });
    }
});

// event::minecraft_online
myEmitter.on("minecraft_online", async (prop) => {
    const message = await getMessage(prop.channelId, prop.messageId);
    const server = getGuild(prop.guildId);
    const embed = getBaseMessage(server.Name);

    try {
        const currentOnlinePlayers = await getCurrentOnlinePlayers(server);

        if (currentOnlinePlayers.length == 0) {
            embed.addField({
                name: "No player online right now.",
                value: "",
            });

            await message.edit({ embeds: [embed] });
            return;
        }

        embed.addField({
            name: "Current player online",
            value: `${currentOnlinePlayers.join("\n")}`,
        });

        await message.edit({ embeds: [embed] });
    } catch (error) {
        Log.error(error);
        await message.edit({
            embeds: GetDiscrodInteractionResponseErrorMessage(),
        });
    }
});

function GetDiscrodInteractionResponseErrorMessage(): Embed[] {
    const embed = new Embed()
        .setTitle("Err....")
        .setColor("#FFD1DC")
        .setDescription(
            "Something unexpected happened. Immaa confused ∘ ∘ ∘ ( °ヮ° ) ?",
        );

    return [embed];
}

function getGuild(guildId: string): AllowedServer {
    return allowedServers.filter((x) => x.Id == guildId)[0];
}

async function getMessage(
    channelID: string,
    messageId: string,
): Promise<Message> {
    const channel = await bot.channels.get<TextChannel>(
        channelID,
    ) as TextChannel;
    const message = await channel.messages.fetch(messageId);

    return message;
}

// Private Methods
function getBaseMessage(guildName: string) {
    return new Embed()
        .setTitle(`${guildName} Minecraft`)
        .setColor("#FFD1DC");
}

async function resetCurrentCommands(
    bot: BotClient,
    server: AllowedServer,
    commands: Collection<string, ApplicationCommand>,
) {
    Log.info(`[${server.Name}] Removing current commands: ${commands.size}`);

    for (const command of commands) {
        await bot.slash.commands.delete(server.Id, command[0])
            .then(() =>
                Log.info(
                    `[${server.Name}] Removing ${command[1].name} ... Success`,
                )
            )
            .catch((error) =>
                Log.error(
                    `[${server.Name}] Removing ${command[1].name} ... Failed`,
                    { error },
                )
            );
    }
}

async function createCommands(bot: BotClient, server: AllowedServer) {
    for (const command of minecraftSlashCommands) {
        await bot.slash.commands.create(command, server.Id)
            .then(() =>
                Log.info(
                    `[${server.Name}] Creating ${command.name} ... Success`,
                )
            )
            .catch((error) =>
                Log.error(
                    `[${server.Name}] Creating ${command.name} ... Failed`,
                    error,
                )
            );
    }
}

async function isGameServerOnline(server: AllowedServer): Promise<boolean> {
    try {
        const endpoint = server.RestApiEndpoint + config.Endpoints.Server;

        const response = await fetch(endpoint, {
            headers: getRestHeader(server),
        });

        if (!response.ok) {
            return false;
        }

        return true;
    } catch (error) {
        Log.error("Error fetching API status:", error);
        return false;
    }
}

async function getCurrentOnlinePlayers(
    server: AllowedServer,
): Promise<string[]> {
    try {
        var endpoint = server.RestApiEndpoint + config.Endpoints.Players;

        const response = await fetch(endpoint, {
            headers: getRestHeader(server),
        });

        if (!response.ok) {
            return [];
        }

        const data = await response.json();

        if (!Object.prototype.hasOwnProperty.call(data, "displayName")) {
            return [];
        }

        const displayNames = data.map((item: { displayName: string }) =>
            item.displayName
        );
        Log.info("Display Names:", displayNames);

        return displayNames;
    } catch (error) {
        Log.error("Error fetching display names:", error);
        return [];
    }
}

function getRestHeader(server: AllowedServer) {
    const headers = new Headers();
    headers.append("key", server.RestApiKey);

    return headers;
}
