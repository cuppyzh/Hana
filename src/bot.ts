import type { Interaction } from "https://deno.land/x/harmony@v2.9.1/src/structures/interactions.ts";
import {
    Client,
    ClientOptions,
    event,
    Intents,
    slash
} from "./deps.ts";
import { manageCommands } from "./services/discord/slashCommandServices.ts";
import { Log } from "./utils/logUtils.ts";

export interface BotClientOptions extends ClientOptions {
    syncCommands?: boolean;
    resetCommands?: boolean;
}

export class BotClient extends Client {
    syncCommands: boolean = false;
    resetCommands: boolean = false;

    constructor(options?: BotClientOptions) {
        super(options);
        if (options?.syncCommands === true) this.syncCommands = true;
        if (options?.resetCommands === true) this.resetCommands = true;
    }

    start() {
        this.connect(Deno.env.get("DISCORD_BOT_TOKEN"), Intents.None);
    }

    @event()
    async ready() {
        Log.info(`Logged in as ${this.user?.tag}`);
        Log.info(`Config 'synCommands': ${this.syncCommands}`);
        Log.info(`Config 'resetCommands': ${this.resetCommands}`);
        Log.info({resetCommands:this.resetCommands});

        if (!this.syncCommands) {
            return;
        }

        Log.info(`Syncing commands...`);

        await manageCommands(this, this.resetCommands)
    }

    // @slash() 
    // minecraft_info(interaction: Interaction) { 
    //     console.log(`Slash command received: ${interaction}`);
    //     Log.Info("test")
    // }
}