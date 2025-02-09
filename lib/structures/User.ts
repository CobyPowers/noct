import DiscordClient from '../client/DiscordClient.ts';
import { AvatarDecorationData, User as IUser, UserFlag, UserPremiumType } from '../types/user.ts';
import Snowflake from './Snowflake.ts';

export default class User {
  #client: DiscordClient;

  raw: IUser;
  id: Snowflake;
  username: string;
  discriminator: string; // not really used anymore
  globalName: string | null;
  avatar: string | null;
  bot?: boolean;
  system?: boolean;
  mfaEnabled?: boolean;
  banner?: string | null;
  accentColor?: number | null;
  locale?: string;
  verified?: boolean;
  email?: string | null;
  flags?: UserFlag | number;
  premiumType?: UserPremiumType;
  publicFlags?: UserFlag | number;
  avatarDecorationData?: AvatarDecorationData | null;

  constructor(client: DiscordClient, data: IUser) {
    this.#client = client;

    this.raw = data;
    this.id = data.id;
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.globalName = data.global_name;
    this.avatar = data.avatar;
    this.bot = data.bot;
    this.system = data.system;
    this.mfaEnabled = data.mfa_enabled;
    this.banner = data.banner;
    this.accentColor = data.accent_color;
    this.locale = data.locale;
    this.verified = data.verified;
    this.email = data.email;
    this.flags = data.flags;
    this.premiumType = data.premium_type;
    this.publicFlags = data.public_flags;
    this.avatarDecorationData = data.avatar_decoration_data;
  }
}