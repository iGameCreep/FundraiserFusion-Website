import {IAction} from "./IAction";
import {StreamLabsEvent} from "./external/streamlabs/StreamLabsEvents";

export interface IEvent {
  id: string;
  threshold?: number;
  eventData: StreamLabsEvent;
  actions: IAction[];
}
