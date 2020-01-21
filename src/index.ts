import { ScreenEdge as ScreenEdgeEnum } from "./ScreenEdge";
import useBoundsHook from "./useBounds";
import useCallbackWindowWhenAllChildrenClosedHook from "./useCallbackWindowWhenAllChildrenClosed";
import useChannelClientHook from "./useChannelClient";
import useChannelProviderHook from "./useChannelProvider";
import useChildWindowHook from "./useChildWindow";
import useDockedHook from "./useDocked";
import useDockWindowHook from "./useDockWindow";
import useFocusHook from "./useFocus";
import useInterApplicationBusPublishHook from "./useInterApplicationBusPublish";
import useInterApplicationBusSendHook from "./useInterApplicationBusSend";
import useInterApplicationBusSubscribeHook from "./useInterApplicationBusSubscribe";
import useMaximizedHook from "./useMaximized";
import useNotificationHook from "./useNotification";
import useOptionsHook from "./useOptions";
import useUserMovementHook from "./useUserMovement";
import useZoomHook from "./useZoom";

export const ScreenEdge = ScreenEdgeEnum;
export const useBounds = useBoundsHook;
export const useChannelClient = useChannelClientHook;
export const useChannelProvider = useChannelProviderHook;
export const useChildWindow = useChildWindowHook;
export const useDockWindow = useDockWindowHook;
export const useDocked = useDockedHook;
export const useFocus = useFocusHook;
export const useCallbackWindowWhenAllChildrenClosed = useCallbackWindowWhenAllChildrenClosedHook;
export const useInterApplicationBusSend = useInterApplicationBusSendHook;
export const useInterApplicationBusSubscribe = useInterApplicationBusSubscribeHook;
export const useInterApplicationBusPublish = useInterApplicationBusPublishHook;
export const useNotification = useNotificationHook;
export const useMaximized = useMaximizedHook;
export const useOptions = useOptionsHook;
export const useUserMovement = useUserMovementHook;
export const useZoom = useZoomHook;

export default {
  ScreenEdge,
  useBounds,
  useCallbackWindowWhenAllChildrenClosed,
  useChannelClient,
  useChannelProvider,
  useChildWindow,
  useDockWindow,
  useDocked,
  useFocus,
  useInterApplicationBusPublish,
  useInterApplicationBusSend,
  useInterApplicationBusSubscribe,
  useMaximized,
  useNotification,
  useOptions,
  useUserMovement,
  useZoom,
};
