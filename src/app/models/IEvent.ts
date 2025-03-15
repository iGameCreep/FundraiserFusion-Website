import {Action} from "./Action";

export interface IEvent {
  action: Action;
  data: string;
  threshold: number;
}
