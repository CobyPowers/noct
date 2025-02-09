import * as color from '@std/fmt/colors';
import { HTTPMethod, Nocular } from 'nocular';
import { NoctURL, NoctVersion } from '../../mod.ts';
import {
  HTTPBadRequestError as IHTTPBadRequestError,
  HTTPClientOptions,
  HTTPRequestOptions,
  HTTPRateLimitError
} from '../types/http.ts';
import Collection from '../structures/Collection.ts';
import Lock from '../util/Lock.ts';
import Logger from '../util/Logger.ts';
import Bucket from './Bucket.ts';
import Route from './Route.ts';
import { delay, querify } from '../util/misc.ts';
import Reactive from '../structures/Reactive.ts';
import { GatewayConnectionInfo } from '../types/gateway.ts';
import { GatewayBotConnectionInfo } from '../types/gateway.ts';
import HTTPBadRequestError from '../errors/HTTPBadRequestError.ts';
import HTTPError from '../errors/HTTPError.ts';
import { Connection, User } from '../types/user.ts';
import DiscordClient from '../client/DiscordClient.ts';
import { Application } from '../types/application.ts';
import { ApplicationRoleConnectionMetadata } from '../types/applicationRole.ts';
import { AuditLog } from '../types/auditLog.ts';
import { AutoModerationRule } from '../types/autoModeration.ts';
import { Channel, GroupChannel, PrivateChannel } from '../types/channel.ts';
import { Snowflake } from '../types/global.ts';
import { Message, MessageReference } from '../types/message.ts';
import { Embed } from '../types/embed.ts';
import { Attachment } from '../types/attachment.ts';
import { PartialGuild } from '../types/guild.ts';

export default class HTTPClient {
  #client: DiscordClient;

  #engine: Nocular;
  #logger: Logger;
  #buckets: Collection<string, Bucket>;
  #lock: Lock;

  #globalLock: Reactive<boolean>;

  baseURL: string;
  apiVersion: number;
  userAgent: string;
  token: string;

  constructor(client: DiscordClient, options: HTTPClientOptions) {
    this.baseURL = options.baseURL || 'https://discord.com/api';
    this.apiVersion = options.apiVersion || 10;
    this.userAgent = options.userAgent || `Noct (${NoctURL}, ${NoctVersion})`;
    this.token = options.token;

    this.#globalLock = new Reactive(false);

    this.#client = client;
    this.#engine = new Nocular({
      baseURL: this.baseURL + `/v${this.apiVersion}`,
    });
    this.#engine.defaultHeaders.common = {
      'Authorization': `Bot ${this.token}`,
      'User-Agent': this.userAgent,
    };
    this.#logger = client.logger.withModule('HTTP');
    this.#buckets = new Collection();
    this.#lock = new Lock();
  }

  async request<T = any>(
    route: Route,
    options?: HTTPRequestOptions,
  ): Promise<T> {
    const bucketID = route.getBucketID();
    const bucket = this.#buckets.get(bucketID);

    if (!options?.ignoreGlobalLock && this.#globalLock.value) {
      await this.#globalLock.waitUntil(false);
    }

    bucket ? await bucket.lock.acquire() : await this.#lock.acquire();

    bucket && await bucket.prepare();

    let headers: Record<string, string> = {};
    if (route.reason) {
      headers['X-Audit-Log-Reason'] = route.reason;
    }

    const res = await this.#engine.request(route.path, {
      ...route,
      headers,
      redirect: 'follow',
      keepalive: true,
      validateStatus: () => true,
    });

    this.#logger.moduleInfo(
      color.blue(`(${res.status}) ${route.method.toUpperCase()} ${route.path}`),
    );

    this.#processBucket(bucketID, bucket, res.headers);

    bucket ? bucket.lock.release() : this.#lock.release();

    if (res.status === 400) {
      const data = res.data as IHTTPBadRequestError;

      throw new HTTPBadRequestError(data);
    }

    if (res.status === 401) {
      throw new HTTPError('You provided an invalid token.');
    }

    if (res.status === 403) {
      throw new HTTPError('You cannot access this resource.');
    }

    if (res.status === 404) {
      throw new HTTPError('This resource does not exist.');
    }

    if (res.status === 405) {
      throw new HTTPError(
        `Method '${route.method}' cannot be used with path '${route.path}.' This is a Noct bug; please contact the developer.`,
      );
    }

    if (res.status === 429) {
      const data = res.data as HTTPRateLimitError;

      if (data.global) {
        this.#globalLock.update(true);
      }

      await delay(data.retry_after * 1000);

      this.#globalLock.update(false);

      return await this.request<T>(route);
    }

    if (res.status === 500 || res.status == 502) {
      const tries = (options?.tries || 0) + 1;
      const delayMS = (Math.pow(2, tries)) * 1000; // exponential backoff algorithm

      this.#logger.debug(
        `HTTP request encountered a 5xx error, waiting ${delayMS}ms...`,
      );

      await delay(delayMS);
      return await this.request<T>(route, { tries });
    }

    return res.data as T;
  }

  #processBucket(
    bucketID: string,
    bucket: Bucket | undefined,
    headers: Headers,
  ): void {
    if (headers.has('X-RateLimit-Bucket')) {
      bucket = bucket
        ? bucket!.update(headers)
        : Bucket.fromHeaders(this.#logger, bucketID, headers);

      this.#buckets.set(bucketID, bucket);
    }
  }

  #transformGatewayInfo<T extends GatewayConnectionInfo>(
    info: T,
    options?: HTTPGetGatewayConnectionInfoOptions,
  ): T {
    const params: Record<string, string | number | undefined> = {};

    if (options) {
      for (const [k, v] of Object.entries(options)) {
        params[k] = v;
      }
    }

    const query = querify(params);

    info.url += '?' + query;

    return info;
  }

  //#region Gateway

  async getGatewayInfo(
    options?: {
      v?: number;
      encoding?: string;
      compress?: string;
    },
  ): Promise<GatewayConnectionInfo> {
    const info = await this.request(
      new Route({
        method: HTTPMethod.GET,
        path: '/gateway',
      }),
    );

    return this.#transformGatewayInfo(info, options);
  }

  async getGatewayBotInfo(
    options?: {
      v?: number;
      encoding?: string;
      compress?: string;
    },
  ): Promise<GatewayBotConnectionInfo> {
    const info = await this.request(
      new Route({
        method: HTTPMethod.GET,
        path: '/gateway/bot',
      }),
    );

    return this.#transformGatewayInfo(info, options);
  }

  //#endregion

  //#region Application

  getApplication(): Promise<Application> {
    return this.request(
      new Route({
        method: HTTPMethod.GET,
        path: '/applications/@me',
      }),
    );
  }

  //#endregion

  //#region Application Role

  getApplicationRoleConnectionMetadata(
    options: HTTPGetApplicationRoleConnectionMetadataOptions,
  ): Promise<ApplicationRoleConnectionMetadata[]> {
    return this.request(
      new Route({
        method: HTTPMethod.GET,
        path: '/applications/{applicationID}/role-connections/metadata',
        resources: {
          ...options,
        },
      }),
    );
  }

  updateApplicationRoleConnectionMetadata() {
    // TODO: implement HTTPClient.updateApplicationRoleConnectionMetadata()
  }

  //#endregion

  //#region Audit Log

  getAuditLog(
    options: HTTPGetAuditLogOptions,
    params?: HTTPGetAuditLogParams,
  ): Promise<AuditLog> {
    return this.request(
      new Route({
        method: HTTPMethod.GET,
        path: '/guilds/{guildID}/audit-logs',
        resources: {
          ...options,
        },
        params: {
          ...params,
        },
      }),
    );
  }

  //#endregion

  //#region Message

  getChannelMessages(options: {
    channelID: Snowflake
  }, params?: {
    around?: Snowflake,
    before?: Snowflake,
    after?: Snowflake,
    limit?: number
  }): Promise<Message[]> {
    return this.request(
      new Route({
        method: HTTPMethod.GET,
        path: '/channels/{channelID}/messages',
        resources: options,
        params
      })
    )
  }

  getChannelMessage(options: {
    channelID: Snowflake,
    messageID: Snowflake
  }): Promise<Message> {
    return this.request(
      new Route({
        method: HTTPMethod.GET,
        path: '/channels/{channelID}/messages/{messageID}',
        resources: options
      })
    )
  }

  createMessage(options: {
    channelID: Snowflake
  }, data: {
    content?: string,
    nonce?: number | string,
    tts?: boolean,
    embeds?: Embed[],
    //allowed_mentions?: AllowedMention,
    message_reference?: MessageReference,
    //components?: MessageComponent[],
    sticker_ids?: Snowflake[],
    files?: any,
    payload_json?: string,
    //attachments?: PartialAttachment,
    flags?: number,
    enforce_nonce?: boolean,
    //poll?: Poll
  }): Promise<Message> {
    return this.request(
      new Route({
        method: HTTPMethod.POST,
        path: '/channels/{channelID}/messages',
        resources: options,
        data
      })
    )
  }

  crosspostMessage(options: {
    channelID: Snowflake,
    messageID: Snowflake
  }): Promise<Message> {
    return this.request(
      new Route({
        method: HTTPMethod.POST,
        path: '/channels/{channelID}/messages/{messageID}/crosspost',
        resources: options
      })
    )
  }

  createReaction(options: {
    channelID: Snowflake,
    messageID: Snowflake,
    emoji: string
  }): Promise<void> {
    return this.request(
      new Route({
        method: HTTPMethod.PUT,
        path: '/channels/{channelID}/messages/{messageID}/reactions/{emoji}/@me',
        resources: options
      })
    )
  }

  deleteOwnReaction(options: {
    channelID: Snowflake,
    messageID: Snowflake,
    emoji: string
  }): Promise<void> {
    return this.request(
      new Route({
        method: HTTPMethod.DELETE,
        path: '/channels/{channelID}/messages/{messageID}/reactions/{emoji}/@me',
        resources: options
      })
    )
  }

  deleteUserReaction(options: {
    channelID: Snowflake,
    messageID: Snowflake,
    userID: Snowflake,
    emoji: string
  }): Promise<void> {
    return this.request(
      new Route({
        method: HTTPMethod.DELETE,
        path: '/channels/{channelID}/messages/{messageID}/reactions/{emoji}/{userID}',
        resources: options
      })
    )
  }

  getReacters(options: {
    channelID: Snowflake,
    messageID: Snowflake,
    emoji: string
  }, params?: {
    //type?: ReactionType,
    after?: Snowflake,
    limit?: number
  }): Promise<User[]> {
    return this.request(
      new Route({
        method: HTTPMethod.GET,
        path: '/channels/{channelID}/messages/{messageID}/reactions/{emoji}',
        resources: options,
        params
      })
    )
  }

  deleteAllReactions(options: {
    channelID: Snowflake,
    messageID: Snowflake
  }): Promise<void> {
    return this.request(
      new Route({
        method: HTTPMethod.DELETE,
        path: '/channels/{channelID}/messages/{messageID}/reactions/{emoji}',
        resources: options
      })
    )
  }

  editMessage(options: {
    channelID: Snowflake,
    messageID: Snowflake
  }, data: {
    content?: string | null,
    embeds?: Embed[] | null,
    flags?: number | null,
    //allowed_mentions?: AllowedMention[] | null,
    //components?: MessageComponent[] | null,
    files?: any | null,
    payload_json?: string | null,
    attachments?: Attachment[] | null
  }): Promise<Message> {
    return this.request(
      new Route({
        method: HTTPMethod.PATCH,
        path: '/channels/{channelID}/messages/{messageID}',
        resources: options,
        data
      })
    )
  }

  deleteMessage(options: {
    channelID: Snowflake,
    messageID: Snowflake
  }, reason?: string): Promise<void> {
    return this.request(
      new Route({
        method: HTTPMethod.DELETE,
        path: '/channels/{channelID}/messages/{messageID}',
        resources: options,
        reason
      })
    )
  }

  bulkDeleteMessages(options: {
    channelID: Snowflake
  }, data: {
    messages: Snowflake[]
  }, reason?: string): Promise<void> {
    return this.request(
      new Route({
        method: HTTPMethod.POST,
        path: '/channels/{channelID}/messages/bulk-delete',
        resources: options,
        data,
        reason
      })
    )
  }

  //#endregion

  //#region User

  getCurrentUser(): Promise<User> {
    return this.request(
      new Route({
        method: HTTPMethod.GET,
        path: '/users/@me'
      })
    )
  }

  getUser(options: {
    userID: Snowflake
  }): Promise<User> {
    return this.request(
      new Route({
        method: HTTPMethod.GET,
        path: '/users/{userID}',
        resources: options
      })
    )
  }

  modifyCurrentUser(data: {
    username?: string,
    avatar?: string, // TODO: replace this and the next line with image data
    banner?: string
  }): Promise<User> {
    return this.request(
      new Route({
        method: HTTPMethod.PATCH,
        path: '/users/@me',
        data
      })
    )
  }

  getCurrentUserGuilds(params?: {
    before?: Snowflake,
    after?: Snowflake,
    limit?: number,
    with_counts?: boolean
  }): Promise<PartialGuild[]> {
    return this.request(
      new Route({
        method: HTTPMethod.GET,
        path: '/users/@me/guilds',
        params: <Record<string, string | number | undefined>>params // HACK: find way to not force cast params
      })
    )
  }

  getCurrentUserGuildMember(options: {
    guildID: Snowflake
  }): Promise<GuildMember> {
    return this.request(
      new Route({
        method: HTTPMethod.GET,
        path: '/users/@me/guilds/{guildID}/member',
        resources: options
      })
    )
  }

  leaveGuild(options: {
    guildID: Snowflake
  }): Promise<void> {
    return this.request(
      new Route({
        method: HTTPMethod.DELETE,
        path: '/users/@me/guilds/{guildID}',
        resources: options
      })
    )
  }

  createDM(data: {
    recipient_id: Snowflake
  }): Promise<PrivateChannel> {
    return this.request(
      new Route({
        method: HTTPMethod.POST,
        path: '/users/@me/channels',
        data
      })
    )
  }

  createGroupDM(data: {
    access_tokens: string[],
    nicks: Record<Snowflake, string>
  }): Promise<PrivateChannel> {
    return this.request(
      new Route({
        method: HTTPMethod.POST,
        path: '/users/@me/channels',
        data
      })
    )
  }

  getCurrentUserConnections(): Promise<Connection[]> {
    return this.request(
      new Route({
        method: HTTPMethod.GET,
        path: '/users/@me/connections'
      })
    )
  }

  getCurrentUserApplicationRoleConnection(options: {
    applicationID: Snowflake
  }): Promise<ApplicationRoleConnection> {
    return this.request(
      new Route({
        method: HTTPMethod.GET,
        path: '/users/@me/applications/{applicationID}/role-connection',
        resources: options
      })
    )
  }

  updateCurrentUserApplicationRoleConnection(options: {
    applicationID: Snowflake
  }, data: {
    platform_name?: string,
    platform_username?: string,
    metadata?: ApplicationRoleConnectionMetadata
  }): Promise<ApplicationRoleConnection> {
    return this.request(
      new Route({
        method: HTTPMethod.PUT,
        path: '/users/@me/applications/{applicationID}/role-connection',
        resources: options,
        data
      })
    )
  }

  //#endregion

}
