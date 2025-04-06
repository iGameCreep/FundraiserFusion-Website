import {IEvent} from "../../IEvent";

export const FILE_VERSION: number = 1;

export interface IConfigFile {
  fileVersion: number;
  events: IEvent[];
}
