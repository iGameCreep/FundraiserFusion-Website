import {IAction} from "./IAction";

export interface IConfig {
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }

  events: {
    threshold: number;
    actions: IAction[];
  }[];
}
