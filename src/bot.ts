import {
    Client,
    ClientOptions,
    event,
    Intents,
    Interaction,
    slash,
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
        Log.Info(`Logged in as ${this.user?.tag}`);
        Log.Info(`Config 'synCommands': ${this.syncCommands}`);
        Log.Info(`Config 'resetCommands': ${this.resetCommands}`);

        if (!this.syncCommands) {
            return;
        }

        Log.Info(`Syncing commands...`);

        await manageCommands(this, this.resetCommands)
    }
}