import {
    Client,
    ClientOptions,
    event,
    Intents,
    Interaction,
    slash,
} from "./deps.ts";

export interface BotClientOptions extends ClientOptions {
    syncCommands?: boolean;
}

export class BotClient extends Client {
    syncCommands: boolean = false;

    constructor(options?: BotClientOptions) {
        super(options);
        if (options?.syncCommands === true) this.syncCommands = true;
    }

    start() {
        this.connect(Deno.env.get("DISCORD_BOT_TOKEN"), Intents.None);
    }

    @event()
    ready() {
        console.log(`Logged in as ${this.user?.tag}`);
        console.log(`Config 'synCommands': ${this.syncCommands}`);

        if (!this.syncCommands) {
            return;
        }

        console.log(`Syncing commands...`);
    }
}