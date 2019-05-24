import useDockedHook from "./useDocked";
import useInterApplicationBusSendHook from "./useInterApplicationBusSend";
import useInterApplicationBusSubscribeHook from "./useInterApplicationBusSubscribe";
import useMaximizedHook from "./useMaximized";

export const useDocked = useDockedHook;
export const useMaximized = useMaximizedHook;
export const useInterApplicationBusSend = useInterApplicationBusSendHook;
export const useInterApplicationBusSubscribe = useInterApplicationBusSubscribeHook;

export default {
    useDocked,
    useInterApplicationBusSend,
    useInterApplicationBusSubscribe,
    useMaximized,
};
