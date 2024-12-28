import { BotClient } from "./bot.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { FirebaseServicesClient } from "./services/FirebaseServicesClient.ts";

// Load environment variables const env =
config();

export const bot = new BotClient({
    syncCommands: true,
    resetCommands: true,
});

bot.start();

// console.log(Deno.env.get("FIREBASE_APP_NAME"))
// const docs = await FirebaseServicesClient.GetDocuments("hana-prod-test");
// console.log(JSON.stringify(docs))