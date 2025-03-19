import {EntityType} from "./EntityType";

export interface IAction {
  action: EAction;
  data: string;
}

export enum EAction {
  SPAWN_ENTITY = "SPAWN_ENTITY",
  SET_WEATHER = "SET_WEATHER",
  COMMAND_EXEC = "COMMAND_EXEC"
}

export const ACTIONS: Record<EAction, { label: string; choices: string[] }> = {
  SPAWN_ENTITY: {
    label: "Spawn Entity",
    choices: Object.values(EntityType)
  },
  SET_WEATHER: {
    label: "Set Weather",
    choices: ["Rain", "Clear", "Storm"]
  },
  COMMAND_EXEC: {
    label: "Run Command",
    choices: []
  }
};
