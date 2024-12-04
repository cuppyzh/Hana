import {
  Client,
  event,
  Intents,
  Interaction,
  InteractionResponseType,
  slash,
  SlashCommandPartial,
} from "./deps.ts";

import { onlyMonkCommands } from "./commands/onlyMonkCommands.ts";
import * as onlyMonkModules from "./modules/onlyMonkModules.ts";
import test from "node:test";

class TagBot extends Client {
  @event()
  ready() {
    console.log(`Logged in as ${this.user?.tag}!`);
    onlyMonkCommands.forEach((cmd) => {
      this.slash.commands.create(cmd, Deno.env.get("SERVER_ID"))
        .then((c) => console.log(`Created Slash Command ${cmd.name}!`))
        .catch(() => console.log(`Failed to create ${cmd.name} command!`));
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
    }
  }

  @slash()
  minecraft_online(i: Interaction) {
    i.respond({
      content: `Belom ada anyink`,
    });
  }

  @slash()
  minecraft_coordinates(i: Interaction) {
    i.respond({
      embeds: onlyMonkModules.getCoordinates(),
    });
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
    }
  }

  @slash()
  minecraft_delete_coordinate(i: Interaction) {
    i.respond({
      content: `Belom ada anyink`,
    });
  }
}

const bot = new TagBot();
bot.connect(Deno.env.get("BOT_TOKEN"), Intents.None);
