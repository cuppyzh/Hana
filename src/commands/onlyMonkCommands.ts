import { SlashCommandOptionType, SlashCommandPartial } from "../deps.ts";

export const onlyMonkCommands: SlashCommandPartial[] = [
    {
        name: "minecraft_info",
        description: "Important information for the server",
        options: [],
    },
    {
        name: "minecraft_online",
        description: "See a who is in the game",
        options: [],
    },
    {
        name: "minecraft_coordinates",
        description: "List of important coordinate",
        options: [],
    },
    {
        name: "minecraft_add_coordinate",
        description: "Add coordinate",
        options: [
            {
                name: "name",
                description: "Name or description of the coordinate",
                required: true,
                type: SlashCommandOptionType.STRING,
            },
            {
                name: "coordinate",
                description: "Coordinate X,Y,Z",
                required: true,
                type: SlashCommandOptionType.STRING,
            },
        ],
    },
    {
        name: "minecraft_delete_coordinate",
        description: "Delete a coordiante",
        options: [
            {
                name: "index",
                description: "number of index from list",
                required: true,
                type: SlashCommandOptionType.STRING,
            }
        ],
    },
];
