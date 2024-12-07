import { DB, Embed, EmbedField, v4, serve, readJson } from "../deps.ts"

const config = await readJson("./OnlyMonkConfig.json");

export const db = new DB(Deno.env.get("DATA_PATH")+"minecraft.coordinates.sqlite");

export function InitDatabase() {
    db.query(`CREATE TABLE IF NOT EXISTS onlymonk_minecraft_coordinates(id string PRIMARY KEY, name TEXT, coordinate TEXT, submit_by TEXT)`)
}

export function getInfo(){
    const embed = new Embed()
        .setTitle("Only Monk Minecraft --- Everlasting")
        .setColor("#237feb");

    embed.addField({
        name: "Server Status",
        value: "Game Server Status: Online\nAPI Status: Offline"
    })

    embed.addField({
        name: "Hostname",
        value: `Playit.gg: ${Deno.env.get("ONLY_MONK_MINECRAFT_SERVER_ADDRESS")}}`
    })

    return [embed]
}

export function getCoordinates() {
    const coordinates = [...db.query(`SELECT * FROM onlymonk_minecraft_coordinates`, [])]

    const embed = new Embed()
        .setTitle("Only Monk Minecraft --- Everlasting")
        .setColor("#237feb");

    let description = ""

    let index = 1;
    for(const [id, name, coordinate] of coordinates){
        description += `${index}. ${name}:${coordinate}`+"\n"
        index++
    }

    embed.addField({
        name: "List of coordinates!",
        value: description
    })

    return [embed]

}

export function addCoordinate(name: string, coordinate: string, submitted_by: string){
    addCoordinateToDb(name, coordinate, submitted_by)

    const embed = new Embed()
        .setTitle("Only Monk Minecraft --- Everlasting")
        .setDescription("**Coordinate has been submitted! **")
        .setColor("#237feb");

    return [embed]
}

/* Private Methods */

function getBaseEmbedMessageResponse(){
    
    return new Embed()
        .setTitle("Only Monk Minecraft")
        .setColor("#237feb"); 
}

function addCoordinateToDb(name: string, coordinate: string, submitted_by: string){
    const id = v4.generate();
    db.query('INSERT INTO onlymonk_minecraft_coordinates (id, name, coordinate, submit_by) VALUES (?, ?, ?, ?)',[id, name, coordinate, submitted_by])
}

export function getGameServerStatus(){
    throw new Error(`Not Implemented Exception`);

    var endpoint = Deno.env.get("ONLY_MONK_MINECRAFT_SERVER_REST_API_ADDRESS") + config.Minecraft.ApiPaths.Status;

    console.log(endpoint)
    var response = getApiStatus(endpoint)

    console.log(response)
}

function getGameApiStatus(){
    throw new Error(`Not Implemented Exception`);
}

async function getApiStatus(url: string): Promise<void> { 
    try { 
        const response = await fetch(url); 
        if (!response.ok) { 
            throw new Error(`HTTP error! status: ${response.status}`); 
        } 
        
        const data = await response.json(); 
        console.log("API Status:", data.status); 
    } catch (error) { 
        console.error("Error fetching API status:", error);
     } 
}