import { _Window } from "openfin/_v2/api/window/window";

export const isWindowV1 = (candidate: any): candidate is fin.OpenFinWindow => !!candidate.getNativeWindow;
export const isWindowV2 = (candidate: any): candidate is _Window => !!candidate.getWebWindow;
export const isWindow = (candidate: any):
        candidate is fin.OpenFinWindow | _Window => isWindowV1(candidate) || isWindowV2(candidate);

export default {
    isWindow,
    isWindowV1,
    isWindowV2,
};
