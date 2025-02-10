import DiscordClient from '../lib/client/DiscordClient.ts';
import { GatewayIntent } from '../lib/types/gateway.ts';

const client = new DiscordClient({
  token: Deno.env.get('DISCORD_TOKEN')!,
  intents: GatewayIntent.ALL
});

client.on("ready", async () => {})

await client.start();