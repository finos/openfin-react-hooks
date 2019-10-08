import { Action } from "openfin/_v2/api/interappbus/channel/channel";
import { ChannelClient } from "openfin/_v2/api/interappbus/channel/client";
import { ChannelProvider } from "openfin/_v2/api/interappbus/channel/provider";
import Bounds from "openfin/_v2/api/window/bounds";
import {_Window } from "openfin/_v2/api/window/window";
import { WindowOption } from "openfin/_v2/api/window/windowOption";
import { Identity } from "openfin/_v2/identity";
import { ReactElement } from "react";
import { ScreenEdge } from "./src/ScreenEdge";
import CHILD_WINDOW_STATE from "./src/utils/types/enums/ChildWindowState";

export interface IDimensions {
    dockedWidth: number;
    dockedHeight: number;
}

export interface IChannelAction {
  topic: string;
  action: Action;
}

export interface IUseChildWindow {
    name: string;
    windowOptions?: WindowOption;
    parentDocument?: HTMLDocument;
    cssUrl?: string;
    shouldClosePreviousOnLaunch?: boolean;
    shouldInheritCSS?: boolean;
    shouldInheritScripts?: boolean;
}

export const useBounds: (target?: _Window) => Bounds;

export const useChannelClient: (channelName: string) => {
  client: ChannelClient;
  error: Error;
};

export const useChannelProvider: (channelName: string, channelActions: IChannelAction[]) => {
  provider: ChannelProvider;
  error: Error;
};

export enum enums {CHILD_WINDOW_STATE}

export const useChildWindow: (useChildWindowOptions: IUseChildWindow) => {
        close: () => void,
        launch: (windowOptions?: WindowOption) => void,
        populate: (jsx: ReactElement[]) => void,
        state: CHILD_WINDOW_STATE,
        window: _Window,
};

export const useDocked: () => [boolean, () => Promise<void>];

export const useDockWindow: (initialEdge?: ScreenEdge, toMove?: _Window, allowUserToUndock?: boolean,
                             stretchToFit?: IDimensions) => [ScreenEdge, {
    dockBottom: () => void;
    dockLeft: () => void;
    dockNone: () => void;
    dockRight: () => void;
    dockTop: () => void;
}];

export const useFocus: (target?: _Window) => [boolean, (newFocus: boolean) => Promise<void>,
    () => Promise<void>, () => Promise<void>];

export const useInterApplicationBusPublish: <T>(topic: string, message: T) => {
    success: boolean;
    error: Error;
};

export const useInterApplicationBusSend: <T>(identity: Identity, topic: string, message: T) => {
    success: boolean;
    error: Error;
};

export const useInterApplicationBusSubscribe: <T>(identity: Identity, topic: string) => {
    data: {
        message: T;
        name: string;
        uuid: string;
    };
    subscribeError: unknown;
    isSubscribed: boolean;
};

export const useMaximized: () => [boolean, (shouldMaximize: boolean) => Promise<void>];

export const useOptions: (target?: _Window) => [WindowOption, (options: WindowOption) => Promise<void>];

export const useUserMovement: (target?: _Window, initialValue?: boolean) =>
    [boolean, (toEnable: boolean) => Promise<void>];

export const useZoom: (target?: _Window) => [number, (newZoom: number) => Promise<void>];

export {ScreenEdge} from "./src/ScreenEdge";
