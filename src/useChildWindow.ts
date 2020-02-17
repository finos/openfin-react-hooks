import { _Window } from "openfin/_v2/api/window/window";
import { IUseChildWindowOptions } from "../index";
import useChildWindowV2 from "./useChildWindowV2";
import useChildWindowV1 from "./v1/useChildWindow";

export default (childWindowOptions: IUseChildWindowOptions) => {
    if (fin.Window.create !== undefined && fin.Window.getCurrentSync().getWebWindow !== undefined) {
        return useChildWindowV2(childWindowOptions);
    } else {
        return useChildWindowV1(childWindowOptions);
    }
};
