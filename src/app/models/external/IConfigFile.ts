import {IAction} from "../IAction";

export interface IConfigFile {
  events: {
    id: string;
    threshold: number;
    actions: IAction[];
  }[];
}
