import useDockedHook from "./useDocked";
import useInterApplicationBusSubscribeHook from "./useInterApplicationBusSubscribe";
import useMaximizedHook from "./useMaximized";

export const useDocked = useDockedHook;
export const useMaximized = useMaximizedHook;
export const useInterApplicationBusSubscribe = useInterApplicationBusSubscribeHook;

export default {
    useDocked,
    useInterApplicationBusSubscribe,
    useMaximized,
};
