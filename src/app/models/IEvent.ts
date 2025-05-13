import {IAction} from "./IAction";
import {StreamLabsEvent} from "./external/streamlabs/StreamLabsEvents";

export interface IEvent {
  id: string;
  donationThreshold: number | null;
  eventData: StreamLabsEvent;
  actions: IAction[];
}
