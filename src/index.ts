import {ScreenEdge as ScreenEdgeEnum} from "./ScreenEdge";
import useBoundsHook from "./useBounds";
import useDockedHook from "./useDocked";
import useDockWindowHook from "./useDockWindow";
import useInterApplicationBusPublishHook from "./useInterApplicationBusPublish";
import useInterApplicationBusSendHook from "./useInterApplicationBusSend";
import useInterApplicationBusSubscribeHook from "./useInterApplicationBusSubscribe";
import useMaximizedHook from "./useMaximized";
import useOptionsHook from "./useOptions";

export const ScreenEdge = ScreenEdgeEnum;
export const useBounds = useBoundsHook;
export const useDockWindow = useDockWindowHook;
export const useDocked = useDockedHook;
export const useMaximized = useMaximizedHook;
export const useOptions = useOptionsHook;
export const useInterApplicationBusSend = useInterApplicationBusSendHook;
export const useInterApplicationBusSubscribe = useInterApplicationBusSubscribeHook;
export const useInterApplicationBusPublish = useInterApplicationBusPublishHook;

export default {
    ScreenEdge,
    useBounds,
    useDockWindow,
    useDocked,
    useInterApplicationBusPublish,
    useInterApplicationBusSend,
    useInterApplicationBusSubscribe,
    useMaximized,
    useOptions,
};
