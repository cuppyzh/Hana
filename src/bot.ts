import {
  Client,
  ClientOptions,
  event,
  Intents,
  Interaction,
  slash,
} from "./deps.ts";

import { onlyMonkCommands } from "./commands/onlyMonkCommands.ts";
import * as onlyMonkModules from "./modules/onlyMonkModules.ts";
import test from "node:test";

interface BotClientOptions extends ClientOptions {
  syncCommands?: boolean;
}

class BotClient extends Client {
  syncCommands: boolean = false;

  constructor(options?: BotClientOptions) {
    super(options);
    if (options?.syncCommands === true) this.syncCommands = true;
  }

  @event()
  ready() {
    console.log(`Logged in as ${this.user?.tag}!`);

    if (!this.syncCommands) {
      return;
    }

    console.log(`Syncing commands...`);

    onlyMonkCommands.forEach((cmd) => {
      this.slash.commands
        .create(cmd)
        .then((c) => {
          console.log(`Created CMD ${cmd.name}!`);
        })
        .catch(() => console.log(`Failed to create ${cmd.name}.`));
    });
  }

  @slash()
  minecraft_info(i: Interaction) {
    try {
      i.respond({
        embeds: onlyMonkModules.getInfo(),
      });
    } catch (error) {
      console.error(error);

      i.respond({
        embeds: onlyMonkModules.getErrorEmbedsResponse(),
      });
    }
  }

  @slash()
  async minecraft_online(i: Interaction) {
    try {
      i.respond({
        embeds: await onlyMonkModules.getOnlinePlayerStatus(),
      });
    } catch (error) {
      console.error(error);

      i.respond({
        embeds: onlyMonkModules.getErrorEmbedsResponse(),
      });
    }
  }

  @slash()
  minecraft_coordinates(i: Interaction) {
    try {
      i.respond({
        embeds: onlyMonkModules.getCoordinates(),
      });
    } catch (error) {
      console.error(error);

      i.respond({
        embeds: onlyMonkModules.getErrorEmbedsResponse(),
      });
    }
  }

  @slash()
  minecraft_add_coordinate(i: Interaction) {
    try {
      let name = i.options.find((e) => e.name == "name")?.value as string;
      let coordinate = i.options.find((e) => e.name == "coordinate")
        ?.value as string;

      i.respond({
        embeds: onlyMonkModules.addCoordinate(name, coordinate, i.user.id),
      });
    } catch (error) {
      console.error(error);

      i.respond({
        embeds: onlyMonkModules.getErrorEmbedsResponse(),
      });
    }
  }

  @slash()
  minecraft_delete_coordinate(i: Interaction) {
    try {
      let index = i.options.find((e) => e.name == "index")?.value as number;

      i.respond({
        embeds: onlyMonkModules.deleteCoordinate(index),
      });
    } catch (error) {
      console.error(error);

      i.respond({
        embeds: onlyMonkModules.getErrorEmbedsResponse(),
      });
    }
  }
}

// -- main progrem --
const bot = new BotClient({
  syncCommands: true
});

bot.connect(Deno.env.get("DISCORD_BOT_TOKEN"), Intents.None);
