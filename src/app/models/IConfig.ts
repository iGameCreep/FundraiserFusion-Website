import {IEvent} from "./IEvent";

export interface IConfig {
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }

  events: IEvent[];
}
