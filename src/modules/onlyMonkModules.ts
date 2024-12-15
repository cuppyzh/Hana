import { initializeApp, DB, Embed, EmbedField, readJson, serve, v4, collection, getFirestore, addDoc, setDoc, doc, query, where, getDocs, getDoc, deleteDoc } from "../deps.ts";

/*
    Property::Start
*/
// Firebase Config
const firebaseConfig = {
    apiKey: "",
    authDomain: "onlymonk-mc.firebaseapp.com",
    projectId: "onlymonk-mc",
    storageBucket: "onlymonk-mc.firebasestorage.app",
    messagingSenderId: "767100591581",
    appId: "1:767100591581:web:00eb709d1a82169283aa34"
  };
const firebaseApp = initializeApp(firebaseConfig, "onlymonk-mc-api");
const database = getFirestore(firebaseApp);
const coordinatesCollection = collection(database,"onlymonk-mc-coordinates");

// Application Config
const onlyMonkConfig = await readJson(`${Deno.env.get("CONFIG_PATH")}/OnlyMonkConfig.json`);
const headers = new Headers();
const apiKey = Deno.env.get("ONLY_MONK_MINECRAFT_SERVER_REST_API_KEY")
    ?.toString();
const apiKeyValue: string = apiKey ?? "defaultApiKey";
headers.append("key", apiKeyValue);
/* 
    Property::End
*/

/* 
    Public Methods::Start
*/
export async function commandGetInfo() {
    const embed = getBaseEmbedMessageResponse();

    embed.addField({
        name: "Server Status",
        value: "Game Server Status: " + await isGameServerOnline()
            ? "🟢 Online"
            : "❌ Offline",
    });

    embed.addField({
        name: "Hostname",
        value: `${Deno.env.get("ONLY_MONK_MINECRAFT_SERVER_ADDRESS")}`,
    });

    return [embed];
}

export async function commandGetOnlinePlayers() {
    const embed = getBaseEmbedMessageResponse();
    const currentOnlinePlayers = await getCurrentOnlinePlayers();

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

export async function commandGetCoordinates() {
    const coordinates = await getCoordinates();

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

    coordinates.forEach(element => {
        
        indexFieldValue += "\n" + index;
        nameFieldValue += "\n" + element.name;
        coordinateFieldValue += "\n" + element.coordinate;
        index++;
    });

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

export async function commandAddCoordinate(name: string, coordinate: string, submitted_by: string) {
    const embed = getBaseEmbedMessageResponse();
    const existingCoordinateDocRef = await getCoordinateDocumentByName(name);

    if (existingCoordinateDocRef != null){
        embed.setDescription("**❌ Coordinate with same name already exists!**");
        return [embed]
    }

    addCoordinate(name, coordinate, submitted_by);

    embed.setDescription("**✅ Coordinate has been submitted! **");
    return [embed];
}

export async function commandDeleteCoordinate(name: string) {
    const embed = getBaseEmbedMessageResponse();

    const existingCoordinateDocRef = await getCoordinateDocumentByName(name);

    if (existingCoordinateDocRef == null) {
        return [
            embed.setDescription(
                "**❌ Coordinate with such index is not exists.**",
            ),
        ];
    }

    await deleteDoc(existingCoordinateDocRef);
    return [embed.setDescription("**✅ Coordinate has been deleted! **")];
}

export function getErrorEmbedsResponse(){
    const embed = getBaseEmbedMessageResponse();

    embed.setDescription("Something happened. Immaa confused ∘ ∘ ∘ ( °ヮ° ) ?")

    return [embed]
}
/* 
    Public Methods::End
*/

/* 
    Private Methods::Start
*/
function getBaseEmbedMessageResponse() {
    return new Embed()
        .setTitle("Only Monk Minecraft")
        .setColor("#FFD1DC");
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

async function getCurrentOnlinePlayers(): Promise<string[]> {
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

async function getCoordinates(){
    const coordinates = await getDocs(coordinatesCollection);
    const data = coordinates.docs.map((doc) => doc.data());

    return data;
}

export async function addCoordinate(name:string, coordinate:string, created_by: string){
    await addDoc(coordinatesCollection,{
        "name":name,
        "coordinate": coordinate,
        "created_by": created_by
    });

    return true;
}

async function getCoordinateDocumentByName(name:string){
    const q = query(coordinatesCollection, where("name","==", name));

    const document = await getDocs(q).then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc);
        return data[0];
      });

    if (!document){
        return null;
    }

    return document.ref;
}
/* 
    Private Methods::End
*/

// await commandGetCoordinates()
await commandDeleteCoordinate("Main Base")