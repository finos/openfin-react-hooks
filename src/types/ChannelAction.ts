import { Action } from "openfin/_v2/api/interappbus/channel/channel";

export interface ChannelAction {
  topic: string;
  action: Action;
}
