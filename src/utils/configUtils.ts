import { readJson } from "../deps.ts";
import { Log } from "./logUtils.ts";

export async function getConfig(configName:string): Promise<JSON> {
    const configPath = `${Deno.env.get("CONFIG_PATH")}/${configName}.json`;
    Log.info(`Load config: ${configPath}`);

    return await readJson(configPath) as JSON;
}