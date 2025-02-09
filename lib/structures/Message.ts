import DiscordClient from '../client/DiscordClient.ts';
import { Snowflake } from '../types/global.ts';
import { Message as IMessage, MessageReferenceType } from '../types/message.ts';

export default class Message {
  #client: DiscordClient;
  
  raw: IMessage;
  id: Snowflake;
  channelID: Snowflake; // TODO: store channel on message class instead of channel id

  constructor(client: DiscordClient, data: IMessage) {
    this.#client = client;
    
    this.raw = data;
    this.id = data.id;
    this.channelID = data.channel_id;
  }

  crosspost() {
    return this.#client.http.crosspostMessage({
      channelID: this.channelID,
      messageID: this.id
    }) 
  }

  createReaction(emoji: string) {
    return this.#client.http.createReaction({
      channelID: this.channelID,
      messageID: this.id,
      emoji
    })
  }

  react(emoji: string) {
    return this.createReaction(emoji);
  }

  // TODO: make message reply contain more than content
  reply(content: string) {
    return this.#client.http.createMessage({
      channelID: this.channelID
    }, {
      message_reference: {
        type: MessageReferenceType.DEFAULT,
        message_id: this.id
      },
      content,
    })
  }

  deleteReaction(emoji: string, userID?: Snowflake) {
    const options = {
      channelID: this.channelID,
      messageID: this.id,
      userID: userID!, // redundant but necessary to keep TS from complaining
      emoji
    }

    return userID ? 
      this.#client.http.deleteUserReaction(options) : 
      this.#client.http.deleteOwnReaction(options)
  }

  getReacters(emoji: string) {
    return this.#client.http.getReacters({
      channelID: this.channelID,
      messageID: this.id,
      emoji
    })
  }

  deleteAllReactions() {
    return this.#client.http.deleteAllReactions({
      channelID: this.channelID,
      messageID: this.id
    }) 
  }

  edit(data?: any) { // TODO: give parameter "data" a type in Message edit()
    return this.#client.http.editMessage({
      channelID: this.channelID,
      messageID: this.id
    }, data)
  }

  delete(reason?: string) {
    return this.#client.http.deleteMessage({
      channelID: this.channelID,
      messageID: this.id
    }, reason)
  }
}