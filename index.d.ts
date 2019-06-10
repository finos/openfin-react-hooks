import Bounds from "openfin/_v2/api/window/bounds";
import {_Window} from "openfin/_v2/api/window/window";
import {WindowOption} from "openfin/_v2/api/window/windowOption";
import {Identity} from "openfin/_v2/identity";
import {ScreenEdge} from "./src/ScreenEdge";

export interface IDimensions {
    dockedWidth: number;
    dockedHeight: number;
}

export const useBounds: (target?: _Window) => Bounds;

export const useDocked: () => [boolean, () => Promise<void>];

export const useDockWindow: (initialEdge?: ScreenEdge, toMove?: _Window, allowUserToUndock?: boolean,
                             stretchToFit?: IDimensions) => [ScreenEdge, {
    dockBottom: () => void;
    dockLeft: () => void;
    dockNone: () => void;
    dockRight: () => void;
    dockTop: () => void;
}];

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

export const useZoom: (target?: _Window) => [number, (newZoom: number) => Promise<void>];

export {ScreenEdge} from "./src/ScreenEdge";
