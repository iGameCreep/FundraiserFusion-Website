import {IAction} from "./IAction";

export interface IEvent {
  id: string;
  threshold: number;
  actions: IAction[];
}
