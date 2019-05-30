import {_Window} from "openfin/_v2/api/window/window";
import {Identity} from "openfin/_v2/identity";
import {ScreenEdge} from "./src/ScreenEdge";

export interface IDimensions {
    dockedWidth: number;
    dockedHeight: number;
}

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

export {ScreenEdge} from "./src/ScreenEdge";
