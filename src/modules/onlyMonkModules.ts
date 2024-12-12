import { DB, Embed, EmbedField, readJson, serve, v4 } from "../deps.ts";

/*
    Initialize
*/
InitDatabase();

/* 
    Property::Start
*/
const config = await readJson("./OnlyMonkConfig.json");

const headers = new Headers();
const apiKey = Deno.env.get("ONLY_MONK_MINECRAFT_SERVER_REST_API_KEY")
    ?.toString();
const apiKeyValue: string = apiKey ?? "defaultApiKey";
headers.append("key", apiKeyValue);

const db = new DB(
    Deno.env.get("ONLY_MONK_MINECRAFT_DATA_PATH") +
        "minecraft.coordinates.sqlite",
);
/* 
    Property::End
*/

/* 
    Public Methods::Start
*/
export function InitDatabase() {
    db.query(
        `CREATE TABLE IF NOT EXISTS onlymonk_minecraft_coordinates(id string PRIMARY KEY, name TEXT, coordinate TEXT, submit_by TEXT)`,
    );
}

export function getInfo() {
    const embed = getBaseEmbedMessageResponse();

    embed.addField({
        name: "Server Status",
        value: "Game Server Status: " + isGameServerOnline()
            ? "🟢 Online"
            : "❌ Offline",
    });

    embed.addField({
        name: "Hostname",
        value: `${Deno.env.get("ONLY_MONK_MINECRAFT_SERVER_ADDRESS")}`,
    });

    return [embed];
}

export async function getOnlinePlayerStatus() {
    const embed = getBaseEmbedMessageResponse();
    const currentOnlinePlayers = await whoOnline();

    if (currentOnlinePlayers.length == 0){
        embed.addField({
            name:"No player online right now.",
            value:""
        });

        return [embed];
    }
    
    embed.addField({
        name: "Current player online",
        value: `${currentOnlinePlayers.join("\n")}`
    })

    return [embed]
}

export function getCoordinates() {
    const coordinates = [
        ...db.query(`SELECT * FROM onlymonk_minecraft_coordinates`, []),
    ];

    const embed = getBaseEmbedMessageResponse();

    if (coordinates.length == 0) {
        embed.addField({
            name: "List of coordinates",
            value: "No record of coordinate.",
        });
        return [embed];
    }

    let indexFieldValue = "", nameFieldValue = "", coordinateFieldValue = "";

    let index = 1;
    for (const [id, name, coordinate] of coordinates) {
        indexFieldValue += "\n" + index;
        nameFieldValue += "\n" + name;
        coordinateFieldValue += "\n" + coordinate;
        index++;
    }

    embed.addField({
        name: "List of coordinates",
        value: "",
    });

    embed.addField({
        name: "Index",
        value: indexFieldValue,
        inline: true,
    });

    embed.addField({
        name: "Name",
        value: nameFieldValue,
        inline: true,
    });

    embed.addField({
        name: "Coordinate",
        value: coordinateFieldValue,
        inline: true,
    });

    return [embed];
}

export function addCoordinate(
    name: string,
    coordinate: string,
    submitted_by: string,
) {
    addCoordinateToDb(name, coordinate, submitted_by);

    const embed = getBaseEmbedMessageResponse()
        .setDescription("**Coordinate has been submitted! **");

    return [embed];
}

export function deleteCoordinate(index: number) {
    const embed = getBaseEmbedMessageResponse();

    const rowId = getCoordinateByIndex(index) as string;

    if (rowId == null) {
        return [
            embed.setDescription(
                "**Coordinate with such index is not exists.**",
            ),
        ];
    }

    deleteCoordinateToDbById(rowId);
    return [embed.setDescription("**Coordinate has been deleted! **")];
}

export function getErrorEmbedsResponse(){
    const embed = getBaseEmbedMessageResponse();

    embed.setDescription("Something happened. Hana confused ∘ ∘ ∘ ( °ヮ° ) ?")

    return [embed]
}
/* 
    Public Methods::End
*/

/* 
    Private Methods::Start
*/
function getCoordinateByIndex(index: number) {
    const [row] = db.query(
        "SELECT ID FROM onlymonk_minecraft_coordinates LIMIT 1 OFFSET ?",
        [index - 1],
    );

    if (row == null || row.length == 0) {
        return null;
    }

    const [rowId] = row;

    if (rowId === undefined) {
        return null;
    }
    
    return rowId;
}

function getBaseEmbedMessageResponse() {
    return new Embed()
        .setTitle("Only Monk Minecraft")
        .setColor("#FFD1DC");
}

function addCoordinateToDb(
    name: string,
    coordinate: string,
    submitted_by: string,
) {
    const id = v4.generate();
    db.query(
        "INSERT INTO onlymonk_minecraft_coordinates (id, name, coordinate, submit_by) VALUES (?, ?, ?, ?)",
        [id, name, coordinate, submitted_by],
    );
}

function deleteCoordinateToDbById(rowId: string) {
    db.query("DELETE FROM onlymonk_minecraft_coordinates WHERE ID = ?", [
        rowId,
    ]);
}

async function isGameServerOnline() {
    try {
        var endpoint = Deno.env.get("ONLY_MONK_MINECRAFT_SERVER_REST_API_ADDRESS") + config.Minecraft.ApiPaths.Server;

        const response = await fetch(endpoint, {
            headers: headers,
        });

        if (!response.ok) {
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error fetching API status:", error);
        return false;
    }
}

async function whoOnline(): Promise<string[]> {
    try { 
        var endpoint = Deno.env.get("ONLY_MONK_MINECRAFT_SERVER_REST_API_ADDRESS") + config.Minecraft.ApiPaths.Players;

        const response = await fetch(endpoint, {
            headers: headers,
        }); 
        
        if (!response.ok) { 
            return [];
        } 
        
        const data = await response.json();
        const displayNames = data.map((item: { displayName: string }) => item.displayName); 
        console.log("Display Names:", displayNames); 

        return displayNames;
    } catch (error) { 
        console.error("Error fetching display names:", error); 
        return [];
    }
}
/* 
    Private Methods::End
*/