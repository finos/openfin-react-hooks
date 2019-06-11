import {ScreenEdge as ScreenEdgeEnum} from "./ScreenEdge";
import useBoundsHook from "./useBounds";
import useDockedHook from "./useDocked";
import useDockWindowHook from "./useDockWindow";
import useFocusHook from "./useFocus";
import useInterApplicationBusPublishHook from "./useInterApplicationBusPublish";
import useInterApplicationBusSendHook from "./useInterApplicationBusSend";
import useInterApplicationBusSubscribeHook from "./useInterApplicationBusSubscribe";
import useMaximizedHook from "./useMaximized";
import useOptionsHook from "./useOptions";
import useZoomHook from "./useZoom";

export const ScreenEdge = ScreenEdgeEnum;
export const useBounds = useBoundsHook;
export const useDockWindow = useDockWindowHook;
export const useDocked = useDockedHook;
export const useFocus = useFocusHook;
export const useInterApplicationBusSend = useInterApplicationBusSendHook;
export const useInterApplicationBusSubscribe = useInterApplicationBusSubscribeHook;
export const useInterApplicationBusPublish = useInterApplicationBusPublishHook;
export const useMaximized = useMaximizedHook;
export const useOptions = useOptionsHook;
export const useZoom = useZoomHook;

export default {
    ScreenEdge,
    useBounds,
    useDockWindow,
    useDocked,
    useFocus,
    useInterApplicationBusPublish,
    useInterApplicationBusSend,
    useInterApplicationBusSubscribe,
    useMaximized,
    useOptions,
    useZoom,
};
