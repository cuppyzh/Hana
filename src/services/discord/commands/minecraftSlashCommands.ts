import { SlashCommandOptionType, SlashCommandPartial } from "../../../deps.ts";

export const minecraftSlashCommands: SlashCommandPartial[] = [
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
                name: "xcoordinate",
                description: "X Coordinate",
                required: true,
                type: SlashCommandOptionType.STRING,
            },
            {
                name: "ycoordinate",
                description: "Y Coordinate",
                required: true,
                type: SlashCommandOptionType.STRING,
            },
            {
                name: "zcoordinate",
                description: "Z Coordinate",
                required: true,
                type: SlashCommandOptionType.STRING,
            }
        ],
    },
    {
        name: "minecraft_delete_coordinate",
        description: "Delete a coordiante",
        options: [
            {
                name: "name",
                description: "Name of the coordinate",
                required: true,
                type: SlashCommandOptionType.STRING,
            }
        ],
    },
];