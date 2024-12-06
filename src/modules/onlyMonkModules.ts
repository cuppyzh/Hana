import { DB, Embed, EmbedField, v4 } from "../deps.ts"

export const db = new DB("/app/data/minecraft.coordinates.sqlite");

export function init() {
    db.query(`CREATE TABLE IF NOT EXISTS onlymonk_minecraft_coordinates(id string PRIMARY KEY, name TEXT, coordinate TEXT, submit_by TEXT)`)
}

init();

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
        value: `(Ucup) Playit.gg: ${Deno.env.get("HOSTNAME_UCUP_PLAYIT")}\n(Ucup) Hamachi: ${Deno.env.get("HOSTNAME_UCUP_HAMACHI")}`
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

function addCoordinateToDb(name: string, coordinate: string, submitted_by: string){
    const id = v4.generate();
    db.query('INSERT INTO onlymonk_minecraft_coordinates (id, name, coordinate, submit_by) VALUES (?, ?, ?, ?)',[id, name, coordinate, submitted_by])
}