import DiscordClient from '../lib/client/DiscordClient.ts';
import { GatewayOpcode } from '../lib/types/codes.ts';
import { GatewayIntent } from '../lib/types/gateway.ts';

const client = new DiscordClient({
  token:
    //'NzIzNjI3NDUyMzc4Nzc1NjIz.Gl-pha.76Uxr9MdFghfOvkQyEk9XhLhPDIwC239IzA_Vk',
    'Nzg3Mzc3MDY2MTIzMTk4NTA1.GRov0n.fKrHy-xx8exWy6whZYUCKyqT53coo0JlV03J6Q',
  intents: GatewayIntent.ALL
});

client.on("ready", () => {
  console.log(`${client.user?.username} is ready!`);
})

await client.start();