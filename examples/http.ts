import HTTPClient from "../lib/http/HTTPClient.ts";
import Logger from "../lib/util/Logger.ts";

const logger = new Logger({ prefix: 'DEFAULT' });
const http = new HTTPClient(logger, { token: 'NzIzNjI3NDUyMzc4Nzc1NjIz.Gl-pha.76Uxr9MdFghfOvkQyEk9XhLhPDIwC239IzA_Vk' });

console.log(await http.getUser({
  userID: '163319338403627008'
}));