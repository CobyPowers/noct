import { ChannelType } from "./channel.ts";
import { PartialEmoji } from "./emoji.ts";

export enum ComponentType {
  ACTION_ROW = 1,
  BUTTON = 2,
  STRING_SELECT = 3,
  TEXT_INPUT = 4,
  USER_SELECT = 5,
  ROLE_SELECT = 6,
  MENTIONABLE_SELECT = 7,
  CHANNEL_SELECT = 8,
}

export enum ButtonComponentStyle {
  PRIMARY = 1,
  SECONDARY = 2,
  SUCCESS = 3,
  DANGER = 4,
  LINK = 5,
}

export enum TextInputComponentStyle {
  SHORT = 1,
  PARAGRAPH = 2,
}

export type Component =
  | ActionRowComponent
  | ButtonComponent
  | StringSelectComponent
  | TextInputComponent
  | UserSelectComponent
  | RoleSelectComponent
  | MentionableSelectComponent
  | ChannelSelectComponent;

interface BaseComponent {
  type: ComponentType;
  custom_id: string;
}

export interface ActionRowComponent extends Omit<BaseComponent, "custom_id"> {
  components: Component[];
}

export interface ButtonComponent extends BaseComponent {
  type: ComponentType.BUTTON;
  style: ButtonComponentStyle;
  label?: string;
  emoji?: PartialEmoji;
  url?: string;
  disabled?: boolean;
}

export interface TextInputComponent extends BaseComponent {
  type: ComponentType.TEXT_INPUT;
  style: TextInputComponentStyle;
  label: string;
  min_length?: number;
  max_length?: number;
  required?: boolean;
  value?: string;
  placeholder?: string;
}

interface SelectMenuComponent extends BaseComponent {
  type:
    | ComponentType.STRING_SELECT
    | ComponentType.USER_SELECT
    | ComponentType.ROLE_SELECT
    | ComponentType.MENTIONABLE_SELECT
    | ComponentType.CHANNEL_SELECT;
  placeholder?: string;
  min_values?: number;
  max_values?: number;
  disabled?: boolean;
}

export interface StringSelectComponent extends SelectMenuComponent {
  type: ComponentType.STRING_SELECT;
  options: StringSelectComponentOptions[];
}

export interface StringSelectComponentOptions {
  label: string;
  value: string;
  description?: string;
  emoji?: PartialEmoji;
  default?: boolean;
}

export interface UserSelectComponent extends SelectMenuComponent {
  type: ComponentType.USER_SELECT;
}

export interface RoleSelectComponent extends SelectMenuComponent {
  type: ComponentType.ROLE_SELECT;
}

export interface MentionableSelectComponent extends SelectMenuComponent {
  type: ComponentType.MENTIONABLE_SELECT;
}

export interface ChannelSelectComponent extends SelectMenuComponent {
  type: ComponentType.CHANNEL_SELECT;
  channel_types: ChannelType[];
}
